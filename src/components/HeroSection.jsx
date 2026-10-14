import React from 'react';

const R2_HERO_BANNER_URL = 'https://pub-ce8688bc6c654bcfb99716f7c9373bcd.r2.dev/radha-sang/hero-banner.jpg';
const LOCAL_FALLBACK_URL = '/hero-banner.jpg';

export const HeroSection = () => {
  return (
    <section className="w-full bg-[#FAF8F5]">
      {/* 
        Hero Banner: Edge-to-edge on mobile, naturally placed without any outer enclosing box,
        borders, padding, or shadows. Pure 1:1 square aspect ratio.
      */}
      <div className="w-full max-w-2xl mx-auto">
        <div className="w-full aspect-square overflow-hidden bg-[#FAF8F5]">
          <img 
            src={R2_HERO_BANNER_URL} 
            onError={(e) => {
              if (e.target.src !== window.location.origin + LOCAL_FALLBACK_URL) {
                e.target.src = LOCAL_FALLBACK_URL;
              }
            }}
            alt="Radha Sang — Girlish & Ladies Fashion Hub" 
            className="w-full h-full object-cover object-center block"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
};
