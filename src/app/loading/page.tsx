"use client";
import { useSearchParams, useRouter } from "next/navigation";

import Image from "next/image";
import "./loading.css";

const environmentData = {
    land: {
        image: "/images/bog_sh.png",
        background: "linear-gradient(to bottom, #FFFFFF, #69F2A9)",
        width: 100,
        height: 100,
    },
    ocean: {
        image:"/images/tuna_sh.png",
        background: "linear-gradient(to bottom, #FFFFFF, #6984F2)",
        width: 140,
        height: 93,
    },
    cave: {
        image: "/images/bat_sh.png",
        background: "linear-gradient(to bottom, #FFFFFF, #C969F2)",
        width: 140,
        height: 93,
    }
}

export default function LoadingPage() {

    const searchParams = useSearchParams();
    const environment = searchParams.get("environment");
    const data = environmentData[
        environment === "ocean" || environment === "cave" ? environment: "land"
    ];

    const router = useRouter();
    // router.push(`/result?environment=${environment}`);

    return (
        <main className="loading-page" style={{ background: data.background}}>
            <div className="loading-circle">
                <div className="circle circle-outer"></div>
                <div className="circle circle-middle"></div>
                <div className="circle circle-inner"></div>

                <div className="dot dot-purple"></div>
                <div className="dot dot-blue"></div>
                <div className="dot dot-green"></div>

                <Image className="loading-animal"
                src={data.image}
                alt="進化前のシルエット"
                width={data.width}
                height={data.height}
                />
            </div>

            <div className="loading-text">
                <h2>未来の姿へ進化しています...</h2>
                <p>設定した環境に適応した姿を生成しています</p>
            </div>
        </main>
    );
}