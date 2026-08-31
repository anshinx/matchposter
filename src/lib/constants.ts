import type { Team, TeamSlug, Match, CafeSettings } from './types';

// ─── Takım Tanımları ───────────────────────────────────────────────────
export const TEAMS: Record<TeamSlug, Team> = {
  galatasaray: {
    slug: 'galatasaray',
    name: 'Galatasaray',
    shortName: 'GS',
    logo: '/teams/galatasaray.png',
    primaryColor: '#FDB913',
    secondaryColor: '#C8102E',
    gradient: 'linear-gradient(135deg, #FDB913 0%, #C8102E 100%)',
    darkGradient: 'linear-gradient(135deg, #7a5800 0%, #5a0613 100%)',
  },
  fenerbahce: {
    slug: 'fenerbahce',
    name: 'Fenerbahçe',
    shortName: 'FB',
    logo: '/teams/fenerbahce.png',
    primaryColor: '#FFED00',
    secondaryColor: '#003DA5',
    gradient: 'linear-gradient(135deg, #FFED00 0%, #003DA5 100%)',
    darkGradient: 'linear-gradient(135deg, #7a7200 0%, #001d52 100%)',
  },
  besiktas: {
    slug: 'besiktas',
    name: 'Beşiktaş',
    shortName: 'BJK',
    logo: '/teams/besiktas.png',
    primaryColor: '#000000',
    secondaryColor: '#E0E0E0',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    darkGradient: 'linear-gradient(135deg, #0a0a15 0%, #0b1020 100%)',
  },
};

export const TEAM_LIST: Team[] = Object.values(TEAMS);

// ─── Varsayılan Örnek Maçlar (2026–2027 Sezonu) ───────────────────────
export const DEFAULT_MATCHES: Match[] = [
  {
    id: 'match_default_1',
    homeTeam: 'galatasaray',
    awayTeam: 'Antalyaspor',
    date: '2026-09-13',
    time: '20:00',
    venue: 'Rams Park',
    league: 'Süper Lig',
    week: 3,
  },
  {
    id: 'match_default_2',
    homeTeam: 'fenerbahce',
    awayTeam: 'Beşiktaş',
    date: '2026-09-20',
    time: '19:00',
    venue: 'Ülker Stadyumu',
    league: 'Süper Lig',
    week: 4,
  },
  {
    id: 'match_default_3',
    homeTeam: 'besiktas',
    awayTeam: 'Trabzonspor',
    date: '2026-09-27',
    time: '21:00',
    venue: 'Tüpraş Stadyumu',
    league: 'Süper Lig',
    week: 5,
  },
  {
    id: 'match_default_4',
    homeTeam: 'galatasaray',
    awayTeam: 'Fenerbahçe',
    date: '2026-10-25',
    time: '19:00',
    venue: 'Rams Park',
    league: 'Süper Lig',
    week: 9,
  },
  {
    id: 'match_default_5',
    homeTeam: 'besiktas',
    awayTeam: 'Galatasaray',
    date: '2026-11-29',
    time: '20:00',
    venue: 'Tüpraş Stadyumu',
    league: 'Süper Lig',
    week: 13,
  },
  {
    id: 'match_default_6',
    homeTeam: 'fenerbahce',
    awayTeam: 'Kasımpaşa',
    date: '2026-09-06',
    time: '19:30',
    venue: 'Ülker Stadyumu',
    league: 'Süper Lig',
    week: 2,
  },
  {
    id: 'match_default_7',
    homeTeam: 'galatasaray',
    awayTeam: 'Bayern Münih',
    date: '2026-10-20',
    time: '21:00',
    venue: 'Rams Park',
    league: 'Şampiyonlar Ligi',
  },
];

// ─── Arka Plan Preset Seçenekleri ──────────────────────────────────────
export const BACKGROUND_PRESETS = [
  { id: 'stadium_1', name: 'Gece Stadyumu 1', url: '/stadium_bg.png' },
  { id: 'stadium_2', name: 'Projektör Sahası 2', url: '/stadium_bg_2.png' },
  { id: 'stadium_3', name: 'Sisli Çim Saha 3', url: '/stadium_bg_3.png' },
] as const;

// ─── Varsayılan Kafe Ayarları ──────────────────────────────────────────
export const DEFAULT_CAFE_SETTINGS: CafeSettings = {
  cafeName: 'AT KAFASI CAFE',
  logo: '',
  phone: '0534 844 6012',
  slogan: 'REZERVASYON YAPTIRMAYI UNUTMAYIN',
  instagramHandle: '@atkafasicafe',
  selectedBackground: '/stadium_bg.png',
  customBackground: '',
};

// ─── Lig Seçenekleri ───────────────────────────────────────────────────
export const LEAGUE_OPTIONS = [
  'Süper Lig',
  'Şampiyonlar Ligi',
  'Avrupa Ligi',
  'Konferans Ligi',
  'Türkiye Kupası',
  'Süper Kupa',
] as const;

// ─── Poster Boyutları ──────────────────────────────────────────────────
export const POSTER_SIZES = {
  story: { width: 1080, height: 1920, label: 'Instagram Story' },
  post: { width: 1080, height: 1080, label: 'Instagram Post' },
} as const;
