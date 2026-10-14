import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { ProductCatalog } from '../components/ProductCatalog';
import { MapPin, Phone, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const InstagramIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export const HomePage = () => {
  const { storeConfig } = useStore();
  const phone = storeConfig?.whatsappNumber || '+91 98557 86123';
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  return (
    <div className="w-full bg-[#FAF8F5]">
      {/* 
        1. HERO BANNER: Full-width edge-to-edge on mobile, naturally placed without boxes,
        no CTAs, no overlays, pure 1:1 banner image from Cloudflare R2.
      */}
      <HeroSection />

      {/* 
        2. ELEGANT BOUTIQUE BRAND STRIP:
        Clean, minimal luxury sub-bar giving instant boutique credibility and direct contacts.
      */}
      <div className="border-y border-[#EAE0D4] bg-white/70 backdrop-blur-xs py-2.5 px-4">
        <div className="max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-[11px] sm:text-xs text-[#5C4538]">
          <span className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#9B1B30]" />
            <span>Near bansi purri ala, Barnala</span>
          </span>

          <a 
            href={`https://wa.me/${cleanPhone}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-semibold text-[#1C1E21] hover:text-[#9B1B30] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#9B1B30]" />
            <span>{phone}</span>
          </a>

          <a 
            href="https://instagram.com/radhasang_barnala" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#7A6455] hover:text-[#9B1B30] transition-colors font-medium"
          >
            <InstagramIcon className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>@radhasang_barnala</span>
          </a>
        </div>
      </div>

      {/* 
        3. CURATED BOUTIQUE COLLECTION
      */}
      <ProductCatalog />
    </div>
  );
};
