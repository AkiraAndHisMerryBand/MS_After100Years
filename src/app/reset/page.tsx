
"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import {
    Thermometer,
    Expand,
    Sun,
    Fish,
    TriangleAlert,
    Check,
    RotateCcw,
    CircleAlert,
    UserRound,
} from "lucide-react";
import styles from "./reset.module.css";

type Environment = "land" | "ocean" | "cave";

type ParameterKey =
    | "temperature"
    | "space"
    | "brightness"
    | "food"
    | "predators";

type Parameters = Record<ParameterKey, number>;

type ReleaseData = {
    id: string;
    name: string;
    environment: Environment;
    parameters: Parameters;
    imageUrl: string;
    description: string;
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

export default function ResetPage() {
    const router = useRouter();

    const [creature, setCreature] = useState<ReleaseData | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const saved = sessionStorage.getItem("releasedCreature");

        if (!saved) {
        return;
        }

        try {
        const data: ReleaseData = JSON.parse(saved);
        Promise.resolve().then(() => {
        setCreature(data);
        });
        } catch (error) {
        console.error("生き物データの読み込みに失敗:", error);
        }
    }, []);

    const environment = creature?.environment ?? "land";
    const theme = environmentStyles[environment];

    const handleReset = () => {
        sessionStorage.removeItem("releasedCreature");
        setShowModal(false);
        router.push("/");
    };

    return (
        <main
        className={styles.resetPage}
        style={
            {
            "--primary": theme.primary,
            "--secondary": theme.secondary,
            "--background": theme.background,
            } as CSSProperties
        }
        >
        <section className={styles.resetContent}>
            <div className={styles.creatureCard}>
                <span className={styles.cardHeading}>
                    生成された未来生物
                </span>

                <h2 className={styles.creatureName}>
                    {creature?.name ?? "読み込み中..."}
                </h2>

                <div className={styles.creatureImage}>
                    {creature?.imageUrl ? (
                    <img
                        src={creature.imageUrl}
                        alt={creature.name || "生成された未来生物"}
                        style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        }}
                    />
                    ) : (
                    <span>?</span>
                    )}
                </div>
            </div>

            <div className={styles.parameterList}>
                {parameters.map(({ key, label, Icon }) => (
                    <div className={styles.parameterRow} key={key}>
                    <Icon
                        className={styles.parameterIcon}
                        size={17}
                        strokeWidth={2}
                        aria-hidden="true"
                    />

                    <span className={styles.parameterLabel}>
                        {label}
                    </span>

                    <output className={styles.parameterValue}>
                        {creature?.parameters[key] ?? 5}
                    </output>
                    </div>
                ))}
            </div>
        </section>

        <section className={styles.completeArea}>
            <div className={styles.completeMessage}>
            <span className={styles.completeIcon}>
                <Check size={30} strokeWidth={3} />
            </span>

            <div>
                <h2>送信が完了しました</h2>
                <p>このままモニターに表示されます。</p>
            </div>
            </div>

            <div className={styles.resetActions}>
            <button
                type="button"
                className={styles.resetButton}
                onClick={() => setShowModal(true)}
            >
                <RotateCcw size={21} />
                リセット
            </button>

            <span className={styles.staffBadge}>
                <UserRound size={16} />
                スタッフのみ操作可能です
            </span>
            </div>
        </section>

        {showModal && (
            <div
            className={styles.modalOverlay}
            role="presentation"
            onClick={() => setShowModal(false)}
            >
            <div
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="reset-modal-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className={styles.modalIcon}>
                <CircleAlert size={27} strokeWidth={2.5} />
                </div>

                <h2 id="reset-modal-title">
                画面をリセットしますか？
                </h2>

                <p className={styles.modalDescription}>
                現在の展示生物を初期化します。
                <br />
                入力内容及び生成中の処理は維持されます。
                </p>

                <div className={styles.modalDivider} />

                <div className={styles.modalButtons}>
                <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setShowModal(false)}
                >
                    キャンセル
                </button>

                <button
                    type="button"
                    className={styles.confirmButton}
                    onClick={handleReset}
                >
                    リセットする
                </button>
                </div>

                <span className={styles.modalStaffBadge}>
                <UserRound size={16} />
                スタッフのみ操作可能です
                </span>
            </div>
            </div>
        )}
        </main>
    );
}
