import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || isNaN(Number(id))) {
    return new NextResponse('Invalid ID', { status: 400 });
  }

  // Sofascore static CDN domain
  const url = `https://img.sofascore.com/api/v1/team/${id}/image`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return new NextResponse('Team logo not found', { status: 404 });
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = res.headers.get('content-type') || 'image/webp';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=604800, immutable',
      },
    });
  } catch (error) {
    console.error(`Failed to fetch logo for team ${id}:`, error);
    return new NextResponse('Error fetching logo', { status: 404 });
  }
}
