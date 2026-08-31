import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
  });
}

export function getTurkishDayName(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Cumartesi';
  const dayName = date.toLocaleDateString('tr-TR', { weekday: 'long' });
  return dayName.charAt(0).toUpperCase() + dayName.slice(1);
}

export function getLeagueHeaderTitle(league?: string): string {
  if (!league) return 'FUTBOL HEYECANI';
  const cleanLeague = league.trim().toUpperCase();
  if (cleanLeague.includes('SÜPER LİG') || cleanLeague === 'SUPER LIG') {
    return 'SÜPER LİG HEYECANI';
  }
  if (cleanLeague.includes('ŞAMPİYONLAR LİGİ') || cleanLeague.includes('CHAMPIONS LEAGUE')) {
    return 'ŞAMPİYONLAR LİGİ HEYECANI';
  }
  if (cleanLeague.includes('AVRUPA LİGİ') || cleanLeague.includes('EUROPA LEAGUE')) {
    return 'AVRUPA LİGİ HEYECANI';
  }
  if (cleanLeague.includes('KONFERANS LİGİ') || cleanLeague.includes('CONFERENCE LEAGUE')) {
    return 'KONFERANS LİGİ HEYECANI';
  }
  if (cleanLeague.endsWith('HEYECANI')) {
    return cleanLeague;
  }
  return `${cleanLeague} HEYECANI`;
}

export function generateId(): string {
  return `match_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function getDaysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatPhoneNumber(phone: string): string {
  if (!phone) return '0534 844 6012';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `0${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 12 && digits.startsWith('90')) {
    return `0${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return phone;
}
