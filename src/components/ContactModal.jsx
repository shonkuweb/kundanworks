import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Check, Sparkles, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { LotusIcon } from './Header';

export const ContactModal = () => {
  const { isContactOpen, setIsContactOpen, showToast } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const [isSuccessAnimating, setIsSuccessAnimating] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);

  // Business WhatsApp number: 8511556115
  const BUSINESS_WHATSAPP_NUMBER = '918511556115';

  useEffect(() => {
    if (!isContactOpen) {
      setIsSuccessAnimating(false);
      setProgressWidth(0);
      setFormData({ name: '', phone: '', message: '' });
    }
  }, [isContactOpen]);

  if (!isContactOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast('Please enter your name', 'error');
      return;
    }
    if (!formData.phone.trim()) {
      showToast('Please enter your phone number', 'error');
      return;
    }
    if (!formData.message.trim()) {
      showToast('Please write your message', 'error');
      return;
    }

    // Prepare formatted WhatsApp message
    const formattedMessage = 
`✨ *NEW INQUIRY - KUNDAN WORKS* ✨
━━━━━━━━━━━━━━━━━━━━
👤 *Customer Name:* ${formData.name.trim()}
📱 *Phone Number:* ${formData.phone.trim()}

💬 *Message:*
${formData.message.trim()}
━━━━━━━━━━━━━━━━━━━━
_Sent via Kundan Works Boutique Portal_`;

    const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedMessage)}`;

    // Trigger 2-second success animation
    setIsSuccessAnimating(true);
    setProgressWidth(100);

    // After exactly 2 seconds, redirect to WhatsApp and close modal
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setIsContactOpen(false);
      setIsSuccessAnimating(false);
      setProgressWidth(0);
      setFormData({ name: '', phone: '', message: '' });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#D7BEA8] max-w-md w-full p-6 shadow-2xl relative my-6">
        
        {/* Close Button */}
        {!isSuccessAnimating && (
          <button
            onClick={() => setIsContactOpen(false)}
            className="absolute top-4 right-4 p-1 rounded-full text-neutral-500 hover:bg-[#EFE8DE] transition-colors cursor-pointer"
            aria-label="Close Contact Dialog"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* 2-SECOND SUCCESS ANIMATION STATE */}
        {isSuccessAnimating ? (
          <div className="py-8 text-center space-y-4 animate-fadeIn">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-75" />
              <div className="relative w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg animate-scaleIn">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
            </div>

            <div>
              <h3 className="font-serif text-xl font-medium text-[#221B16]">
                Message Received!
              </h3>
              <p className="text-xs text-neutral-600 mt-1">
                Redirecting to Kundan Works WhatsApp in a moment...
              </p>
            </div>

            {/* 2-second progress bar animation */}
            <div className="w-full bg-[#EAE0D4] h-1.5 rounded-full overflow-hidden mt-4">
              <div 
                className="bg-emerald-600 h-full transition-all duration-[2000ms] ease-linear rounded-full"
                style={{ width: `${progressWidth}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="text-center pb-4 border-b border-[#EAE0D4] mb-5">
              <div className="flex justify-center mb-1">
                <LotusIcon className="w-8 h-6 text-brand-700" />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#221B16]">
                Contact Kundan Works
              </h3>
              <p className="text-[11px] text-[#796455] font-light mt-0.5">
                Stylist Desk & Client Concierge • WhatsApp: <strong>8511556115</strong>
              </p>
            </div>

            {/* Simple Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Full Name */}
              <div>
                <label className="block text-neutral-700 font-medium mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 bg-white border border-[#DECBB8] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-700"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-neutral-700 font-medium mb-1.5">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-3 bg-white border border-[#DECBB8] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-700"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-neutral-700 font-medium mb-1.5">
                  Your Message / Inquiry *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us what you are looking for (custom sizing, styling, bridal, delivery inquiry)..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full p-3 bg-white border border-[#DECBB8] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-700"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] active:scale-98 text-white rounded-xl text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send via WhatsApp</span>
                </button>
                <p className="text-[10px] text-center text-neutral-500 mt-2">
                  Opens directly to WhatsApp with <strong>+91 85115 56115</strong>
                </p>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  );
};
