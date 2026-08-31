'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import MatchList from '@/components/MatchList';
import StoryPoster from '@/components/StoryPoster';
import PostPoster from '@/components/PostPoster';
import ExportControls from '@/components/ExportControls';
import CafeSettingsModal from '@/components/CafeSettingsModal';
import { useMatches } from '@/hooks/useMatches';
import { useCafeSettings } from '@/hooks/useCafeSettings';
import type { PosterFormat } from '@/lib/types';
import { Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const {
    matches,
    addMatch,
    removeMatch,
    isRefreshing,
    lastUpdated,
    refreshError,
    refreshFromApi,
  } = useMatches();
  const { settings, updateSettings } = useCafeSettings();
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [format, setFormat] = useState<PosterFormat>('story');
  const [showCafeModal, setShowCafeModal] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  const selectedMatch = matches.find((m) => m.id === selectedMatchId) ?? matches[0] ?? null;

  const handleSelectMatch = useCallback((matchId: string) => {
    setSelectedMatchId(matchId);
  }, []);

  // Sayfa açılışında Sofascore'dan otomatik çek
  useEffect(() => {
    refreshFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header
        onOpenCafeSettings={() => setShowCafeModal(true)}
        onRefresh={refreshFromApi}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
        refreshError={refreshError}
      />

      <main className="flex flex-1 overflow-hidden">
        {/* ── Left Panel: Match List ──────────────────────────── */}
        <aside className="flex w-[380px] shrink-0 flex-col border-r border-white/5 bg-[#0c0c14] overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">Maç Listesi</h2>
              {/* Sofascore badge */}
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-400 ring-1 ring-emerald-500/20">
                Sofascore
              </span>
            </div>
            <button
              onClick={() => setShowCafeModal(true)}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <Settings2 className="h-3.5 w-3.5" />
              Kafe Ayarları
            </button>
          </div>
          <div className="flex-1 overflow-hidden p-4">
            <MatchList
              matches={matches}
              selectedMatchId={selectedMatch?.id ?? null}
              onSelectMatch={handleSelectMatch}
              onAddMatch={addMatch}
              onDeleteMatch={removeMatch}
            />
          </div>
        </aside>

        {/* ── Right Panel: Preview + Export ─────────────────── */}
        <section className="flex flex-1 flex-col overflow-hidden">
          {/* Export Controls Bar */}
          <div className="shrink-0 border-b border-white/5 bg-[#0a0a12]/80 px-6 py-3 backdrop-blur-sm">
            <ExportControls
              posterRef={posterRef}
              selectedMatch={selectedMatch}
              format={format}
              onFormatChange={setFormat}
              cafeSettings={settings}
              onOpenCafeSettings={() => setShowCafeModal(true)}
            />
          </div>

          {/* Preview Canvas Area */}
          <div className="flex flex-1 items-center justify-center overflow-auto bg-[#06060d] p-8">
            {/* Decorative background grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            {isRefreshing && matches.length === 0 ? (
              /* İlk yükleme skeleton */
              <div className="flex flex-col items-center gap-5 text-center">
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <div className="absolute inset-0 animate-ping rounded-full bg-amber-500/20" />
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-500/30 to-red-600/30 flex items-center justify-center">
                    <span className="text-2xl">⚽</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Sofascore'dan maçlar çekiliyor...</p>
                  <p className="mt-1 text-xs text-gray-500">GS • FB • BJK yaklaşan maçları</p>
                </div>
              </div>
            ) : selectedMatch ? (
              <div className="relative flex items-center justify-center">
                {/* Ambient glow behind poster */}
                <div
                  className="pointer-events-none absolute inset-0 -z-10 scale-90 blur-3xl opacity-20"
                  style={{
                    background:
                      'radial-gradient(circle, #fdb913 0%, #c8102e 50%, transparent 80%)',
                  }}
                />

                {/* Scaled preview wrapper */}
                <div
                  className={cn(
                    'origin-center transition-transform duration-500 ease-out shadow-2xl shadow-black/80 rounded-2xl overflow-hidden ring-1 ring-white/10'
                  )}
                  style={{
                    transform: format === 'story' ? 'scale(0.285)' : 'scale(0.47)',
                    width: 1080,
                    height: format === 'story' ? 1920 : 1080,
                    marginTop: format === 'story' ? '-670px' : '0',
                    marginBottom: format === 'story' ? '-670px' : '0',
                  }}
                >
                  {format === 'story' ? (
                    <StoryPoster ref={posterRef} match={selectedMatch} cafeSettings={settings} />
                  ) : (
                    <PostPoster ref={posterRef} match={selectedMatch} cafeSettings={settings} />
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <span className="text-4xl">🏟️</span>
                </div>
                <div>
                  <p className="text-base font-semibold text-white">Maç seçilmedi</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Sol panelden bir maç seçerek önizlemeyi başlatın
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Cafe Settings Modal */}
      {showCafeModal && (
        <CafeSettingsModal
          settings={settings}
          onSave={updateSettings}
          onClose={() => setShowCafeModal(false)}
        />
      )}
    </div>
  );
}
