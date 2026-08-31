'use client';

import { useState } from 'react';
import type { Match, TeamSlug } from '@/lib/types';
import { TEAMS, LEAGUE_OPTIONS } from '@/lib/constants';
import { generateId, cn } from '@/lib/utils';
import { X, Plus, Calendar, Clock, MapPin, Trophy } from 'lucide-react';
import TeamLogo from './TeamLogo';

interface MatchFormProps {
  onSubmit: (match: Match) => void;
  onClose: () => void;
}

export default function MatchForm({ onSubmit, onClose }: MatchFormProps) {
  const [homeTeam, setHomeTeam] = useState<TeamSlug>('galatasaray');
  const [awayTeam, setAwayTeam] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('20:00');
  const [venue, setVenue] = useState('');
  const [league, setLeague] = useState('Süper Lig');
  const [week, setWeek] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!awayTeam || !date || !time || !venue) return;

    const match: Match = {
      id: generateId(),
      homeTeam,
      awayTeam,
      date,
      time,
      venue,
      league,
      week: week ? parseInt(week) : undefined,
    };
    onSubmit(match);
    onClose();
  };

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-amber-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-amber-500/20';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg animate-in fade-in zoom-in-95 duration-300">
        <div className="rounded-2xl border border-white/10 bg-[#12121a] p-6 shadow-2xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <Plus className="h-5 w-5 text-amber-400" />
              Yeni Maç Ekle
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg bg-white/5 p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Home team selector */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400">Ev Sahibi Takım</label>
              <div className="flex gap-2">
                {Object.values(TEAMS).map((team) => (
                  <button
                    key={team.slug}
                    type="button"
                    onClick={() => setHomeTeam(team.slug)}
                    className={cn(
                      'flex flex-1 flex-col items-center gap-2 rounded-xl border p-3 transition-all duration-200',
                      homeTeam === team.slug
                        ? 'border-amber-500/50 bg-white/10'
                        : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                    )}
                  >
                    <TeamLogo team={team.slug} size={36} />
                    <span className="text-[11px] font-medium text-gray-300">{team.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Away team */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400">Rakip Takım</label>
              <input
                type="text"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                placeholder="Örn: Trabzonspor"
                className={inputClass}
                required
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 flex items-center gap-1 text-xs font-medium text-gray-400">
                  <Calendar className="h-3 w-3" /> Tarih
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="mb-2 flex items-center gap-1 text-xs font-medium text-gray-400">
                  <Clock className="h-3 w-3" /> Saat
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Venue */}
            <div>
              <label className="mb-2 flex items-center gap-1 text-xs font-medium text-gray-400">
                <MapPin className="h-3 w-3" /> Stadyum
              </label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Örn: Rams Park"
                className={inputClass}
                required
              />
            </div>

            {/* League & Week */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 flex items-center gap-1 text-xs font-medium text-gray-400">
                  <Trophy className="h-3 w-3" /> Lig / Turnuva
                </label>
                <select
                  value={league}
                  onChange={(e) => setLeague(e.target.value)}
                  className={inputClass}
                >
                  {LEAGUE_OPTIONS.map((l) => (
                    <option key={l} value={l} className="bg-[#12121a]">
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">Hafta (opsiyonel)</label>
                <input
                  type="number"
                  value={week}
                  onChange={(e) => setWeek(e.target.value)}
                  placeholder="Örn: 5"
                  min="1"
                  max="40"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-amber-500 to-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/20 transition-all duration-200 hover:shadow-amber-500/40 hover:brightness-110 active:scale-[0.98]"
            >
              Maç Ekle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
