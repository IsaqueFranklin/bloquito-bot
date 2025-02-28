import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Lista de origens permitidas
const allowedOrigins = [
  "http://localhost:3001",
  "http://br5f7-7uaaa-aaaaa-qaaca-cai.localhost:4943",
  "http://localhost:3000",
  // Adicione outras origens aqui
];

export async function GET(req: NextRequest) {
  try {
    // Obtém a origem da requisição
    const origin:any = req.headers.get("origin");

    // Se a origem não estiver na lista permitida, bloqueia a requisição
    if (allowedOrigins.includes(origin)) {
      // 🔥 Corrigido: Agora passa os cookies corretamente para recuperar a sessão
      const session:any = await getServerSession(authOptions);
      console.log("ESSA É A SESSION E ESTÁ OK: ", session)
      if (!session || !session.accessToken) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }

      // 🔥 Corrigido: Adicionando "Bearer" ao token de acesso corretamente
      const response = await axios.get("https://discord.com/api/users/@me/guilds", {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });

      // Filtra apenas servidores onde o usuário é dono (owner) ou tem permissão de administração
      const adminGuilds = response.data.filter((guild: any) => (guild.permissions & 0x20) === 0x20);

      // Criar resposta JSON
      const routeResponse = NextResponse.json(adminGuilds, { status: 200 });

      // 🔥 Corrigido: Configuração CORS para permitir credenciais
      routeResponse.headers.set("Access-Control-Allow-Origin", origin);
      routeResponse.headers.set("Access-Control-Allow-Credentials", "true");
      routeResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      routeResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

      return routeResponse;
    }
  } catch (error) {
    console.error("[ERROR API ROUTE][USER-SESSION]: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
