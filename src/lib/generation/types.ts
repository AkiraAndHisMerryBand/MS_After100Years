export type GenerationStatus =
  | "QUEUED"
  | "IMAGE_GENERATING"
  | "IMAGE_COMPLETED"
  | "MODEL_GENERATING"
  | "COMPLETED"
  | "FALLBACK_2D"
  | "FAILED"
  | "TIMED_OUT";

export interface GenerationJob {
  id: string;
  experience_id: string;
  status: GenerationStatus;
}