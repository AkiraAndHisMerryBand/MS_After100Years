import PQueue from "p-queue";

const globalForQueue = globalThis as typeof globalThis & {
  generationQueue?: PQueue;
};

export const generationQueue =
  globalForQueue.generationQueue ??
  new PQueue({
    concurrency: 3,
  });

globalForQueue.generationQueue = generationQueue;