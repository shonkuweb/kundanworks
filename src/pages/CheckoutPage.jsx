import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Trash2,
  Truck,
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
  QrCode,
  Lock,
  Copy,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Phone
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FashionPlaceholder } from '../components/Placeholders';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    cartSubtotal, 
    updateCartQuantity, 
    removeFromCart, 
    createOrder,
    clearCart, 
    showToast,
    storeConfig
  } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Barnala',
    pincode: '148101',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cod'
  const [upiOption, setUpiOption] = useState('qr'); // 'qr' | 'gpay' | 'phonepe' | 'paytm' | 'upi_id'
  const [upiIdInput, setUpiIdInput] = useState('');
  
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const [selectedBank, setSelectedBank] = useState('sbi');

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  const boutiquePhone = storeConfig?.whatsappNumber || '+91 98557 86123';
  const cleanPhone = boutiquePhone.replace(/[^0-9]/g, '');
  const waTarget = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, '').slice(0, 16);
    // Format as 4 groups of 4
    val = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardData(prev => ({ ...prev, number: val }));
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    if (val.length > 2) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardData(prev => ({ ...prev, expiry: val }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!formData.phone.trim()) {
      showToast('Please enter your contact phone number', 'error');
      return;
    }
    if (!formData.address.trim()) {
      showToast('Please enter your street / delivery address', 'error');
      return;
    }
    if (cart.length === 0) {
      showToast('Your shopping bag is empty', 'error');
      return;
    }

    // Begin Simulated Payment Flow
    setIsProcessing(true);
    setProcessingStatus('Connecting securely to 256-bit payment gateway...');

    const combinedLocation = `${formData.address.trim()}, ${formData.city.trim()} - ${formData.pincode.trim()}`;
    const newOrderId = `RS-${Math.floor(100000 + Math.random() * 900000)}`;
    const txnId = `TXN_${Date.now().toString(36).toUpperCase()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // Payment simulation stages
    setTimeout(() => {
      if (paymentMethod === 'cod') {
        setProcessingStatus('Verifying Cash on Delivery booking...');
      } else if (paymentMethod === 'upi') {
        setProcessingStatus('Authorizing UPI payment request via banking node...');
      } else if (paymentMethod === 'card') {
        setProcessingStatus('Verifying card token and 3D Secure simulation...');
      } else {
        setProcessingStatus('Connecting to selected bank gateway...');
      }
    }, 700);

    setTimeout(() => {
      setProcessingStatus('Payment authorized! Generating official order receipt...');
    }, 1400);

    setTimeout(async () => {
      const orderPayload = {
        id: newOrderId,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        location: combinedLocation,
        items: [...cart],
        subtotal: cartSubtotal,
        total: cartSubtotal,
        totalPrice: cartSubtotal,
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : (
          paymentMethod === 'upi' ? `UPI (${upiOption.toUpperCase()})` : (
            paymentMethod === 'card' ? 'Credit / Debit Card' : `Net Banking (${selectedBank.toUpperCase()})`
          )
        ),
        paymentStatus: paymentMethod === 'cod' ? 'Pending (COD on Delivery)' : 'Paid (Dummy Payment Gateway)',
        transactionId: txnId,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };

      const created = await createOrder(orderPayload);
      clearCart();
      setIsProcessing(false);
      setCompletedOrder(created || orderPayload);
      setOrderCompleted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  const copyOrderId = () => {
    if (!completedOrder?.id) return;
    navigator.clipboard.writeText(completedOrder.id);
    setCopiedId(true);
    showToast('Order ID copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(false), 2500);
  };

  // ==========================================
  // VIEW: ORDER CONFIRMATION / RECEIPT SCREEN
  // ==========================================
  if (orderCompleted && completedOrder) {
    return (
      <div className="bg-[#FAF8F5] min-h-[90vh] py-8 sm:py-12 animate-fadeIn">
        <div className="max-w-2xl mx-auto px-4">
          
          <div className="bg-white rounded-3xl border border-[#DECBB8] p-6 sm:p-9 shadow-xl relative overflow-hidden">
            {/* Top Accent Ribbon */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#9B1B30] via-[#C5A059] to-[#831427]" />

            {/* Success Icon & Heading */}
            <div className="text-center space-y-3 pt-2">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-60" />
                <div className="relative w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
              </div>

              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-1.5">
                  {completedOrder.paymentMethod.includes('COD') ? 'Order Confirmed' : 'Payment Successful'}
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl text-[#1E1A17] font-medium tracking-tight">
                  Thank You for Your Order!
                </h1>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto mt-1 font-light">
                  Your order has been recorded in the <strong>Radha Sang</strong> boutique system. Our Barnala studio is preparing your pieces.
                </p>
              </div>
            </div>

            {/* Order Reference Box */}
            <div className="mt-6 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE0D4] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold block">
                  Order Tracking Reference
                </span>
                <span className="font-mono text-xl font-bold text-[#9B1B30] tracking-wide">
                  #{completedOrder.id}
                </span>
              </div>
              <button
                type="button"
                onClick={copyOrderId}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full bg-white border border-[#D8C7B5] hover:bg-[#F2EAE0] text-[#3E3834] transition-colors cursor-pointer"
              >
                {copiedId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>

            {/* Transaction & Payment Metadata */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE0D4]">
                <span className="text-[10px] text-neutral-500 block uppercase font-medium">Payment Mode</span>
                <span className="font-semibold text-[#25201C] mt-0.5 block truncate">
                  {completedOrder.paymentMethod}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE0D4]">
                <span className="text-[10px] text-neutral-500 block uppercase font-medium">Payment Status</span>
                <span className="font-semibold text-emerald-700 mt-0.5 block truncate">
                  {completedOrder.paymentStatus.includes('Paid') ? '✓ Paid' : 'Pending COD'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE0D4] col-span-2 sm:col-span-1">
                <span className="text-[10px] text-neutral-500 block uppercase font-medium">Transaction Ref</span>
                <span className="font-mono text-[11px] font-semibold text-[#5A4A3E] mt-0.5 block truncate">
                  {completedOrder.transactionId}
                </span>
              </div>
            </div>

            {/* Shipping Address Details */}
            <div className="mt-5 p-4 rounded-xl border border-[#EAE0D4] text-xs space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold block">
                Delivery Address & Contact
              </span>
              <p className="font-bold text-[#1E1A17]">{completedOrder.customerName || completedOrder.name}</p>
              <p className="text-neutral-600">{completedOrder.phone || completedOrder.customerPhone}</p>
              <p className="text-neutral-600">{completedOrder.customerLocation || completedOrder.location}</p>
            </div>

            {/* Ordered Items Preview */}
            <div className="mt-5 space-y-2.5">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold block">
                Ordered Pieces ({completedOrder.items?.length || 0})
              </span>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {(completedOrder.items || []).map((item, idx) => {
                  const product = item?.product || item || {};
                  const title = product.title || product.name || 'Boutique Apparel';
                  const price = Number(product.price) || 0;
                  const qty = Number(item.quantity) || 1;
                  const imageUrl = (Array.isArray(product.images) && product.images[0]) || product.imageUrl;

                  return (
                    <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#F0E6DC]">
                      <div className="w-12 h-14 rounded-lg bg-[#EFE9E2] overflow-hidden shrink-0 border border-[#DECBB8]">
                        <FashionPlaceholder
                          type={product.placeholderKey || 'kurta'}
                          imageUrl={imageUrl}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-xs font-semibold text-[#1E1A17] truncate">{title}</h4>
                        <p className="text-[11px] text-neutral-500">Qty: {qty} • ₹{price.toLocaleString('en-IN')} each</p>
                      </div>
                      <span className="font-serif text-xs font-bold text-[#1E1A17]">
                        ₹{(price * qty).toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Paid Summary */}
            <div className="mt-5 p-4 rounded-xl bg-[#F7F2EC] border border-[#E5DACD] flex items-center justify-between text-xs">
              <div>
                <span className="text-neutral-600 block">Total Amount</span>
                <span className="text-[10px] text-neutral-500">Delivery: Decided by the Admin</span>
              </div>
              <span className="font-serif text-xl font-bold text-[#1E1A17]">
                ₹{(completedOrder.total || completedOrder.totalPrice || 0).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-2.5">
              <button
                type="button"
                onClick={() => navigate(`/order?id=${completedOrder.id}`)}
                className="w-full py-3.5 bg-[#9B1B30] hover:bg-[#831427] active:scale-98 text-white rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Track Order Live (4 Stages)</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full py-3 bg-white hover:bg-neutral-50 text-neutral-800 border border-[#D8C7B5] rounded-full text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>

            {/* Barnala Studio Concierge Note */}
            <div className="mt-6 pt-5 border-t border-[#EAE0D4] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <p className="text-xs font-semibold text-[#25201C]">
                  Radha Sang Barnala Studio
                </p>
                <p className="text-[11px] text-neutral-500">
                  Near bansi purri ala, Barnala • Call / WhatsApp: <strong>{boutiquePhone}</strong>
                </p>
              </div>

              <a
                href={`https://wa.me/${waTarget}?text=${encodeURIComponent(
                  `Hello Radha Sang! I just placed order #${completedOrder.id} and would love to confirm details.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#25D366]/10 text-emerald-800 text-xs font-semibold hover:bg-[#25D366]/20 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Message Boutique</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: CHECKOUT FORM WITH DUMMY GATEWAY
  // ==========================================
  return (
    <div className="bg-[#FAF8F5] min-h-[85vh] py-6 sm:py-10 animate-fadeIn">
      
      {/* SIMULATED PAYMENT PROCESSING OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#DECBB8] p-8 max-w-sm w-full text-center space-y-5 shadow-2xl animate-scaleIn">
            <div className="w-16 h-16 bg-[#9B1B30]/10 text-[#9B1B30] rounded-full flex items-center justify-center mx-auto relative">
              <span className="absolute inset-0 rounded-full border-4 border-[#9B1B30] border-t-transparent animate-spin" />
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#9B1B30] bg-[#FDF2F4] px-2.5 py-1 rounded-full border border-[#F9CCD4]">
                256-Bit SSL Secured Sandbox
              </span>
              <h3 className="font-serif text-xl font-medium text-[#1E1A17] mt-3">
                Processing Payment
              </h3>
              <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed font-light">
                {processingStatus}
              </p>
            </div>

            <div className="w-full bg-[#F2ECE4] h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#9B1B30] via-[#C5A059] to-[#831427] h-full w-full animate-pulse" />
            </div>

            <div className="text-[11px] text-neutral-400 font-mono">
              Amount: ₹{cartSubtotal.toLocaleString('en-IN')} • Safe Sandbox Test
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md md:max-w-4xl lg:max-w-5xl mx-auto px-4">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
          <Link to="/" className="hover:text-brand-900 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
          <span>/</span>
          <span className="text-[#241F1C] font-medium font-serif italic">Secure Checkout</span>
        </div>

        {/* Page Title */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE0D4] mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-semibold text-[#866D5B] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Radha Sang • Barnala</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1E1A17] font-normal tracking-tight">
              Order & Payment Checkout
            </h1>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs text-neutral-500 block">Boutique Desk</span>
            <p className="font-mono text-xs font-semibold text-[#9B1B30]">{boutiquePhone}</p>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-[#DAC8B8] p-6 space-y-4">
            <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
            <div>
              <p className="font-serif text-lg text-[#3E3834] mb-1">Your bag is currently empty</p>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Select your favorite piece from our catalog to proceed with checkout.
              </p>
            </div>
            <Link
              to="/"
              className="inline-block px-7 py-3 bg-[#9B1B30] hover:bg-[#831427] text-white rounded-full text-xs uppercase tracking-wider font-semibold shadow-sm transition-all"
            >
              Explore Boutique Collection
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePaymentSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Customer Info + Payment Methods */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* SECTION 1: Customer Details */}
              <div className="bg-white rounded-2xl border border-[#EAE0D4] p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F2EAE1]">
                  <h2 className="font-serif text-lg font-medium text-[#221B16] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#9B1B30] text-white text-xs flex items-center justify-center font-bold">1</span>
                    <span>Delivery Address & Contact</span>
                  </h2>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Full Name */}
                  <div>
                    <label className="block text-neutral-700 font-medium mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Radhika Sharma"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-[#FAF8F5] border border-[#DECBB8] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#9B1B30]"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-neutral-700 font-medium mb-1.5">
                      Contact Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. 9855786123"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-[#FAF8F5] border border-[#DECBB8] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#9B1B30]"
                    />
                    <p className="text-[10px] text-neutral-400 mt-1">
                      Our boutique studio will send order status and live tracking link to this number.
                    </p>
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="block text-neutral-700 font-medium mb-1.5">
                      Street Address / House No / Landmark *
                    </label>
                    <textarea
                      name="address"
                      required
                      rows={2}
                      placeholder="Flat, House no., Building, Street, Landmark"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-[#FAF8F5] border border-[#DECBB8] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#9B1B30]"
                    />
                  </div>

                  {/* City & Pincode Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-700 font-medium mb-1.5">
                        City / Town *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        placeholder="e.g. Barnala"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-[#FAF8F5] border border-[#DECBB8] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#9B1B30]"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 font-medium mb-1.5">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        required
                        placeholder="e.g. 148101"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-[#FAF8F5] border border-[#DECBB8] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#9B1B30]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Payment Gateway Flow */}
              <div className="bg-white rounded-2xl border border-[#EAE0D4] p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F2EAE1]">
                  <h2 className="font-serif text-lg font-medium text-[#221B16] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#9B1B30] text-white text-xs flex items-center justify-center font-bold">2</span>
                    <span>Select Payment Method (Sandbox Gateway)</span>
                  </h2>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    🔒 100% Risk Free Demo
                  </span>
                </div>

                {/* Payment Method Selector Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-[#9B1B30] bg-[#FDF2F4] text-[#831427] shadow-xs ring-1 ring-[#9B1B30]'
                        : 'border-[#EAE0D4] bg-[#FAF8F5] text-neutral-600 hover:bg-[#F2ECE4]'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-[#9B1B30]" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-[#9B1B30] bg-[#FDF2F4] text-[#831427] shadow-xs ring-1 ring-[#9B1B30]'
                        : 'border-[#EAE0D4] bg-[#FAF8F5] text-neutral-600 hover:bg-[#F2ECE4]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#9B1B30]" />
                    <span>Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'netbanking'
                        ? 'border-[#9B1B30] bg-[#FDF2F4] text-[#831427] shadow-xs ring-1 ring-[#9B1B30]'
                        : 'border-[#EAE0D4] bg-[#FAF8F5] text-neutral-600 hover:bg-[#F2ECE4]'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-[#9B1B30]" />
                    <span>Net Banking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-[#9B1B30] bg-[#FDF2F4] text-[#831427] shadow-xs ring-1 ring-[#9B1B30]'
                        : 'border-[#EAE0D4] bg-[#FAF8F5] text-neutral-600 hover:bg-[#F2ECE4]'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-[#9B1B30]" />
                    <span>Cash on Delivery</span>
                  </button>
                </div>

                {/* TAB 1: UPI PAYMENT FLOW */}
                {paymentMethod === 'upi' && (
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE0D4] space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1E1A17]">
                        Choose UPI App or Scan QR
                      </span>
                      <span className="text-[11px] text-[#9B1B30] font-mono font-medium">
                        UPI Autopay Ready
                      </span>
                    </div>

                    {/* QR Code Simulator */}
                    <div className="p-4 bg-white rounded-xl border border-[#DECBB8] flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                      <div className="w-28 h-28 bg-[#FAF8F5] border border-neutral-300 rounded-xl p-2 flex flex-col items-center justify-center shrink-0 shadow-inner">
                        {/* Simulated QR Code Graphic */}
                        <div className="w-full h-full border-2 border-dashed border-[#9B1B30] rounded-lg flex flex-col items-center justify-center bg-white p-1">
                          <QrCode className="w-12 h-12 text-[#9B1B30]" />
                          <span className="text-[8px] font-mono text-neutral-400 mt-0.5">SCAN & PAY</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-serif text-sm font-semibold text-[#1E1A17]">
                          Scan QR with any UPI App
                        </h4>
                        <p className="text-[11px] text-neutral-500 leading-relaxed">
                          Google Pay, PhonePe, Paytm, or BHIM. Tapping <strong>"Complete Payment"</strong> below will simulate an instant verified response.
                        </p>
                        <div className="pt-1 flex flex-wrap gap-1.5">
                          {['GPay', 'PhonePe', 'Paytm', 'BHIM UPI'].map(app => (
                            <span key={app} className="text-[10px] font-medium bg-[#FDF2F4] text-[#831427] px-2 py-0.5 rounded-md border border-[#F9CCD4]">
                              ✓ {app}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Or Enter UPI ID */}
                    <div className="text-xs space-y-1.5">
                      <label className="block text-neutral-700 font-medium">
                        Or Enter UPI ID (Virtual Payment Address)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. mobile@upi or name@okhdfcbank"
                          value={upiIdInput}
                          onChange={(e) => setUpiIdInput(e.target.value)}
                          className="flex-1 p-2.5 bg-white border border-[#DECBB8] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#9B1B30]"
                        />
                        <button
                          type="button"
                          onClick={() => setUpiIdInput('radhasang.customer@upi')}
                          className="px-3 py-2 bg-white border border-[#D8C7B5] hover:bg-[#F2EAE0] text-[11px] font-medium text-neutral-700 rounded-xl transition-colors cursor-pointer"
                        >
                          Auto-fill
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: CREDIT / DEBIT CARDS */}
                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE0D4] space-y-3 animate-fadeIn text-xs">
                    <div className="flex items-center justify-between text-neutral-500 text-[11px]">
                      <span>Enter any dummy test card details</span>
                      <span>Visa • Mastercard • RuPay</span>
                    </div>

                    <div>
                      <label className="block text-neutral-700 font-medium mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="4532 0123 4567 8910"
                          value={cardData.number}
                          onChange={handleCardNumberChange}
                          className="w-full p-2.5 bg-white border border-[#DECBB8] rounded-xl text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#9B1B30]"
                        />
                        <CreditCard className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-700 font-medium mb-1">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          placeholder="12/28"
                          value={cardData.expiry}
                          onChange={handleExpiryChange}
                          className="w-full p-2.5 bg-white border border-[#DECBB8] rounded-xl text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#9B1B30]"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-700 font-medium mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="•••"
                          value={cardData.cvv}
                          onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value.replace(/[^0-9]/g, '') }))}
                          className="w-full p-2.5 bg-white border border-[#DECBB8] rounded-xl text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#9B1B30]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-700 font-medium mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="Name on card"
                        value={cardData.name}
                        onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-2.5 bg-white border border-[#DECBB8] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#9B1B30]"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 3: NET BANKING */}
                {paymentMethod === 'netbanking' && (
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE0D4] space-y-3 animate-fadeIn text-xs">
                    <span className="text-neutral-600 font-medium block">
                      Select Your Preferred Bank
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'sbi', name: 'State Bank of India' },
                        { id: 'hdfc', name: 'HDFC Bank' },
                        { id: 'icici', name: 'ICICI Bank' },
                        { id: 'axis', name: 'Axis Bank' },
                        { id: 'pnb', name: 'Punjab National Bank' },
                        { id: 'kotak', name: 'Kotak Mahindra' }
                      ].map(b => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setSelectedBank(b.id)}
                          className={`p-2.5 rounded-lg border text-[11px] font-medium text-left transition-all cursor-pointer ${
                            selectedBank === b.id
                              ? 'border-[#9B1B30] bg-[#FDF2F4] text-[#831427] font-semibold'
                              : 'border-[#DECBB8] bg-white text-neutral-700 hover:bg-[#FAF8F5]'
                          }`}
                        >
                          {b.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: CASH ON DELIVERY */}
                {paymentMethod === 'cod' && (
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE0D4] space-y-2 animate-fadeIn text-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Cash on Delivery Available</span>
                    </div>
                    <p className="text-neutral-600 leading-relaxed font-light">
                      Pay easily in cash or UPI QR directly to the courier executive when your package reaches your doorstep in <strong>{formData.city || 'Barnala'}</strong>.
                    </p>
                  </div>
                )}

              </div>

              {/* Trust & Guarantee Banner */}
              <div className="bg-[#FAF4EC] rounded-xl border border-[#E8D9C8] p-4 flex items-center gap-3 text-xs text-[#6A5342]">
                <ShieldCheck className="w-5 h-5 text-[#9B1B30] shrink-0" />
                <div>
                  <span className="font-semibold block">Radha Sang Boutique Guarantee</span>
                  <span className="text-[11px] text-neutral-500">
                    Handcrafted inspection in Barnala studio • Pan-India Express Delivery • 100% genuine fabric.
                  </span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Order Summary & Payment CTA */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white rounded-2xl border border-[#EAE0D4] p-5 sm:p-6 shadow-xs space-y-4 sticky top-24">
                
                <div className="flex items-center justify-between pb-3 border-b border-[#F2EAE1]">
                  <h2 className="font-serif text-lg font-medium text-[#221B16]">
                    Order Summary
                  </h2>
                  <span className="text-xs text-neutral-500 font-medium">
                    {cart.length} {cart.length === 1 ? 'piece' : 'pieces'}
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {cart.map((item, idx) => {
                    const product = item?.product || item || {};
                    const pid = product.id || item?.id || `checkout-item-${idx}`;
                    const title = product.title || product.name || 'Handcrafted Apparel';
                    const price = Number(product.price) || 0;
                    const quantity = Number(item?.quantity) || 1;
                    const itemTotal = price * quantity;
                    const imageUrl = (Array.isArray(product.images) && product.images[0]) || product.imageUrl;

                    return (
                      <div 
                        key={`${pid}-${idx}`}
                        className="flex gap-3 pb-3 border-b border-[#F7F2EC] last:border-b-0"
                      >
                        {/* Image Thumbnail */}
                        <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-[#F4ECE3] border border-[#E5DACD]">
                          <FashionPlaceholder 
                            type={product.placeholderKey || 'kurta'} 
                            imageUrl={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover" 
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className="font-serif text-xs font-semibold text-[#221B16] line-clamp-1">
                              {title}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-500">
                              <span>₹{price.toLocaleString('en-IN')} each</span>
                            </div>
                          </div>

                          {/* Quantity controls */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="inline-flex items-center bg-[#F6F0E8] rounded-md px-1.5 py-0.5 text-xs">
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(pid, -1)}
                                className="p-0.5 text-neutral-600 hover:text-black cursor-pointer"
                                title="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-5 text-center font-semibold text-[#25201C] select-none">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(pid, 1)}
                                className="p-0.5 text-neutral-600 hover:text-black cursor-pointer"
                                title="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-serif font-semibold text-xs text-[#1E1A17]">
                                ₹{itemTotal.toLocaleString('en-IN')}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFromCart(pid)}
                                className="text-neutral-400 hover:text-rose-600 p-0.5 cursor-pointer transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown */}
                <div className="pt-3 border-t border-[#EAE0D4] space-y-2 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-serif font-medium text-neutral-800">
                      ₹{cartSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-700">
                    <span>Delivery</span>
                    <span className="font-medium text-[#1E1A17]">Decided by the Admin</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-[#221B16] pt-2 border-t border-[#EAE0D4]">
                    <span>Total Amount</span>
                    <span className="font-serif text-lg font-bold text-[#9B1B30]">
                      ₹{cartSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Proceed to Payment Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 px-5 bg-[#9B1B30] hover:bg-[#831427] active:bg-[#6B0E1E] active:scale-98 text-white rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2.5 shadow-lg shadow-[#9B1B30]/25 transition-all cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>
                      {paymentMethod === 'cod' 
                        ? `Place COD Order (₹${cartSubtotal.toLocaleString('en-IN')})` 
                        : `Pay ₹${cartSubtotal.toLocaleString('en-IN')} Securely`}
                    </span>
                  </button>

                  <p className="text-[10px] text-center text-neutral-400 mt-2 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Dummy Payment Gateway Sandbox • No Real Card Charged</span>
                  </p>
                </div>

                {/* Studio Help Box */}
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE0D4] text-[11px] text-neutral-500 space-y-1">
                  <p className="font-semibold text-neutral-700">Need styling or order assistance?</p>
                  <p>WhatsApp our Barnala Studio: <strong className="text-neutral-900">{boutiquePhone}</strong></p>
                </div>

              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
