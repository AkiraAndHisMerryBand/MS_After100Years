
/* 生息環境 */
export type Environment = "land" | "ocean" | "cave";

/* 環境パラメータ */
export type Parameters = {
    temperature: number;
    space: number;
    brightness: number;
    food: number;
    predators: number;
};

/* 生物を放つときのデータ */
export type ReleaseData = {
    id: string;
    name: string;
    environment: Environment;
    parameters: Parameters;
    imageUrl: string;
    description: string;
};

// バックエンドから受け取るデータ
export type ApiResult = {
    message: string;

    receiveData: {
        environment: Environment;
        temperature: number;
        space: number;
        brightness: number;
        food: number;
        predators: number;
    };

    // 将来的に受け取る生物の情報
    id?: string;
    name?: string;
    imageUrl?: string;
    description?: string;
};
