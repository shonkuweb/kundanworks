import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { FashionPlaceholder } from './Placeholders';
import { useStore } from '../context/StoreContext';

export const HeroSection = ({ onShopNowClick }) => {
  const { storeConfig } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      tag: "NEW COLLECTION",
      titleLine1: "Tradition",
      titleLine2: "Meets",
      titleLine3: "Everyday Style",
      subtitle: "Elegant outfits for every you.",
      buttonText: "SHOP NOW",
      scriptNote: "Clothes for a kinder you ♡",
      placeholderType: "hero_anarkali",
      targetCategory: "ethnic-wear"
    },
    {
      tag: "ARTISANAL EDIT",
      titleLine1: "Bespoke",
      titleLine2: "Linen &",
      titleLine3: "Pure Silks",
      subtitle: "Handcrafted comfort that tells a story.",
      buttonText: "EXPLORE NOW",
      scriptNote: "Grace in every fold ♡",
      placeholderType: "ethnic_featured",
      targetCategory: "kurtas-sets"
    }
  ];

  // Auto-advance slides periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <section className="relative w-full overflow-hidden bg-[#ECE4DC] pb-5 pt-3 transition-colors duration-700">
      <div className="max-w-md md:max-w-4xl lg:max-w-6xl mx-auto px-4">
        
        {/* Main Hero Card Container */}
        <div className="relative min-h-[460px] sm:min-h-[500px] md:min-h-[520px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#F2EAE2] to-[#E8DDD2] shadow-sm border border-[#DFD1C4]/70 flex flex-col justify-between">
          
          {/* Top content area with 2-column layout on medium+, stacked on mobile */}
          <div className="grid grid-cols-12 h-full z-10 p-5 sm:p-7 md:p-9 relative">
            
            {/* Left Content Column */}
            <div className="col-span-7 sm:col-span-6 flex flex-col justify-center items-start pr-2 z-20">
              
              {/* Tag / Collection badge */}
              <div className="inline-block mb-2">
                <span className="text-[9px] sm:text-[10px] tracking-[0.25em] font-semibold text-[#866D5B] uppercase block">
                  {slide.tag}
                </span>
              </div>

              {/* Display Headline matching the exact screenshot */}
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#1E1A17] font-normal leading-[1.12] tracking-tight mb-2.5">
                <span className="block">{slide.titleLine1}</span>
                <span className="block">{slide.titleLine2}</span>
                <span className="block italic font-serif">{slide.titleLine3}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-[#67564A] font-light leading-relaxed mb-5 max-w-[210px] sm:max-w-xs">
                {slide.subtitle}
              </p>

              {/* CTA Button matching brand curve-edge button */}
              <button
                onClick={() => onShopNowClick ? onShopNowClick(slide.targetCategory) : null}
                className="group inline-flex items-center gap-2.5 bg-[#1C1E21] hover:bg-[#11A0AB] text-white px-5 sm:px-6 py-3 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
              >
                <span>{slide.buttonText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
              </button>
            </div>

            {/* Right Visual / Model Placeholder Column */}
            <div className="col-span-5 sm:col-span-6 relative flex items-center justify-end">
              
              {/* Script accent badge floating on top right: "Clothes for a kinder you ♡" */}
              <div className="absolute -top-1 sm:top-2 right-0 sm:right-2 z-30 pointer-events-none select-none text-right">
                <p className="font-script text-[#3D332D] text-sm sm:text-base md:text-lg leading-tight transform -rotate-3">
                  Clothes<br />
                  for a<br />
                  kinder you<br />
                  <span className="inline-block text-xs text-brand-600">♡</span>
                </p>
              </div>

              {/* Model & Attire Fashion Placeholder Graphic */}
              <div className="w-full h-full min-h-[360px] sm:min-h-[420px] rounded-xl overflow-hidden relative shadow-inner">
                <FashionPlaceholder 
                  type={slide.placeholderType} 
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
              </div>
            </div>

          </div>

          {/* Slider Pagination Dots (bottom center) */}
          <div className="relative z-20 pb-4 flex items-center justify-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full h-1.5 ${
                  currentSlide === idx 
                    ? 'w-6 bg-[#241F1C]' 
                    : 'w-1.5 bg-[#9C8B7D]/50 hover:bg-[#9C8B7D]'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
