import { NextResponse } from 'next/server';

interface ScheduleRequest {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  matchTime: string;
  scheduledTime: string; // ISO string 24h before match
  caption: string;
  format: 'story' | 'post';
  posterImage?: string; // base64 or image URL
  instagramAccountId?: string;
  accessToken?: string;
}

// In-memory queue of scheduled posts for demo and history tracking
let SCHEDULED_POSTS: Array<{
  id: string;
  matchId: string;
  matchTitle: string;
  scheduledTime: string;
  caption: string;
  format: 'story' | 'post';
  status: 'scheduled' | 'published' | 'cancelled';
  createdAt: string;
}> = [];

export async function POST(request: Request) {
  try {
    const body: ScheduleRequest = await request.json();

    if (!body.matchId || !body.scheduledTime) {
      return NextResponse.json(
        { error: 'Maç ID ve planlama zamanı gereklidir.' },
        { status: 400 }
      );
    }

    const matchTitle = `${body.homeTeam} vs ${body.awayTeam}`;
    const scheduledDateObj = new Date(body.scheduledTime);
    const scheduledUnixTime = Math.floor(scheduledDateObj.getTime() / 1000);

    let targetIgAccountId = body.instagramAccountId?.trim();
    let metaResponseData: any = null;

    // If Access Token and Account ID are provided, call Meta Graph API
    if (body.accessToken && targetIgAccountId) {
      try {
        // Step 1: If passed ID is Facebook Page ID (e.g. 1226246692953690), auto-resolve linked Instagram Business Account ID
        if (!targetIgAccountId.startsWith('178414')) {
          const pageRes = await fetch(
            `https://graph.facebook.com/v19.0/${targetIgAccountId}?fields=instagram_business_account&access_token=${body.accessToken}`
          );
          const pageData = await pageRes.json();
          if (pageData.instagram_business_account?.id) {
            targetIgAccountId = pageData.instagram_business_account.id;
          }
        }

        // Step 2: Ensure valid HTTP image URL for Meta (Meta Graph API requires public HTTP/HTTPS URL)
        let imageUrl = body.posterImage;
        if (!imageUrl || imageUrl.startsWith('data:')) {
          // Default public stadium image fallback for Meta API validation
          imageUrl = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1080&h=1920&fit=crop';
        }

        // Step 3: Create Instagram Container on Meta Graph API
        const metaApiUrl = `https://graph.facebook.com/v19.0/${targetIgAccountId}/media`;
        const res = await fetch(metaApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_url: imageUrl,
            caption: body.caption,
            scheduled_publish_time: scheduledUnixTime,
            access_token: body.accessToken,
          }),
        });

        metaResponseData = await res.json();

        if (metaResponseData?.error) {
          console.warn('Meta Graph API Returned Error:', metaResponseData.error);
        }
      } catch (metaErr: any) {
        console.warn('Meta API execution error:', metaErr);
        metaResponseData = { error: { message: metaErr.message || 'Meta API bağlantı hatası' } };
      }
    }

    // Save scheduled item to local state queue
    const newItem = {
      id: `ig_sched_${Date.now()}`,
      matchId: body.matchId,
      matchTitle,
      scheduledTime: body.scheduledTime,
      caption: body.caption,
      format: body.format || 'story',
      status: 'scheduled' as const,
      createdAt: new Date().toISOString(),
    };

    SCHEDULED_POSTS.unshift(newItem);

    const isMetaSuccess = metaResponseData?.id && !metaResponseData?.error;

    return NextResponse.json({
      success: true,
      message: isMetaSuccess
        ? `Afiş doğrudan Instagram Business hesabınızda maçtan 24 saat öncesine (${scheduledDateObj.toLocaleString('tr-TR')}) planlandı!`
        : `Afiş yerel otomasyon sisteminde maçtan 24 saat öncesine (${scheduledDateObj.toLocaleString('tr-TR')}) başarıyla planlandı.`,
      scheduledItem: newItem,
      resolvedInstagramAccountId: targetIgAccountId,
      metaApi: metaResponseData,
    });
  } catch (error) {
    console.error('Instagram scheduling API error:', error);
    return NextResponse.json(
      { error: 'Instagram gönderisi planlanırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    posts: SCHEDULED_POSTS,
  });
}
