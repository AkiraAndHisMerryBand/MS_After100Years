import type { GenerationJob } from "./types";
import { updateJobStatus } from "./repository";

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function processGenerationJob(
  job: GenerationJob
): Promise<void> {
  console.log(`[START] ${job.id}`);

  try {
    // 画像生成開始
    await updateJobStatus(job.id, "IMAGE_GENERATING");
    console.log(`[IMAGE_GENERATING] ${job.id}`);

    // ダミー画像生成処理
    await sleep(5000);

    // 画像生成完了
    await updateJobStatus(job.id, "IMAGE_COMPLETED");
    console.log(`[IMAGE_COMPLETED] ${job.id}`);

    // 3Dモデル生成開始
    await updateJobStatus(job.id, "MODEL_GENERATING");
    console.log(`[MODEL_GENERATING] ${job.id}`);

    // ダミー3Dモデル生成処理
    await sleep(10000);

    // 全工程完了
    await updateJobStatus(job.id, "COMPLETED");
    console.log(`[COMPLETED] ${job.id}`);

  } catch (error) {
    console.error(`[FAILED] ${job.id}`, error);

    await updateJobStatus(job.id, "FAILED");
  }
}