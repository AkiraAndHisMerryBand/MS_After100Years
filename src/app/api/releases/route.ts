
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    // ① リクエストを取得
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "JSON形式が不正です" },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { error: "リクエスト形式が不正です" },
        { status: 400 }
      );
    }

    const { creature_id, name } = body as Record<string, unknown>;

    // ② 生物IDの検証
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (
      typeof creature_id !== "string" ||
      !uuidPattern.test(creature_id)
    ) {
      return NextResponse.json(
        { error: "生物IDが不正です" },
        { status: 400 }
      );
    }

    // ③ 名前の検証
    if (
      typeof name !== "string" ||
      name.trim().length === 0 ||
      name.trim().length > 100
    ) {
      return NextResponse.json(
        { error: "生物名は1〜100文字で入力してください" },
        { status: 400 }
      );
    }

    // ④ PostgreSQL関数を実行
    const { data, error } = await supabase.rpc(
      "release_creature",
      {
        p_creature_id: creature_id,
        p_name: name.trim(),
      }
    );

    // ⑤ DBエラーの処理
    if (error) {
      console.error("放出登録エラー:", error);

      if (error.message.includes("CREATURE_NOT_FOUND")) {
        return NextResponse.json(
          { error: "指定された生物が存在しません" },
          { status: 404 }
        );
      }

      if (error.message.includes("ALREADY_RELEASED")) {
        return NextResponse.json(
          { error: "この生物はすでに放出されています" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "放出登録に失敗しました" },
        { status: 500 }
      );
    }

    // ⑥ 成功レスポンス
    return NextResponse.json(
      {
        message: "放出登録成功",
        release: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("予期しないエラー:", error);

    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
