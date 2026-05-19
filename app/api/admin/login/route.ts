import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { pin } = await req.json();

    // In production, this should be in an environment variable
    const ADMIN_PIN = process.env.ADMIN_SECURITY_PIN || "Elspace12345@";

    if (pin === ADMIN_PIN) {
      // In a real app, we would set a secure cookie or JWT here
      return NextResponse.json({
        success: true,
        token: "admin_session_" + Math.random().toString(36).substring(7)
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid Security PIN" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
