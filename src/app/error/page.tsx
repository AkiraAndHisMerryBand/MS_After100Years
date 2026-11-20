
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./error.module.css";


export default function ErrorPage() {
  const router = useRouter();

  // スタッフ用リセット
  const handleReset = () => {
    // 保存している生成結果を削除
    sessionStorage.removeItem("creatureTestResult");

    // 初期画面へ戻る
    router.replace("/");
  };

  return (
    <main className={styles.errorPage}>

      {/* ヘッダー */}
      <header className={styles.header}>
        <h1 className={styles.logo}>
          <Image
            src="/images/rogo.png"
            alt="ロゴ"
            width={100}
            height={79}
          />
        </h1>

        <span className={styles.headerLabel}>
          未来生物生成端末
        </span>
      </header>


      {/* エラー内容 */}
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


      {/* スタッフ用リセット */}
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
