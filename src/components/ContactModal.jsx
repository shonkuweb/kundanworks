import React from 'react';
import { X, Phone, MessageSquare, Mail, MapPin, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { LotusIcon } from './Header';

export const ContactModal = () => {
  const { isContactOpen, setIsContactOpen, storeConfig } = useStore();

  if (!isContactOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#D7BEA8] max-w-md w-full p-6 shadow-2xl relative my-6">
        
        {/* Close Button */}
        <button
          onClick={() => setIsContactOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-full text-neutral-500 hover:bg-[#EFE8DE] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4 border-b border-[#EAE0D4] mb-5">
          <div className="flex justify-center mb-1">
            <LotusIcon className="w-8 h-6 text-brand-700" />
          </div>
          <h3 className="font-serif text-xl font-medium text-[#221B16]">
            {storeConfig.storeName || 'KUNDAN WORKS'}
          </h3>
          <p className="text-[10px] tracking-widest text-[#796455] uppercase mt-0.5">
            Client Concierge & Stylist Desk
          </p>
        </div>

        {/* Boutique Contact Options */}
        <div className="space-y-3 text-xs mb-6">
          <div className="bg-white p-3.5 rounded-xl border border-[#EAE0D4] flex items-start gap-3 shadow-xs">
            <div className="p-2 rounded-lg bg-[#F5EDE4] text-brand-700 shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-neutral-800 block text-xs">Telephone Inquiries</span>
              <a href={`tel:${storeConfig.whatsappNumber}`} className="text-brand-800 hover:underline">
                {storeConfig.whatsappNumber}
              </a>
              <p className="text-[11px] text-neutral-400 mt-0.5">Mon - Sat: 10:00 AM - 8:00 PM IST</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#EAE0D4] flex items-start gap-3 shadow-xs">
            <div className="p-2 rounded-lg bg-[#E7F8EE] text-emerald-700 shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-neutral-800 block text-xs">WhatsApp Stylist Chat</span>
              <a 
                href={`https://wa.me/919876543210?text=${encodeURIComponent('Hello Kundan Works, I would like to inquire about your apparel collection.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 font-medium hover:underline inline-block mt-0.5"
              >
                Start WhatsApp Conversation →
              </a>
              <p className="text-[11px] text-neutral-400 mt-0.5">Custom tailoring, bridal orders & styling</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#EAE0D4] flex items-start gap-3 shadow-xs">
            <div className="p-2 rounded-lg bg-[#F5EDE4] text-brand-700 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-neutral-800 block text-xs">Flagship Studio</span>
              <p className="text-neutral-600 mt-0.5">Heritage Textile Quarter, Design Row, India</p>
            </div>
          </div>
        </div>

        {/* ShonkuWEB Tech & Integration Partner Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#F5ECE2] to-[#EBE0D4] border border-[#DECAB7] text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-900">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
            <span>Digital Technology Partner</span>
          </div>
          <p className="text-[#4E4137] text-[11px] leading-relaxed">
            This catalog portal is developed and powered by <strong>ShonkuWEB Technologies</strong>. For payment gateway setup, API integrations, and ecommerce expansion, reach out to team ShonkuWEB.
          </p>
          <div className="pt-1 flex items-center justify-between text-[11px]">
            <a 
              href="mailto:team@shonkuweb.com" 
              className="text-brand-800 font-semibold hover:underline"
            >
              team@shonkuweb.com
            </a>
            <span className="text-neutral-400">•</span>
            <span className="text-brand-700 font-medium">ShonkuWEB Tech</span>
          </div>
        </div>

      </div>
    </div>
  );
};
