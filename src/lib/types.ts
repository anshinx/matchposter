export type TeamSlug = 'galatasaray' | 'fenerbahce' | 'besiktas';

export interface Team {
  slug: TeamSlug;
  name: string;
  shortName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  gradient: string;
  darkGradient: string;
}

export interface Match {
  id: string;
  homeTeam: TeamSlug;
  awayTeam: string;
  awayTeamLogo?: string;
  date: string;        // YYYY-MM-DD
  time: string;        // HH:mm
  venue: string;
  league: string;
  week?: number;
  source?: 'sofascore' | 'manual'; // Veri kaynağı — manual olanlar refresh'te silinmez
  sofascoreId?: number;            // Sofascore event ID (güncelleme için)
}

export interface CafeSettings {
  cafeName: string;
  logo: string;         // Base64 data URL
  phone: string;
  slogan: string;
  instagramHandle: string;
  customBackground?: string;   // Custom uploaded background image (Base64)
  selectedBackground?: string; // Selected background URL or ID
  instagramAccountId?: string; // Meta Graph API Instagram Business Account ID
  metaAccessToken?: string;    // Meta Graph API User/Page Access Token
}

export type PosterFormat = 'story' | 'post';

export interface PosterExportOptions {
  element: HTMLElement;
  filename: string;
  width: number;
  height: number;
}
