import React, { useState } from 'react';
import { Tag, ChevronLeft, ChevronRight, Gift, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const PromoStrip = () => {
  const { storeConfig } = useStore();
  const [index, setIndex] = useState(0);

  const promos = [
    {
      icon: <Tag className="w-4 h-4 text-brand-700" />,
      title: storeConfig.promoBanner || "FLAT ₹500 OFF",
      subtext: "on your first order"
    },
    {
      icon: <Gift className="w-4 h-4 text-brand-700" />,
      title: "COMPLIMENTARY GIFT WRAP",
      subtext: "with luxury box on all orders"
    },
    {
      icon: <Truck className="w-4 h-4 text-brand-700" />,
      title: "FREE EXPRESS DELIVERY",
      subtext: "across all Indian pincodes"
    }
  ];

  const handlePrev = () => {
    setIndex(prev => (prev - 1 + promos.length) % promos.length);
  };

  const handleNext = () => {
    setIndex(prev => (prev + 1) % promos.length);
  };

  const current = promos[index];

  return (
    <div className="w-full bg-[#EFE8E1] border-y border-[#E2D5C8] py-2.5 transition-all">
      <div className="max-w-md md:max-w-4xl lg:max-w-6xl mx-auto px-4 flex items-center justify-between">
        
        {/* Left Arrow */}
        <button 
          onClick={handlePrev}
          className="p-1 text-[#6F5B4E] hover:text-[#25211E] transition-colors"
          aria-label="Previous promo"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Center Banner Content matching screenshot */}
        <div className="flex items-center justify-center gap-2.5 text-center flex-1">
          <span className="p-1 rounded-full bg-[#E6DDD3]">
            {current.icon}
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5 leading-tight">
            <span className="text-[12px] sm:text-xs font-bold tracking-wider text-[#2B2522] uppercase">
              {current.title}
            </span>
            <span className="text-[11px] sm:text-xs text-[#705E51] font-light">
              {current.subtext}
            </span>
          </div>
        </div>

        {/* Right Arrow */}
        <button 
          onClick={handleNext}
          className="p-1 text-[#6F5B4E] hover:text-[#25211E] transition-colors"
          aria-label="Next promo"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
