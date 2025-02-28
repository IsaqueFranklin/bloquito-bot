import DiscordProvider from "next-auth/providers/discord";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { AuthOptions } from "next-auth";
import clientPromise from "./db";

export const authOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            authorization: {
                params: { scope: "identify guilds email" }, // Adicione mais escopos se necessário
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: "jwt", // 🔥 Garante que a sessão seja armazenada corretamente no MongoDB
    },
    callbacks: {
      async jwt({ token, account, user }: any) {
        if (account) {
          console.log("🔹 JWT Callback - Novo Login detectado!");
          console.log("🔹 account: ", account); // Verificar se o token do Discord está chegando
  
          token.accessToken = account.access_token; // ✅ Salva o token de acesso do Discord
          token.id = account.providerAccountId; // ✅ ID correto do usuário
        }
        return token;
      },
      async session({ session, token }: any) {
        console.log("🔹 Session Callback - Token recebido:", token); // Debug
        session.user.id = token.id;
        session.accessToken = token.accessToken; // ✅ Agora a sessão tem accessToken
        return session;
      },
      },
    debug: true,
} as AuthOptions;
