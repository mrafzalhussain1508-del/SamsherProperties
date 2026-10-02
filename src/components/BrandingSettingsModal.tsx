'use client';

import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Sparkles, Check, RotateCcw } from 'lucide-react';

interface BrandingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogoUrl: string;
  currentHeroUrl: string;
  onSaveBranding: (newLogoUrl: string, newHeroUrl: string) => void;
  onResetBranding: () => void;
}

export default function BrandingSettingsModal({
  isOpen,
  onClose,
  currentLogoUrl,
  currentHeroUrl,
  onSaveBranding,
  onResetBranding,
}: BrandingSettingsModalProps) {
  const [logoInput, setLogoInput] = useState(currentLogoUrl || '');
  const [heroInput, setHeroInput] = useState(currentHeroUrl || '');
  const [copiedNotification, setCopiedNotification] = useState(false);

  if (!isOpen) return null;

  // File Upload Handlers (converts local image to base64 so it previews immediately)
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoInput(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroInput(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBranding(logoInput, heroInput);
    setCopiedNotification(true);
    setTimeout(() => {
      setCopiedNotification(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-[#e2eae0] relative max-h-[92vh] overflow-y-auto my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5 space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-[#eef3ed] text-[#1a4332] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            Asset Placeholders
          </div>
          <h3 className="text-xl font-serif font-bold text-[#163a34]">
            Upload Logo & Hero Image
          </h3>
          <p className="text-xs text-[#526f62]">
            Upload your custom brand logo and property hero image, or enter an image URL.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* LOGO PLACEHOLDER */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#163a34] uppercase tracking-wider">
              1. Brand Logo Placeholder
            </label>
            <div className="p-3 bg-[#f8faf7] rounded-2xl border border-[#dce5db] space-y-3">
              <div className="flex items-center gap-3">
                {logoInput ? (
                  <img
                    src={logoInput}
                    alt="Preview"
                    className="w-12 h-12 rounded-full object-cover border border-[#c8a15b]"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#16201b] border border-[#c8a15b] flex items-center justify-center text-[#c8a15b] text-xs font-serif font-bold">
                    SP
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#163a34]">Logo Preview</p>
                  <p className="text-[11px] text-[#738f82]">Recommended: 200x200px circular</p>
                </div>
              </div>

              {/* Upload file or enter URL */}
              <div className="flex items-center gap-2">
                <label className="flex-1 bg-white hover:bg-[#eef3ed] text-[#1a4332] border border-[#c8ded3] font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Logo File...</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Or paste direct image URL (https://...)"
                  value={logoInput}
                  onChange={(e) => setLogoInput(e.target.value)}
                  className="w-full bg-white border border-[#dce5db] rounded-xl px-3 py-2 text-xs text-[#163a34] placeholder:text-[#9bb2a6] focus:outline-none focus:border-[#1a4332]"
                />
              </div>
            </div>
          </div>

          {/* HERO INTERIOR IMAGE PLACEHOLDER */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#163a34] uppercase tracking-wider">
              2. Hero Interior Image Placeholder
            </label>
            <div className="p-3 bg-[#f8faf7] rounded-2xl border border-[#dce5db] space-y-3">
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-200 border border-[#dce5db]">
                <img
                  src={heroInput || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
                  alt="Hero Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="flex-1 bg-white hover:bg-[#eef3ed] text-[#1a4332] border border-[#c8ded3] font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Interior Photo...</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Or paste direct hero image URL"
                  value={heroInput}
                  onChange={(e) => setHeroInput(e.target.value)}
                  className="w-full bg-white border border-[#dce5db] rounded-xl px-3 py-2 text-xs text-[#163a34] placeholder:text-[#9bb2a6] focus:outline-none focus:border-[#1a4332]"
                />
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="submit"
              className="flex-1 bg-[#1a4332] hover:bg-[#123325] text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {copiedNotification ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Branding Applied!</span>
                </>
              ) : (
                <span>Save & Apply Branding</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                onResetBranding();
                setLogoInput('');
                setHeroInput('');
                onClose();
              }}
              className="p-3 bg-[#f0f5ee] hover:bg-[#e2ebe0] text-[#163a34] rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title="Reset to default screenshot assets"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[10px] text-[#789689] text-center">
            Tip: You can also place files in your project directory: <code className="bg-[#eef3ed] px-1 py-0.5 rounded">public/images/logo.png</code>
          </p>
        </form>
      </div>
    </div>
  );
}
