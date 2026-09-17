import React, { useState, useEffect, useMemo } from 'react';
import { X, ShoppingBag, ShieldCheck, Heart, Sparkles, Check, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { FashionPlaceholder } from './Placeholders';
import { useStore } from '../context/StoreContext';

export const ProductDetailModal = () => {
  const { selectedProduct, setSelectedProduct, addToCart, setIsCartOpen } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Extract all available images uploaded for this product
  const allImages = useMemo(() => {
    if (!selectedProduct) return [];
    const set = new Set();
    if (Array.isArray(selectedProduct.images)) {
      selectedProduct.images.forEach(img => {
        if (img && typeof img === 'string' && img.trim()) {
          set.add(img.trim());
        }
      });
    }
    if (Array.isArray(selectedProduct.gallery)) {
      selectedProduct.gallery.forEach(img => {
        if (img && typeof img === 'string' && img.trim()) {
          set.add(img.trim());
        }
      });
    }
    if (selectedProduct.imageUrl && typeof selectedProduct.imageUrl === 'string' && selectedProduct.imageUrl.trim()) {
      set.add(selectedProduct.imageUrl.trim());
    }
    return Array.from(set);
  }, [selectedProduct]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedProduct?.id]);

  if (!selectedProduct) return null;

  const hasMultipleImages = allImages.length > 1;
  const currentImage = (allImages.length > 0 && allImages[activeImageIndex])
    ? allImages[activeImageIndex]
    : selectedProduct.imageUrl;

  const handlePrevImage = (e) => {
    if (e) e.stopPropagation();
    if (!hasMultipleImages) return;
    setActiveImageIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    if (e) e.stopPropagation();
    if (!hasMultipleImages) return;
    setActiveImageIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleAddAndOpenCart = () => {
    addToCart(selectedProduct, 'Standard', quantity);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#D7BEA8] max-w-lg w-full overflow-hidden shadow-2xl my-6 relative">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-3.5 right-3.5 z-20 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="max-h-[85vh] overflow-y-auto">
          
          {/* Top Visual Banner / Gallery */}
          <div className="relative aspect-[4/4] sm:aspect-[4/4] w-full bg-[#EFE8DE] overflow-hidden group select-none">
            {currentImage ? (
              <img 
                key={currentImage}
                src={currentImage} 
                alt={`${selectedProduct.title} - View ${activeImageIndex + 1}`} 
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            ) : (
              <FashionPlaceholder 
                type={selectedProduct.placeholderKey || 'kurta'} 
                imageUrl={selectedProduct.imageUrl}
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
              />
            )}

            {/* Photo Counter Pill (when multiple photos available) */}
            {hasMultipleImages && (
              <div className="absolute top-3.5 left-3.5 z-10">
                <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium rounded-full shadow-sm flex items-center gap-1.5 tracking-wide">
                  <Camera className="w-3.5 h-3.5 text-amber-300" />
                  <span>{activeImageIndex + 1} of {allImages.length}</span>
                </span>
              </div>
            )}

            {selectedProduct.tag && !hasMultipleImages && (
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full text-white bg-[#926749] shadow-xs">
                  {selectedProduct.tag}
                </span>
              </div>
            )}

            {/* Prev / Next Chevrons on Modal Image (when multiple photos) */}
            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="Previous photo"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-800 backdrop-blur-md shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 -ml-0.5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="Next photo"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-800 backdrop-blur-md shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 -mr-0.5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip inside Modal */}
          {hasMultipleImages && (
            <div className="px-5 pt-3 pb-1 bg-[#F5EDE3] border-b border-[#E8DDD1] flex items-center gap-2 overflow-x-auto scrollbar-none">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-14 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 bg-[#EFE8DE] ${
                    activeImageIndex === idx
                      ? 'border-[#11A0AB] ring-2 ring-[#11A0AB]/30 scale-102 opacity-100 shadow-xs'
                      : 'border-[#DACABE] opacity-60 hover:opacity-100'
                  }`}
                  title={`View photo ${idx + 1}`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0.5 left-0.5 px-1 bg-black/60 text-white text-[8px] rounded">
                    {idx + 1}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Details Section */}
          <div className="p-5 sm:p-6 space-y-4">
            
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#866D5B] mb-1">
                Kundan Works Exclusive
              </p>
              <h2 className="font-serif text-xl sm:text-2xl text-[#221B16] font-normal leading-snug">
                {selectedProduct.title}
              </h2>
              {selectedProduct.subtitle && (
                <p className="text-xs text-neutral-500 font-serif italic mt-0.5">
                  {selectedProduct.subtitle}
                </p>
              )}
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-2.5 pb-3 border-b border-[#EAE0D4]">
              <span className="font-serif text-2xl font-semibold text-[#1E1A17]">
                ₹{selectedProduct.price.toLocaleString('en-IN')}
              </span>
              {selectedProduct.originalPrice > selectedProduct.price && (
                <span className="text-sm text-neutral-400 line-through">
                  ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs text-emerald-700 font-medium">
                Inclusive of all taxes
              </span>
            </div>

            {/* Fabric Details */}
            {selectedProduct.fabric && (
              <div className="p-3 bg-[#F4EDE4] rounded-xl text-xs text-[#52443A] space-y-0.5">
                <span className="font-semibold block text-brand-800">Fabric & Craft:</span>
                <p>{selectedProduct.fabric}</p>
              </div>
            )}

            {/* Description */}
            <div className="text-xs text-neutral-600 leading-relaxed font-light">
              <p>{selectedProduct.description}</p>
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center gap-3">
              {selectedProduct.stock !== undefined && selectedProduct.stock <= 0 ? (
                <button
                  disabled
                  className="flex-1 py-3.5 px-4 bg-neutral-200 text-neutral-500 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <span>Out of Stock</span>
                </button>
              ) : (
                <button
                  onClick={handleAddAndOpenCart}
                  className="flex-1 py-3.5 px-4 bg-[#11A0AB] hover:bg-[#0E848D] text-white rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag • ₹{(selectedProduct.price * quantity).toLocaleString('en-IN')}</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
