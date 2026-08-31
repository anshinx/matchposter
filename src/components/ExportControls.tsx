'use client';

import { useState, RefObject } from 'react';
import type { Match, CafeSettings, PosterFormat } from '@/lib/types';
import { POSTER_SIZES, TEAMS } from '@/lib/constants';
import { downloadPosterAsPng } from '@/lib/poster-export';
import { cn } from '@/lib/utils';
import { Download, Smartphone, Square, Loader2, CheckCircle2, Image as ImageIcon, X } from 'lucide-react';
import InstagramScheduleModal from '@/components/InstagramScheduleModal';

interface ExportControlsProps {
  posterRef: RefObject<HTMLDivElement | null>;
  selectedMatch: Match | null;
  format: PosterFormat;
  onFormatChange: (format: PosterFormat) => void;
  cafeSettings: CafeSettings;
  onOpenCafeSettings?: () => void;
}

type ExportState = 'idle' | 'loading' | 'success';

export default function ExportControls({
  posterRef,
  selectedMatch,
  format,
  onFormatChange,
  cafeSettings,
  onOpenCafeSettings,
}: ExportControlsProps) {
  const [exportState, setExportState] = useState<ExportState>('idle');
  const [showInstagramModal, setShowInstagramModal] = useState(false);

  const handleDownload = async () => {
    if (!posterRef.current || !selectedMatch) return;

    setExportState('loading');
    try {
      const size = POSTER_SIZES[format];
      const safeName = selectedMatch.homeTeam + '_vs_' + selectedMatch.awayTeam.replace(/\s+/g, '_');
      await downloadPosterAsPng({
        element: posterRef.current,
        filename: `matchposter_${safeName}_${format}`,
        width: size.width,
        height: size.height,
      });
      setExportState('success');
      setTimeout(() => setExportState('idle'), 2000);
    } catch (err) {
      console.error(err);
      setExportState('idle');
    }
  };

  const formats: { value: PosterFormat; label: string; icon: typeof Smartphone; desc: string }[] = [
    {
      value: 'story',
      label: 'Story',
      icon: Smartphone,
      desc: '1080×1920',
    },
    {
      value: 'post',
      label: 'Post',
      icon: Square,
      desc: '1080×1080',
    },
  ];

  return (
    <div className="flex items-center justify-between gap-4 w-full">
      {/* Format selector + Background button */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-xl border border-white/[0.07] bg-white/[0.04] p-1">
          {formats.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.value}
                onClick={() => onFormatChange(f.value)}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200',
                  format === f.value
                    ? 'bg-white/15 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-300'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{f.label}</span>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[10px] font-medium transition-colors',
                    format === f.value ? 'bg-white/15 text-gray-300' : 'bg-white/5 text-gray-600'
                  )}
                >
                  {f.desc}
                </span>
              </button>
            );
          })}
        </div>

        {onOpenCafeSettings && (
          <button
            onClick={onOpenCafeSettings}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300 transition-all hover:border-amber-500/40 hover:bg-amber-500/20 hover:text-amber-200"
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Arka Plan Değiştir</span>
          </button>
        )}
      </div>

      {/* Match info (center) */}
      {selectedMatch && (
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
          <span className="font-semibold text-white">{TEAMS[selectedMatch.homeTeam]?.name ?? selectedMatch.homeTeam}</span>
          <span>vs</span>
          <span className="font-semibold text-white">{selectedMatch.awayTeam}</span>
          <span className="mx-1.5 text-gray-700">•</span>
          <span>{selectedMatch.date}</span>
          <span>{selectedMatch.time}</span>
        </div>
      )}

      {/* Action buttons (Instagram Schedule + PNG Download) */}
      <div className="flex items-center gap-2">
        {selectedMatch && (
          <button
            onClick={() => setShowInstagramModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 px-4 py-2.5 text-xs font-bold text-white transition-all duration-200 shadow-md shadow-pink-500/20 hover:brightness-110 active:scale-[0.98]"
          >
            <X className="h-4 w-4" />
            <span>Instagram'da Planla (-24s)</span>
          </button>
        )}

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={!selectedMatch || exportState === 'loading'}
          className={cn(
            'flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all duration-200 shadow-lg',
            !selectedMatch
              ? 'cursor-not-allowed bg-white/5 text-gray-600'
              : exportState === 'success'
                ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
                : 'bg-white/10 text-white hover:bg-white/20 active:scale-[0.98]'
          )}
        >
          {exportState === 'loading' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : exportState === 'success' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {exportState === 'loading'
            ? 'Oluşturuluyor...'
            : exportState === 'success'
              ? 'İndirildi!'
              : 'PNG İndir'}
        </button>
      </div>

      {/* Instagram Schedule Modal */}
      {showInstagramModal && selectedMatch && (
        <InstagramScheduleModal
          match={selectedMatch}
          cafeSettings={cafeSettings}
          format={format}
          onClose={() => setShowInstagramModal(false)}
        />
      )}
    </div>
  );
}
