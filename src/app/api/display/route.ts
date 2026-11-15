
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const environment = request.nextUrl.searchParams.get("environment");

  // 環境の入力チェック
  if (
    environment !== "ocean" &&
    environment !== "cave" &&
    environment !== "land"
  ) {
    return NextResponse.json(
      { error: "environmentはocean、cave、landのいずれかを指定してください" },
      { status: 400 }
    );
  }

  // 展示対象の生物データを取得
  const { data, error } = await supabase
    .from("display_state")
    .select(`
      creature_id,
      environment,
      display_order,
      added_at,
      creatures (
        id,
        name,
        environment,
        parameters,
        features,
        description
      )
    `)
    .eq("environment", environment)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("展示生物取得エラー:", error);

    return NextResponse.json(
      { error: "展示生物の取得に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: "展示生物取得成功",
      creatures: data ?? [],
    },
    { status: 200 }
  );
}
