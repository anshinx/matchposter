'use client';

import { useState, useRef } from 'react';
import type { CafeSettings } from '@/lib/types';
import { BACKGROUND_PRESETS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { X, Store, Phone, Sparkles, Upload, Trash2, Check, Image as ImageIcon, Layers } from 'lucide-react';

interface CafeSettingsModalProps {
  settings: CafeSettings;
  onSave: (settings: CafeSettings) => void;
  onClose: () => void;
}

export default function CafeSettingsModal({ settings, onSave, onClose }: CafeSettingsModalProps) {
  const [form, setForm] = useState<CafeSettings>({ ...settings });
  const [activeTab, setActiveTab] = useState<'info' | 'background'>('info');
  const [saved, setSaved] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleField = <K extends keyof CafeSettings>(field: K, value: CafeSettings[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      handleField('logo', ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      handleField('customBackground', ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
  };

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-amber-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-amber-500/20';

  return (
    <div className="relative w-full max-w-lg animate-fade-in-up">
      <div className="rounded-2xl border border-white/10 bg-[#111118] shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-red-500/20 ring-1 ring-amber-500/30">
              <Store className="h-4 w-4 text-amber-400" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-white">Kafe ve Afiş Ayarları</h2>
              <p className="text-[11px] text-gray-500">Kafe bilgileri ve stadyum arka plan seçimi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-white/5 p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/[0.06] px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('info')}
            className={cn(
              'flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all',
              activeTab === 'info'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            )}
          >
            <Store className="h-3.5 w-3.5" />
            Kafe Bilgileri
          </button>
          <button
            onClick={() => setActiveTab('background')}
            className={cn(
              'flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all',
              activeTab === 'background'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            )}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            Arka Plan Değiştir
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {activeTab === 'info' ? (
            <div className="space-y-4">
              {/* Logo upload */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">Kafe Logosu</label>
                <div className="flex items-center gap-3">
                  {/* Preview */}
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden">
                    {form.logo ? (
                      <img src={form.logo} alt="Logo" className="h-full w-full object-cover" />
                    ) : (
                      <Store className="h-6 w-6 text-gray-600" />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-2">
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-gray-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Logo Yükle
                    </button>
                    {form.logo && (
                      <button
                        onClick={() => handleField('logo', '')}
                        className="flex items-center justify-center gap-1.5 text-xs text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-3 w-3" /> Logoyu kaldır
                      </button>
                    )}
                  </div>

                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </div>
              </div>

              {/* Cafe name */}
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray-400">
                  <Store className="h-3 w-3" /> Kafe Adı
                </label>
                <input
                  type="text"
                  value={form.cafeName}
                  onChange={(e) => handleField('cafeName', e.target.value)}
                  placeholder="Örn: AT KAFASI CAFE"
                  className={inputClass}
                />
              </div>

              {/* Slogan */}
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray-400">
                  <Sparkles className="h-3 w-3" /> Slogan / Alt Not
                </label>
                <input
                  type="text"
                  value={form.slogan}
                  onChange={(e) => handleField('slogan', e.target.value)}
                  placeholder="Örn: REZERVASYON YAPTIRMAYI UNUTMAYIN"
                  className={inputClass}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray-400">
                  <Phone className="h-3 w-3" /> Telefon / Rezervasyon
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => handleField('phone', e.target.value)}
                  placeholder="Örn: 0534 844 6012"
                  className={inputClass}
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray-400">
                  Instagram Kullanıcı Adı
                </label>
                <input
                  type="text"
                  value={form.instagramHandle}
                  onChange={(e) => handleField('instagramHandle', e.target.value)}
                  placeholder="Örn: @atkafasicafe"
                  className={inputClass}
                />
              </div>

              {/* Meta API Settings */}
              <div className="border-t border-white/[0.08] pt-3 mt-3">
                <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-pink-400">
                  Meta Instagram API Ayarları (Otomatik Paylaşım İçin)
                </label>
                <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">
                      Facebook Sayfa veya Instagram ID'niz
                    </label>
                    <input
                      type="text"
                      value={form.instagramAccountId || ''}
                      onChange={(e) => handleField('instagramAccountId', e.target.value)}
                      placeholder="Örn: 1226246692953690 veya 178414..."
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">
                      Meta Access Token
                    </label>
                    <input
                      type="password"
                      value={form.metaAccessToken || ''}
                      onChange={(e) => handleField('metaAccessToken', e.target.value)}
                      placeholder="Örn: EAB..."
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Background Selection Tab */
            <div className="space-y-5">
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-300">
                  <Layers className="h-3.5 w-3.5 text-amber-400" /> Stadyum Arka Plan Presetleri
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {BACKGROUND_PRESETS.map((bg) => {
                    const isSelected =
                      !form.customBackground && (form.selectedBackground || '/stadium_bg.png') === bg.url;
                    return (
                      <div
                        key={bg.id}
                        onClick={() => {
                          handleField('customBackground', '');
                          handleField('selectedBackground', bg.url);
                        }}
                        className={cn(
                          'group relative cursor-pointer overflow-hidden rounded-xl border transition-all duration-200',
                          isSelected
                            ? 'border-amber-400 ring-2 ring-amber-400/30 scale-[1.02]'
                            : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/20'
                        )}
                      >
                        <div className="h-28 w-full overflow-hidden bg-black">
                          <img
                            src={bg.url}
                            alt={bg.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div className="bg-[#181824] p-2 text-center">
                          <span className="text-[11px] font-semibold text-gray-200 block truncate">
                            {bg.name}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-black shadow-md">
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-white/[0.08] pt-4">
                <label className="mb-2 flex items-center justify-between text-xs font-semibold text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <Upload className="h-3.5 w-3.5 text-amber-400" /> Özel Arka Plan Yükle
                  </span>
                  {form.customBackground && (
                    <button
                      onClick={() => handleField('customBackground', '')}
                      className="text-[11px] text-red-400 hover:underline"
                    >
                      Özel görseli kaldır
                    </button>
                  )}
                </label>

                <div className="flex items-center gap-4">
                  {form.customBackground ? (
                    <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border-2 border-amber-400">
                      <img
                        src={form.customBackground}
                        alt="Custom background"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}

                  <button
                    onClick={() => bgInputRef.current?.click()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.03] py-4 text-xs font-medium text-gray-300 transition-all hover:border-amber-400/50 hover:bg-white/[0.06] hover:text-white"
                  >
                    <Upload className="h-4 w-4 text-amber-400" />
                    {form.customBackground ? 'Farklı Görsel Seç' : 'Bilgisayardan Fotoğraf Yükle'}
                  </button>
                  <input
                    ref={bgInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCustomBgUpload}
                  />
                </div>
                <p className="mt-2 text-[11px] text-gray-500">
                  Dilediğiniz stadyum veya kafe görselini yükleyebilirsiniz (JPG, PNG).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-white/[0.06] px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition-all duration-200 shadow-lg',
              saved
                ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
                : 'bg-gradient-to-r from-amber-500 to-red-600 shadow-amber-500/25 hover:brightness-110 active:scale-[0.98]'
            )}
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Kaydedildi!
              </>
            ) : (
              'Kaydet'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

