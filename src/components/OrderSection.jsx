import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  PhoneCall, 
  MessageSquare, 
  AlertCircle 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FashionPlaceholder } from './Placeholders';

export const OrderSection = () => {
  const { orders, trackOrder, setIsContactOpen } = useStore();

  // Search state - defaults to first order so user immediately sees a live tracking demo!
  const [searchQuery, setSearchQuery] = useState('KW-1001');
  const [searchedOrder, setSearchedOrder] = useState(() => orders[0] || null);
  const [searchError, setSearchError] = useState('');

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchError('Please enter an Order ID or Phone Number');
      return;
    }
    const result = trackOrder(searchQuery);
    if (result) {
      setSearchedOrder(result);
      setSearchError('');
    } else {
      setSearchedOrder(null);
      setSearchError(`No active orders found matching "${searchQuery}". Please check the ID or try a demo order below.`);
    }
  };

  const handleSelectDemo = (orderId) => {
    setSearchQuery(orderId);
    const result = trackOrder(orderId);
    if (result) {
      setSearchedOrder(result);
      setSearchError('');
    }
  };

  const trackingSteps = [
    { step: 1, label: 'Order Confirmed', sub: 'Payment & sizing verified' },
    { step: 2, label: 'Artisanal Crafting', sub: 'Hand-embroidery & finish' },
    { step: 3, label: 'Dispatched', sub: 'Handed to express courier' },
    { step: 4, label: 'Out for Delivery', sub: 'With local delivery agent' },
    { step: 5, label: 'Delivered', sub: 'Handed over at doorstep' }
  ];

  return (
    <div className="py-8 sm:py-12 bg-[#FAF8F5] min-h-[85vh]">
      <div className="max-w-md md:max-w-3xl lg:max-w-4xl mx-auto px-4 space-y-8">
        
        {/* Top Section Header */}
        <div className="text-center">
          <div className="inline-flex p-3 rounded-full bg-[#F3ECE3] border border-[#DFCFC0] text-brand-700 mb-3 shadow-xs">
            <Package className="w-8 h-8 stroke-[1.6]" />
          </div>
          <span className="text-[10px] tracking-[0.25em] font-semibold text-brand-600 uppercase block mb-1">
            Storefront Services
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1F1A17] font-normal tracking-tight">
            Live Order Tracking
          </h1>
          <p className="text-xs sm:text-sm text-[#705E51] font-light mt-1 max-w-md mx-auto">
            Track your handcrafted ensemble from our artisanal studio to your doorstep in real time.
          </p>
        </div>

        {/* 1. SEARCH & TRACK BAR */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#EAE0D4] shadow-xs space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-brand-600 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. KW-1001) or Phone number..."
                className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#DAC8B8] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-600"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#1E1A17] hover:bg-[#342C27] text-white rounded-xl text-xs uppercase tracking-wider font-semibold shadow-xs transition-all active:scale-95"
            >
              Track Order
            </button>
          </form>

          {/* Quick Demo Selector Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-neutral-400 text-[11px] font-medium">Quick Demo IDs:</span>
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => handleSelectDemo(o.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] transition-all border ${
                  searchedOrder?.id === o.id
                    ? 'bg-brand-100 text-brand-900 border-brand-300 font-semibold'
                    : 'bg-[#FAF8F5] text-neutral-600 border-[#E5DACF] hover:bg-[#F2EAE0]'
                }`}
              >
                #{o.id} ({o.statusTitle})
              </button>
            ))}
          </div>

          {searchError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}
        </div>

        {/* 2. ORDER DETAILS & LIVE TRACKING TIMELINE */}
        {searchedOrder && (
          <div className="bg-white rounded-2xl border border-[#E0D2C2] overflow-hidden shadow-card animate-fadeIn space-y-6">
            
            {/* Order Status Banner */}
            <div className="bg-gradient-to-r from-[#241F1C] to-[#3B322B] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase tracking-widest text-[#D9B58B] font-mono">
                    Order #{searchedOrder.id}
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-xs text-neutral-300 font-light">
                    Placed on {searchedOrder.date}
                  </span>
                </div>
                <h2 className="font-serif text-lg sm:text-xl font-medium text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#D9B58B]" />
                  <span>{searchedOrder.statusTitle}</span>
                </h2>
                <p className="text-xs text-neutral-300 mt-1 font-light max-w-md">
                  {searchedOrder.statusDescription}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-3 rounded-xl text-right sm:text-right shrink-0">
                <span className="text-[10px] text-[#D9B58B] uppercase tracking-wider block">Estimated Delivery</span>
                <span className="font-serif text-sm font-semibold text-white">{searchedOrder.estimatedDelivery}</span>
                <span className="text-[10px] text-neutral-300 block font-mono mt-0.5">{searchedOrder.courierName}</span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="px-5 sm:px-8 py-2">
              <div className="relative">
                {/* Horizontal Progress Bar for Desktop, Vertical for Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
                  {trackingSteps.map((stepItem, idx) => {
                    const isCompleted = searchedOrder.currentStep > stepItem.step;
                    const isCurrent = searchedOrder.currentStep === stepItem.step;

                    return (
                      <div key={stepItem.step} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 relative">
                        {/* Step Circle */}
                        <div 
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold transition-all ${
                            isCompleted 
                              ? 'bg-emerald-600 text-white' 
                              : isCurrent 
                                ? 'bg-[#9D6843] text-white ring-4 ring-[#9D6843]/20 shadow-md scale-105' 
                                : 'bg-neutral-100 text-neutral-400 border border-neutral-300'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                          ) : (
                            <span>{stepItem.step}</span>
                          )}
                        </div>

                        {/* Labels */}
                        <div className="sm:mt-1">
                          <p className={`text-xs font-medium ${
                            isCurrent ? 'text-brand-900 font-bold' : isCompleted ? 'text-neutral-800' : 'text-neutral-400'
                          }`}>
                            {stepItem.label}
                          </p>
                          <p className="text-[10px] text-neutral-500 font-light hidden sm:block">
                            {stepItem.sub}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Ordered Items & Delivery Details Grid */}
            <div className="p-5 sm:p-8 pt-0 grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Items Card */}
              <div className="md:col-span-7 bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE0D4] space-y-3">
                <h3 className="font-serif text-xs uppercase tracking-wider text-brand-800 font-semibold pb-2 border-b border-[#EAE0D4]">
                  Items in this Shipment
                </h3>

                {searchedOrder.items.map((item, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-[#EFE8DF] shrink-0 border border-[#DAC8B8]">
                      <FashionPlaceholder 
                        type={item.placeholderKey || 'kurta'} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-xs sm:text-sm font-medium text-[#221B16] line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Size: <span className="font-semibold text-neutral-700">{item.size}</span> • Qty: {item.quantity}
                      </p>
                      <p className="font-serif font-semibold text-xs text-[#1E1A17] mt-1">
                        ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="pt-2 border-t border-[#EAE0D4] text-xs space-y-1 text-neutral-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{searchedOrder.subtotal?.toLocaleString('en-IN')}</span>
                  </div>
                  {searchedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Promo Savings</span>
                      <span>- ₹{searchedOrder.discount?.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-[#1E1A17] pt-1 border-t border-[#EAE0D4]">
                    <span>Total Paid</span>
                    <span className="font-serif">₹{searchedOrder.total?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Shipping & Support Card */}
              <div className="md:col-span-5 bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE0D4] flex flex-col justify-between space-y-4">
                <div className="space-y-3 text-xs">
                  <h3 className="font-serif uppercase tracking-wider text-brand-800 font-semibold pb-2 border-b border-[#EAE0D4]">
                    Dispatch & Recipient Info
                  </h3>

                  <div>
                    <span className="text-[10px] uppercase font-semibold text-neutral-400 block">Recipient</span>
                    <p className="font-medium text-neutral-800">{searchedOrder.customerName}</p>
                    <p className="text-neutral-500">{searchedOrder.phone}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold text-neutral-400 block">Delivery Address</span>
                    <p className="text-neutral-700 leading-relaxed text-[11px]">{searchedOrder.shippingAddress}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold text-neutral-400 block">AWB Tracking No.</span>
                    <p className="font-mono text-neutral-800 font-semibold">{searchedOrder.awbNumber}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsContactOpen(true)}
                    className="w-full py-2 bg-white hover:bg-neutral-50 border border-[#DAC6B4] text-brand-900 rounded-lg text-xs font-medium tracking-wide uppercase transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Order Inquiries Desk</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
