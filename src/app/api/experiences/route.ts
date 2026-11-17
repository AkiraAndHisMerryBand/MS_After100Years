
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const deviceId = body.device_id;

    if (
      typeof deviceId !== "string" ||
      deviceId.trim().length === 0 ||
      deviceId.length > 100
    ) {
      return NextResponse.json(
        { error: "device_idが不正です" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("experiences")
      .insert({
        device_id: deviceId,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "体験の開始に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "体験開始成功",
        experience: data,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "リクエストが不正です" },
      { status: 400 }
    );
  }
}
