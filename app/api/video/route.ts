import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";      

const prisma = new PrismaClient();

export async function GET(request: NextRequest) { 
    console.log("GET /api/video - starting...");
    try {
        console.log("Connecting to database...");
        const videos = await prisma.video.findMany(
            {
                orderBy: {
                    createdAt: "desc"
                }
            }
        );
        console.log(`Found ${videos.length} videos`);
        return NextResponse.json(videos);
    } catch (error) {
        console.error("Error fetching videos:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ 
            error: "Failed to fetch videos", 
            details: errorMessage,
            hint: "Check DATABASE_URL in .env file"
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
        console.log("Database connection closed");
    }
}