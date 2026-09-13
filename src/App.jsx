import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { OrderSection } from './components/OrderSection';
import { AdminPanel } from './components/AdminPanel';
import { BottomNavigation } from './components/BottomNavigation';
import { CartDrawer } from './components/CartDrawer';
import { ContactModal } from './components/ContactModal';
import { Sparkles } from 'lucide-react';

const Layout = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    toast 
  } = useStore();

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between text-[#282422] selection:bg-[#EAE0D4] pb-16 sm:pb-0">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-16 right-4 z-50 animate-bounce">
          <div className="bg-[#241F1C] text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-[#443831]">
            <Sparkles className="w-4 h-4 text-[#D9B58B]" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Global Header */}
      <Header />

      {/* Dynamic Route Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/order" element={<OrderSection />} />
          {/* Fallback route */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Footer: Kundan Works Creation */}
      <footer className="bg-[#F3ECE4] border-t border-[#E5DACF] py-6 text-center px-4">
        <p className="font-serif text-xs sm:text-sm tracking-widest text-[#241F1C] uppercase font-medium">
          Kundan Works Creation
        </p>
      </footer>

      {/* Mobile Sticky Bottom Navigation (4 tabs: Home, Cart, Contact, Order) */}
      <BottomNavigation />

      {/* Modals & Slide Drawers */}
      {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} />}
      <CartDrawer />
      <ContactModal />

    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
