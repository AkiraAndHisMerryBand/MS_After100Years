
"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import "./loading.css";

const environmentData = {
  land: {
    image: "/images/bog_sh.png",
    background: "linear-gradient(to bottom, #FFFFFF, #69F2A9)",
    width: 100,
    height: 100,
  },
  ocean: {
    image: "/images/tuna_sh.png",
    background: "linear-gradient(to bottom, #FFFFFF, #6984F2)",
    width: 140,
    height: 93,
  },
  cave: {
    image: "/images/bat_sh.png",
    background: "linear-gradient(to bottom, #FFFFFF, #C969F2)",
    width: 140,
    height: 93,
  },
};

export default function LoadingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryString = searchParams.toString();
  const requestStarted = useRef(false);

  const [error, setError] = useState("");

  const environmentParam = searchParams.get("environment");
  const environment =
    environmentParam === "ocean" || environmentParam === "cave"
      ? environmentParam
      : "land";

  const data = environmentData[environment];

  useEffect(() => {
    if (requestStarted.current) return;
    requestStarted.current = true;

    const sendData = async () => {
      try {
        setError("");

        const params = new URLSearchParams(queryString);

        const requestData = {
          environment,
          temperature: Number(params.get("temperature") ?? 5),
          space: Number(params.get("space") ?? 5),
          brightness: Number(params.get("brightness") ?? 5),
          food: Number(params.get("food") ?? 5),
          predators: Number(params.get("predators") ?? 5),
        };

        // バックエンドに設定データを送信
        const response = await fetch("/api/creatures", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error(`API通信に失敗しました（${response.status}）`);
        }

        // バックエンドからの応答を受け取る
        const result = await response.json();

        // 結果画面で利用できるように保存
        sessionStorage.setItem(
          "creatureTestResult",
          JSON.stringify(result)
        );

        // 通信完了後に結果画面へ移動
        router.push(`/result?${queryString}`);
      } catch (err) {
        console.error("バックエンド通信エラー:", err);
        setError(
          err instanceof Error
            ? err.message
            : "通信に失敗しました。"
        );
      }
    };

    void sendData();
  }, [environment, queryString, router]);

  return (
    <main
      className="loading-page"
      style={{ background: data.background }}
    >
      <div className="loading-circle">
        <div className="circle circle-outer"></div>
        <div className="circle circle-middle"></div>
        <div className="circle circle-inner"></div>

        <div className="dot dot-purple"></div>
        <div className="dot dot-blue"></div>
        <div className="dot dot-green"></div>

        <Image
          className="loading-animal"
          src={data.image}
          alt="進化する生き物のシルエット"
          width={data.width}
          height={data.height}
        />
      </div>

      <div className="loading-text">
        {error ? (
          <>
            <h2>通信に失敗しました</h2>
            <p>{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              もう一度試す
            </button>
          </>
        ) : (
          <>
            <h2>未来の姿へ進化しています...</h2>
            <p>設定した環境に適応した姿を生成しています</p>
          </>
        )}
      </div>
    </main>
  );
}
