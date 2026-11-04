// Backend API
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    // フロントからのJSONを取得
    const data = await request.json();

    //バックエンドのターミナルに表示
    console.log("受信データ:", data);

    //受け取ったデータをそのまま返す
    return NextResponse.json({
        message: "受信したよ",
        receiveData: data,
    });
}