import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { CheckoutPage } from './pages/CheckoutPage';
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
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between text-[#241A1C] selection:bg-[#FDF5F6] selection:text-[#7A112A] pb-16 sm:pb-0">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-16 right-4 z-50 animate-bounce">
          <div className="bg-[#18060B] text-white text-xs px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 border border-[#7A112A]/40">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
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
          <Route path="/admin" element={<AdminPanel onClose={() => setIsAdminOpen(false)} />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order" element={<OrderSection />} />
          {/* Fallback route */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

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
