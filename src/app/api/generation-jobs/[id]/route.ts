
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const allowedStatuses = [
  "QUEUED",
  "IMAGE_GENERATING",
  "IMAGE_COMPLETED",
  "MODEL_GENERATING",
  "COMPLETED",
  "FALLBACK_2D",
  "FAILED",
  "TIMED_OUT",
];

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // テスト用APIなので開発環境のみ
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Not Found" },
      { status: 404 }
    );
  }

  const { id } = await context.params;

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(id)) {
    return NextResponse.json(
      { error: "ジョブIDが不正です" },
      { status: 400 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSONが不正です" },
      { status: 400 }
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("status" in body) ||
    typeof body.status !== "string" ||
    !allowedStatuses.includes(body.status)
  ) {
    return NextResponse.json(
      { error: "statusが不正です" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("generation_jobs")
    .update({
      status: body.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "ジョブ更新に失敗しました" },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "ジョブが見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "ジョブ更新成功",
    job: data,
  });
}
