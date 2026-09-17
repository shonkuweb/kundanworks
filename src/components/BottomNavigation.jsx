import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Phone, FileText } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    cartCount, 
    isCartOpen,
    setIsCartOpen, 
    setIsContactOpen,
    setActiveCategory 
  } = useStore();

  const isHomeActive = location.pathname === '/' && !isCartOpen;
  const isOrderActive = location.pathname === '/order' && !isCartOpen;

  const handleTabClick = (tab) => {
    if (tab === 'home') {
      setIsCartOpen(false);
      setActiveCategory('all');
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'cart') {
      setIsCartOpen(prev => !prev);
    } else if (tab === 'contact') {
      setIsCartOpen(false);
      setIsContactOpen(true);
    } else if (tab === 'order') {
      setIsCartOpen(false);
      navigate('/order');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#EAE0D4] pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] px-6 shadow-nav transition-all">
      <div className="max-w-md md:max-w-xl mx-auto flex items-center justify-between">
        
        {/* 1. HOME TAB */}
        <button
          onClick={() => handleTabClick('home')}
          className={`flex flex-col items-center justify-center gap-1 group transition-all duration-200 select-none ${
            isHomeActive ? 'text-[#9D6843]' : 'text-[#67564A] hover:text-[#25211E]'
          }`}
        >
          <div className="relative p-1">
            <Home className={`w-5 h-5 transition-transform ${isHomeActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.6]'}`} />
          </div>
          <span className={`text-[11px] tracking-wide transition-all ${
            isHomeActive ? 'font-semibold text-[#9D6843]' : 'font-medium'
          }`}>
            Home
          </span>
        </button>

        {/* 2. BAG TAB */}
        <button
          onClick={() => handleTabClick('cart')}
          className={`flex flex-col items-center justify-center gap-1 group transition-all duration-200 select-none ${
            isCartOpen ? 'text-[#9D6843]' : 'text-[#67564A] hover:text-[#25211E]'
          }`}
        >
          <div className="relative p-1">
            <ShoppingBag className={`w-5 h-5 transition-transform ${isCartOpen ? 'scale-110 stroke-[2.2]' : 'stroke-[1.6] group-hover:scale-105'}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-700 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <span className={`text-[11px] tracking-wide transition-all ${
            isCartOpen ? 'font-semibold text-[#9D6843]' : 'font-medium'
          }`}>
            Bag
          </span>
        </button>

        {/* 3. CONTACT TAB */}
        <button
          onClick={() => handleTabClick('contact')}
          className="flex flex-col items-center justify-center gap-1 group transition-all duration-200 select-none text-[#67564A] hover:text-[#25211E]"
        >
          <div className="relative p-1">
            <Phone className="w-5 h-5 stroke-[1.6] group-hover:scale-105 transition-transform" />
          </div>
          <span className="text-[11px] font-medium tracking-wide">
            Contact
          </span>
        </button>

        {/* 4. ORDER TAB */}
        <button
          onClick={() => handleTabClick('order')}
          className={`flex flex-col items-center justify-center gap-1 group transition-all duration-200 select-none ${
            isOrderActive ? 'text-[#9D6843]' : 'text-[#67564A] hover:text-[#25211E]'
          }`}
        >
          <div className="relative p-1">
            <FileText className={`w-5 h-5 transition-transform ${isOrderActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.6]'}`} />
          </div>
          <span className={`text-[11px] tracking-wide transition-all ${
            isOrderActive ? 'font-semibold text-[#9D6843]' : 'font-medium'
          }`}>
            Order
          </span>
        </button>

      </div>
    </nav>
  );
};
