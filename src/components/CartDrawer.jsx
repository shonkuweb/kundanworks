import React from 'react';
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
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Slide Drawer */}
      <div className="relative w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden">
        
        {/* Cart Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE0D4] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-700" />
            <h2 className="font-serif text-lg font-medium text-[#221B16]">
              Your Shopping Bag
            </h2>
            <span className="text-xs bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full font-medium">
              {cart.length}
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded-full text-neutral-500 hover:bg-[#F2EAE0]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#F4EDE4] mx-auto flex items-center justify-center text-brand-600">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-lg text-[#25201C]">Your bag is empty</h3>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Explore our handcrafted ethnic sets and contemporary western apparel to add your favorite looks.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-2 px-5 py-2 bg-[#25211E] hover:bg-[#3D3530] text-white rounded-lg text-xs uppercase tracking-wider font-medium cursor-pointer transition-colors"
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
                  className="bg-white p-3 rounded-xl border border-[#EAE0D4] flex gap-3 shadow-xs"
                >
                  {/* Image */}
                  <div 
                    onClick={() => handleOpenProduct(pid)}
                    className="w-18 h-22 rounded-lg overflow-hidden shrink-0 bg-[#F4ECE3] cursor-pointer hover:opacity-90 transition-opacity"
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
                          className="font-serif text-sm font-medium text-[#221B16] line-clamp-1 cursor-pointer hover:text-brand-700"
                        >
                          {title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(pid, size)}
                          className="text-neutral-400 hover:text-rose-600 p-0.5 cursor-pointer transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Size: <span className="font-semibold text-neutral-700">{size}</span>
                        {price > 0 && (
                          <span className="text-neutral-400 ml-2">₹{price.toLocaleString('en-IN')} each</span>
                        )}
                      </p>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F7F2EC]">
                      <div className="flex items-center gap-2 bg-[#F6F0E8] rounded-md px-1.5 py-0.5">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(pid, size, -1)}
                          className="p-1 text-neutral-600 hover:text-black cursor-pointer"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold text-[#25201C] w-4 text-center select-none">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(pid, size, 1)}
                          className="p-1 text-neutral-600 hover:text-black cursor-pointer"
                          title="Increase quantity"
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

        {/* Cart Summary & Checkout Footer */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-[#EAE0D4] space-y-3">
            
            <div className="space-y-1.5 text-xs text-[#52443A]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-serif font-medium">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-emerald-700 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#221B16] pt-2 border-t border-[#EAE0D4]">
                <span>Total Amount</span>
                <span className="font-serif text-base">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3 bg-[#1E1A17] hover:bg-[#342D28] text-white rounded-xl text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
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
