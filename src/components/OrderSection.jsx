import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
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
  MessageCircle,
  Loader2,
  PackageCheck,
  Sparkles,
  Heart,
  ShoppingBag,
  RotateCcw
} from 'lucide-react';
import { useStore, ORDER_STAGES } from '../context/StoreContext';
import { FashionPlaceholder } from './Placeholders';

export const OrderSection = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { orders, trackOrder, storeConfig } = useStore();

  const urlOrderId = searchParams.get('id') || '';

  // Clean real search state - no fake demo pre-population
  const [searchQuery, setSearchQuery] = useState(urlOrderId);
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const rawPhone = storeConfig?.whatsappNumber || '8511556155';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
  const whatsappPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  // Auto-search if navigated with ?id=... from checkout
  useEffect(() => {
    if (urlOrderId) {
      setSearchQuery(urlOrderId);
      (async () => {
        setIsSearching(true);
        setSearchError('');
        try {
          const result = await trackOrder(urlOrderId);
          if (result) {
            setSearchedOrder(result);
            setSearchError('');
          } else {
            setSearchError(`No active order found with ID "${urlOrderId}". Please check your order reference.`);
          }
        } catch {
          setSearchError(`Unable to fetch tracking for "${urlOrderId}".`);
        } finally {
          setIsSearching(false);
        }
      })();
    }
  }, [urlOrderId]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      setSearchError('Please enter your Order ID or Phone Number');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    try {
      const result = await trackOrder(query);
      if (result) {
        setSearchedOrder(result);
        setSearchError('');
      } else {
        setSearchedOrder(null);
        setSearchError(`No active order found matching "${query}". Please verify your Order ID or Phone Number.`);
      }
    } catch {
      setSearchedOrder(null);
      setSearchError(`Error connecting to server. Please try again.`);
    } finally {
      setIsSearching(false);
    }
  };

  const trackingSteps = ORDER_STAGES;

  const isDelivered = Boolean(
    searchedOrder &&
    searchedOrder.decision !== 'rejected' &&
    (
      Number(searchedOrder.currentStep) >= 4 ||
      Number(searchedOrder.stage) >= 4 ||
      searchedOrder.status === 'delivered' ||
      (searchedOrder.statusTitle || '').toLowerCase().includes('delivered')
    )
  );

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
              disabled={isSearching}
              className="px-6 py-3 bg-[#11A0AB] hover:bg-[#0E848D] disabled:bg-neutral-400 text-white rounded-full text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 min-w-[120px]"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <span>Track Order</span>
              )}
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
          <div className="bg-white rounded-3xl border border-[#E0D2C2] overflow-hidden shadow-xl animate-fadeIn space-y-6">
            
            {/* DELIVERED CELEBRATION HERO BANNER */}
            {isDelivered ? (
              <div className="relative overflow-hidden bg-gradient-to-br from-[#064E3B] via-[#0E5C4D] to-[#11A0AB] text-white p-6 sm:p-8">
                {/* Radiant luxury background effects */}
                <div className="absolute -top-12 -right-12 w-56 h-56 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-[#FD9AA7]/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="flex items-start gap-4">
                    {/* Glowing Delivered Icon Badge */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-emerald-300 shadow-lg shrink-0">
                      <PackageCheck className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.2]" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-xs uppercase tracking-widest text-emerald-200 font-mono font-semibold">
                          Order #{searchedOrder.id}
                        </span>
                        <span className="text-white/40">•</span>
                        <span className="inline-flex items-center gap-1.5 text-[11px] bg-emerald-400/25 text-white px-3 py-0.5 rounded-full font-medium border border-emerald-300/30 shadow-xs">
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Package Delivered Successfully</span>
                        </span>
                      </div>

                      <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-medium text-white tracking-tight">
                        Delivered to Your Doorstep!
                      </h2>

                      <p className="text-xs sm:text-sm text-emerald-50/90 font-light mt-1.5 max-w-lg leading-relaxed">
                        Your handcrafted Kundan Works pieces have arrived safely. We hope you cherish every thread of your new ensemble!
                      </p>
                    </div>
                  </div>

                  {/* Delivery Status Pill */}
                  <div className="bg-white/15 backdrop-blur-md border border-white/25 p-4 rounded-2xl text-left sm:text-right shrink-0 shadow-xs">
                    <span className="text-[10px] text-emerald-200 uppercase tracking-wider font-semibold block">
                      Fulfillment Status
                    </span>
                    <div className="flex items-center sm:justify-end gap-1.5 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300 stroke-[2.5]" />
                      <span className="font-serif text-sm sm:text-base font-bold text-white">
                        Delivered
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-200/80 block font-mono mt-0.5">
                      {searchedOrder.courierName || 'Boutique Express Logistics'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Standard / In-Transit / Rejected Banner */
              <div className={`p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                searchedOrder.decision === 'rejected'
                  ? 'bg-gradient-to-r from-[#4A1515] to-[#2B0E0E] text-white'
                  : 'bg-gradient-to-r from-[#1C1E21] to-[#2E333D] text-white'
              }`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs uppercase tracking-widest text-[#11A0AB] font-mono font-semibold">
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
                        <Truck className="w-5 h-5 text-[#11A0AB]" />
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
                  <span className="text-[10px] text-[#11A0AB] uppercase tracking-wider block font-semibold">Estimated Delivery</span>
                  <span className="font-serif text-sm font-semibold text-white">
                    {searchedOrder.decision === 'rejected' ? 'Cancelled' : searchedOrder.estimatedDelivery}
                  </span>
                  <span className="text-[10px] text-neutral-300 block font-mono mt-0.5">{searchedOrder.courierName}</span>
                </div>
              </div>
            )}

            {/* VIP Customer Concierge & Styling Assistance Card (Shown on Delivered) */}
            {isDelivered && (
              <div className="mx-5 sm:mx-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#F0FDF4] via-[#F8FAFC] to-[#FFF1F2] border border-[#A7F3D0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 text-center sm:text-left">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 border border-emerald-200">
                    <Heart className="w-5 h-5 fill-emerald-600 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#1C1E21]">
                      Thank You for Choosing Kundan Works!
                    </h4>
                    <p className="text-[11px] text-neutral-600 mt-0.5">
                      Need alterations, custom styling advice, or want to share a look photo with us?
                    </p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    `Hello Kundan Works! I received my order #${searchedOrder.id} and would love to share feedback / get styling assistance.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-95 whitespace-nowrap cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            )}

            {/* Stepper Timeline (4 Stages) - Shown if not rejected */}
            {searchedOrder.decision !== 'rejected' && (
              <div className="px-5 sm:px-8 pt-1 pb-2">
                <div className="relative">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 relative">
                    {trackingSteps.map((stepItem) => {
                      const isDeliveredState = isDelivered;
                      const isCompleted = isDeliveredState || searchedOrder.currentStep > stepItem.step;
                      const isCurrent = !isDeliveredState && searchedOrder.currentStep === stepItem.step;
                      const isFinalDeliveredStep = stepItem.step === 4;

                      return (
                        <div 
                          key={stepItem.step} 
                          className={`flex flex-col items-center text-center p-3.5 rounded-2xl transition-all relative ${
                            isDeliveredState
                              ? 'bg-[#F0FDF4] border border-[#BBF7D0]'
                              : isCurrent 
                                ? 'bg-[#F0FDFA] border border-[#99F6E4] shadow-xs' 
                                : isCompleted 
                                  ? 'bg-[#FAF8F5] border border-[#EAE0D4]' 
                                  : 'bg-white border border-[#E2E8F0]'
                          }`}
                        >
                          {/* Step Circle */}
                          <div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold mb-2 transition-all ${
                              isDeliveredState || isCompleted
                                ? 'bg-emerald-600 text-white shadow-xs' 
                                : isCurrent 
                                  ? 'bg-[#11A0AB] text-white ring-4 ring-[#11A0AB]/20 shadow-md scale-105' 
                                  : 'bg-neutral-100 text-neutral-400 border border-neutral-300'
                            }`}
                          >
                            {(isDeliveredState || isCompleted) ? (
                              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                            ) : (
                              <span>{stepItem.step}</span>
                            )}
                          </div>

                          {/* Labels */}
                          <div>
                            <div className="flex items-center justify-center gap-1">
                              <p className={`text-xs font-semibold ${
                                isDeliveredState
                                  ? 'text-emerald-900'
                                  : isCurrent 
                                    ? 'text-[#0E848D]' 
                                    : isCompleted 
                                      ? 'text-neutral-800' 
                                      : 'text-neutral-400'
                              }`}>
                                {stepItem.label}
                              </p>
                              {isDeliveredState && isFinalDeliveredStep && (
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              )}
                            </div>
                            <p className="text-[10px] text-neutral-500 font-light mt-0.5 leading-tight">
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
            <div className={`px-5 sm:px-8 py-4 border-t border-[#EAE0D4] flex flex-col sm:flex-row justify-between gap-4 text-xs ${
              isDelivered ? 'bg-emerald-50/40' : 'bg-[#FAF8F5]/50'
            }`}>
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold block">Customer Details</span>
                <p className="font-semibold text-neutral-900">{searchedOrder.customerName}</p>
                <p className="text-neutral-600">{searchedOrder.phone}</p>
              </div>
              <div className="space-y-1 sm:text-right max-w-xs">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold block">
                  {isDelivered ? 'Delivered Destination' : 'Delivery Destination'}
                </span>
                <p className="text-neutral-700 font-medium">{searchedOrder.shippingAddress || 'Studio pickup / Verified address'}</p>
              </div>
            </div>

            {/* Ordered Items Breakdown */}
            {searchedOrder.items && searchedOrder.items.length > 0 && (
              <div className="px-5 sm:px-8 pb-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#EAE0D4] pb-2">
                  <h3 className="font-serif text-sm font-semibold text-neutral-900">
                    {isDelivered ? 'Delivered Items' : 'Ordered Ensemble'} ({searchedOrder.items.length} {searchedOrder.items.length === 1 ? 'item' : 'items'})
                  </h3>
                  {isDelivered && (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Fulfilled</span>
                    </span>
                  )}
                </div>

                <div className="divide-y divide-[#EAE0D4]">
                  {searchedOrder.items.map((item, idx) => {
                    const itemImage = item.product?.images?.[0] || item.product?.imageUrl;
                    return (
                      <div key={idx} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-14 rounded-xl bg-neutral-100 overflow-hidden shrink-0 border border-[#DECBB8]">
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
                            <p className="text-xs font-semibold text-neutral-900 line-clamp-1">{item.product?.title}</p>
                            <p className="text-[11px] text-neutral-500">
                              Qty: <span className="font-semibold text-neutral-700">{item.quantity}</span>
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

                {/* Action Buttons for Delivered Order */}
                {isDelivered && (
                  <div className="pt-4 flex flex-col sm:flex-row items-center gap-2.5">
                    <button
                      onClick={() => {
                        navigate('/');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full sm:flex-1 py-3 bg-[#11A0AB] hover:bg-[#0E848D] text-white rounded-full text-xs font-semibold shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Browse New Boutique Arrivals</span>
                    </button>
                    <button
                      onClick={() => {
                        setSearchedOrder(null);
                        setSearchQuery('');
                      }}
                      className="w-full sm:w-auto px-5 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full text-xs font-medium transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Track Another Order</span>
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
