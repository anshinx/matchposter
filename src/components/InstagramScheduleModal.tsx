'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Match, CafeSettings, PosterFormat } from '@/lib/types';
import { TEAMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { X, Calendar, Clock, Send, CheckCircle2, Loader2, Sparkles, Key, AlertCircle } from 'lucide-react';

interface InstagramScheduleModalProps {
  match: Match;
  cafeSettings: CafeSettings;
  format: PosterFormat;
  onClose: () => void;
}

export default function InstagramScheduleModal({
  match,
  cafeSettings,
  format,
  onClose,
}: InstagramScheduleModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const homeTeam = TEAMS[match.homeTeam];

  // Maç tarihinden tam 24 saat öncesini hesapla
  const matchDateTime = new Date(`${match.date}T${match.time}:00`);
  const scheduledDateTime = new Date(matchDateTime.getTime() - 24 * 60 * 60 * 1000);

  const formattedScheduledDate = isNaN(scheduledDateTime.getTime())
    ? 'Maçtan 24 saat önce'
    : scheduledDateTime.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    }) + ` saat ${scheduledDateTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;

  // Otomatik üretilen Instagram açıklama metni
  const defaultCaption = `🔥 ${match.league} Heyecanı ${cafeSettings.cafeName || 'Kafe'}'de!

⚽ ${homeTeam?.name || match.homeTeam} vs ${match.awayTeam}
📅 Tarih: ${match.date} - ${match.time}
🏟️ Stadyum / Yayın: Dev Ekran Canlı Yayın

Masa rezervasyonunuzu hemen yaptırın, bu büyük maçı kaçırmayın! 🍻

📞 Rezervasyon: ${cafeSettings.phone}
📍 ${cafeSettings.slogan}

#MaçGünü #${match.homeTeam} #${match.awayTeam.replace(/\s+/g, '')} #${match.league.replace(/\s+/g, '')} #${cafeSettings.cafeName.replace(/\s+/g, '')} #DevEkran #CanlıYayın #MaçHeyecanı`;

  const [caption, setCaption] = useState(defaultCaption);
  const [accessToken, setAccessToken] = useState(cafeSettings.metaAccessToken || '');
  const [instagramAccountId, setInstagramAccountId] = useState(cafeSettings.instagramAccountId || '');
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSchedule = async () => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/instagram/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: match.id,
          homeTeam: homeTeam?.name || match.homeTeam,
          awayTeam: match.awayTeam,
          matchDate: match.date,
          matchTime: match.time,
          scheduledTime: scheduledDateTime.toISOString(),
          caption,
          format,
          accessToken,
          instagramAccountId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Planlama hatası oluştu.');
      }

      setStatus('success');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'Instagram gönderisi planlanamadı.');
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg animate-fade-in-up">
        <div className="rounded-2xl border border-white/10 bg-[#12121c] shadow-2xl shadow-purple-900/40 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-amber-900/30 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 shadow-md shadow-pink-500/20">

              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  Instagram'da Otomatik Planla
                </h2>
                <p className="text-[11px] text-pink-300/80">
                  Afişi maç saatinden tam 24 saat öncesine zamanlar
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg bg-white/5 p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-4 p-6 max-h-[75vh] overflow-y-auto">
            {/* Scheduled Time Banner (24h Before Match) */}
            <div className="rounded-xl border border-pink-500/30 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-pink-500/20 p-2 text-pink-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wide">
                      Planlanan Yayın Zamanı
                    </span>
                    <span className="rounded-full bg-pink-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-pink-300 border border-pink-500/30">
                      Maçtan 24 Saat Önce
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-extrabold text-amber-300">
                    {formattedScheduledDate}
                  </p>
                  <p className="mt-0.5 text-[11px] text-gray-400">
                    Maç Zamanı: {match.date} {match.time}
                  </p>
                </div>
              </div>
            </div>

            {/* Match Badge Summary */}
            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-xs font-bold text-white">
                  {homeTeam?.name || match.homeTeam} vs {match.awayTeam}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                {format.toUpperCase()} (1080×{format === 'story' ? '1920' : '1080'})
              </span>
            </div>

            {/* Caption Input */}
            <div>
              <label className="mb-2 flex items-center justify-between text-xs font-medium text-gray-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Gönderi Açıklaması (Caption)
                </span>
                <span className="text-[11px] text-gray-500">Otomatik Hazırlandı</span>
              </label>
              <textarea
                rows={5}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white placeholder-gray-500 outline-none transition-all focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20"
              />
            </div>

            {/* Optional Meta API Configuration Accordion */}
            <div className="border-t border-white/[0.08] pt-3">
              <button
                type="button"
                onClick={() => setShowApiConfig(!showApiConfig)}
                className="flex items-center justify-between w-full text-xs font-semibold text-gray-400 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-purple-400" /> Meta Graph API Token (İsteğe Bağlı Canlı API)
                </span>
                <span>{showApiConfig ? '▲' : '▼'}</span>
              </button>

              {showApiConfig && (
                <div className="mt-3 space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">
                      Instagram Business Account ID
                    </label>
                    <input
                      type="text"
                      placeholder="17841400000000000"
                      value={instagramAccountId}
                      onChange={(e) => setInstagramAccountId(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">
                      Meta User Access Token
                    </label>
                    <input
                      type="password"
                      placeholder="EAA..."
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500">
                    Token boş bırakılırsa afiş sistem içi 24 saat önceden otomasyon kuyruğuna alınır.
                  </p>
                </div>
              )}
            </div>

            {/* Error banner */}
            {status === 'error' && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 border-t border-white/[0.08] bg-black/40 px-6 py-4">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-semibold text-gray-300 transition-all hover:bg-white/10 hover:text-white"
            >
              İptal
            </button>
            <button
              onClick={handleSchedule}
              disabled={status === 'loading' || status === 'success'}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white transition-all duration-200 shadow-lg',
                status === 'success'
                  ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 shadow-pink-500/25 hover:brightness-110 active:scale-[0.98]'
              )}
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Planlanıyor...
                </>
              ) : status === 'success' ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  24s Öncesine Planlandı!
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  24 Saat Öncesine Planla
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
