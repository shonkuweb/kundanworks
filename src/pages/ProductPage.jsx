import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FashionPlaceholder } from '../components/Placeholders';

export const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, setIsCartOpen } = useStore();

  const product = products.find(p => p.id === id || p.slug === id);

  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

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
  const productImage = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images[0]
    : product.imageUrl;

  // Other products for "You May Also Like"
  const otherProducts = products
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (isSoldOut) return;
    addToCart(product, selectedSize, quantity);
    setIsCartOpen(true);
  };

  const handleCheckout = () => {
    if (isSoldOut) return;
    addToCart(product, selectedSize, quantity);
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
          
          {/* LEFT: Single Clean Image (No 3-photo selector option) */}
          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#F4ECE3] border border-[#E5DACD]">
            {productImage ? (
              <img 
                src={productImage} 
                alt={product.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <FashionPlaceholder 
                type={product.placeholderKey || 'kurta'}
                imageUrl={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            )}

            {isSoldOut && (
              <div className="absolute top-3 right-3 z-10">
                <span className="px-3 py-1 bg-rose-600 text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
                  Sold Out
                </span>
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

              {/* Size & Quantity Selectors */}
              <div className="space-y-4 pt-1">
                {/* Size Selector */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider block">
                    Select Size
                  </span>
                  <div className="flex items-center gap-2">
                    {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`w-10 h-10 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          selectedSize === s
                            ? 'bg-[#11A0AB] text-white shadow-xs'
                            : 'bg-white text-neutral-700 border border-neutral-300 hover:border-[#11A0AB]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selector */}
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

    </div>
  );
};
