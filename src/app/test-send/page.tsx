"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TestSendPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [environment, setEnvironment] = useState("ocean");

  async function handleSend() { 

    setError("");

    const data = {
      environment: environment,
      temperature: 5,
      space: 8,
      brightness: 1,
      food: 7,
      predators: 8,
    };

    try {
      const response = await fetch("/api/creatures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("API通信に失敗");
      }

      const result = await response.json();

      // JSONを一時保存
      sessionStorage.setItem(
        "creatureTestResult",
        JSON.stringify(result)
      );

      // 遷移
      router.push("/test-result");
    } catch {
      setError("送信失敗");
    }
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>バックエンド通信テスト</h1>
      <label>
        環境:
        <select value={environment} onChange={(e) => setEnvironment(e.target.value)}>
          <option value="ocean">ocean</option>
          <option value="forest">forest</option>
          <option value="desert">desert</option>
        </select>
      </label>
      
      <p>温度：5 / 広さ：8 / 明るさ：1</p>

      <button onClick={handleSend}>
        JSONを送信
      </button>

      {error && <p role="alert">{error}</p>}
    </main>
  );
}
