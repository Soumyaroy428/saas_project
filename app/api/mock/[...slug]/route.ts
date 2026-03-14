import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug?.[0] || '';
  
  console.log('Mock image requested:', slug);
  console.log('Full params:', resolvedParams);
  
  if (!slug) {
    return NextResponse.json(
      { error: 'No image specified' },
      { status: 400 }
    );
  }

  // For demo purposes, return a placeholder image
  // In production, you would serve the actual uploaded image
  const imageUrl = 'https://picsum.photos/800/600';
  
  // Instead of redirect, return the image directly
  const response = await fetch(imageUrl);
  const imageBuffer = await response.arrayBuffer();
  
  return new NextResponse(imageBuffer, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
