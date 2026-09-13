import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { ShopByCategory } from '../components/ShopByCategory';
import { PromoStrip } from '../components/PromoStrip';
import { ProductCatalog } from '../components/ProductCatalog';
import { useStore } from '../context/StoreContext';

export const HomePage = () => {
  const { setActiveCategory } = useStore();

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
    </>
  );
};
