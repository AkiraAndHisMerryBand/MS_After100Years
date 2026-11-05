
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Not Found" },
      { status: 404 }
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
    !("experience_id" in body) ||
    typeof body.experience_id !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      body.experience_id
    )
  ) {
    return NextResponse.json(
      { error: "experience_idが不正です" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("generation_jobs")
    .insert({
      experience_id: body.experience_id,
      status: "QUEUED",
    })
    .select()
    .single();

  if (error) {
    console.error(error);

    return NextResponse.json(
      { error: "生成ジョブの登録に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: "生成ジョブ登録成功",
      job: data,
    },
    { status: 201 }
  );
}
