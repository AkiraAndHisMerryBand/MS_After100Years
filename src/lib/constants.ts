
import type { Parameters } from "./types";

import {
    Thermometer,
    Expand,
    Sun,
    Fish,
    TriangleAlert,
} from "lucide-react";

/* 環境ごとの表示情報 */
export const environmentStyles = {
    land: {
        name: "地上",
        primary: "#69F2A9",
        secondary: "#276C4A",
        background: "linear-gradient(to bottom, #FFFFFF, #69F2A9)",
        image: "/images/dog.png",
        creatureName: "イヌ",
        loadingImage: "/images/bog_sh.png",
        loadingWidth: 100,
        loadingHeight: 100,
    },

    ocean: {
        name: "海底",
        primary: "#6984F2",
        secondary: "#000083",
        background: "linear-gradient(to bottom, #FFFFFF, #6984F2)",
        image: "/images/tuna.png",
        creatureName: "マグロ",
        loadingImage: "/images/tuna_sh.png",
        loadingWidth: 140,
        loadingHeight: 93,
    },

    cave: {
        name: "洞窟",
        primary: "#C969F2",
        secondary: "#580088",
        background: "linear-gradient(to bottom, #FFFFFF, #C969F2)",
        image: "/images/bat.png",
        creatureName: "コウモリ",
        loadingImage: "/images/bat_sh.png",
        loadingWidth: 140,
        loadingHeight: 93,
    },
};

/* パラメータの初期値 */
export const defaultValues: Parameters = {
    temperature: 5,
    space: 5,
    brightness: 5,
    food: 5,
    predators: 5,
};

/* パラメータの表示情報 */
export const parameters = [
    {
        key: "temperature",
        label: "温度",
        Icon: Thermometer,
    },
    {
        key: "space",
        label: "空間の広さ",
        Icon: Expand,
    },
    {
        key: "brightness",
        label: "明るさ",
        Icon: Sun,
    },
    {
        key: "food",
        label: "餌資源",
        Icon: Fish,
    },
    {
        key: "predators",
        label: "天敵の多さ",
        Icon: TriangleAlert,
    },
] as const;
