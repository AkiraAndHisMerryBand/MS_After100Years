import { supabase } from "@/lib/supabase";
import type { GenerationStatus } from "./types";

export async function updateJobStatus(
  jobId: string,
  status: GenerationStatus
): Promise<void> {
  const { data, error } = await supabase
    .from("generation_jobs")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", jobId)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(
      `ジョブ更新失敗: ${error?.message ?? jobId}`
    );
  }
}