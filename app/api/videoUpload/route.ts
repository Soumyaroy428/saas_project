import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

cloudinary.config({
    cloud_name:process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
    public_id: string;
    bytes: number;
    duration?: number;
    [key:string]: any;
}

export async function POST(request: NextRequest) { 
    console.log("POST /api/videoUpload - Starting upload...");
    try {
      //check if the user is authenticated
      const { userId } = await auth();
      console.log("User auth check:", userId ? "Authenticated" : "Not authenticated");

      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (
        !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
      ) {
        return NextResponse.json(
          { error: "Cloudinary credentials are not found" },
          { status: 500 },
        );
        }
        
      const formData = await request.formData();
        const file = formData.get("file") as File;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const originalSize = formData.get("originalSize") as string;

        console.log("Received form data:", {
            fileExists: !!file,
            fileName: file?.name,
            fileSize: file?.size,
            fileType: file?.type,
            title,
            description,
            originalSize,
        });

      if (!file) {
        return NextResponse.json(
          { error: "No file uploaded" },
          { status: 400 },
        );
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise<CloudinaryUploadResult>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader
            .upload_stream(
                {
                    resource_type: "video",
                    folder: "video-uploads",
                    quality: "auto",
                    fetch_format: "mp4",
                    timeout: 300000, // 5 minutes timeout
                },
              (error, result) => {
                if (error || !result) reject(error || new Error("Upload failed"));
                else resolve(result as CloudinaryUploadResult);
              },
            );
          uploadStream.end(buffer);
        },
      );
      console.log("Cloudinary upload successful, public_id:", result.public_id);
      
      let video;
      try {
        video = await prisma.video.create({
          data: {
            userId: userId,
            title: title || "Untitled",
            description: description || "",
            publicId: result.public_id,
            originalsize: String(Number(originalSize || 0)),
            compressedsize: String(result.bytes || 0),
            duration: String(result.duration || 0),
          },
        });
        console.log("Video saved to database:", video.id);
      } catch (dbError) {
        console.error("Database error - saving metadata failed:", dbError);
        // Return partial success with Cloudinary data even if DB fails
        return NextResponse.json({
          warning: "Video uploaded to Cloudinary but database save failed",
          cloudinaryData: {
            publicId: result.public_id,
            bytes: result.bytes,
            duration: result.duration,
          },
          dbError: dbError instanceof Error ? dbError.message : "Database connection failed",
        }, { status: 207 }); // 207 Multi-Status
      }

        return NextResponse.json(video);
    } catch (error) {
        console.error("Upload video failed.", error);
        
        // Handle specific error types
        if (error instanceof Error) {
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            
            // Check for timeout errors
            if (error.message.includes('timeout') || error.message.includes('Timeout')) {
                return NextResponse.json(
                    { 
                        error: "Upload timed out", 
                        details: "Video upload to Cloudinary took too long. Try a smaller file or check your internet connection."
                    },
                    { status: 504 },
                );
            }
        }

        const message =
          error instanceof Error ? error.message : JSON.stringify(error);

        return NextResponse.json(
          { error: "upload video failed", details: message },
          { status: 500 },
        );
    } finally {
        await prisma.$disconnect();
      }
}



