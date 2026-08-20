// Dev helper: mint a next-auth v4 session cookie for local API testing.
// Usage: node scripts/dev-session-token.mjs [email] [name]
import { encode } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;
if (!secret) {
  console.error("NEXTAUTH_SECRET missing");
  process.exit(1);
}

const email = process.argv[2] ?? "test@kubo.local";
const name = process.argv[3] ?? "Test User";

const token = await encode({
  token: { email, name, picture: null, sub: "dev-" + email },
  secret,
});

console.log(token);
