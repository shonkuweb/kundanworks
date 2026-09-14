import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { FashionPlaceholder } from './Placeholders';
import { useStore } from '../context/StoreContext';

export const ProductCatalog = () => {
  const navigate = useNavigate();
  const { 
    products, 
    categories, 
    activeCategory, 
    setActiveCategory, 
    searchQuery, 
    addToCart,
    setIsCartOpen 
  } = useStore();

  // Filter products by category and search
  const filteredProducts = products.filter(product => {
    if (!product) return false;
    const title = product.title || product.name || '';
    const desc = product.description || '';
    const tag = product.tag || '';

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchTitle = title.toLowerCase().includes(q);
      const matchDesc = desc.toLowerCase().includes(q);
      const matchTag = tag.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }

    if (activeCategory === 'all') return true;
    const catSlug = (product.categorySlug || product.categoryId || '').toLowerCase();
    const subSlug = (product.subCategorySlug || '').toLowerCase();
    const target = activeCategory.toLowerCase();
    return catSlug === target || subSlug === target;
  });

  const getDiscount = (price, orig) => {
    if (!orig || orig <= price) return null;
    return Math.round(((orig - price) / orig) * 100);
  };

  const handleOpenProductPage = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <section id="catalog-section" className="py-8 bg-[#FAF8F5]">
      <div className="max-w-md md:max-w-4xl lg:max-w-6xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-[#EAE0D4]">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-semibold text-brand-700 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Selection</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1E1A17] font-normal tracking-tight">
              {activeCategory === 'all' 
                ? 'The Complete Collection' 
                : categories.find(c => c.slug === activeCategory)?.name || 'Filtered Collection'}
            </h2>
          </div>

          <div className="mt-3 sm:mt-0 text-xs text-[#705E51]">
            Showing <span className="font-semibold text-brand-900">{filteredProducts.length}</span> pieces
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-[#F4ECE3]/50 rounded-2xl border border-dashed border-[#DAC8B8] p-6">
            <p className="font-serif text-lg text-[#3E3834] mb-2">
              {products.length === 0 ? 'No designs added yet' : 'No designs match your filter'}
            </p>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto mb-4">
              {products.length === 0 
                ? 'Use the Store Manager Admin Panel to add your boutique designs with direct camera or gallery photos.'
                : 'Try adjusting your category filter or search keywords to explore other boutique pieces.'}
            </p>
            {activeCategory !== 'all' && (
              <button
                onClick={() => setActiveCategory('all')}
                className="px-4 py-2 bg-[#25211E] text-white rounded-md text-xs uppercase tracking-wider font-medium"
              >
                Reset to All Collections
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {filteredProducts.map((product) => {
              const discount = getDiscount(product.price, product.originalPrice);

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl overflow-hidden border border-[#EDE4D9] shadow-xs hover:shadow-card transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Image Card - Links to Product Page */}
                  <div 
                    onClick={() => handleOpenProductPage(product)}
                    className="relative aspect-[3/4] w-full overflow-hidden bg-[#F3ECE4] cursor-pointer"
                  >
                    <FashionPlaceholder 
                      type={product.placeholderKey || 'kurta'} 
                      imageUrl={(product.images && product.images[0]) || product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Tag / Badge */}
                    {product.tag && (
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span className={`text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full text-white shadow-xs ${product.badgeColor || 'bg-brand-600'}`}>
                          {product.tag}
                        </span>
                      </div>
                    )}

                    {/* Stock badge if out of stock */}
                    {product.stock !== undefined && product.stock <= 0 && (
                      <div className="absolute top-2.5 right-2.5 z-10">
                        <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-xs">
                          Sold Out
                        </span>
                      </div>
                    )}

                    {/* Quick View link indicator on hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <div className="px-3 py-1.5 bg-white/95 text-[#241F1C] rounded-full text-[10px] tracking-wider uppercase font-semibold shadow-md flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Piece</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Details info */}
                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] tracking-wider uppercase text-neutral-400 font-medium mb-1 line-clamp-1">
                        Kundan Works • {(product.category || product.categorySlug || 'Collection').toString().replace(/-/g, ' ')}
                      </p>
                      
                      {/* Title - Links to dedicated product page */}
                      <h3 
                        onClick={() => handleOpenProductPage(product)}
                        className="font-serif text-sm sm:text-base font-medium text-[#221E1B] leading-snug cursor-pointer group-hover:text-brand-700 transition-colors line-clamp-2"
                      >
                        {product.title}
                      </h3>

                      {product.subtitle && (
                        <p className="text-[11px] text-neutral-500 font-serif italic mt-0.5 line-clamp-1">
                          {product.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Pricing & Add to Cart button */}
                    <div className="mt-3 pt-2.5 border-t border-[#F5EFE8] flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-serif font-semibold text-sm sm:text-base text-[#1E1A17]">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-[11px] text-neutral-400 line-through font-light">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        {discount && (
                          <span className="text-[10px] text-emerald-700 font-medium">
                            {discount}% off
                          </span>
                        )}
                      </div>

                      {/* Add Button or Sold Out indicator */}
                      {product.stock !== undefined && product.stock <= 0 ? (
                        <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-[10px] font-semibold uppercase tracking-wider">
                          Sold Out
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            addToCart(product, 'M', 1);
                            setIsCartOpen(true);
                          }}
                          className="p-2 sm:px-3 sm:py-1.5 bg-[#25211E] hover:bg-[#3D3530] text-white rounded-md text-[11px] font-medium tracking-wider uppercase flex items-center gap-1 transition-all active:scale-95 shadow-xs cursor-pointer"
                          aria-label={`Add ${product.title} to bag`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Add</span>
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
