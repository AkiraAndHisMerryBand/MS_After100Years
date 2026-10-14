
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./result.module.css";
import {
  Thermometer,
  Expand,
  Sun,
  Fish,
  TriangleAlert,
} from "lucide-react";

type Environment = "land" | "ocean" | "cave";

type ParameterKey =
  | "temperature"
  | "space"
  | "brightness"
  | "food"
  | "predators";

const environmentStyles: Record<
  Environment,
  {
    name: string;
    primary: string;
    secondary: string;
    background: string;
  }
> = {
  land: {
    name: "地上",
    primary: "#69F2A9",
    secondary: "#276C4A",
    background: "linear-gradient(135deg, #FFFFFF 0%, #69F2A9 100%)",
  },
  ocean: {
    name: "海底",
    primary: "#6984F2",
    secondary: "#000083",
    background: "linear-gradient(135deg, #FFFFFF 0%, #6984F2 100%)",
  },
  cave: {
    name: "洞窟",
    primary: "#C969F2",
    secondary: "#580088",
    background: "linear-gradient(135deg, #FFFFFF 0%, #C969F2 100%)",
  },
};

const parameters: {
  key: ParameterKey;
  label: string;
  Icon: typeof Thermometer;
}[] = [
  { key: "temperature", label: "温度", Icon: Thermometer },
  { key: "space", label: "空間の広さ", Icon: Expand },
  { key: "brightness", label: "明るさ", Icon: Sun },
  { key: "food", label: "餌資源", Icon: Fish },
  { key: "predators", label: "天敵の多さ", Icon: TriangleAlert },
];

export default function ResultPage() {
  const searchParams = useSearchParams();

  const environmentParam = searchParams.get("environment");

  const environment: Environment =
    environmentParam === "ocean" ||
    environmentParam === "cave" ||
    environmentParam === "land"
      ? environmentParam
      : "land";

  const style = environmentStyles[environment];

  const [creatureName, setCreatureName] = useState("");

  const values: Record<ParameterKey, number> = {
    temperature: Number(searchParams.get("temperature") ?? 5),
    space: Number(searchParams.get("space") ?? 5),
    brightness: Number(searchParams.get("brightness") ?? 5),
    food: Number(searchParams.get("food") ?? 5),
    predators: Number(searchParams.get("predators") ?? 5),
  };

  const handleRelease = () => {
    // TODO: バックエンドと連携して生物を大型モニターに放つ
    console.log("生物の名前:", creatureName);
    console.log("生息環境:", environment);
    console.log("パラメーター:", values);
  };

  return (
    <main
      className={styles.resultpage}
      style={
        {
          "--primary": style.primary,
          "--secondary": style.secondary,
          "--background": style.background,
        } as React.CSSProperties
      }
    >
      <section className={styles.resultcontent}>
        <div className={styles.resultcard}>
          <span className={styles.resultcardheading}>
            生成された未来生物
          </span>

          <div className={styles.resultimage} aria-label="生成された生物">
            ?
          </div>
        </div>

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

          <input
            className={styles.creatureNameInput}
            type="text"
            maxLength={30}
            placeholder="生物の名前を入力"
            aria-label="生物の名前"
            value={creatureName}
            onChange={(event) => setCreatureName(event.target.value)}
          />

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
