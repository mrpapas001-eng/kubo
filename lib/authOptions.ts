import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

// Lee una variable de entorno tolerando espacios, saltos de línea (\r) y
// comillas pegadas al pegar valores a mano en .env.local.
function cleanEnv(name: string): string {
  const value = (process.env[name] ?? "").trim().replace(/^["']+|["']+$/g, "");
  if (!value) {
    console.error(
      `[kubo-auth] Falta la variable de entorno ${name}. ` +
        `Revisa .env.local (sin espacios alrededor del "=", una variable por línea) y reinicia "npm run dev".`
    );
  }
  return value;
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: cleanEnv("GOOGLE_CLIENT_ID"),
      clientSecret: cleanEnv("GOOGLE_CLIENT_SECRET"),
    }),

    FacebookProvider({
      clientId: cleanEnv("FACEBOOK_CLIENT_ID"),
      clientSecret: cleanEnv("FACEBOOK_CLIENT_SECRET"),
    }),
  ],
  secret: cleanEnv("NEXTAUTH_SECRET"),
};