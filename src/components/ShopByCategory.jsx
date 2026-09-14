import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { FashionPlaceholder } from './Placeholders';
import { useStore } from '../context/StoreContext';

export const ShopByCategory = ({ onSelectCategory }) => {
  const { categories, activeCategory, setActiveCategory } = useStore();

  // Separate featured major cards from circular pills
  const featuredCards = categories.filter(c => c.displayType === 'featured_card');
  const circularCategories = categories.filter(c => c.displayType === 'circular_pill');

  const handleCategoryClick = (slug) => {
    setActiveCategory(slug);
    if (onSelectCategory) {
      onSelectCategory(slug);
    }
  };

  // If no categories exist, don't render empty header
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-6 sm:py-8 bg-[#FAF8F5] transition-all">
      <div className="max-w-md md:max-w-4xl lg:max-w-6xl mx-auto px-4">
        
        {/* Section Divider Title: "— Shop by Category —" */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mb-6 sm:mb-8">
          <span className="h-[0.5px] flex-1 max-w-[50px] sm:max-w-[120px] bg-[#DAC6B4]"></span>
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-[#1E1A17] font-normal tracking-wide text-center">
            Shop by Category
          </h2>
          <span className="h-[0.5px] flex-1 max-w-[50px] sm:max-w-[120px] bg-[#DAC6B4]"></span>
        </div>

        {/* 1. Two Featured Large Category Cards side-by-side */}
        {featuredCards.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 mb-7 sm:mb-9">
            {featuredCards.map((card) => {
              const isSelected = activeCategory === card.slug;
              return (
                <div
                  key={card.id}
                  onClick={() => handleCategoryClick(card.slug)}
                  className={`group relative aspect-[3/4] sm:aspect-[4/5] rounded-xl overflow-hidden cursor-pointer shadow-sm transition-all duration-300 transform hover:-translate-y-1 ${
                    isSelected ? 'ring-2 ring-brand-600 ring-offset-2' : ''
                  }`}
                >
                  {/* Visual Background Placeholder / Image */}
                  <FashionPlaceholder 
                    type={card.placeholderKey || 'ethnic_featured'} 
                    imageUrl={card.imageUrl}
                    alt={card.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Dark gradient overlay to ensure text contrast matching screenshot */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-3.5 sm:p-5 text-white" />

                  {/* Content overlay */}
                  <div className="relative z-10 p-3.5 sm:p-5 flex flex-col justify-end h-full">
                    <h3 className="font-serif text-sm sm:text-lg md:text-xl font-medium tracking-wider text-white uppercase leading-tight mb-1">
                      {card.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#EAE0D4] font-serif italic mb-3 opacity-90">
                      {card.subtitle}
                    </p>
                    
                    <div className="inline-flex items-center gap-1.5 self-start bg-black/40 hover:bg-black/70 backdrop-blur-xs border border-white/25 px-2.5 sm:px-3 py-1.5 rounded-sm text-[9px] sm:text-[11px] font-medium tracking-wider uppercase text-white transition-colors">
                      <span>SHOP NOW</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. Circular Subcategory Avatars row */}
        {circularCategories.length > 0 && (
          <div className="py-2">
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto">
              {circularCategories.map((cat) => {
                const isSelected = activeCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.slug)}
                    className="flex flex-col items-center group focus:outline-none"
                  >
                    {/* Circle Image Wrapper matching screenshot */}
                    <div 
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden p-1 transition-all duration-300 ${
                        isSelected 
                          ? 'ring-2 ring-brand-600 ring-offset-2 scale-105 shadow-md bg-brand-100' 
                          : 'bg-[#F2ECE4] group-hover:ring-1 group-hover:ring-brand-400 group-hover:scale-105'
                      }`}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden bg-white shadow-inner flex items-center justify-center">
                        <FashionPlaceholder 
                          type={cat.placeholderKey || 'kurta'} 
                          imageUrl={cat.imageUrl}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Category Label beneath circle in serif font */}
                    <span className={`mt-2 font-serif text-[11px] sm:text-xs tracking-tight text-center transition-colors line-clamp-1 ${
                      isSelected ? 'font-semibold text-brand-800' : 'text-[#3E3834] group-hover:text-brand-700'
                    }`}>
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Category Filter Reset pill if filtered */}
        {activeCategory !== 'all' && (
          <div className="mt-4 flex items-center justify-center">
            <button
              onClick={() => setActiveCategory('all')}
              className="inline-flex items-center gap-1.5 text-xs text-brand-700 hover:text-brand-900 bg-brand-100/70 hover:bg-brand-100 px-3 py-1 rounded-full transition-colors border border-brand-200"
            >
              <span>Showing filtered products</span>
              <span className="font-semibold underline">Show All Products</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
