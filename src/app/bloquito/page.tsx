"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function BotControl() {
  const [status, setStatus] = useState<string | null>(null);
  const session = useSession()
  
  const startBot = async () => {
    setStatus("Iniciando...");
    try {
      const res = await fetch("/api/start-bloquito", { method: "POST" });
      const data = await res.json();
      setStatus(data.message || "Erro ao iniciar bot");
    } catch (error) {
      setStatus("Erro ao iniciar bot");
      console.error(error);
    }
  };

  useEffect(() => {
    axios.get("/api/user-session").then(response => {
      console.log("This is the session from the api: ", response.data)
    })

    axios.get("/api/user-guilds").then(response => {
      console.log("This is the user guilds from the api: ", response.data)
    })
  }, [])

  return (
    <main className="flex flex-col items-center lg:mx-auto px-6 py-6 lg:max-w-7xl">
      <h2>Teste de controle geral do Bloquito</h2>
      <p>{JSON.stringify(session)}</p>
      <button onClick={startBot} disabled={status === "Iniciando..."}>
        🚀 Iniciar Bot
      </button>
      {status && <p>{status}</p>}
    </main>
  );
}
