#!/bin/bash
# Local E2E tests for publish + launch promotion (Premium/Destacado)
set -u
export NEXTAUTH_SECRET="dev-secret-kubo-local-1234567890abcdef"
BASE=http://localhost:3000
PSQL="psql postgresql://kubo:kubo@localhost:5432/kubo -tA -c"

tok() { node scripts/dev-session-token.mjs "$1" "$2"; }

T_E1=$(tok empresa1@kubo.local "Empresa Uno")
T_E2=$(tok empresa2@kubo.local "Empresa Dos")
T_P1=$(tok particular1@kubo.local "Particular Uno")

publish() { # $1 token, $2 sellerType, $3 businessName, $4 title
  local data
  data=$(cat <<EOF
{"title":"$4","description":"Anuncio de prueba local","phone":"3001234567","price":100000,"currency":"COP","city":"Bogotá","categorySlug":"celulares","subcategorySlug":"celulares","template":"GENERAL","sellerType":"$2","businessName":"$3","imageUrl":"https://example.com/foto.jpg","details":{"images":["https://example.com/foto.jpg"],"cellphone":{"brand":"Samsung","model":"S23"}}}
EOF
)
  curl -s -X POST -H "Content-Type: application/json" -H "Cookie: next-auth.session-token=$1" -d "$data" "$BASE/api/listings"
}

claim() { # $1 token, $2 kind, $3 listingId
  curl -s -o /tmp/claim_out -w "%{http_code}" -H "Cookie: next-auth.session-token=$1" "$BASE/api/promote/$2?listingId=$3"
}

getid() { python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('id') or d.get('listing',{}).get('id') or d)"; }

echo "== 1. Publicar anuncio EMPRESA (empresa1) =="
R1=$(publish "$T_E1" EMPRESA "Tienda Uno" "Celular prueba E1")
echo "$R1" | head -c 300; echo
L1=$($PSQL "SELECT id FROM \"Listing\" WHERE title='Celular prueba E1' ORDER BY \"createdAt\" DESC LIMIT 1")
echo "L1=$L1"

echo "== 2. Reclamar Destacado (debe funcionar, 302) =="
code=$(claim "$T_E1" featured "$L1"); echo "HTTP $code"; cat /tmp/claim_out | head -c 200; echo
$PSQL "SELECT \"isFeatured\",\"isPremium\",\"premiumPlan\",\"featuredUntil\" FROM \"Listing\" WHERE id='$L1'"

echo "== 3. Reclamar Premium sobre el mismo (ALREADY_PROMOTED, 400) =="
code=$(claim "$T_E1" premium "$L1"); echo "HTTP $code"; cat /tmp/claim_out; echo

echo "== 4. Segundo anuncio empresa1 y reclamar (USER_DAILY_LIMIT, 400) =="
publish "$T_E1" EMPRESA "Tienda Uno" "Celular prueba E1-B" >/dev/null
L1B=$($PSQL "SELECT id FROM \"Listing\" WHERE title='Celular prueba E1-B' LIMIT 1")
code=$(claim "$T_E1" featured "$L1B"); echo "HTTP $code"; cat /tmp/claim_out; echo

echo "== 5. Anuncio PARTICULAR y reclamar (BUSINESS_ONLY, 400) =="
publish "$T_P1" PARTICULAR "" "Celular prueba P1" >/dev/null
LP1=$($PSQL "SELECT id FROM \"Listing\" WHERE title='Celular prueba P1' LIMIT 1")
code=$(claim "$T_P1" featured "$LP1"); echo "HTTP $code"; cat /tmp/claim_out; echo

echo "== 6. Anuncio de ayer (NOT_TODAY, 400) =="
publish "$T_E2" EMPRESA "Tienda Dos" "Celular prueba E2-ayer" >/dev/null
L2A=$($PSQL "SELECT id FROM \"Listing\" WHERE title='Celular prueba E2-ayer' LIMIT 1")
$PSQL "UPDATE \"Listing\" SET \"createdAt\"=\"createdAt\" - interval '1 day' WHERE id='$L2A'" >/dev/null
code=$(claim "$T_E2" featured "$L2A"); echo "HTTP $code"; cat /tmp/claim_out; echo

echo "== 7. Sin sesión (401) =="
code=$(curl -s -o /tmp/claim_out -w "%{http_code}" "$BASE/api/promote/featured?listingId=$L1")
echo "HTTP $code"; cat /tmp/claim_out; echo

echo "== 8. Agotar cupos Premium (5) y probar SOLD_OUT (409) =="
DAY=$(TZ=America/Bogota date +%F)
MARKER="LANZAMIENTO:$DAY"
for i in 1 2 3 4 5; do
  $PSQL "INSERT INTO \"Listing\" (id,title,description,currency,city,\"categorySlug\",\"subcategorySlug\",template,\"sellerType\",\"isBusiness\",\"ownerEmail\",status,\"isPremium\",\"premiumPlan\",\"createdAt\") VALUES ('seedprem$i','Seed Prem $i','seed','COP','Bogotá','celulares','celulares','GENERAL','EMPRESA',true,'seed$i@kubo.local','active',true,'$MARKER',now()) ON CONFLICT (id) DO NOTHING" >/dev/null
done
$PSQL "SELECT count(*) FROM \"Listing\" WHERE \"isPremium\"=true AND \"premiumPlan\"='$MARKER'"
publish "$T_E2" EMPRESA "Tienda Dos" "Celular prueba E2-hoy" >/dev/null
L2B=$($PSQL "SELECT id FROM \"Listing\" WHERE title='Celular prueba E2-hoy' LIMIT 1")
code=$(claim "$T_E2" premium "$L2B"); echo "HTTP $code"; cat /tmp/claim_out; echo

echo "== 9. empresa2 reclama Destacado (debe funcionar: cupo featured libre) =="
code=$(claim "$T_E2" featured "$L2B"); echo "HTTP $code"; cat /tmp/claim_out | head -c 200; echo
$PSQL "SELECT \"isFeatured\",\"featuredUntil\" > now() + interval '23 hours' AND \"featuredUntil\" <= now() + interval '25 hours' AS dur24h FROM \"Listing\" WHERE id='$L2B'"

echo "== 10. Contador en /premium (HTML) =="
curl -s -H "Cookie: next-auth.session-token=$T_E1" "$BASE/premium?listingId=$L1" | grep -o "[0-9]* de 20 disponibles hoy\|[0-9]* de 5 disponibles hoy"

echo "== FIN =="
