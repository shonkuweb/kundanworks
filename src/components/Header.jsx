import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, X, ShieldCheck, ShoppingBag, Sparkles, Phone, FileText } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const LotusIcon = ({ className = "w-6 h-6", color = "#A77D5E" }) => (
  <svg 
    viewBox="0 0 48 36" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M24 2C24 2 20 12 20 22C20 25.5 21.8 28 24 28C26.2 28 28 25.5 28 22C28 12 24 2 24 2Z" 
      stroke={color} 
      strokeWidth="1.8" 
      fill="#FAF8F5" 
    />
    <path 
      d="M21 9C21 9 14 17 15 25C15.5 28 18 29.5 21 28.5C19 25 19 19 21 9Z" 
      stroke={color} 
      strokeWidth="1.6" 
      fill="#FAF8F5" 
    />
    <path 
      d="M27 9C27 9 34 17 33 25C32.5 28 30 29.5 27 28.5C29 25 29 19 27 9Z" 
      stroke={color} 
      strokeWidth="1.6" 
      fill="#FAF8F5" 
    />
    <path 
      d="M16 19C16 19 8 23 8 28C8 31 12 32 17 30C15 27 15.5 23 16 19Z" 
      stroke={color} 
      strokeWidth="1.4" 
      fill="#FAF8F5" 
    />
    <path 
      d="M32 19C32 19 40 23 40 28C40 31 36 32 31 30C33 27 32.5 23 32 19Z" 
      stroke={color} 
      strokeWidth="1.4" 
      fill="#FAF8F5" 
    />
    <path 
      d="M14 33C19 35 29 35 34 33" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
    />
  </svg>
);

export const Header = () => {
  const navigate = useNavigate();
  const { 
    storeConfig, 
    searchQuery, 
    setSearchQuery, 
    setActiveCategory, 
    setIsAdminOpen, 
    setIsContactOpen,
    cartCount,
    setIsCartOpen
  } = useStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]/80 transition-all shadow-xs">
        <div className="max-w-md md:max-w-4xl lg:max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
          
          {/* Left: Drawer Toggle */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="p-2 -ml-1 text-[#1C1E21] hover:text-[#11A0AB] hover:bg-[#F0FDFA] rounded-full transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-6 h-6 stroke-[1.8]" />
          </button>

          {/* Center: Brand Logo Image */}
          <div 
            onClick={() => {
              setActiveCategory('all');
              navigate('/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center justify-center cursor-pointer select-none group px-2 py-0.5"
          >
            <img 
              src="/logo.png" 
              alt={storeConfig.storeName || 'Kundan Work Creation'} 
              className="h-11 sm:h-14 md:h-16 max-w-[190px] sm:max-w-[240px] md:max-w-[270px] object-contain group-hover:scale-105 transition-transform duration-300" 
            />
          </div>

          {/* Right: Search, Cart & Admin Access with Curved Edges */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsSearchOpen(prev => !prev)}
              className="p-2 text-[#1C1E21] hover:text-[#11A0AB] hover:bg-[#F0FDFA] rounded-full transition-colors cursor-pointer"
              aria-label="Search catalog"
            >
              <Search className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Shopping Bag / Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#1C1E21] hover:text-[#11A0AB] hover:bg-[#F0FDFA] rounded-full transition-colors cursor-pointer touch-manipulation"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#11A0AB] text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs select-none">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsAdminOpen(true)}
              title="Admin Panel"
              className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase px-3.5 py-1.5 rounded-full bg-[#F0FDFA] hover:bg-[#CCFBF1] text-[#0B6A71] border border-[#99F6E4] transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#11A0AB]" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-[#EAE0D4] bg-[#F7F2EC] px-4 py-2.5 animate-fadeIn">
            <div className="max-w-md mx-auto relative flex items-center">
              <Search className="w-4 h-4 text-brand-600 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  navigate('/');
                }}
                placeholder="Search kurtas, sarees, linen shirts, bottoms..."
                autoFocus
                className="w-full bg-white border border-[#DAC6B4] rounded-full pl-9 pr-8 py-2 text-sm text-[#282422] placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Side Navigation Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          <div className="relative w-72 sm:w-80 max-w-[85vw] bg-[#FAF8F5] h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE0D4]">
                <div 
                  onClick={() => {
                    setActiveCategory('all');
                    navigate('/');
                    setIsDrawerOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <img 
                    src="/logo.png" 
                    alt="Kundan Work Creation" 
                    className="h-9 w-auto object-contain"
                  />
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-full text-neutral-500 hover:bg-[#F0FDFA] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-1">
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    navigate('/');
                    setIsDrawerOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-brand-900 hover:bg-[#F2EAE0] transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Home Collection</span>
                  <Sparkles className="w-4 h-4 text-brand-500" />
                </button>

                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B2522] hover:bg-[#F2EAE0] transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-brand-700" />
                    <span>Shopping Bag</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="text-[11px] bg-brand-700 text-white px-2 py-0.5 rounded-full font-bold">
                      {cartCount}
                    </span>
                  )}
                </button>

                <div className="pt-4 pb-1 px-3 text-[11px] font-semibold text-[#8C6F5A] tracking-wider uppercase">
                  Customer Desk
                </div>

                <button
                  onClick={() => {
                    navigate('/order');
                    setIsDrawerOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-[#3E3834] hover:bg-[#F2EAE0] transition-colors flex items-center gap-2.5"
                >
                  <FileText className="w-4 h-4 text-brand-600" />
                  <span>Orders & Payment Gateway Status</span>
                </button>

                <button
                  onClick={() => {
                    setIsContactOpen(true);
                    setIsDrawerOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-[#3E3834] hover:bg-[#F2EAE0] transition-colors flex items-center gap-2.5"
                >
                  <Phone className="w-4 h-4 text-brand-600" />
                  <span>Contact Kundan Works</span>
                </button>
              </div>
            </div>

            <div className="p-5 border-t border-[#EAE0D4] bg-[#F4ECE3]/50">
              <button
                onClick={() => {
                  setIsAdminOpen(true);
                  setIsDrawerOpen(false);
                }}
                className="w-full py-2.5 px-3 bg-[#241F1C] hover:bg-[#38312D] text-white rounded-lg text-xs tracking-wider uppercase font-medium flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#D9B58B]" />
                <span>Open Admin Portal</span>
              </button>
              <p className="text-[10px] text-center text-neutral-500 mt-2.5 font-light">
                Manage Products & Orders • Kundan Works
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
