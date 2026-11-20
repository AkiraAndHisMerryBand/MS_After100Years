
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PATCH(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // UUID形式のチェック
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(id)) {
    return NextResponse.json(
      { error: "体験IDが不正です" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("experiences")
    .update({
      status: "completed",
      ended_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "active")
    .select()
    .maybeSingle();

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "体験終了に失敗しました" },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "対象の体験が存在しないか、既に終了しています" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "体験終了成功",
    experience: data,
  });
}
