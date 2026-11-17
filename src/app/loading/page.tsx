
"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./loading.module.css";

import { environmentStyles } from "@/lib/constants";
import { getEnvironment, getParameters } from "@/lib/params";
import { createCreature } from "@/lib/api";


function LoadingContent(){
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryString = searchParams.toString();
  const requestStarted = useRef(false);

  const environment = getEnvironment(searchParams);

  // 環境ごとの表示情報を取得
  const data = environmentStyles[environment];

  useEffect(() => {
    if (requestStarted.current) return;
    requestStarted.current = true;

    // 指定した時間だけ待つ
    const wait = (ms: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
      });
    };

    const sendData = async () => {
      const startTime = Date.now();

      try {
        const params = new URLSearchParams(queryString);

        const values = getParameters(params);

        // バックエンドに設定データを送信して結果を受け取る
        const result = await createCreature(environment, values);

        // 結果画面で利用できるように保存
        sessionStorage.setItem(
          "creatureTestResult",
          JSON.stringify(result)
        );

        // loading画面を最低3秒間表示
        const elapsedTime = Date.now() - startTime;

        if (elapsedTime < 3000) {
          await wait(3000 - elapsedTime);
        }

        // 通信完了後に結果画面へ移動
        router.push(`/result?${queryString}`);
      } catch (err) {
        console.error("バックエンド通信エラー:", err);
        router.push(`/error?environment=${environment}`);
      }
    };

    void sendData();
  }, [environment, queryString, router]);


  return (
    <main
      className={styles.loadingPage}
      style={{ background: data.background }}
    >
      <div className={styles.loadingCircle}>
        <div className={`${styles.circle} ${styles.circleOuter}`}></div>
        <div className={`${styles.circle} ${styles.circleMiddle}`}></div>
        <div className={`${styles.circle} ${styles.circleInner}`}></div>

        <div className={`${styles.dot} ${styles.dotPurple}`}></div>
        <div className={`${styles.dot} ${styles.dotBlue}`}></div>
        <div className={`${styles.dot} ${styles.dotGreen}`}></div>

        <Image
          className={styles.loadingAnimal}
          src={data.loadingImage}
          alt="進化する生き物のシルエット"
          width={data.loadingWidth}
          height={data.loadingHeight}
        />
      </div>

      <div className={styles.loadingText}>
        <h2>未来の姿へ進化しています...</h2>
        <p>設定した環境に適応した姿を生成しています</p>
      </div>
    </main>
  );
}

// loadingページ本体
export default function LoadingPage() {
  return (
    <Suspense fallback={<p>読み込み中...</p>}>
      <LoadingContent />
    </Suspense>
  );
}
