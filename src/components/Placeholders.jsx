import React from 'react';

// Elegant SVG placeholders tuned directly to the Kundan Works luxury fashion palette
export const FashionPlaceholder = ({ 
  type = 'ethnic_featured', 
  className = '', 
  imageUrl = '', 
  alt = 'Product placeholder' 
}) => {
  if (imageUrl && imageUrl.trim().length > 0) {
    return (
      <img 
        src={imageUrl} 
        alt={alt} 
        className={`w-full h-full object-cover ${className}`}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  // Visual SVG placeholders matching the uploaded design
  switch (type) {
    case 'hero_anarkali':
      return (
        <div className={`relative w-full h-full bg-[#E8DFD5] flex items-center justify-center overflow-hidden ${className}`}>
          {/* Subtle warm gradient background */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#8E5E43]/40 via-transparent to-[#F4EEE8]/30 mix-blend-multiply" />
          
          <svg viewBox="0 0 400 550" className="w-full h-full object-cover drop-shadow-md">
            <defs>
              <linearGradient id="anarkaliGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C0846A" />
                <stop offset="50%" stopColor="#A26B54" />
                <stop offset="100%" stopColor="#7E4A35" />
              </linearGradient>
              <linearGradient id="goldAcc" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E9D3AA" />
                <stop offset="100%" stopColor="#C69E58" />
              </linearGradient>
              <pattern id="embroidery" x1="0" y1="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1.5" fill="#E8D1B0" opacity="0.6" />
                <path d="M10 5 L12 10 L10 15 L8 10 Z" fill="none" stroke="#E8D1B0" strokeWidth="0.5" opacity="0.4" />
              </pattern>
            </defs>
            
            {/* Background architectural arch */}
            <path d="M70 550 V200 Q200 60 330 200 V550 Z" fill="#DDD2C4" opacity="0.7" />

            {/* Graceful Model Silhouette representation */}
            <circle cx="200" cy="115" r="32" fill="#9C6B52" opacity="0.25" />
            <path d="M175 145 Q200 135 225 145 Q215 200 185 200 Z" fill="#9C6B52" opacity="0.3" />

            {/* Dupatta flow */}
            <path d="M130 190 Q90 320 110 500 Q150 490 160 350 Q160 250 170 200 Z" fill="url(#anarkaliGrad)" opacity="0.85" />
            <path d="M230 200 Q280 300 290 480 Q250 490 230 330 Z" fill="url(#anarkaliGrad)" opacity="0.85" />

            {/* Anarkali Flared Gown */}
            <path d="M165 190 Q200 195 235 190 L285 530 Q200 545 115 530 Z" fill="url(#anarkaliGrad)" />
            <path d="M165 190 Q200 195 235 190 L285 530 Q200 545 115 530 Z" fill="url(#embroidery)" />

            {/* Delicate Zari Neckline */}
            <path d="M185 190 Q200 235 215 190 Z" fill="#FAF4EE" stroke="url(#goldAcc)" strokeWidth="2.5" />
            <path d="M190 235 V280" stroke="url(#goldAcc)" strokeWidth="2.5" strokeDasharray="3 3" />

            {/* Embroidered Hemline */}
            <path d="M115 530 Q200 545 285 530" stroke="url(#goldAcc)" strokeWidth="8" fill="none" />
            <path d="M115 515 Q200 530 285 515" stroke="#FAF4EE" strokeWidth="2" strokeDasharray="4 4" fill="none" />
          </svg>
          
          <div className="absolute bottom-4 left-4 bg-white/70 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] tracking-widest uppercase font-medium text-brand-800">
            Dusty Rose Ensemble
          </div>
        </div>
      );

    case 'ethnic_featured':
      return (
        <div className={`relative w-full h-full bg-[#E5D7C7] flex items-center justify-center overflow-hidden ${className}`}>
          <svg viewBox="0 0 350 450" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="mustardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C98B3B" />
                <stop offset="100%" stopColor="#9C621E" />
              </linearGradient>
            </defs>
            <rect width="350" height="450" fill="#DECBB7" />
            <circle cx="175" cy="110" r="30" fill="#9C6B52" opacity="0.3" />
            <path d="M150 140 Q175 130 200 140 Q190 200 160 200 Z" fill="#9C6B52" opacity="0.3" />
            
            {/* Kurti with rich golden embroidery */}
            <path d="M140 170 Q175 175 210 170 L240 430 Q175 440 110 430 Z" fill="url(#mustardGrad)" />
            {/* Golden zari yoke */}
            <path d="M160 170 Q175 220 190 170" fill="none" stroke="#FCE8B3" strokeWidth="3" />
            <path d="M175 220 V270" stroke="#FCE8B3" strokeWidth="2.5" />
            <circle cx="175" cy="235" r="2.5" fill="#FFF" />
            <circle cx="175" cy="250" r="2.5" fill="#FFF" />
            <circle cx="175" cy="265" r="2.5" fill="#FFF" />

            {/* Scallop bottom hem */}
            <path d="M110 430 Q175 440 240 430" stroke="#FCE8B3" strokeWidth="5" fill="none" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
        </div>
      );

    case 'western_featured':
      return (
        <div className={`relative w-full h-full bg-[#E5E0D8] flex items-center justify-center overflow-hidden ${className}`}>
          <svg viewBox="0 0 350 450" className="w-full h-full object-cover">
            <rect width="350" height="450" fill="#E8E3DB" />
            {/* Modern Chic model depiction */}
            <circle cx="175" cy="100" r="28" fill="#8C6E5C" opacity="0.3" />
            {/* Sunglasses vibe */}
            <rect x="160" y="95" width="30" height="8" rx="4" fill="#222" opacity="0.7" />

            {/* Crisp Alabaster Button Down Shirt */}
            <path d="M135 150 Q175 160 215 150 L235 320 Q175 325 115 320 Z" fill="#FDFBF7" stroke="#E2DDD5" strokeWidth="1" />
            <path d="M160 150 L175 185 L190 150" fill="#FAF6EE" stroke="#D3C9BC" strokeWidth="1.5" />
            <path d="M175 185 V320" stroke="#D3C9BC" strokeWidth="1.5" strokeDasharray="5 5" />

            {/* Classic Denim / Trousers */}
            <path d="M125 315 L225 315 L235 445 L180 445 L175 350 L170 445 L115 445 Z" fill="#60768C" />
            <path d="M175 315 V350" stroke="#485A6C" strokeWidth="2" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
        </div>
      );

    case 'kurta':
      return (
        <div className={`w-full h-full bg-[#FAF0EC] flex items-center justify-center p-2 rounded-full ${className}`}>
          <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#9B4832]">
            {/* Wooden hanger */}
            <path d="M50 20 L50 25 M30 35 L50 25 L70 35" fill="none" stroke="#7A5230" strokeWidth="2" strokeLinecap="round" />
            {/* Kurta silhouette */}
            <path d="M30 35 L38 35 L42 42 L58 42 L62 35 L70 35 L74 52 L68 55 L67 80 L33 80 L32 55 L26 52 Z" fill="#A8523A" />
            {/* Placket */}
            <line x1="50" y1="42" x2="50" y2="60" stroke="#FAF0EC" strokeWidth="1.5" strokeDasharray="1.5 2" />
          </svg>
        </div>
      );

    case 'top':
      return (
        <div className={`w-full h-full bg-[#EBF2F6] flex items-center justify-center p-2 rounded-full ${className}`}>
          <svg viewBox="0 0 100 100" className="w-12 h-12">
            {/* Folded white shirt with dark contrast */}
            <rect x="25" y="32" width="50" height="42" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <path d="M38 32 L50 48 L62 32" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
            <circle cx="50" cy="54" r="1.5" fill="#64748B" />
            <circle cx="50" cy="62" r="1.5" fill="#64748B" />
            {/* Stacked second garment behind */}
            <rect x="30" y="24" width="40" height="10" rx="2" fill="#334155" />
          </svg>
        </div>
      );

    case 'saree':
      return (
        <div className={`w-full h-full bg-[#FCEEF3] flex items-center justify-center p-2 rounded-full ${className}`}>
          <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#9E476A]">
            {/* Saree drape graceful pleats */}
            <path d="M35 25 Q50 35 65 30 L60 82 Q45 84 35 80 Z" fill="#B34B76" />
            <path d="M65 30 L55 20 Q48 18 42 22 L45 35 Z" fill="#D26894" />
            {/* Golden zari border curve */}
            <path d="M35 25 Q50 35 65 30" stroke="#E6BE78" strokeWidth="2" fill="none" />
            <path d="M35 80 Q45 84 60 82" stroke="#E6BE78" strokeWidth="2.5" fill="none" />
          </svg>
        </div>
      );

    case 'bottom':
      return (
        <div className={`w-full h-full bg-[#F4EFE6] flex items-center justify-center p-2 rounded-full ${className}`}>
          <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#7D6A53]">
            {/* Wooden hanger */}
            <path d="M50 20 L50 25 M32 32 L50 25 L68 32" fill="none" stroke="#7A5230" strokeWidth="2" strokeLinecap="round" />
            {/* Pleated pants */}
            <path d="M36 34 L64 34 L67 80 L52 80 L50 48 L48 80 L33 80 Z" fill="#968066" />
            <line x1="42" y1="36" x2="42" y2="78" stroke="#B4A28B" strokeWidth="1" />
            <line x1="58" y1="36" x2="58" y2="78" stroke="#B4A28B" strokeWidth="1" />
          </svg>
        </div>
      );

    default:
      return (
        <div className={`w-full h-full bg-[#EFE9E2] flex items-center justify-center ${className}`}>
          <div className="text-center p-4">
            <span className="text-2xl text-brand-600 block mb-1">✦</span>
            <span className="text-xs uppercase tracking-widest text-brand-700 font-serif">Kundan Works</span>
          </div>
        </div>
      );
  }
};
