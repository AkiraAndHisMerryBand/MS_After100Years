
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import styles from "./error.module.css";

type Environment = "land" | "ocean" | "cave";

const environmentBackgrounds: Record<Environment, string> = {
  land: "linear-gradient(180deg, #E4F8EC 0%, #B4EBCB 100%)",
  ocean: "linear-gradient(180deg, #DFE7FF 0%, #AEBFF7 100%)",
  cave: "linear-gradient(180deg, #F1E2FF 0%, #D6B3F2 100%)",
};

function isEnvironment(value: string | null): value is Environment {
  return value === "land" || value === "ocean" || value === "cave";
}

export default function ErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const environmentParam = searchParams.get("environment");

  const environment: Environment = isEnvironment(environmentParam)
    ? environmentParam
    : "land";

  const handleReset = () => {
    // 保存している生成結果を削除
    sessionStorage.removeItem("creatureTestResult");

    // 初期画面へ戻る
    router.replace("/");
  };

  return (
    <main
      className={styles.errorPage}
      style={{
        background: environmentBackgrounds[environment],
      }}
    >
      <header className={styles.header}>
        <h1 className={styles.logo}> <Image
                  src="/images/rogo.png"
                  alt="ロゴ"
                  width={100}
                  height={79}
                /></h1>
        <span className={styles.headerLabel}>未来生物生成端末</span>
      </header>

      <section className={styles.errorCard}>
        <div className={styles.errorIcon}>
          <span>!</span>
        </div>

        <h2 className={styles.errorTitle}>
          生物の生成に失敗しました
        </h2>

        <p className={styles.errorMessage}>
          申し訳ありません。画像を生成できませんでした。
          <br />
          スタッフにお知らせ下さい。
        </p>

        <div className={styles.errorBadge}>
          生成エラー
        </div>
      </section>

      <div className={styles.resetArea}>
        <button
          type="button"
          className={styles.resetButton}
          onClick={handleReset}
        >
          スタッフ用リセット
        </button>

        <p className={styles.resetNote}>
          ※ 来場者による再生成はできません
        </p>
      </div>
    </main>
  );
}
