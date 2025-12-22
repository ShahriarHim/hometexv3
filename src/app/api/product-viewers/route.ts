import { pusherServer } from "@/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

// Store active viewers per product (in production, use Redis)
const activeViewers = new Map<string, Set<string>>();

export async function POST(request: NextRequest) {
  try {
    const { productId, action, userId } = await request.json();

    if (!productId || !action || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const channelName = `product-${productId}`;
    const viewersKey = `product-${productId}`;

    if (!activeViewers.has(viewersKey)) {
      activeViewers.set(viewersKey, new Set());
    }

    const viewers = activeViewers.get(viewersKey);
    if (!viewers) {
      return NextResponse.json({ error: "Viewers set not found" }, { status: 500 });
    }

    if (action === "join") {
      viewers.add(userId);
    } else if (action === "leave") {
      viewers.delete(userId);
    }

    const viewerCount = viewers.size;

    // Trigger event to all subscribers
    try {
      await pusherServer.trigger(channelName, "viewer-update", {
        viewerCount,
        productId,
      });
    } catch (pusherError) {
      const errorMsg = pusherError instanceof Error ? pusherError.message : String(pusherError);
      console.error("Pusher trigger error:", {
        message: errorMsg,
        code: (pusherError as Record<string, unknown>).status,
      });
      // Don't fail the request if Pusher fails - it's optional for displaying viewer count
      if (process.env.NODE_ENV === "development") {
        console.error("Full Pusher error:", pusherError);
      }
    }

    return NextResponse.json({ success: true, viewerCount });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Error in product-viewers API:", errorMsg);
    if (process.env.NODE_ENV === "development") {
      console.error("Full error details:", error);
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const viewersKey = `product-${productId}`;
    const viewers = activeViewers.get(viewersKey);
    const viewerCount = viewers ? viewers.size : 0;

    return NextResponse.json({ viewerCount });
  } catch (error) {
    console.error("Error fetching viewer count:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
