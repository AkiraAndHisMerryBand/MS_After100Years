
"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import "./setting.css";
import { useRouter, useSearchParams } from "next/navigation";
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
    primary: string;
    secondary: string;
    background: string;
    image: string;
    creatureName: string;
  }
> = {
  land: {
    primary: "#69F2A9",
    secondary: "#276C4A",
    background: "linear-gradient(135deg, #FFFFFF 0%, #69F2A9 100%)",
    image: "/images/dog.png",
    creatureName: "イヌ",
  },
  ocean: {
    primary: "#6984F2",
    secondary: "#000083",
    background: "linear-gradient(135deg, #FFFFFF 0%, #6984F2 100%)",
    image: "/images/tuna.png",
    creatureName: "マグロ",
  },
  cave: {
    primary: "#C969F2",
    secondary: "#580088",
    background: "linear-gradient(135deg, #FFFFFF 0%, #C969F2 100%)",
    image: "/images/bat.png",
    creatureName: "コウモリ",
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

export default function SettingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const environmentParam = searchParams.get("environment");

  const environment: Environment =
    environmentParam === "ocean" ||
    environmentParam === "cave" ||
    environmentParam === "land"
      ? environmentParam
      : "land";

  const style = environmentStyles[environment];

  const [values, setValues] = useState<Record<ParameterKey, number>>({
    temperature: 5,
    space: 5,
    brightness: 5,
    food: 5,
    predators: 5,
  });

  const handleEvolve = () => {
    const query = new URLSearchParams({
      environment,
      ...Object.fromEntries(
        Object.entries(values).map(([key, value]) => [
          key,
          String(value),
        ])
      ),
    });

    router.push(`/loading?${query.toString()}`);
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <main
      className="setting-page"
      style={
        {
          "--primary": style.primary,
          "--secondary": style.secondary,
          "--page-background": style.background,
        } as CSSProperties
      }
    >
      <section className="setting-content">
        {/* 左側：進化前の生物カード */}
        <div className="creature-card">
          <div className="creature-heading">
            <span>進化前生物</span>
            <strong>{style.creatureName}</strong>
          </div>

          <div className="creature-image">
            <Image
              src={style.image}
              alt={style.creatureName}
              width={160}
              height={160}
              priority
              className="animal-image"
            />
          </div>
        </div>

        {/* 右側：パラメータ設定 */}
        <div className="setting-controls">
          <div className="parameter-list">
            {parameters.map(({ key, label, Icon }) => (
              <div className="parameter-row" key={key}>
                <Icon
                  className="parameter-icon"
                  size={17}
                  strokeWidth={2}
                  aria-hidden="true"
                />

                <label htmlFor={key}>{label}</label>

                <output htmlFor={key} className="parameter-value">
                  {values[key]}
                </output>

                <input
                  id={key}
                  className="parameter-slider"
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

          <div className="setting-buttons">
            <button
              type="button"
              className="back-button"
              onClick={handleBack}
            >
              戻る
            </button>

            <button
              type="button"
              className="evolve-button"
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
