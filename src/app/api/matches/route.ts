import { NextResponse } from 'next/server';
import type { Match, TeamSlug } from '@/lib/types';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// ─── Takım ID Haritası ─────────────────────────────────────────────────
const TRACKED_TEAMS: { slug: TeamSlug; sofascoreId: number; name: string }[] = [
  { slug: 'galatasaray', sofascoreId: 3061, name: 'Galatasaray' },
  { slug: 'fenerbahce', sofascoreId: 3052, name: 'Fenerbahçe' },
  { slug: 'besiktas', sofascoreId: 3050, name: 'Beşiktaş' },
];

// Sofascore "away team" ismini TeamSlug'a eşleştirmek için
const TEAM_NAME_TO_SLUG: Record<string, TeamSlug> = {
  galatasaray: 'galatasaray',
  'galatasaray sk': 'galatasaray',
  fenerbahçe: 'fenerbahce',
  fenerbahce: 'fenerbahce',
  'fenerbahçe sk': 'fenerbahce',
  beşiktaş: 'besiktas',
  besiktas: 'besiktas',
  'beşiktaş jk': 'besiktas',
};

// ─── Sofascore Timestamp → Türkiye saatine çevirme ─────────────────────
function tsToDate(timestamp: number): { date: string; time: string } {
  // Sofascore UTC timestamp'ini TR (UTC+3) saatine çevirir
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

// ─── Tek takımın maçlarını çek ─────────────────────────────────────────
async function fetchTeamMatches(team: (typeof TRACKED_TEAMS)[number]): Promise<Match[]> {
  const url = `https://api.sofascore.com/api/v1/team/${team.sofascoreId}/events/next/0`;

  try {
    const curlCommand = `curl -s -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "${url}"`;
    const { stdout } = await execAsync(curlCommand);

    if (!stdout || stdout.trim() === '') {
      console.error(`Sofascore curl returned empty output for ${team.name}`);
      return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: { events: any[] } = JSON.parse(stdout);

    if (!data.events || !Array.isArray(data.events)) {
      console.error(`Sofascore events array missing for ${team.name}`);
      return [];
    }

    const now = Math.floor(Date.now() / 1000);

    return data.events
      .filter((event) => event.startTimestamp >= now - 3600)
      .slice(0, 8) // en fazla 8 maç
      .map((event) => {
        const { date, time } = tsToDate(event.startTimestamp);

        // ID ile ev sahibi/deplasman tespiti
        const isHome = event.homeTeam?.id === team.sofascoreId;

        // Karşı takım bilgisi
        const opponent = isHome ? event.awayTeam : event.homeTeam;
        const opponentName = opponent?.name ?? 'Bilinmiyor';
        const opponentId = opponent?.id;
        const awayTeamLogo = opponentId ? `/api/team-logo/${opponentId}` : undefined;

        // Venue fallback
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
    console.error(`Sofascore curl failed for ${team.name}:`, err);
    return [];
  }
}

// ─── Ana Route Handler ──────────────────────────────────────────────────
export async function GET() {
  try {
    // 3 takımı paralel çek
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

    if (allMatches.length === 0) {
      // Tüm istekler başarısız olduysa fallback
      return NextResponse.json(
        { error: 'Sofascore verisi alınamadı', matches: [] },
        { status: 503 }
      );
    }

    return NextResponse.json(allMatches);
  } catch (err) {
    console.error('Matches API error:', err);
    return NextResponse.json(
      { error: 'Sunucu hatası', matches: [] },
      { status: 500 }
    );
  }
}
