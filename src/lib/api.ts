
import type { Environment, Parameters } from "./types";

// バックエンドに設定データを送信する
export const createCreature = async (
    environment: Environment,
    values: Parameters
) => {
    const requestData = {
        environment: environment,
        temperature: values.temperature,
        space: values.space,
        brightness: values.brightness,
        food: values.food,
        predators: values.predators,
    };

    const response = await fetch("/api/creatures", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
    });

    if (!response.ok) {
        throw new Error(`API通信に失敗しました（${response.status}）`);
    }

    const result = await response.json();

    return result;
};
