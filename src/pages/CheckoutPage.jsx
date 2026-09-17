import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  MessageSquare, 
  Plus, 
  Minus, 
  Trash2,
  Truck 
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
    showToast 
  } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [sentWhatsappUrl, setSentWhatsappUrl] = useState('');

  // Target admin WhatsApp number: 8511556155
  const ADMIN_WHATSAPP_NUMBER = '918511556155';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBuyViaWhatsApp = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!formData.phone.trim()) {
      showToast('Please enter your mobile / WhatsApp number', 'error');
      return;
    }
    if (!formData.location.trim()) {
      showToast('Please enter your delivery location / address', 'error');
      return;
    }
    if (cart.length === 0) {
      showToast('Your shopping bag is empty', 'error');
      return;
    }

    setIsSubmitting(true);

    // Generate real unique order ID
    const newOrderId = `KW-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create real order in store
    createOrder({
      id: newOrderId,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      location: formData.location.trim(),
      items: [...cart],
      subtotal: cartSubtotal,
      total: cartSubtotal
    });

    // Format individual items with direct link
    const origin = window.location.origin;
    const itemsListText = cart.map((item, idx) => {
      const product = item?.product || item || {};
      const pid = product.id || item?.id || idx;
      const title = product.title || product.name || 'Handcrafted Apparel';
      const price = Number(product.price) || 0;
      const quantity = Number(item?.quantity) || 1;
      const size = item?.size || 'Standard';
      const productLink = `${origin}/product/${pid}`;
      return `${idx + 1}. *${title}*\n   • Size: *${size}* | Qty: *${quantity}*\n   • Price: ₹${(price * quantity).toLocaleString('en-IN')} (₹${price} each)\n   • Product Link: ${productLink}`;
    }).join('\n\n');

    // Structured, clear message for the admin
    const whatsappMessage = 
`✨ *NEW ORDER - KUNDAN WORKS* ✨
━━━━━━━━━━━━━━━━━━━━
📦 *ORDER ID:* #${newOrderId}

👤 *CUSTOMER DETAILS:*
• *Name:* ${formData.name.trim()}
• *Mobile:* ${formData.phone.trim()}
• *Delivery Location:* ${formData.location.trim()}

🛍️ *ORDERED PIECES:*
${itemsListText}

━━━━━━━━━━━━━━━━━━━━
💰 *TOTAL AMOUNT:* ₹${cartSubtotal.toLocaleString('en-IN')}
🚚 *Delivery:* Complimentary Express Delivery
━━━━━━━━━━━━━━━━━━━━
_Hi Kundan Works, please confirm this order and share delivery / payment steps._`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodedMessage}`;

    setCreatedOrderId(newOrderId);
    setSentWhatsappUrl(whatsappUrl);
    setOrderSent(true);

    // Redirect to WhatsApp
    window.open(whatsappUrl, '_blank');
    clearCart();
  };

  // If order was placed
  if (orderSent) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#DECBB8] p-6 sm:p-8 text-center shadow-lg space-y-4 animate-fadeIn">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-700">
            <Check className="w-7 h-7 stroke-[2.5]" />
          </div>

          <h2 className="font-serif text-2xl text-[#221B16] font-medium">
            Order Sent to WhatsApp!
          </h2>

          <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE0D4]">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Your Live Tracking ID</span>
            <span className="font-mono text-base font-bold text-brand-900">#{createdOrderId}</span>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed">
            Your order details and selected product links have been prepared for <strong>Kundan Works</strong>. Please send the message on WhatsApp to complete your order with the boutique.
          </p>

          <div className="pt-2 space-y-2.5">
            <a
              href={sentWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open WhatsApp Again</span>
            </a>

            <button
              onClick={() => navigate(`/order?id=${createdOrderId}`)}
              className="w-full py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Truck className="w-4 h-4" />
              <span>Track Order Live</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs uppercase tracking-wider font-medium transition-colors"
            >
              Return to Boutique Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-[85vh] py-6 sm:py-10 animate-fadeIn">
      <div className="max-w-md md:max-w-4xl lg:max-w-5xl mx-auto px-4">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
          <Link to="/" className="hover:text-brand-900 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
          <span>/</span>
          <span className="text-[#241F1C] font-medium font-serif italic">Checkout</span>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-[#EAE0D4] mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-semibold text-[#866D5B] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-700" />
              <span>Direct Boutique Order</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1E1A17] font-normal tracking-tight">
              Order Checkout
            </h1>
          </div>

          <div className="text-right">
            <span className="text-xs text-neutral-500">Stylist WhatsApp</span>
            <p className="font-mono text-xs font-semibold text-emerald-800">+91 85115 56155</p>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-[#DAC8B8] p-6 space-y-4">
            <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
            <div>
              <p className="font-serif text-lg text-[#3E3834] mb-1">Your bag is currently empty</p>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Select your favorite artisanal piece from our catalog to proceed with checkout.
              </p>
            </div>
            <Link
              to="/"
              className="inline-block px-7 py-3 bg-[#11A0AB] hover:bg-[#0E848D] text-white rounded-full text-xs uppercase tracking-wider font-semibold shadow-sm transition-all"
            >
              Explore Boutique
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT: Customer Details Form */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-white rounded-2xl border border-[#EAE0D4] p-5 sm:p-6 shadow-xs">
                <h2 className="font-serif text-lg font-medium text-[#221B16] pb-3 border-b border-[#F2EAE1] mb-4">
                  1. Delivery & Contact Information
                </h2>

                <form onSubmit={handleBuyViaWhatsApp} id="checkout-form" className="space-y-4 text-xs">
                  {/* Name */}
                  <div>
                    <label className="block text-neutral-700 font-medium mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Radhika Agarwal"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-[#FAF8F5] border border-[#DECBB8] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-600"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-neutral-700 font-medium mb-1.5">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-[#FAF8F5] border border-[#DECBB8] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-600"
                    />
                    <p className="text-[10px] text-neutral-400 mt-1">
                      Our stylist will coordinate dispatch and tracking updates to this number.
                    </p>
                  </div>

                  {/* Location / Delivery Address */}
                  <div>
                    <label className="block text-neutral-700 font-medium mb-1.5">
                      Delivery Location & Address *
                    </label>
                    <textarea
                      name="location"
                      required
                      rows={3}
                      placeholder="Apartment/House no, Street, Landmark, City, State and Pincode"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-[#FAF8F5] border border-[#DECBB8] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-600"
                    />
                  </div>
                </form>
              </div>

              {/* Trust Badge */}
              <div className="bg-[#FAF4EC] rounded-xl border border-[#E8D9C8] p-4 flex items-center gap-3 text-xs text-[#6A5342]">
                <ShieldCheck className="w-5 h-5 text-brand-700 shrink-0" />
                <div>
                  <span className="font-semibold block">Direct Boutique Guarantee</span>
                  <span className="text-[11px] text-neutral-500">Every piece is hand-inspected before packaging. Direct stylist communication.</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Order Summary & WhatsApp Buy CTA */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white rounded-2xl border border-[#EAE0D4] p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F2EAE1]">
                  <h2 className="font-serif text-lg font-medium text-[#221B16]">
                    2. Order Summary
                  </h2>
                  <span className="text-xs text-neutral-500 font-medium">
                    {cart.length} {cart.length === 1 ? 'item' : 'items'}
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
                    const size = item?.size || 'Standard';
                    const itemTotal = price * quantity;
                    const imageUrl = (Array.isArray(product.images) && product.images[0]) || product.imageUrl;

                    return (
                      <div 
                        key={`${pid}-${size}-${idx}`}
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
                              <span>Size: <strong>{size}</strong></span>
                              <span>•</span>
                              <span>₹{price.toLocaleString('en-IN')}</span>
                            </div>
                          </div>

                          {/* Quantity controls */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="inline-flex items-center bg-[#F6F0E8] rounded-md px-1.5 py-0.5 text-xs">
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(pid, size, -1)}
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
                                onClick={() => updateCartQuantity(pid, size, 1)}
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
                                onClick={() => removeFromCart(pid, size)}
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
                  <div className="flex justify-between text-emerald-700">
                    <span>Delivery</span>
                    <span className="font-medium">Free Express Delivery</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-[#221B16] pt-2 border-t border-[#EAE0D4]">
                    <span>Total Payable</span>
                    <span className="font-serif text-base">
                      ₹{cartSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Buy via WhatsApp Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={isSubmitting}
                    className="w-full py-4 px-5 bg-[#25D366] hover:bg-[#20bd5a] active:scale-98 text-white rounded-full text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    <span>Buy via WhatsApp</span>
                  </button>
                  <p className="text-[10px] text-center text-neutral-500 mt-2">
                    Tapping Buy opens WhatsApp with your order details and product links addressed to <strong>8511556155</strong>.
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
