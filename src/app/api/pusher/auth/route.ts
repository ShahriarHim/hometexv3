import { pusherServer } from "@/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

/**
 * Pusher Authentication Endpoint
 * This endpoint is used by the Pusher client to authenticate access to private/presence channels
 */
export async function POST(request: NextRequest) {
  try {
    // Validate Pusher is properly configured
    if (!process.env.PUSHER_SECRET || !process.env.PUSHER_APP_ID) {
      console.error("Pusher not properly configured: Missing PUSHER_SECRET or PUSHER_APP_ID");
      return NextResponse.json({ error: "Pusher not configured" }, { status: 503 });
    }

    const body = await request.json();
    const { socket_id, channel_name } = body;

    if (!socket_id || !channel_name) {
      return NextResponse.json({ error: "Missing socket_id or channel_name" }, { status: 400 });
    }

    // For presence channels, you can add user info
    let authResponse;
    if (channel_name.startsWith("presence-")) {
      // Presence channel - include user info
      authResponse = pusherServer.authorizeChannel(socket_id, channel_name, {
        user_id: `user-${Date.now()}`, // You could get real user ID from session
        user_info: {
          name: "Anonymous User",
        },
      });
    } else {
      // Private channel
      authResponse = pusherServer.authorizeChannel(socket_id, channel_name);
    }

    return NextResponse.json(authResponse);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Pusher auth error:", errorMsg);
    if (process.env.NODE_ENV === "development") {
      console.error("Full error:", error);
      console.error("Stack:", (error as Error).stack);
    }
    return NextResponse.json(
      {
        error: "Authentication failed",
        details: process.env.NODE_ENV === "development" ? errorMsg : undefined,
      },
      { status: 500 }
    );
  }
}
