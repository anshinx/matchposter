'use client';

import { RefreshCw, Settings2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onOpenCafeSettings?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastUpdated?: Date | null;
  refreshError?: string | null;
}

export default function Header({
  onOpenCafeSettings,
  onRefresh,
  isRefreshing = false,
  lastUpdated,
  refreshError,
}: HeaderProps) {
  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-white/[0.06] bg-[#0a0a12]/90 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-5">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-red-600 shadow-lg shadow-amber-500/25 transition-shadow hover:shadow-amber-500/40">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-base font-bold tracking-tight text-transparent">
              MatchPoster
            </span>
            <span className="text-[10px] text-gray-500 tracking-widest uppercase">
              Kafe Afiş Oluşturucu
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Team pills */}
          <div className="hidden sm:flex items-center gap-1.5 mr-3">
            {[
              { name: 'GS', color: '#fdb913', bg: 'rgba(253,185,19,0.12)' },
              { name: 'FB', color: '#ffed00', bg: 'rgba(255,237,0,0.12)' },
              { name: 'BJK', color: '#e0e0e0', bg: 'rgba(224,224,224,0.10)' },
            ].map((t) => (
              <span
                key={t.name}
                className="rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide"
                style={{ color: t.color, backgroundColor: t.bg }}
              >
                {t.name}
              </span>
            ))}
          </div>

          {/* Refresh button */}
          {onRefresh && (
            <div className="flex items-center gap-2">
              {/* Status indicator */}
              <div className="hidden sm:flex flex-col items-end leading-none">
                {refreshError ? (
                  <span className="text-[11px] text-red-400">Bağlantı hatası</span>
                ) : timeStr ? (
                  <span className="text-[11px] text-gray-500">
                    Son: <span className="text-gray-400 font-medium">{timeStr}</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-gray-600">Sofascore</span>
                )}
                {!refreshError && (
                  <span className="text-[10px] text-gray-700">Maç verileri</span>
                )}
              </div>

              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                title="Sofascore'dan maçları güncelle"
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200',
                  isRefreshing
                    ? 'cursor-not-allowed border-white/5 bg-white/[0.03] text-gray-600'
                    : refreshError
                    ? 'border-red-500/20 bg-red-500/5 text-red-400 hover:border-red-500/40 hover:bg-red-500/10'
                    : 'border-white/[0.08] bg-white/[0.04] text-gray-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white'
                )}
              >
                <RefreshCw
                  className={cn('h-3.5 w-3.5', isRefreshing && 'animate-spin')}
                />
                <span className="hidden sm:inline">
                  {isRefreshing ? 'Yükleniyor...' : 'Yenile'}
                </span>
              </button>
            </div>
          )}

          {/* Cafe settings button */}
          {onOpenCafeSettings && (
            <button
              onClick={onOpenCafeSettings}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-gray-300 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              <Settings2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Kafe Ayarları</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
