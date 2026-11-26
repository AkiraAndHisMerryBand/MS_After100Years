import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// 並列処理用のモジュール
import { generationQueue } from "@/lib/generation/queue";
import { processGenerationJob } from "@/lib/generation/worker";
import type { GenerationJob } from "@/lib/generation/types";

export const runtime = "nodejs";

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

  // DBに生成ジョブを登録
  const { data, error } = await supabase
    .from("generation_jobs")
    .insert({
      experience_id: body.experience_id,
      status: "QUEUED",
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        {
          error: "この体験の生成ジョブは既に登録されています",
        },
        { status: 409 }
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        error: "生成ジョブの登録に失敗しました",
      },
      { status: 500 }
    );
  }

  // 生成ジョブの作成
  const job: GenerationJob = {
    id: data.id,
    experience_id: data.experience_id,
    status: "QUEUED",
  };

  // キューにジョブを追加
  void generationQueue
    .add(() => processGenerationJob(job))
    .catch((error) => {
      console.error(`[QUEUE ERROR] ${job.id}`, error);
    });

  console.log(`[QUEUED] ${job.id}`);
  console.log(`実行中: ${generationQueue.pending}`);
  console.log(`待機中: ${generationQueue.size}`);

  // 生成完了を待たずにレスポンスを返す
  return NextResponse.json(
    {
      message: "生成ジョブ登録成功",
      job: data,
    },
    { status: 201 }
  );
}