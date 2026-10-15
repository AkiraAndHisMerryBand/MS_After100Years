"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TestResultPage() {
  const [result, setResult] = useState<unknown>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("creatureTestResult");

    if (saved) {
      try {
        setResult(JSON.parse(saved));
      } catch {
        setResult(null);
      }
    }
  }, []);

  return (
    <main style={{ padding: 40 }}>
      <h1>バックエンドからの受信結果</h1>

      {result === null ? (
        <p>表示するデータがありません</p>
      ) : (
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

      <Link href="/test-send">送信画面に戻る</Link>
    </main>
  );
}
