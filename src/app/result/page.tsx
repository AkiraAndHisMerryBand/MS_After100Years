
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import styles from "./result.module.css";

import type { Environment, ApiResult, ReleaseData } from "@/lib/types";
import { environmentStyles, parameters } from "@/lib/constants";


// 生息環境が正しいか確認する
function isEnvironment(value: unknown): value is Environment {
  return value === "land" || value === "ocean" || value === "cave";
}

export default function ResultPage() {
  const router = useRouter();

  // バックエンドから受け取ったデータ
  const [creatureData, setCreatureData] = useState<ApiResult | null>(null);

  // 来場者が入力する名前
  const [creatureName, setCreatureName] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("creatureTestResult");

    if (!saved) {
      router.push("/error");
      return;
    }

    try {
      const result: ApiResult = JSON.parse(saved);

      const data = result.receiveData;

      if (!data) {
        throw new Error("受信データがありません");
      }

      if (!isEnvironment(data.environment)) {
        throw new Error("生息環境が正しくありません");
      }

      const numbers = [
        data.temperature,
        data.space,
        data.brightness,
        data.food,
        data.predators,
      ];

      for (const number of numbers) {
        if (!Number.isInteger(number) || number < 1 || number > 10) {
          throw new Error("パラメータが正しくありません");
        }
      }

      // バックエンドから受け取ったデータをまとめて保存
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCreatureData(result);

    } catch (error) {
      console.error("受信データの読み込みに失敗しました:", error);
      router.push("/error");
    }
  }, [router]);
  
  // 生き物を放つボタン
  const handleRelease = () => {
    if (!creatureData) {
      return;
    }

    const data = creatureData.receiveData;

    const releaseData: ReleaseData = {
      id: creatureData.id || "",
      name: creatureName.trim(),
      environment: data.environment,
      parameters: {
        temperature: data.temperature,
        space: data.space,
        brightness: data.brightness,
        food: data.food,
        predators: data.predators,
      },
      imageUrl: creatureData.imageUrl || "",
      description: creatureData.description || "",
    };

    // 生き物の情報を保存
    sessionStorage.setItem(
      "releasedCreature",
      JSON.stringify(releaseData)
    );

    router.push("/reset");
  };

  // データの読み込み待ち
  if (!creatureData) {
    return <p>データを読み込んでいます...</p>;
  }

  // バックエンドから受け取ったデータ
  const data = creatureData.receiveData;

  const environment = data.environment;

  const values = {
    temperature: data.temperature,
    space: data.space,
    brightness: data.brightness,
    food: data.food,
    predators: data.predators,
  };

  const imageUrl = creatureData.imageUrl || "";
  const description = creatureData.description || "";

  // 環境ごとの表示情報
  const style = environmentStyles[environment];


  return (
    <main
      className={styles.resultpage}
      style={
        {
          "--primary": style.primary,
          "--secondary": style.secondary,
          "--background": style.background,
        } as CSSProperties
      }
    >
      <section className={styles.resultcontent}>

        {/* 生き物のカード */}
        <div className={styles.resultcard}>
          <span className={styles.resultcardheading}>
            生成された未来の生き物
          </span>

          <div
            className={styles.resultimage}
            aria-label="生成された生き物"
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={creatureName || "生成された生き物"}
                width={210}
                height={210}
                className={styles.generatedimage}
              />
            ) : (
              "?"
            )}
          </div>

          {description && <p>{description}</p>}
        </div>


        {/* パラメータ表示 */}
        <div className={styles.resultcontrols}>
          <div className={styles.parameterlist}>
            {parameters.map(({ key, label, Icon }) => (
              <div className={styles.parameterrow} key={key}>
                <Icon
                  className={styles.parametericon}
                  size={17}
                  strokeWidth={2}
                  aria-hidden="true"
                />

                <span>{label}</span>

                <output className={styles.parametervalue}>
                  {values[key]}
                </output>
              </div>
            ))}
          </div>


          {/* 生き物の名前入力 */}
          <input
            className={styles.creatureNameInput}
            type="text"
            maxLength={30}
            placeholder="生き物の名前を入力"
            aria-label="生き物の名前"
            value={creatureName}
            onChange={(event) => setCreatureName(event.target.value)}
          />


          {/* 生き物を放つボタン */}
          <button
            type="button"
            className={styles.evolveButton}
            onClick={handleRelease}
            disabled={!creatureName.trim()}
          >
            この生き物を放つ
          </button>

        </div>
      </section>
    </main>
  );
}
