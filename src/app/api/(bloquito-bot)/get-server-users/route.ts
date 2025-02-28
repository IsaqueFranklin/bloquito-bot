import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import axios from "axios";

// Lista de origens permitidas
const allowedOrigins = [
    "http://localhost:3001",
    "http://br5f7-7uaaa-aaaaa-qaaca-cai.localhost:4943",
    "http://localhost:3000",
    // Adicione outras origens aqui
];

// Essa função precisa que o Id do servidor do discord seja passado como guildId
export async function POST(req: NextRequest) {
  try {
    // Obtém a origem da requisição
    const origin:any = req.headers.get("origin");

    // Se a origem não estiver na lista permitida, bloqueia a requisição
    if (allowedOrigins.includes(origin)) {
        // 🔥 Corrigido: Agora passa os cookies corretamente para recuperar a sessão
        const session:any = await getServerSession(authOptions);
        if (!session || !session.accessToken) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const { guildId } = await req.json();
        const url = `https://discord.com/api/v10/guilds/${guildId}/members?limit=1000`;

        try {
            const response = await axios.get(url, {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
            });
        
            const userIds = response.data.map((member: any) => member.user);
        
            
        
            const routeResponse = NextResponse.json(userIds, { status: 200 });

            // 🔥 Corrigido: Configuração CORS para permitir credenciais
            routeResponse.headers.set("Access-Control-Allow-Origin", origin);
            routeResponse.headers.set("Access-Control-Allow-Credentials", "true");
            routeResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            routeResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

            return routeResponse;
          } catch (error) {
            console.error("Erro ao buscar canais:", error);
            return NextResponse.json({ error: "Erro interno" }, { status: 500 });
          }
    }
  } catch (error) {
    console.error("[ERROR API ROUTE][USER-SESSION]: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}