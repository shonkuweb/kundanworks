import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Heart, 
  Share2, 
  Check, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  MessageSquare, 
  ChevronRight,
  Ruler,
  Info,
  Tag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FashionPlaceholder } from '../components/Placeholders';
import { LotusIcon } from '../components/Header';

export const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, categories, addToCart, setIsCartOpen, showToast, storeConfig } = useStore();

  // Find product by id or slug
  const product = products.find(p => p.id === id || p.slug === id);

  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [activeImageKey, setActiveImageKey] = useState(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeInfoTab, setActiveInfoTab] = useState('details'); // 'details' | 'fabric' | 'care'

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (product) {
      setActiveImageKey(product.placeholderKey || 'kurta');
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <LotusIcon className="w-10 h-8 text-brand-600 mb-3" />
        <h2 className="font-serif text-2xl text-[#241F1C] mb-2">Design Not Found</h2>
        <p className="text-xs text-neutral-500 max-w-sm mb-6">
          The artisanal design you are looking for might have moved or been updated in our boutique catalog.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-[#1E1A17] text-white rounded-lg text-xs uppercase tracking-wider font-medium"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  // Find Category info
  const category = categories.find(c => c.slug === product.categorySlug);

  // Gallery items
  const gallery = product.gallery && product.gallery.length > 0 
    ? product.gallery 
    : [product.placeholderKey || 'kurta', 'hero_anarkali', 'ethnic_featured'];

  // Discount percentage
  const discount = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  // Related products
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.categorySlug === product.categorySlug || p.subCategorySlug === product.subCategorySlug))
    .slice(0, 3);

  // WhatsApp Stylist Link
  const stylistMessage = `Hello Kundan Works stylist, I am interested in ordering: "${product.title}" (SKU: ${product.sku || product.id}), Size: ${selectedSize}, Price: ₹${product.price}. Could you please assist with placing the order?`;
  const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(stylistMessage)}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `${product.title} - Kundan Works Luxury Apparel`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!');
    }
  };

  const handleAddAndOpenCart = () => {
    addToCart(product, selectedSize, quantity);
    setIsCartOpen(true);
  };

  return (
    <div className="bg-[#FAF8F5] pb-16 pt-2 animate-fadeIn">
      
      {/* Breadcrumbs & Navigation Bar */}
      <div className="max-w-md md:max-w-4xl lg:max-w-6xl mx-auto px-4 py-3 flex items-center justify-between border-b border-[#EAE0D4]/70 mb-4 text-xs">
        <div className="flex items-center gap-1.5 text-neutral-500 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link to="/" className="hover:text-brand-900 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Catalog</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
          <Link to="/" className="hover:text-brand-900 transition-colors font-serif italic">
            {category?.name || 'Collection'}
          </Link>
          <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
          <span className="text-brand-900 font-medium truncate max-w-[140px] sm:max-w-xs">
            {product.title}
          </span>
        </div>

        <button
          onClick={handleShare}
          className="p-1.5 text-neutral-500 hover:text-brand-900 hover:bg-[#F0E6DA] rounded-full transition-colors shrink-0"
          title="Share design"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Product Layout */}
      <div className="max-w-md md:max-w-4xl lg:max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10">
          
          {/* LEFT: Visual Showcase & Gallery */}
          <div className="md:col-span-6 lg:col-span-7 space-y-3">
            
            {/* Main Stage Image / Placeholder */}
            <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#ECE4DA] border border-[#DFCFC1] shadow-sm">
              <FashionPlaceholder 
                type={activeImageKey || product.placeholderKey || 'kurta'}
                imageUrl={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover transition-all duration-500"
              />

              {/* Tag / Badge */}
              {product.tag && (
                <div className="absolute top-3.5 left-3.5 z-10">
                  <span className={`text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full text-white shadow-xs ${product.badgeColor || 'bg-brand-600'}`}>
                    {product.tag}
                  </span>
                </div>
              )}

              {/* SKU Pill */}
              {product.sku && (
                <div className="absolute bottom-3.5 right-3.5 bg-black/40 backdrop-blur-xs text-white/90 text-[9px] tracking-widest uppercase font-mono px-2.5 py-1 rounded-full">
                  {product.sku}
                </div>
              )}
            </div>

            {/* Thumbnail Angle Switcher */}
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
              {gallery.map((gKey, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageKey(gKey)}
                  className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageKey === gKey 
                      ? 'border-brand-700 ring-2 ring-brand-200 scale-105' 
                      : 'border-[#DECBB9] opacity-70 hover:opacity-100'
                  }`}
                >
                  <FashionPlaceholder 
                    type={gKey}
                    imageUrl={idx === 0 ? product.imageUrl : ''}
                    alt={`Angle ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[8px] text-center py-0.5 uppercase tracking-wider font-light">
                    View {idx + 1}
                  </span>
                </button>
              ))}
            </div>

          </div>

          {/* RIGHT: Product Details, Pricing, Size, CTAs */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col justify-start space-y-5">
            
            {/* Brand & Title */}
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.25em] text-[#8C6F5A] uppercase mb-1.5">
                <Sparkles className="w-3 h-3 text-brand-600" />
                <span>Kundan Works • Luxury Apparel</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1E1A17] font-normal leading-[1.15] tracking-tight">
                {product.title}
              </h1>
              {product.subtitle && (
                <p className="text-xs sm:text-sm text-neutral-500 font-serif italic mt-1">
                  {product.subtitle}
                </p>
              )}
            </div>

            {/* Pricing Section */}
            <div className="bg-white p-4 rounded-xl border border-[#EAE0D4] shadow-xs">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#1E1A17]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm sm:text-base text-neutral-400 line-through font-light">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {discount && (
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    Save {discount}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500 mt-1 font-light flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Inclusive of all taxes • Complimentary delivery included</span>
              </p>

              {/* Offer Callout */}
              <div className="mt-3 pt-3 border-t border-[#F3ECE3] flex items-center gap-2 text-xs text-brand-800">
                <Tag className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span>Use code <strong className="font-semibold underline">FIRST500</strong> for Flat ₹500 off at checkout</span>
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#4E4137]">
                  Select Size
                </label>
                <button
                  onClick={() => setShowSizeGuide(prev => !prev)}
                  className="text-xs text-brand-700 hover:text-brand-900 font-serif italic flex items-center gap-1 underline"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Measurement Chart</span>
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedSize === s
                        ? 'bg-[#1E1A17] text-[#FAF8F5] shadow-sm scale-102 ring-2 ring-brand-300'
                        : 'bg-white text-[#4A3E35] border border-[#DECBB9] hover:bg-[#F7F2EC]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Collapsible Size Guide */}
              {showSizeGuide && (
                <div className="bg-[#FAF3EB] p-3.5 rounded-xl border border-[#E0D0BE] text-xs text-[#524337] space-y-1 animate-fadeIn">
                  <span className="font-semibold block text-brand-900 mb-1">Standard Size Chart (Inches):</span>
                  <div className="grid grid-cols-5 text-center text-[11px] font-mono border-t border-[#DECBB9] pt-1">
                    <div>XS: 32"</div>
                    <div>S: 34"</div>
                    <div>M: 36"</div>
                    <div>L: 38"</div>
                    <div>XL: 40"</div>
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#4E4137]">
                Quantity
              </span>
              <div className="inline-flex items-center bg-white border border-[#DECBB9] rounded-lg px-2 py-1">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-2 py-0.5 text-neutral-600 hover:text-black font-semibold"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-semibold font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-2 py-0.5 text-neutral-600 hover:text-black font-semibold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              {/* Primary: Add to Bag */}
              <button
                onClick={handleAddAndOpenCart}
                className="w-full py-3.5 px-6 bg-[#181818] hover:bg-[#2C2724] text-white rounded-xl text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-[#E6CDB2]" />
                <span>Add to Bag • ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
              </button>

              {/* Secondary: WhatsApp Stylist Order */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Order via Stylist WhatsApp</span>
              </a>
            </div>

            {/* Product Information Tabs */}
            <div className="bg-white rounded-xl border border-[#EAE0D4] overflow-hidden shadow-xs">
              <div className="flex border-b border-[#EAE0D4] bg-[#F7F2EC]/60">
                <button
                  onClick={() => setActiveInfoTab('details')}
                  className={`flex-1 py-2.5 text-xs font-medium uppercase tracking-wider transition-all ${
                    activeInfoTab === 'details'
                      ? 'bg-white text-brand-900 border-b-2 border-brand-700 font-semibold'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Story & Fit
                </button>
                <button
                  onClick={() => setActiveInfoTab('fabric')}
                  className={`flex-1 py-2.5 text-xs font-medium uppercase tracking-wider transition-all ${
                    activeInfoTab === 'fabric'
                      ? 'bg-white text-brand-900 border-b-2 border-brand-700 font-semibold'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Fabric & Craft
                </button>
                <button
                  onClick={() => setActiveInfoTab('care')}
                  className={`flex-1 py-2.5 text-xs font-medium uppercase tracking-wider transition-all ${
                    activeInfoTab === 'care'
                      ? 'bg-white text-brand-900 border-b-2 border-brand-700 font-semibold'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Wash & Care
                </button>
              </div>

              <div className="p-4 text-xs text-[#52443A] leading-relaxed">
                {activeInfoTab === 'details' && (
                  <div className="space-y-2">
                    <p>{product.description}</p>
                    {product.fit && (
                      <div className="pt-2 border-t border-[#F4EDE4]">
                        <span className="font-semibold text-neutral-800 block">Fit & Model Note:</span>
                        <p>{product.fit}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeInfoTab === 'fabric' && (
                  <div className="space-y-2">
                    <p><strong>Primary Textile:</strong> {product.fabric || 'Pure Artisan Woven Cotton & Silk Blend'}</p>
                    <p><strong>Workmanship:</strong> Hand-detailed needlework, refined stitching, and authentic dye processing.</p>
                  </div>
                )}

                {activeInfoTab === 'care' && (
                  <div className="space-y-2">
                    <p>{product.care || 'Gentle dry clean recommended. Store in cool, dry wardrobe inside breathable garment bag.'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Assurance Perks */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F5EDE4] text-xs text-[#52443A]">
                <Truck className="w-4 h-4 text-brand-700 shrink-0" />
                <span className="text-[11px]">Free 3-5 day delivery</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F5EDE4] text-xs text-[#52443A]">
                <ShieldCheck className="w-4 h-4 text-brand-700 shrink-0" />
                <span className="text-[11px]">Artisanal Handcraft</span>
              </div>
            </div>

          </div>

        </div>

        {/* RELATED DESIGNS ("You May Also Love") */}
        {relatedProducts.length > 0 && (
          <div className="mt-14 pt-8 border-t border-[#EAE0D4]">
            <div className="text-center mb-6">
              <span className="text-[10px] tracking-[0.25em] font-semibold text-brand-700 uppercase block mb-1">
                Curated Suggestions
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#1E1A17]">
                You May Also Love
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-6">
              {relatedProducts.map(rel => (
                <Link
                  key={rel.id}
                  to={`/product/${rel.id}`}
                  className="group bg-white rounded-xl overflow-hidden border border-[#EDE4D9] shadow-xs hover:shadow-card transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] w-full bg-[#F3ECE4] overflow-hidden">
                    <FashionPlaceholder 
                      type={rel.placeholderKey || 'kurta'}
                      imageUrl={rel.imageUrl}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-serif text-xs sm:text-sm font-medium text-[#221E1B] line-clamp-1 group-hover:text-brand-700 transition-colors">
                      {rel.title}
                    </h4>
                    <span className="font-serif font-semibold text-xs sm:text-sm text-[#1E1A17] block mt-1">
                      ₹{rel.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
