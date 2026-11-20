"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./setting.module.css";
import type { CSSProperties } from "react";

import type { Parameters } from "@/lib/types";
import { environmentStyles, defaultValues, parameters } from "@/lib/constants";
import { getEnvironment } from "@/lib/params";


function SettingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const environment = getEnvironment(searchParams);

  // 選択した環境のデザイン情報
  const style = environmentStyles[environment];

  // 5つのパラメータを管理
  const [values, setValues] = useState<Parameters>(defaultValues);

  // 進化するボタン
  const handleEvolve = () => {
    const query = new URLSearchParams({
      environment: environment,
      temperature: String(values.temperature),
      space: String(values.space),
      brightness: String(values.brightness),
      food: String(values.food),
      predators: String(values.predators),
    });

    router.push(`/loading?${query.toString()}`);
  };

  // 戻るボタン
  const handleBack = () => {
    router.push("/");
  };


  return (
    <main
      className={styles.settingpage}
      style={
        {
          "--secondary": style.secondary,
          "--page-background": style.background,
        } as CSSProperties
      }
    >
      <section className={styles.settingcontent}>
        {/* 左側：進化前の生物カード */}
        <div className={styles.creaturecard}>
          <div className={styles.creatureheading}>
            <span>進化前生物</span>
            <strong>{style.creatureName}</strong>
          </div>

          <div className={styles.creatureimage}>
            <Image
              src={style.image}
              alt={style.creatureName}
              width={160}
              height={160}
              priority
              className={styles.animalimage}
            />
          </div>
        </div>

        {/* 右側：パラメータ設定 */}
        <div className={styles.settingcontrols}>
          <div className={styles.parameterlist}>
            {parameters.map(({ key, label, Icon }) => (
              <div className={styles.parameterrow} key={key}>
                <Icon
                  className={styles.parametericon}
                  size={17}
                  strokeWidth={2}
                  aria-hidden="true"
                />

                <label htmlFor={key}>{label}</label>

                <output htmlFor={key} className={styles.parametervalue}>
                  {values[key]}
                </output>

                <input
                  id={key}
                  className={styles.parameterslider}
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={values[key]}
                  aria-label={label}
                  onChange={(event) =>
                    setValues((previous) => ({
                      ...previous,
                      [key]: Number(event.target.value),
                    }))
                  }
                />
              </div>
            ))}
          </div>

          <div className={styles.settingbuttons}>
            <button
              type="button"
              className={styles.backbutton}
              onClick={handleBack}
            >
              戻る
            </button>

            <button
              type="button"
              className={styles.evolvebutton}
              onClick={handleEvolve}
            >
              進化させる
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}

export default function SettingPage() {
  return (
    <Suspense fallback={<p>読み込み中...</p>}>
      <SettingContent />
    </Suspense>
  );
}
