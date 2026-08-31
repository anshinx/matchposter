import { NextResponse } from 'next/server';
import type { Match, TeamSlug } from '@/lib/types';
import { DEFAULT_MATCHES } from '@/lib/constants';

// ─── Takım ID Haritası ─────────────────────────────────────────────────
const TRACKED_TEAMS: { slug: TeamSlug; sofascoreId: number; name: string }[] = [
  { slug: 'galatasaray', sofascoreId: 3061, name: 'Galatasaray' },
  { slug: 'fenerbahce', sofascoreId: 3052, name: 'Fenerbahçe' },
  { slug: 'besiktas', sofascoreId: 3050, name: 'Beşiktaş' },
];

// ─── Sofascore Timestamp → Türkiye saatine çevirme ─────────────────────
function tsToDate(timestamp: number): { date: string; time: string } {
  const trOffset = 3 * 60 * 60 * 1000;
  const d = new Date(timestamp * 1000 + trOffset);

  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const hours = String(d.getUTCHours()).padStart(2, '0');
  const minutes = String(d.getUTCMinutes()).padStart(2, '0');

  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
  };
}

// ─── Lig adını normalize et ─────────────────────────────────────────────
function normalizeLeague(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('süper lig') || lower.includes('super lig') || lower.includes('trendyol'))
    return 'Süper Lig';
  if (lower.includes('şampiyonlar ligi') || lower.includes('champions league') || lower.includes('ucl'))
    return 'Şampiyonlar Ligi';
  if (lower.includes('avrupa ligi') || lower.includes('europa league') || lower.includes('uel'))
    return 'Avrupa Ligi';
  if (lower.includes('konferans') || lower.includes('conference'))
    return 'Konferans Ligi';
  if (lower.includes('türkiye kupası') || lower.includes('turkish cup'))
    return 'Türkiye Kupası';
  if (lower.includes('süper kupa') || lower.includes('super cup'))
    return 'Süper Kupa';
  return name;
}

// ─── Tek takımın maçlarını çek (Native fetch - Vercel Uyumlu) ─────────
async function fetchTeamMatches(team: (typeof TRACKED_TEAMS)[number]): Promise<Match[]> {
  const url = `https://api.sofascore.com/api/v1/team/${team.sofascoreId}/events/next/0`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        Accept: '*/*',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      next: { revalidate: 300 }, // 5 dakika cache
    });

    if (!res.ok) {
      console.warn(`Sofascore HTTP error ${res.status} for ${team.name}`);
      return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: { events: any[] } = await res.json();

    if (!data.events || !Array.isArray(data.events)) {
      return [];
    }

    const now = Math.floor(Date.now() / 1000);

    return data.events
      .filter((event) => event.startTimestamp >= now - 7200)
      .slice(0, 8)
      .map((event) => {
        const { date, time } = tsToDate(event.startTimestamp);

        const isHome = event.homeTeam?.id === team.sofascoreId;
        const opponent = isHome ? event.awayTeam : event.homeTeam;
        const opponentName = opponent?.name ?? 'Bilinmiyor';
        const opponentId = opponent?.id;
        const awayTeamLogo = opponentId ? `/api/team-logo/${opponentId}` : undefined;

        const homeTeamName = event.homeTeam?.name ?? team.name;
        const venue = isHome
          ? `${team.name} Stadyumu`
          : `${homeTeamName} Stadyumu`;

        return {
          id: `sfs_${event.id}`,
          homeTeam: team.slug,
          awayTeam: opponentName,
          awayTeamLogo,
          date,
          time,
          venue,
          league: normalizeLeague(event.tournament?.name ?? 'Süper Lig'),
          week: event.roundInfo?.round ?? undefined,
          source: 'sofascore' as const,
          sofascoreId: event.id,
        } satisfies Match;
      });
  } catch (err) {
    console.error(`Sofascore fetch failed for ${team.name}:`, err);
    return [];
  }
}

// ─── Ana Route Handler ──────────────────────────────────────────────────
export async function GET() {
  try {
    const results = await Promise.allSettled(
      TRACKED_TEAMS.map((team) => fetchTeamMatches(team))
    );

    const allMatches: Match[] = [];
    const seenIds = new Set<string>();

    for (const result of results) {
      if (result.status === 'fulfilled') {
        for (const match of result.value) {
          if (!seenIds.has(match.id)) {
            seenIds.add(match.id);
            allMatches.push(match);
          }
        }
      }
    }

    // Tarihe göre sırala
    allMatches.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Vercel veya IP engeli durumunda hiç canlı maç çekilemediyse DEFAULT_MATCHES verisini sun
    if (allMatches.length === 0) {
      console.warn('Sofascore canlı verileri çekilemedi, fallback örnek maçlar sunuluyor.');
      return NextResponse.json(DEFAULT_MATCHES);
    }

    return NextResponse.json(allMatches);
  } catch (err) {
    console.error('Matches API error:', err);
    // Hata durumunda da boş dizi yerine varsayılan maçları dönerek uygulamanın çökmesini engelle
    return NextResponse.json(DEFAULT_MATCHES);
  }
}
