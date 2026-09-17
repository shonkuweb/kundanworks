import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FashionPlaceholder } from './Placeholders';

export const CartDrawer = () => {
  const navigate = useNavigate();
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    cartSubtotal, 
    removeFromCart, 
    updateCartQuantity 
  } = useStore();

  // Prevent background scrolling while cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProduct = (productId) => {
    setIsCartOpen(false);
    navigate(`/product/${productId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fadeIn"
        aria-hidden="true"
      />

      {/* Slide Drawer with 100dvh for mobile viewport accuracy */}
      <div className="relative w-full max-w-md bg-[#FAF8F5] h-[100dvh] max-h-[100dvh] shadow-2xl z-10 flex flex-col justify-between overflow-hidden animate-slideInRight">
        
        {/* Cart Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE0D4] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-700" />
            <h2 className="font-serif text-lg font-medium text-[#221B16]">
              Your Shopping Bag
            </h2>
            <span className="text-xs bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full font-medium">
              {cart.length} {cart.length === 1 ? 'piece' : 'pieces'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="p-2 -mr-1 rounded-full text-neutral-500 hover:bg-[#F2EAE0] active:scale-95 transition-all touch-manipulation cursor-pointer"
            aria-label="Close Shopping Bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List - min-h-0 allows flexbox scrolling */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-3.5 overscroll-contain">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-16 px-4 text-center space-y-3.5">
              <div className="w-16 h-16 rounded-full bg-[#F4EDE4] flex items-center justify-center text-brand-700 shadow-sm">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-lg text-[#25201C] font-medium">Your bag is empty</h3>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                Explore our handcrafted ethnic sets and contemporary western apparel to add your favorite looks.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-2 px-6 py-2.5 bg-[#25211E] hover:bg-[#3D3530] active:scale-95 text-white rounded-xl text-xs uppercase tracking-wider font-semibold cursor-pointer transition-all shadow-sm"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            cart.map((item, idx) => {
              const product = item?.product || item || {};
              const pid = product.id || item?.id || `item-${idx}`;
              const title = product.title || product.name || 'Handcrafted Apparel';
              const price = Number(product.price) || 0;
              const quantity = Number(item?.quantity) || 1;
              const size = item?.size || 'Standard';
              const itemTotal = price * quantity;
              const imageUrl = (Array.isArray(product.images) && product.images[0]) || product.imageUrl;

              return (
                <div 
                  key={`${pid}-${size}-${idx}`}
                  className="bg-white p-3 rounded-xl border border-[#EAE0D4] flex gap-3 shadow-sm hover:border-[#D8C7B5] transition-colors"
                >
                  {/* Image */}
                  <div 
                    onClick={() => handleOpenProduct(pid)}
                    className="w-20 h-24 rounded-lg overflow-hidden shrink-0 bg-[#F4ECE3] cursor-pointer hover:opacity-90 transition-opacity border border-[#EDE3D8]"
                  >
                    <FashionPlaceholder 
                      type={product.placeholderKey || 'kurta'} 
                      imageUrl={imageUrl}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 
                          onClick={() => handleOpenProduct(pid)}
                          className="font-serif text-sm font-medium text-[#221B16] line-clamp-1 cursor-pointer hover:text-brand-700 transition-colors"
                        >
                          {title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(pid, size)}
                          className="text-neutral-400 hover:text-rose-600 active:text-rose-700 p-1 -mr-1 cursor-pointer transition-colors touch-manipulation"
                          title="Remove item"
                          aria-label={`Remove ${title} from bag`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-1">
                        <span className="bg-[#FAF5EE] text-[#5F3F2C] font-semibold px-2 py-0.5 rounded border border-[#EAE0D4]">
                          Size: {size}
                        </span>
                        {price > 0 && (
                          <span className="text-neutral-400">₹{price.toLocaleString('en-IN')} each</span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Stepper & Item Total */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F7F2EC]">
                      <div className="flex items-center bg-[#F6F0E8] rounded-lg border border-[#E7DCCE] overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(pid, size, -1)}
                          className="w-7 h-7 flex items-center justify-center text-neutral-700 hover:text-black active:bg-[#EADFCF] cursor-pointer touch-manipulation transition-colors"
                          title="Decrease quantity"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-[#25201C] select-none">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(pid, size, 1)}
                          className="w-7 h-7 flex items-center justify-center text-neutral-700 hover:text-black active:bg-[#EADFCF] cursor-pointer touch-manipulation transition-colors"
                          title="Increase quantity"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-serif font-semibold text-sm text-[#1E1A17]">
                        ₹{itemTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Cart Summary & Checkout Footer - with Safe Area padding */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-[#EAE0D4] space-y-3 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            
            <div className="space-y-1.5 text-xs text-[#52443A]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-serif font-medium text-neutral-800">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-emerald-700 font-medium">Free Express Delivery</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#221B16] pt-2 border-t border-[#EAE0D4]">
                <span>Total Amount</span>
                <span className="font-serif text-base font-bold">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-[#1E1A17] hover:bg-[#342D28] active:bg-black text-white rounded-xl text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer touch-manipulation"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
