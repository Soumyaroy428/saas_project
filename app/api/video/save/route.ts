import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

// Singleton Prisma client
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    console.log("Received body:", body);
    
    const { public_id, bytes, duration, originalSize, title, description } = body;

    // Validate required fields
    if (!public_id) {
      return NextResponse.json(
        { error: "Missing public_id from Cloudinary" },
        { status: 400 }
      );
    }

    // Prepare data
    const data = {
      userId,
      title: title || "Untitled",
      description: description || "",
      publicId: public_id,
      originalsize: String(originalSize || 0),
      compressedsize: String(bytes || 0),
      duration: String(duration || 0),
    };
    
    console.log("Creating video with data:", data);

    // Save video metadata to database
    const video = await prisma.video.create({ data });

    return NextResponse.json(video);
  } catch (error) {
    console.error("Save video failed:", error);
    const message =
      error instanceof Error ? error.message : JSON.stringify(error);
    return NextResponse.json(
      { error: "Failed to save video", details: message },
      { status: 500 }
    );
  }
}
