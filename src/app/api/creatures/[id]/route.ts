
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // UUID形式の確認
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(id)) {
    return NextResponse.json(
      { error: "生物IDの形式が不正です" },
      { status: 400 }
    );
  }

  // Supabaseから生物データを取得
  const { data, error } = await supabase
    .from("creatures")
    .select(
      "id, experience_id, name, environment, parameters, features, description, created_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("生物取得エラー:", error);

    return NextResponse.json(
      { error: "生物データの取得に失敗しました" },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "指定された生物が見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      message: "生物取得成功",
      creature: data,
    },
    { status: 200 }
  );
}
