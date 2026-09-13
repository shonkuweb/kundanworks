import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { ShopByCategory } from '../components/ShopByCategory';
import { PromoStrip } from '../components/PromoStrip';
import { ProductCatalog } from '../components/ProductCatalog';
import { LotusIcon } from '../components/Header';
import { useStore } from '../context/StoreContext';

export const HomePage = () => {
  const { storeConfig, setActiveCategory } = useStore();

  const handleShopNow = (targetCategory) => {
    if (targetCategory) {
      setActiveCategory(targetCategory);
    }
    const elem = document.getElementById('catalog-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Hero Section matching screenshot */}
      <HeroSection onShopNowClick={handleShopNow} />

      {/* Shop by Category Section matching screenshot */}
      <ShopByCategory onSelectCategory={handleShopNow} />

      {/* Promotional Strip */}
      <PromoStrip />

      {/* Product Catalog Grid */}
      <ProductCatalog />

      {/* Aesthetic Boutique Footer */}
      <footer className="bg-[#F3ECE4] border-t border-[#E5DACF] py-10 sm:py-14 text-center px-4">
        <div className="max-w-md md:max-w-3xl mx-auto space-y-4">
          <div className="flex justify-center">
            <LotusIcon className="w-8 h-6 text-brand-700" />
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-medium tracking-widest text-[#241F1C] uppercase">
            {storeConfig.storeName}
          </h3>
          <p className="font-serif italic text-xs sm:text-sm text-[#736052] max-w-sm mx-auto">
            "Celebrating authentic Indian textiles, timeless silhouettes, and the subtle luxury of handcrafted grace."
          </p>
          <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-[#866D5B] font-medium tracking-wider uppercase">
            <span>Pure Silks</span>
            <span>•</span>
            <span>Artisanal Khadi</span>
            <span>•</span>
            <span>Organic Linens</span>
          </div>
          <div className="pt-4 border-t border-[#DECBB9] flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-2">
            <p>© {new Date().getFullYear()} Kundan Works. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Powered by <strong className="text-neutral-700">Team ShonkuWEB</strong>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};
