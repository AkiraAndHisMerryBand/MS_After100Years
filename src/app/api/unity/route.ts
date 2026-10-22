// Unity API route handler
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Unityからのリクエストを受信しました",
    timestamp: new Date().toISOString(),
  });
}
