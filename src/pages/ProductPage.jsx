import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag, 
  ArrowRight, 
  Plus, 
  Minus, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X, 
  Camera 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FashionPlaceholder } from '../components/Placeholders';

export const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, setIsCartOpen } = useStore();

  const product = products.find(p => p.id === id || p.slug === id);

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Scroll to top and reset gallery when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIndex(0);
    setIsLightboxOpen(false);
  }, [id]);

  // Extract all available images uploaded for this product
  const allImages = useMemo(() => {
    if (!product) return [];
    const set = new Set();
    if (Array.isArray(product.images)) {
      product.images.forEach(img => {
        if (img && typeof img === 'string' && img.trim()) {
          set.add(img.trim());
        }
      });
    }
    if (Array.isArray(product.gallery)) {
      product.gallery.forEach(img => {
        if (img && typeof img === 'string' && img.trim()) {
          set.add(img.trim());
        }
      });
    }
    if (product.imageUrl && typeof product.imageUrl === 'string' && product.imageUrl.trim()) {
      set.add(product.imageUrl.trim());
    }
    return Array.from(set);
  }, [product]);

  const hasMultipleImages = allImages.length > 1;
  const currentImage = (allImages.length > 0 && allImages[activeImageIndex])
    ? allImages[activeImageIndex]
    : (product ? product.imageUrl : null);

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

  // Keyboard navigation for image switching and lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (hasMultipleImages) {
        if (e.key === 'ArrowLeft') {
          setActiveImageIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
        } else if (e.key === 'ArrowRight') {
          setActiveImageIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
        }
      }
      if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasMultipleImages, isLightboxOpen, allImages.length]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-2xl text-[#241F1C] mb-2">Product Not Found</h2>
        <p className="text-xs text-neutral-500 max-w-sm mb-6">
          The item you are looking for is not available or has been removed.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-[#1E1A17] text-white rounded-lg text-xs uppercase tracking-wider font-medium"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isSoldOut = product.stock !== undefined && product.stock <= 0;

  // Other products for "You May Also Like"
  const otherProducts = products
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (isSoldOut) return;
    addToCart(product, 'Standard', quantity);
    setIsCartOpen(true);
  };

  const handleCheckout = () => {
    if (isSoldOut) return;
    addToCart(product, 'Standard', quantity);
    navigate('/checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#FAF8F5] pb-16 pt-3 animate-fadeIn min-h-[85vh]">
      
      {/* Simple Back Link */}
      <div className="max-w-4xl mx-auto px-4 mb-4">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-[#1E1A17] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Products</span>
        </Link>
      </div>

      {/* Main Product Container */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE0D4] shadow-xs">
          
          {/* LEFT: Complete Multi-Image Product Gallery */}
          <div className="flex flex-col">
            {/* Main Featured Photo Box */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#F4ECE3] border border-[#E5DACD] group shadow-xs select-none">
              {currentImage ? (
                <img 
                  key={currentImage}
                  src={currentImage} 
                  alt={`${product.title} - View ${activeImageIndex + 1}`} 
                  onClick={() => setIsLightboxOpen(true)}
                  className="w-full h-full object-cover transition-opacity duration-300 cursor-zoom-in hover:scale-102"
                />
              ) : (
                <FashionPlaceholder 
                  type={product.placeholderKey || 'kurta'}
                  imageUrl={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Photo Count Indicator (when multiple photos available) */}
              {hasMultipleImages && (
                <div className="absolute top-3.5 left-3.5 z-10">
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium rounded-full shadow-sm flex items-center gap-1.5 tracking-wide">
                    <Camera className="w-3.5 h-3.5 text-amber-300" />
                    <span>{activeImageIndex + 1} of {allImages.length}</span>
                  </span>
                </div>
              )}

              {/* Sold Out Badge */}
              {isSoldOut && (
                <div className="absolute top-3.5 right-3.5 z-10">
                  <span className="px-3 py-1 bg-rose-600 text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
                    Sold Out
                  </span>
                </div>
              )}

              {/* Expand / Lightbox Button */}
              {currentImage && (
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  aria-label="View fullscreen photo"
                  title="Click to zoom / expand photo"
                  className="absolute bottom-3.5 right-3.5 z-10 p-2 rounded-full bg-black/55 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow-sm hover:scale-105 cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}

              {/* Prev / Next Chevrons on Main Photo (when multiple photos) */}
              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    aria-label="Previous photo"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-neutral-800 backdrop-blur-md shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5 -ml-0.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Next photo"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-neutral-800 backdrop-blur-md shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5 -mr-0.5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip: Shows every uploaded image */}
            {hasMultipleImages && (
              <div className="mt-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-neutral-500 font-medium px-1">
                  <span>Available Photos ({allImages.length})</span>
                  <span className="text-[10px] text-neutral-400">Tap to view angle</span>
                </div>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-18 h-22 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 bg-[#F4ECE3] ${
                        activeImageIndex === idx
                          ? 'border-[#11A0AB] ring-2 ring-[#11A0AB]/30 shadow-md scale-102 opacity-100'
                          : 'border-[#E3D7C9] opacity-60 hover:opacity-100 hover:border-neutral-400'
                      }`}
                      title={`View photo ${idx + 1}`}
                    >
                      <img
                        src={img}
                        alt={`${product.title} view ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-medium rounded-full">
                        {idx + 1}
                      </span>
                      {activeImageIndex === idx && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#11A0AB] ring-2 ring-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Super Simple Product Details */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Title & Subtitle */}
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl text-[#1E1A17] font-medium leading-tight">
                  {product.title}
                </h1>
                {product.subtitle && (
                  <p className="text-xs sm:text-sm text-neutral-500 font-serif italic mt-1">
                    {product.subtitle}
                  </p>
                )}
              </div>

              {/* Price & Stock Status */}
              <div className="flex items-baseline gap-3 pb-3 border-b border-[#F0E6DC]">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1A17]">
                  ₹{(product.price || 0).toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-neutral-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                  isSoldOut
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {isSoldOut ? 'Out of Stock' : 'In Stock'}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider block">
                  Description
                </span>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {product.description || 'Artisan handcrafted ensemble tailored with premium textiles.'}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="pt-2">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider block">
                    Quantity
                  </span>
                  <div className="inline-flex items-center bg-[#FAF5EE] border border-[#DECBB8] rounded-full p-1">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-700 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center text-xs font-semibold text-[#25201C] select-none">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-700 hover:bg-white cursor-pointer transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons: Add to Bag & Checkout */}
            <div className="space-y-2.5 pt-4 border-t border-[#F0E6DC]">
              <div className="grid grid-cols-2 gap-3">
                {/* Add to Bag */}
                <button
                  type="button"
                  disabled={isSoldOut}
                  onClick={handleAddToCart}
                  className="py-3.5 px-4 bg-white hover:bg-[#F6EFE8] text-[#1E1A17] border border-[#DECBB8] rounded-full text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#11A0AB]" />
                  <span>{isSoldOut ? 'Sold Out' : 'Add to Bag'}</span>
                </button>

                {/* Checkout */}
                <button
                  type="button"
                  disabled={isSoldOut}
                  onClick={handleCheckout}
                  className="py-3.5 px-4 bg-[#11A0AB] hover:bg-[#0E848D] text-white rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>{isSoldOut ? 'Unavailable' : 'Checkout'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* YOU MAY ALSO LIKE */}
        {otherProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[#EAE0D4]">
            <div className="mb-6">
              <h3 className="font-serif text-xl sm:text-2xl text-[#1E1A17] font-medium">
                You May Also Like
              </h3>
              <p className="text-xs text-neutral-500 font-light mt-0.5">
                Explore more handcrafted pieces from our collection
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {otherProducts.map(item => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="group bg-white rounded-xl overflow-hidden border border-[#EDE4D9] shadow-xs hover:shadow-card transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] w-full bg-[#F3ECE4] overflow-hidden">
                    <FashionPlaceholder 
                      type={item.placeholderKey || 'kurta'}
                      imageUrl={(item.images && item.images[0]) || item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-serif text-xs sm:text-sm font-medium text-[#221E1B] line-clamp-1 group-hover:text-brand-700 transition-colors">
                      {item.title}
                    </h4>
                    <span className="font-serif font-semibold text-xs sm:text-sm text-[#1E1A17] block mt-1">
                      ₹{(item.price || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Fullscreen High-Resolution Lightbox Modal */}
      {isLightboxOpen && currentImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Header Bar */}
          <div 
            className="w-full max-w-5xl flex items-center justify-between text-white/90 pt-2 pb-3 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm sm:text-base font-serif font-medium text-white">
                {product.title}
              </span>
              {hasMultipleImages && (
                <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-xs rounded-full text-xs font-medium text-white">
                  {activeImageIndex + 1} of {allImages.length}
                </span>
              )}
            </div>
            
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close full view (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center Image Container with Previous & Next Navigation */}
          <div 
            className="relative flex-1 w-full max-w-5xl flex items-center justify-center overflow-hidden my-auto select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {hasMultipleImages && (
              <button
                type="button"
                onClick={handlePrevImage}
                aria-label="Previous image"
                className="absolute left-2 sm:left-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-6 h-6 -ml-0.5" />
              </button>
            )}

            <img
              src={currentImage}
              alt={`${product.title} photo ${activeImageIndex + 1}`}
              className="max-h-[72vh] max-w-full object-contain rounded-xl shadow-2xl transition-all"
            />

            {hasMultipleImages && (
              <button
                type="button"
                onClick={handleNextImage}
                aria-label="Next image"
                className="absolute right-2 sm:right-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
              >
                <ChevronRight className="w-6 h-6 -mr-0.5" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Strip inside Lightbox */}
          {hasMultipleImages && (
            <div 
              className="flex items-center gap-2.5 pb-2 pt-2 overflow-x-auto max-w-full scrollbar-none select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-18 sm:w-16 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 bg-neutral-900 ${
                    activeImageIndex === idx
                      ? 'border-[#11A0AB] scale-105 ring-2 ring-[#11A0AB]/40 opacity-100'
                      : 'border-white/20 opacity-40 hover:opacity-90'
                  }`}
                  title={`View photo ${idx + 1}`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
