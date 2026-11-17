
import type { Environment, Parameters } from "./types";
import { defaultValues } from "./constants";

// URLから生息環境を取得する
export const getEnvironment = (params: URLSearchParams): Environment => {
    const environment = params.get("environment");

    if (
        environment === "land" ||
        environment === "ocean" ||
        environment === "cave"
    ) {
        return environment;
    }

    return "land";
};

// URLからパラメータを取得する
export const getParameters = (params: URLSearchParams): Parameters => {
    // 数値が正しいか確認する
    const getValue = (key: string, defaultValue: number) => {
        const value = params.get(key);

        if (value === null) {
        return defaultValue;
        }

        const number = Number(value);

        if (!Number.isInteger(number) || number < 1 || number > 10) {
        return defaultValue;
        }

        return number;
    };

    return {
        temperature: getValue("temperature", defaultValues.temperature),
        space: getValue("space", defaultValues.space),
        brightness: getValue("brightness", defaultValues.brightness),
        food: getValue("food", defaultValues.food),
        predators: getValue("predators", defaultValues.predators),
    };
};
