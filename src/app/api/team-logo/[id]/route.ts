import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || isNaN(Number(id))) {
    return new NextResponse('Invalid ID', { status: 400 });
  }

  const url = `https://api.sofascore.com/api/v1/team/${id}/image`;
  const curlCommand = `curl -s -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "${url}"`;

  return new Promise<NextResponse>((resolve) => {
    exec(curlCommand, { encoding: 'buffer' }, (error, stdout) => {
      if (error || !stdout || stdout.length === 0) {
        console.error(`Failed to fetch logo for team ${id}:`, error);
        // Fallback transparent 1x1 PNG
        const fallbackPng = Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
          'base64'
        );
        resolve(
          new NextResponse(fallbackPng, {
            headers: {
              'Content-Type': 'image/png',
              'Cache-Control': 'public, max-age=86400',
            },
          })
        );
        return;
      }

      resolve(
        new NextResponse(stdout, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=604800, immutable', // Cache for 7 days
          },
        })
      );
    });
  });
}
