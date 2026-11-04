
"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
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

type Parameters = Record<ParameterKey, number>;

type ApiResult = {
  message?: string;
  receiveData?: {
    environment?: string;
    temperature?: number;
    space?: number;
    brightness?: number;
    food?: number;
    predators?: number;
  };
  id?: string;
  name?: string;
  imageUrl?: string;
  description?: string;
  parameters?: Partial<Parameters>;
};

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
  { key: "food", label: "食料", Icon: Fish },
  { key: "predators", label: "天敵の多さ", Icon: TriangleAlert },
];

const defaultValues: Parameters = {
  temperature: 5,
  space: 5,
  brightness: 5,
  food: 5,
  predators: 5,
};

function isEnvironment(value: unknown): value is Environment {
  return value === "land" || value === "ocean" || value === "cave";
}

export default function ResultPage() {
  const searchParams = useSearchParams();

  const environmentParam = searchParams.get("environment");

  const [environment, setEnvironment] = useState<Environment>(
    isEnvironment(environmentParam) ? environmentParam : "land"
  );

  const [values, setValues] = useState<Parameters>(() => ({
    temperature: Number(searchParams.get("temperature") ?? 5),
    space: Number(searchParams.get("space") ?? 5),
    brightness: Number(searchParams.get("brightness") ?? 5),
    food: Number(searchParams.get("food") ?? 5),
    predators: Number(searchParams.get("predators") ?? 5),
  }));

  const [creatureName, setCreatureName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [creatureId, setCreatureId] = useState("");
  const [received, setReceived] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("creatureTestResult");

    if (!saved) {
      return;
    }

    try {
      const result: ApiResult = JSON.parse(saved);

      // APIが生き物データを直接返す場合
      // または receiveData に設定データを入れて返す場合の両方に対応
      const receivedData = result.receiveData ?? result;

      if (isEnvironment(receivedData.environment)) {
        setEnvironment(receivedData.environment);
      }

      const receivedParameters: Partial<Parameters> =
        "parameters" in receivedData && receivedData.parameters
          ? receivedData.parameters
          : receivedData;

      setValues((previous) => ({
        temperature:
          typeof receivedParameters.temperature === "number"
            ? receivedParameters.temperature
            : previous.temperature,
        space:
          typeof receivedParameters.space === "number"
            ? receivedParameters.space
            : previous.space,
        brightness:
          typeof receivedParameters.brightness === "number"
            ? receivedParameters.brightness
            : previous.brightness,
        food:
          typeof receivedParameters.food === "number"
            ? receivedParameters.food
            : previous.food,
        predators:
          typeof receivedParameters.predators === "number"
            ? receivedParameters.predators
            : previous.predators,
      }));

      if (typeof result.name === "string") {
        setCreatureName(result.name);
      }

      if (typeof result.imageUrl === "string") {
        setImageUrl(result.imageUrl);
      }

      if (typeof result.description === "string") {
        setDescription(result.description);
      }

      if (typeof result.id === "string") {
        setCreatureId(result.id);
      }

      setReceived(true);
    } catch (error) {
      console.error("受信データの読み込みに失敗しました:", error);
    }
  }, []);

  const style = environmentStyles[environment];

  const handleRelease = () => {
    const releaseData = {
      id: creatureId,
      name: creatureName.trim(),
      environment,
      parameters: values,
      imageUrl,
      description,
    };

    console.log("生き物の名前:", releaseData.name);
    console.log("生息環境:", releaseData.environment);
    console.log("パラメータ:", releaseData.parameters);
    console.log("受信データあり:", received);
    console.log("生き物データ:", releaseData);
  };

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
        <div className={styles.resultcard}>
          <span className={styles.resultcardheading}>
            生成された未来の生き物
          </span>

          <div
            className={styles.resultimage}
            aria-label="生成された生き物"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={creatureName || "生成された生き物"}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              "?"
            )}
          </div>

          {description && <p>{description}</p>}
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
            placeholder="生き物の名前を入力"
            aria-label="生き物の名前"
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
