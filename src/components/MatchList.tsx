'use client';

import { useState } from 'react';
import type { Match, TeamSlug } from '@/lib/types';
import { TEAM_LIST } from '@/lib/constants';
import { cn } from '@/lib/utils';
import MatchCard from './MatchCard';
import MatchForm from './MatchForm';
import { Plus, Filter } from 'lucide-react';

interface MatchListProps {
  matches: Match[];
  selectedMatchId: string | null;
  onSelectMatch: (matchId: string) => void;
  onAddMatch: (match: Match) => void;
  onDeleteMatch: (id: string) => void;
}

type FilterOption = 'all' | TeamSlug;

export default function MatchList({
  matches,
  selectedMatchId,
  onSelectMatch,
  onAddMatch,
  onDeleteMatch,
}: MatchListProps) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<FilterOption>('all');

  const filteredMatches =
    filter === 'all'
      ? matches
      : matches.filter((m) => m.homeTeam === filter);

  const filters: { value: FilterOption; label: string }[] = [
    { value: 'all', label: 'Tümü' },
    ...TEAM_LIST.map((t) => ({ value: t.slug as FilterOption, label: t.shortName })),
  ];

  return (
    <div className="flex h-full flex-col gap-3">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-2 shrink-0">
        {/* Filter pills */}
        <div className="flex items-center gap-1.5 rounded-xl bg-white/[0.04] p-1">
          <Filter className="h-3 w-3 text-gray-500 ml-1.5" />
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all duration-200',
                filter === f.value
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-300'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex shrink-0 items-center gap-1 rounded-lg bg-gradient-to-r from-amber-500 to-red-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/40 hover:brightness-110 active:scale-[0.97]"
        >
          <Plus className="h-3.5 w-3.5" />
          Yeni Maç
        </button>
      </div>

      {/* Match cards */}
      <div className="flex-1 space-y-2.5 overflow-y-auto pr-0.5">
        {filteredMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
            <p className="text-sm text-gray-500">Maç bulunamadı</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-3 text-xs font-semibold text-amber-400 hover:text-amber-300"
            >
              + Yeni maç ekle
            </button>
          </div>
        ) : (
          filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              isSelected={selectedMatchId === match.id}
              onSelect={(m) => onSelectMatch(m.id)}
              onDelete={onDeleteMatch}
            />
          ))
        )}
      </div>

      {/* Footer count */}
      <div className="shrink-0 text-center text-[11px] text-gray-600">
        {filteredMatches.length} maç listeleniyor
      </div>

      {/* Add Match Modal */}
      {showForm && (
        <MatchForm onSubmit={onAddMatch} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
