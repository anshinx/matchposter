'use client';

import { TEAMS } from '@/lib/constants';
import type { Match, TeamSlug } from '@/lib/types';
import { formatDate, getDaysUntil, cn } from '@/lib/utils';
import TeamLogo from './TeamLogo';
import { Calendar, Clock, MapPin, Trophy, Trash2, Image } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  isSelected: boolean;
  onSelect: (match: Match) => void;
  onDelete: (id: string) => void;
}

export default function MatchCard({ match, isSelected, onSelect, onDelete }: MatchCardProps) {
  const homeTeam = TEAMS[match.homeTeam];
  const daysUntil = getDaysUntil(match.date);
  const isPast = daysUntil < 0;

  return (
    <div
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300',
        isSelected
          ? 'border-white/20 bg-white/[0.08] shadow-xl shadow-white/5'
          : 'border-white/5 bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.06]',
        isPast && 'opacity-50'
      )}
      onClick={() => onSelect(match)}
    >
      {/* Gradient accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-1 transition-all duration-300"
        style={{ background: homeTeam.gradient }}
      />

      {/* Glow effect on selected */}
      {isSelected && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-20"
          style={{ background: homeTeam.gradient, filter: 'blur(20px)' }}
        />
      )}

      <div className="relative p-4">
        {/* Top row: League + Days */}
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-gray-400">
            <Trophy className="h-3 w-3" />
            {match.league}
            {match.week && <span className="text-gray-500">• Hafta {match.week}</span>}
          </span>
          <div className="flex items-center gap-1.5">
            {/* Kaynak etiketi */}
            {match.source === 'sofascore' && (
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-500 ring-1 ring-emerald-500/20">
                SFS
              </span>
            )}
            {!isPast && (
              <span
                className={cn(
                  'rounded-full px-2.5 py-1 text-[11px] font-bold',
                  daysUntil <= 3
                    ? 'bg-red-500/20 text-red-400'
                    : daysUntil <= 7
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                )}
              >
                {daysUntil === 0 ? 'BUGÜN!' : `${daysUntil} gün`}
              </span>
            )}
          </div>
        </div>

        {/* Match: teams */}
        <div className="mb-3 flex items-center justify-between gap-3">
          {/* Home Team */}
          <div className="flex flex-1 items-center gap-3">
            <TeamLogo team={match.homeTeam} size={48} />
            <div>
              <p className="text-sm font-bold text-white">{homeTeam.name}</p>
              <p className="text-[11px] text-gray-500">Ev Sahibi</p>
            </div>
          </div>

          {/* VS */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-black tracking-widest text-gray-500">VS</span>
          </div>

          {/* Away Team */}
          <div className="flex flex-1 items-center justify-end gap-3 text-right">
            <div>
              <p className="text-sm font-bold text-white">{match.awayTeam}</p>
              <p className="text-[11px] text-gray-500">Deplasman</p>
            </div>
            {match.awayTeamLogo ? (
              <img
                src={match.awayTeamLogo}
                alt={match.awayTeam}
                className="h-12 w-12 object-contain"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-gray-400">
                {match.awayTeam.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Bottom: meta info */}
        <div className="flex items-center gap-4 border-t border-white/5 pt-3 text-[11px] text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(match.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {match.time}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {match.venue}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(match);
            }}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200',
              isSelected
                ? 'bg-white text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            )}
          >
            <Image className="h-3.5 w-3.5" />
            {isSelected ? 'Seçili' : 'Afiş Oluştur'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(match.id);
            }}
            className="rounded-lg bg-red-500/10 p-2 text-red-400 transition-all duration-200 hover:bg-red-500/20"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
