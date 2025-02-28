import { connectToDatabase } from "@/lib/database/mongoose";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";

// Lista de origens permitidas
const allowedOrigins = [
    "http://localhost:3001",
    "http://br5f7-7uaaa-aaaaa-qaaca-cai.localhost:4943",
    "http://localhost:3000",
    // Adicione outras origens aqui
];

export async function GET(req: NextRequest, res: NextResponse) {
    await connectToDatabase()
    try {
        // Obtém a origem da requisição
        const origin:any = req.headers.get("origin");

        // Verifica se a origem está na lista de permitidas
        if (allowedOrigins.includes(origin)) {
            const session:any = await getServerSession(authOptions);
            //const session:any = await getSession();
            console.log("This is the session: ", session);

            if(!session){
                const response = NextResponse.json(null, { status: 200 });

                // Configura o cabeçalho CORS dinamicamente
                response.headers.set("Access-Control-Allow-Origin", origin);
                response.headers.set("Access-Control-Allow-Credentials", "true");
                response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

                return response;
            }
        
            const response = NextResponse.json(session, { status: 200 });

            // Configura o cabeçalho CORS dinamicamente
            response.headers.set("Access-Control-Allow-Origin", origin);
            response.headers.set("Access-Control-Allow-Credentials", "true");
            response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

            return response;
        }

        // Se a origem não for permitida, retorne um erro ou negue o acesso
        return new NextResponse(null, { status: 403 });
    }catch(error){
        console.log("[ERROR API ROUTE][USER-SESSION]: ", error)
        return NextResponse.json({error: error}, { status:200 });
    }
}
