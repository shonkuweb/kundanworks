import React from 'react';
import { ArrowRight, Sparkles, Heart, ShieldCheck, Truck, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const R2_HERO_BANNER_URL = 'https://pub-ce8688bc6c654bcfb99716f7c9373bcd.r2.dev/radha-sang/hero-banner.jpg';
const LOCAL_FALLBACK_URL = '/hero-banner.jpg';

export const HeroSection = ({ onShopNowClick }) => {
  const { setActiveCategory } = useStore();

  const categories = [
    { label: 'All Collection', slug: 'all' },
    { label: 'Ethnic Wear', slug: 'ethnic-wear' },
    { label: 'Kurtis', slug: 'kurtas-sets' },
    { label: 'Co-ord Sets', slug: 'co-ord-sets' },
    { label: 'Tops', slug: 'tops-western' }
  ];

  const handleCategoryClick = (slug) => {
    if (setActiveCategory) {
      setActiveCategory(slug);
    }
    if (onShopNowClick) {
      onShopNowClick(slug);
    }
    const catalogElement = document.getElementById('catalog-section');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full bg-[#FAF6F0] py-4 sm:py-6 transition-colors">
      <div className="max-w-md md:max-w-3xl lg:max-w-4xl mx-auto px-4">
        
        {/* 1:1 SQUARE HERO BANNER CONTAINER */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#E8DCCF] bg-white group">
          
          {/* Main 1:1 Image */}
          <div className="relative w-full aspect-square overflow-hidden bg-[#F5EEE6]">
            <img 
              src={R2_HERO_BANNER_URL} 
              onError={(e) => {
                // Fallback to local image if R2 URL has network interruption
                if (e.target.src !== window.location.origin + LOCAL_FALLBACK_URL) {
                  e.target.src = LOCAL_FALLBACK_URL;
                }
              }}
              alt="Radha Sang — Ethnic Wear, Kurtis, Co-ord Sets, Tops" 
              className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              loading="eager"
            />

            {/* Subtle Gradient Overlay at bottom for seamless interaction */}
            <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 bg-gradient-to-t from-black/60 via-black/25 to-transparent pointer-events-none" />

            {/* Floating Action Bar inside Banner on Mobile & Desktop */}
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 z-10">
              
              {/* Studio Pill */}
              <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#9B1B30] animate-pulse" />
                <span className="text-[11px] font-semibold tracking-wide text-[#221215]">
                  Barnala Boutique Collection • Near bansi purri ala
                </span>
              </div>

              {/* Shop Now CTA Button */}
              <button
                type="button"
                onClick={() => handleCategoryClick('all')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-[#9B1B30] hover:bg-[#831427] active:scale-95 text-white text-xs uppercase tracking-widest font-bold shadow-lg shadow-[#9B1B30]/30 transition-all cursor-pointer"
              >
                <span>Explore Pieces</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

            </div>

          </div>

          {/* Quick Categories Bar underneath matching banner categories */}
          <div className="p-3 sm:p-4 bg-white border-t border-[#F0E6DA] flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => handleCategoryClick(cat.slug)}
                className="px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border border-[#E8DCCF] bg-[#FAF8F5] text-[#4A3236] hover:bg-[#9B1B30] hover:text-white hover:border-[#9B1B30] active:scale-95 cursor-pointer shadow-2xs"
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Feature Badges Strip directly tuned to the boutique banner */}
        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3 text-center text-xs">
          <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-[#EAE0D4] shadow-2xs space-y-0.5">
            <span className="text-[#C5A059] block font-serif font-bold text-sm sm:text-base">✨ Artisanal</span>
            <span className="text-[10px] sm:text-[11px] text-[#6E565B] block font-medium">Zari & Handcrafted</span>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-[#EAE0D4] shadow-2xs space-y-0.5">
            <span className="text-[#9B1B30] block font-serif font-bold text-sm sm:text-base">💸 Best Price</span>
            <span className="text-[10px] sm:text-[11px] text-[#6E565B] block font-medium">Guaranteed Quality</span>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-[#EAE0D4] shadow-2xs space-y-0.5">
            <span className="text-[#C5A059] block font-serif font-bold text-sm sm:text-base">📦 Pan India</span>
            <span className="text-[10px] sm:text-[11px] text-[#6E565B] block font-medium">Express Doorstep</span>
          </div>
        </div>

      </div>
    </section>
  );
};
