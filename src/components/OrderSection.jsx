import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  Clock,
  MapPin,
  Phone,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { useStore, ORDER_STAGES } from '../context/StoreContext';
import { FashionPlaceholder } from './Placeholders';

export const OrderSection = () => {
  const [searchParams] = useSearchParams();
  const { orders, trackOrder } = useStore();

  const urlOrderId = searchParams.get('id') || '';

  // Clean real search state - no fake demo pre-population
  const [searchQuery, setSearchQuery] = useState(urlOrderId);
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [searchError, setSearchError] = useState('');

  // Auto-search if navigated with ?id=... from checkout
  useEffect(() => {
    if (urlOrderId) {
      setSearchQuery(urlOrderId);
      const result = trackOrder(urlOrderId);
      if (result) {
        setSearchedOrder(result);
        setSearchError('');
      } else {
        setSearchError(`No active order found with ID "${urlOrderId}". Please check your order reference.`);
      }
    }
  }, [urlOrderId, orders]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchError('Please enter your Order ID or Phone Number');
      return;
    }
    const result = trackOrder(searchQuery.trim());
    if (result) {
      setSearchedOrder(result);
      setSearchError('');
    } else {
      setSearchedOrder(null);
      setSearchError(`No active order found matching "${searchQuery.trim()}". Please verify your Order ID.`);
    }
  };

  const trackingSteps = ORDER_STAGES;

  return (
    <div className="py-8 sm:py-12 bg-[#FAF8F5] min-h-[85vh]">
      <div className="max-w-md md:max-w-3xl lg:max-w-4xl mx-auto px-4 space-y-8">
        
        {/* Top Section Header */}
        <div className="text-center">
          <div className="inline-flex p-3 rounded-full bg-[#F3ECE3] border border-[#DFCFC0] text-brand-700 mb-3 shadow-xs">
            <Package className="w-8 h-8 stroke-[1.6]" />
          </div>
          <span className="text-[10px] tracking-[0.25em] font-semibold text-brand-600 uppercase block mb-1">
            Order Services
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
                placeholder="Enter your Order ID (e.g. KW-123456) or Phone number..."
                className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#DAC8B8] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-600"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#1E1A17] hover:bg-[#342C27] text-white rounded-xl text-xs uppercase tracking-wider font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              Track Order
            </button>
          </form>

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
            <div className={`p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              searchedOrder.decision === 'rejected'
                ? 'bg-gradient-to-r from-[#4A1515] to-[#2B0E0E] text-white'
                : 'bg-gradient-to-r from-[#241F1C] to-[#3B322B] text-white'
            }`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase tracking-widest text-[#D9B58B] font-mono">
                    Order #{searchedOrder.id}
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-xs text-neutral-300 font-light">
                    Placed on {searchedOrder.date} {searchedOrder.time ? `at ${searchedOrder.time}` : ''}
                  </span>
                </div>
                <h2 className="font-serif text-lg sm:text-xl font-medium text-white flex items-center gap-2">
                  {searchedOrder.decision === 'rejected' ? (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <span>Order Cancelled / Rejected</span>
                    </>
                  ) : (
                    <>
                      <Truck className="w-5 h-5 text-[#D9B58B]" />
                      <span>{searchedOrder.statusTitle}</span>
                    </>
                  )}
                </h2>
                <p className="text-xs text-neutral-300 mt-1 font-light max-w-md">
                  {searchedOrder.decision === 'rejected'
                    ? 'This order could not be fulfilled by the studio. Please reach out to our stylist on WhatsApp for any assistance.'
                    : searchedOrder.statusDescription}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-3 rounded-xl text-left sm:text-right shrink-0">
                <span className="text-[10px] text-[#D9B58B] uppercase tracking-wider block">Estimated Delivery</span>
                <span className="font-serif text-sm font-semibold text-white">
                  {searchedOrder.decision === 'rejected' ? 'Cancelled' : searchedOrder.estimatedDelivery}
                </span>
                <span className="text-[10px] text-neutral-300 block font-mono mt-0.5">{searchedOrder.courierName}</span>
              </div>
            </div>

            {/* Stepper Timeline (4 Stages) - Shown if not rejected */}
            {searchedOrder.decision !== 'rejected' && (
              <div className="px-5 sm:px-8 pt-2 pb-4">
                <div className="relative">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
                    {trackingSteps.map((stepItem) => {
                      const isCompleted = searchedOrder.currentStep > stepItem.step;
                      const isCurrent = searchedOrder.currentStep === stepItem.step;

                      return (
                        <div key={stepItem.step} className="flex flex-col items-center text-center p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE0D4] relative">
                          {/* Step Circle */}
                          <div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold mb-2 transition-all ${
                              isCompleted 
                                ? 'bg-emerald-600 text-white shadow-xs' 
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
                          <div>
                            <p className={`text-xs font-medium ${
                              isCurrent ? 'text-brand-900 font-bold' : isCompleted ? 'text-neutral-800' : 'text-neutral-400'
                            }`}>
                              {stepItem.label}
                            </p>
                            <p className="text-[10px] text-neutral-500 font-light mt-0.5">
                              {stepItem.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Customer & Shipping Summary */}
            <div className="px-5 sm:px-8 py-4 border-t border-[#EAE0D4] bg-[#FAF8F5]/50 flex flex-col sm:flex-row justify-between gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold block">Customer Details</span>
                <p className="font-medium text-neutral-800">{searchedOrder.customerName}</p>
                <p className="text-neutral-600">{searchedOrder.phone}</p>
              </div>
              <div className="space-y-1 sm:text-right max-w-xs">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold block">Delivery Location</span>
                <p className="text-neutral-700">{searchedOrder.shippingAddress || 'Studio pickup / To be verified'}</p>
              </div>
            </div>

            {/* Ordered Items Breakdown */}
            {searchedOrder.items && searchedOrder.items.length > 0 && (
              <div className="px-5 sm:px-8 pb-6 space-y-3">
                <h3 className="font-serif text-sm font-semibold text-neutral-900 border-b border-[#EAE0D4] pb-2">
                  Ordered Ensemble ({searchedOrder.items.length} {searchedOrder.items.length === 1 ? 'item' : 'items'})
                </h3>
                <div className="divide-y divide-[#EAE0D4]">
                  {searchedOrder.items.map((item, idx) => {
                    const itemImage = item.product?.images?.[0] || item.product?.imageUrl;
                    return (
                      <div key={idx} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-14 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-[#DECBB8]">
                            {itemImage ? (
                              <img 
                                src={itemImage} 
                                alt={item.product?.title || 'Product'} 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <FashionPlaceholder 
                                category="kurta" 
                                className="w-full h-full" 
                                iconClassName="w-5 h-5 text-neutral-300" 
                              />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-neutral-900 line-clamp-1">{item.product?.title}</p>
                            <p className="text-[11px] text-neutral-500">
                              Size: <span className="font-semibold text-neutral-700">{item.size}</span> • Qty: <span className="font-semibold text-neutral-700">{item.quantity}</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold text-neutral-900">
                            ₹{((item.product?.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-[#DECBB8] flex justify-between items-center text-sm font-semibold text-neutral-900">
                  <span>Total Amount</span>
                  <span className="text-brand-900 font-serif text-base">₹{(searchedOrder.total || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
