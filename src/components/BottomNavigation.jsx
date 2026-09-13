import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, Phone, FileText } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    cartCount, 
    setIsCartOpen, 
    setIsContactOpen,
    setActiveCategory 
  } = useStore();

  const isHomeActive = location.pathname === '/';
  const isOrderActive = location.pathname === '/order';

  const handleTabClick = (tab) => {
    if (tab === 'home') {
      setActiveCategory('all');
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'cart') {
      setIsCartOpen(true);
    } else if (tab === 'contact') {
      setIsContactOpen(true);
    } else if (tab === 'order') {
      navigate('/order');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#EAE0D4] py-2 px-6 shadow-nav transition-all">
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

        {/* 2. CART TAB */}
        <button
          onClick={() => handleTabClick('cart')}
          className="flex flex-col items-center justify-center gap-1 group transition-all duration-200 select-none text-[#67564A] hover:text-[#25211E]"
        >
          <div className="relative p-1">
            <ShoppingCart className="w-5 h-5 stroke-[1.6] group-hover:scale-105 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium tracking-wide">
            Cart
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
