import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Package, 
  Settings, 
  Check, 
  Search, 
  Eye,
  EyeOff,
  Camera,
  Image as ImageIcon,
  ShoppingBag,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  XCircle,
  RotateCcw,
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useStore, ORDER_STAGES } from '../context/StoreContext';
import { FashionPlaceholder } from './Placeholders';
import { api } from '../services/api';

// Client-side image compression helper: keeps aspect ratio, max 1200px, quality JPEG
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Invalid image file'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1200;
        const maxHeight = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export const AdminPanel = ({ onClose }) => {
  const navigate = useNavigate();
  const { 
    products, 
    orders,
    updateOrderDecision,
    updateOrderStage,
    deleteOrder,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    storeConfig, 
    setStoreConfig, 
    showToast 
  } = useStore();

  // Super Secure Admin Authentication State (NO password stored in frontend)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authPassword, setAuthPassword] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Settings: Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Verify existing admin session token on mount
  useEffect(() => {
    let isMounted = true;
    const verifyExistingSession = async () => {
      const token = sessionStorage.getItem('kundan_admin_token');
      if (!token) {
        if (isMounted) {
          setIsAuthenticated(false);
          setIsCheckingAuth(false);
        }
        return;
      }
      try {
        const res = await api.adminVerifySession(token);
        if (isMounted) {
          if (res && res.valid) {
            setIsAuthenticated(true);
          } else {
            sessionStorage.removeItem('kundan_admin_token');
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        if (isMounted) {
          sessionStorage.removeItem('kundan_admin_token');
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    verifyExistingSession();
    return () => { isMounted = false; };
  }, []);

  // Admin Login Handler
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!authPassword.trim()) {
      setAuthError('Please enter the admin password');
      return;
    }
    setIsLoggingIn(true);
    setAuthError('');
    try {
      const res = await api.adminLogin(authPassword);
      if (res && res.success && res.token) {
        sessionStorage.setItem('kundan_admin_token', res.token);
        setIsAuthenticated(true);
        setAuthPassword('');
        showToast('Admin access granted', 'success');
      } else {
        setAuthError(res?.error || 'Invalid admin password');
      }
    } catch (err) {
      setAuthError(err.message || 'Incorrect password or authentication error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Lock / Logout Admin Panel
  const handleLockAdmin = async () => {
    const token = sessionStorage.getItem('kundan_admin_token');
    try {
      if (token) {
        await api.adminLogout(token);
      }
    } catch {
      // ignore
    } finally {
      sessionStorage.removeItem('kundan_admin_token');
      setIsAuthenticated(false);
      showToast('Admin panel locked');
    }
  };

  // Change Admin Password in Settings
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Please enter current admin password', 'error');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      showToast('New password must be at least 6 characters long', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    setIsChangingPass(true);
    try {
      const token = sessionStorage.getItem('kundan_admin_token');
      const res = await api.adminChangePassword({ currentPassword, newPassword }, token);
      if (res && res.success) {
        if (res.token) {
          sessionStorage.setItem('kundan_admin_token', res.token);
        }
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        showToast('Admin password updated successfully!', 'success');
      } else {
        showToast(res?.error || 'Failed to update password', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update password', 'error');
    } finally {
      setIsChangingPass(false);
    }
  };

  // Admin Active Tab: 'products' | 'orders' | 'settings'
  const [adminTab, setAdminTab] = useState('products');

  // Search Queries
  const [adminSearch, setAdminSearch] = useState('');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all'); // 'all' | 'pending' | 'accepted' | 'rejected'

  // Ref inputs for camera and gallery
  const fileInputCameraRef = useRef(null);
  const fileInputGalleryRef = useRef(null);

  // Super Simple Product Form State (NO Subtitle, NO Category)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    price: '',
    originalPrice: '',
    stock: '10',
    description: '',
    images: [] // Up to 3 images
  });

  // Handle open product modal (Reset fields cleanly)
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      title: '',
      price: '',
      originalPrice: '',
      stock: '10',
      description: '',
      images: []
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProductId(prod.id);
    const existingImages = Array.isArray(prod.images) && prod.images.length > 0
      ? prod.images
      : (prod.imageUrl ? [prod.imageUrl] : []);

    setProductForm({
      title: prod.title || prod.name || '',
      price: prod.price ?? '',
      originalPrice: prod.originalPrice ?? prod.price ?? '',
      stock: prod.stock !== undefined ? String(prod.stock) : (prod.inStock === false ? '0' : '10'),
      description: prod.description || '',
      images: existingImages
    });
    setIsProductModalOpen(true);
  };

  // Uploading photos (up to 3)
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = 3 - productForm.images.length;
    if (remainingSlots <= 0) {
      showToast('Maximum 3 photos allowed per product', 'error');
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);
    showToast('Optimizing and loading photo(s)...', 'info');

    try {
      const compressedUrls = await Promise.all(
        filesToProcess.map(file => compressImage(file))
      );
      setProductForm(prev => ({
        ...prev,
        images: [...prev.images, ...compressedUrls].slice(0, 3)
      }));
      showToast(`Added ${compressedUrls.length} photo${compressedUrls.length > 1 ? 's' : ''}`);
    } catch (err) {
      console.error('Failed to process photos', err);
      showToast('Failed to load photos. Please try another image.', 'error');
    }
    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.title.trim()) {
      showToast('Product title is required', 'error');
      return;
    }
    if (!productForm.price) {
      showToast('Product price is required', 'error');
      return;
    }

    const firstImage = productForm.images && productForm.images.length > 0 ? productForm.images[0] : '';
    const stockNum = Math.max(0, parseInt(productForm.stock, 10) || 0);
    const regularPrice = Number(productForm.price);
    const origPrice = productForm.originalPrice ? Number(productForm.originalPrice) : regularPrice;

    const payload = {
      title: productForm.title.trim(),
      name: productForm.title.trim(),
      subtitle: '',
      category: 'Collection',
      categorySlug: 'collection',
      price: regularPrice,
      originalPrice: origPrice,
      stock: stockNum,
      inStock: stockNum > 0,
      description: productForm.description ? productForm.description.trim() : '',
      images: productForm.images,
      imageUrl: firstImage,
      gallery: productForm.images
    };

    if (editingProductId) {
      updateProduct(editingProductId, payload);
      showToast('Product updated successfully!');
    } else {
      addProduct(payload);
      showToast('New product added to store!');
    }
    setIsProductModalOpen(false);
  };

  // Quick Stock Toggle for Products right on card
  const handleToggleProductStock = (prod) => {
    const isCurrentlyInStock = (prod.stock ?? 10) > 0;
    const nextStock = isCurrentlyInStock ? 0 : 10;
    updateProduct(prod.id, {
      ...prod,
      stock: nextStock,
      inStock: !isCurrentlyInStock
    });
    showToast(isCurrentlyInStock ? `Marked "${prod.title}" as Out of Stock` : `Marked "${prod.title}" as In Stock`);
  };

  // Direct WhatsApp Customer Support / Order Notification
  const handleWhatsAppCustomer = (order) => {
    const rawPhone = order.phone || order.customerPhone || '';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const phoneWithCode = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    
    const itemsText = (order.items || [])
      .map(i => `• ${i.product?.title || i.title || 'Item'} (x${i.quantity || 1})`)
      .join('\n');

    const msg = `Hello ${order.customerName || 'Customer'}! Thank you for ordering from Kundan Works (Order #${order.id}).\n\nItems:\n${itemsText}\n\nTotal: ₹${(order.total || 0).toLocaleString('en-IN')}\nStatus: ${order.statusTitle || 'Processing'}\n\nWe are preparing your package!`;
    
    const url = `https://wa.me/${phoneWithCode}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // Filtered Products
  const filteredAdminProducts = products.filter(p => {
    if (!p) return false;
    const title = p.title || p.name || '';
    const q = (adminSearch || '').toLowerCase().trim();
    return !q || title.toLowerCase().includes(q);
  });

  // Filtered Orders
  const filteredOrders = orders.filter(order => {
    const q = orderSearchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      (order.id && order.id.toLowerCase().includes(q)) ||
      (order.customerName && order.customerName.toLowerCase().includes(q)) ||
      (order.phone && order.phone.includes(q)) ||
      (order.shippingAddress && order.shippingAddress.toLowerCase().includes(q));
    
    if (!matchesSearch) return false;
    if (orderStatusFilter === 'all') return true;
    return order.decision === orderStatusFilter;
  });

  const pendingOrdersCount = orders.filter(o => o.decision === 'pending').length;
  const acceptedOrdersCount = orders.filter(o => o.decision === 'accepted').length;

  // 1. Session verification in progress
  if (isCheckingAuth) {
    return (
      <div className="fixed inset-0 z-50 bg-[#1C1E21] flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#11A0AB] animate-spin mx-auto mb-3" />
          <p className="text-xs text-neutral-300 font-medium">Verifying admin session...</p>
        </div>
      </div>
    );
  }

  // 2. Lock Screen Guard (Zero password stored in frontend)
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#1C1E21]/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
        <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] relative my-auto animate-fadeIn">
          
          {/* Close / Return button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
            title="Return to Store"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo / Lock Badge */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#11A0AB]/20 to-[#FD9AA7]/20 flex items-center justify-center mb-3 text-[#11A0AB] border border-[#11A0AB]/20 shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-[#1C1E21] tracking-tight">Admin Access</h2>
            <p className="text-xs text-neutral-500 mt-1">
              Protected area. Enter admin password to manage products and orders.
            </p>
          </div>

          {/* Error notification */}
          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showAuthPassword ? 'text' : 'password'}
                  value={authPassword}
                  onChange={(e) => {
                    setAuthPassword(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="Enter admin password"
                  autoFocus
                  className="w-full pl-4 pr-11 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#11A0AB]/30 focus:border-[#11A0AB] text-[#1C1E21]"
                />
                <button
                  type="button"
                  onClick={() => setShowAuthPassword(!showAuthPassword)}
                  className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-600 p-0.5 cursor-pointer"
                  tabIndex={-1}
                >
                  {showAuthPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-[#11A0AB] hover:bg-[#0E848D] active:scale-98 disabled:opacity-60 text-white rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Admin Panel</span>
                </>
              )}
            </button>
          </form>

          {/* Security footnote */}
          <div className="mt-6 pt-4 border-t border-[#F1F5F9] text-center flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#11A0AB]" />
            <span>End-to-end cryptographic verification</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#FAFCFD] flex flex-col font-sans">
      
      {/* Top Mobile-Friendly Admin Navigation Bar */}
      <header className="sticky top-0 z-20 bg-[#1C1E21] text-white border-b border-[#2C3036] shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-1.5 rounded-full backdrop-blur-xs">
              <img 
                src="/logo.png" 
                alt="Kundan Works" 
                className="h-7 w-auto object-contain" 
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-semibold tracking-wide text-white">
                  Admin Panel
                </h1>
                <span className="text-[10px] bg-[#11A0AB] text-white px-2.5 py-0.5 rounded-full font-medium tracking-wide">
                  Store Manager
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-light hidden sm:block">
                Super simple management for Boutique Products & Orders
              </p>
            </div>
          </div>

          {/* Action Buttons - Curve Edged */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLockAdmin}
              title="Lock Admin Panel"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white rounded-full text-xs font-medium transition-all active:scale-95 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#2E333D] hover:bg-[#3E4552] text-white rounded-full text-xs font-medium transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* 3 Clean Navigation Tabs */}
        <div className="max-w-5xl mx-auto px-3 flex items-center gap-2 overflow-x-auto no-scrollbar py-2 border-t border-white/10">
          
          {/* 1. Products Tab */}
          <button
            onClick={() => setAdminTab('products')}
            className={`px-4 py-2 text-xs font-medium rounded-full flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              adminTab === 'products'
                ? 'bg-[#11A0AB] text-white shadow-sm font-semibold'
                : 'text-neutral-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          {/* 2. Orders Tab */}
          <button
            onClick={() => setAdminTab('orders')}
            className={`px-4 py-2 text-xs font-medium rounded-full flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              adminTab === 'orders'
                ? 'bg-[#11A0AB] text-white shadow-sm font-semibold'
                : 'text-neutral-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="px-2 py-0.5 bg-[#FD9AA7] text-neutral-900 font-bold text-[10px] rounded-full animate-pulse">
                {pendingOrdersCount} new
              </span>
            )}
          </button>

          {/* 3. Settings Tab */}
          <button
            onClick={() => setAdminTab('settings')}
            className={`px-4 py-2 text-xs font-medium rounded-full flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              adminTab === 'settings'
                ? 'bg-[#11A0AB] text-white shadow-sm font-semibold'
                : 'text-neutral-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>

        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 pb-28">
        
        {/* ======================================================== */}
        {/* TAB 1: PRODUCTS (SUPER SIMPLE & MOBILE-FIRST) */}
        {/* ======================================================== */}
        {adminTab === 'products' && (
          <div className="space-y-4">
            
            {/* Top Bar: Prominent Add Button & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-xs">
              
              {/* Search Bar with Curve Edges */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  placeholder="Search products by name..."
                  className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#11A0AB]/30 focus:border-[#11A0AB]"
                />
                {adminSearch && (
                  <button 
                    onClick={() => setAdminSearch('')}
                    className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Add Product Button with Curve Edges */}
              <button
                onClick={handleOpenAddProduct}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#11A0AB] hover:bg-[#0E848D] text-white rounded-full text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Mobile Card List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredAdminProducts.map(prod => {
                const hasImage = prod.images && prod.images.length > 0;
                const displayImage = hasImage ? prod.images[0] : prod.imageUrl;
                const inStock = (prod.stock ?? 10) > 0;

                return (
                  <div 
                    key={prod.id} 
                    className="bg-white rounded-2xl border border-[#E2E8F0] p-3.5 shadow-xs hover:border-[#11A0AB]/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top row: Thumbnail & Basic Info */}
                      <div className="flex gap-3 items-start">
                        {/* Thumbnail */}
                        <div className="w-20 h-24 rounded-xl overflow-hidden shrink-0 bg-[#F1F5F9] border border-[#E2E8F0] relative">
                          {displayImage ? (
                            <img 
                              src={displayImage} 
                              alt={prod.title} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <FashionPlaceholder 
                              type={prod.placeholderKey || 'kurta'} 
                              imageUrl={prod.imageUrl}
                              alt={prod.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                          {prod.images && prod.images.length > 1 && (
                            <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded-full font-medium">
                              {prod.images.length} photos
                            </span>
                          )}
                        </div>

                        {/* Title & Price */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-[#1C1E21] line-clamp-2 leading-snug">
                            {prod.title}
                          </h4>

                          <div className="flex items-baseline gap-2 mt-1.5">
                            <span className="font-bold text-base text-[#11A0AB]">
                              ₹{Number(prod.price).toLocaleString('en-IN')}
                            </span>
                            {prod.originalPrice > prod.price && (
                              <span className="text-xs text-neutral-400 line-through">
                                ₹{Number(prod.originalPrice).toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          {/* Instant 1-Tap Stock Toggle Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleProductStock(prod)}
                            className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                              inStock 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                            }`}
                            title="Tap to toggle in stock / out of stock"
                          >
                            <span className={`w-2 h-2 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            <span>{inStock ? `In Stock (${prod.stock ?? 10})` : 'Out of Stock'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Optional Description snippet */}
                      {prod.description && (
                        <p className="text-[11px] text-neutral-500 line-clamp-2 mt-2.5 px-1 font-light">
                          {prod.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Action Buttons (All Curve Edged) */}
                    <div className="flex items-center justify-between gap-1.5 mt-3 pt-2.5 border-t border-[#F1F5F9]">
                      <button
                        onClick={() => {
                          onClose();
                          navigate(`/product/${prod.id}`);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 text-[11px] font-medium text-[#11A0AB] hover:text-white hover:bg-[#11A0AB] bg-[#E6F6F7] rounded-full transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${prod.title}"?`)) {
                              deleteProduct(prod.id);
                              showToast('Product deleted');
                            }
                          }}
                          className="inline-flex items-center gap-1 p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}

              {filteredAdminProducts.length === 0 && (
                <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-[#CBD5E1] p-6">
                  <Package className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                  <p className="text-base font-semibold text-neutral-800 mb-1">No products found</p>
                  <p className="text-xs text-neutral-500 mb-4 max-w-xs mx-auto">
                    {adminSearch ? `No matches for "${adminSearch}".` : 'Get started by adding your boutique outfits.'}
                  </p>
                  <button
                    onClick={handleOpenAddProduct}
                    className="px-5 py-2.5 bg-[#11A0AB] hover:bg-[#0E848D] text-white rounded-full text-xs font-semibold shadow-sm cursor-pointer"
                  >
                    + Add Product
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ORDERS (MOBILE-FIRST CARDS & DIRECT WHATSAPP) */}
        {/* ======================================================== */}
        {adminTab === 'orders' && (
          <div className="space-y-4">
            
            {/* Orders Search & Filter Pills */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Search by order ID, customer name, phone..."
                  className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#11A0AB]/30 focus:border-[#11A0AB]"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
                {[
                  { id: 'all', label: `All (${orders.length})` },
                  { id: 'pending', label: `Pending (${pendingOrdersCount})`, alert: pendingOrdersCount > 0 },
                  { id: 'accepted', label: `Accepted (${acceptedOrdersCount})` },
                  { id: 'rejected', label: `Rejected (${orders.filter(o => o.decision === 'rejected').length})` }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setOrderStatusFilter(filter.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                      orderStatusFilter === filter.id
                        ? 'bg-[#1C1E21] text-white shadow-xs'
                        : 'bg-[#F1F5F9] text-neutral-600 hover:bg-[#E2E8F0]'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredOrders.map(order => {
                const currentStageObj = ORDER_STAGES[(order.currentStep || 1) - 1] || ORDER_STAGES[0];
                const isPending = order.decision === 'pending';
                const isAccepted = order.decision === 'accepted';
                const isRejected = order.decision === 'rejected';

                return (
                  <div 
                    key={order.id}
                    className={`bg-white rounded-2xl border p-4 shadow-xs flex flex-col justify-between transition-all ${
                      isPending 
                        ? 'border-amber-300 ring-1 ring-amber-100' 
                        : isRejected 
                          ? 'border-rose-200' 
                          : 'border-[#E2E8F0] hover:border-[#11A0AB]/50'
                    }`}
                  >
                    <div>
                      {/* Top Row: Order ID and Status Pill */}
                      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#F1F5F9]">
                        <div>
                          <span className="font-mono text-xs sm:text-sm font-bold text-[#1C1E21]">
                            #{order.id}
                          </span>
                          <span className="text-[11px] text-neutral-400 block">
                            {order.date} {order.time ? `• ${order.time}` : ''}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {isPending && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-[11px] font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Review Pending
                            </span>
                          )}
                          {isAccepted && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-medium">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              {currentStageObj.label}
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-full text-[11px] font-medium">
                              <XCircle className="w-3 h-3 text-rose-500" />
                              Rejected
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Customer Info Card */}
                      <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] my-3 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-neutral-900">{order.customerName || 'Guest Shopper'}</span>
                          <span className="font-mono text-neutral-600">{order.phone || order.customerPhone}</span>
                        </div>
                        {order.shippingAddress && (
                          <div className="flex items-start gap-1 text-[11px] text-neutral-500">
                            <MapPin className="w-3 h-3 text-neutral-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{order.shippingAddress}</span>
                          </div>
                        )}
                      </div>

                      {/* Items Summary & Total */}
                      <div className="flex items-center justify-between text-xs py-1">
                        <span className="text-neutral-500">
                          {order.items?.length || 0} {(order.items?.length === 1 ? 'item' : 'items')}
                        </span>
                        <span className="font-bold text-base text-[#11A0AB]">
                          ₹{(order.total || 0).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* 4-Stage Lifecycle Stepper if Accepted */}
                      {isAccepted && (
                        <div className="mt-3 p-2.5 bg-[#F0FDFA] rounded-xl border border-[#CCFBF1]">
                          <div className="flex items-center justify-between text-[11px] text-neutral-600 mb-2 font-medium">
                            <span>Stage: <strong>{currentStageObj.label}</strong></span>
                            <span className="text-[#11A0AB] font-semibold">{order.currentStep || 1}/4</span>
                          </div>
                          
                          {/* 4 Step Buttons - Curve Edged & Easy to Tap on Mobile */}
                          <div className="grid grid-cols-4 gap-1.5">
                            {ORDER_STAGES.map(st => {
                              const isActive = (order.currentStep || 1) === st.step;
                              const isDone = (order.currentStep || 1) > st.step;

                              return (
                                <button
                                  key={st.step}
                                  type="button"
                                  onClick={() => updateOrderStage(order.id, st.step)}
                                  className={`py-1.5 px-1 rounded-lg text-[10px] font-semibold text-center transition-all cursor-pointer ${
                                    isActive
                                      ? 'bg-[#11A0AB] text-white shadow-xs'
                                      : isDone
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-white text-neutral-500 border border-neutral-200 hover:bg-neutral-50'
                                  }`}
                                  title={`Set to Stage ${st.step}: ${st.label}`}
                                >
                                  {st.step}. {st.label.split(' ')[0]}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Order Action Buttons Row */}
                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-[#F1F5F9]">
                      
                      {/* Direct WhatsApp Customer Button */}
                      <button
                        type="button"
                        onClick={() => handleWhatsAppCustomer(order)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
                        title="Chat with customer on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>WhatsApp</span>
                      </button>

                      {/* Decision buttons (Accept / Reject) */}
                      <div className="flex items-center gap-1.5">
                        {isPending && (
                          <>
                            <button
                              type="button"
                              onClick={() => updateOrderDecision(order.id, 'accepted')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer"
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() => updateOrderDecision(order.id, 'rejected')}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-full text-xs font-medium transition-all cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {isAccepted && (
                          <button
                            type="button"
                            onClick={() => updateOrderDecision(order.id, 'pending')}
                            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
                            title="Reset to Pending"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete order #${order.id}?`)) {
                              deleteOrder(order.id);
                              showToast('Order deleted');
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}

              {filteredOrders.length === 0 && (
                <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-[#CBD5E1] p-6">
                  <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                  <p className="text-base font-semibold text-neutral-800 mb-1">No orders found</p>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                    Orders will appear here as soon as shoppers complete checkout via WhatsApp.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: SETTINGS (SIMPLE & CLEAN) */}
        {/* ======================================================== */}
        {adminTab === 'settings' && (
          <div className="max-w-xl mx-auto space-y-6">
            
            {/* 1. Store Settings Card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-[#1C1E21]">
                  Store Settings
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Manage boutique contact numbers, delivery charges and payment details.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                
                {/* WhatsApp Number */}
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Boutique WhatsApp Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={storeConfig.whatsappNumber || '8511556155'}
                      onChange={(e) => setStoreConfig(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#11A0AB]/30"
                      placeholder="e.g. 8511556155"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Shoppers will click "Buy via WhatsApp" which directs directly to this phone.
                  </p>
                </div>

                {/* Store Name */}
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Store / Boutique Name
                  </label>
                  <input
                    type="text"
                    value={storeConfig.storeName || 'Kundan Work Creation'}
                    onChange={(e) => setStoreConfig(prev => ({ ...prev, storeName: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#11A0AB]/30"
                  />
                </div>

                {/* Tagline */}
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={storeConfig.tagline || 'Artisanal Ethnic & Western Wear'}
                    onChange={(e) => setStoreConfig(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#11A0AB]/30"
                  />
                </div>

                {/* Save Confirmation Button */}
                <div className="pt-3 border-t border-[#F1F5F9]">
                  <button
                    type="button"
                    onClick={() => showToast('Store settings saved successfully!')}
                    className="w-full py-3 bg-[#11A0AB] hover:bg-[#0E848D] text-white rounded-full text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    Save Store Settings
                  </button>
                </div>

              </div>
            </div>

            {/* 2. Admin Security & Password Card (Super Secure) */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-[#F1F5F9]">
                <div className="w-9 h-9 rounded-full bg-[#11A0AB]/10 flex items-center justify-center text-[#11A0AB]">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1C1E21]">
                    Admin Security & Password
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Update the master password used to unlock this admin panel.
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Current Admin Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current admin password"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#11A0AB]/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600 p-0.5 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full pl-3.5 pr-10 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#11A0AB]/30"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600 p-0.5 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#11A0AB]/30"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isChangingPass}
                    className="w-full py-3 bg-[#2E333D] hover:bg-[#1C1E21] active:scale-98 disabled:opacity-60 text-white rounded-full text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isChangingPass ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-[#11A0AB]" />
                        <span>Update Admin Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* POPUP: ADD / EDIT PRODUCT (SUPER SIMPLE, NO SUBTITLE, NO CATEGORY) */}
      {/* ======================================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] max-w-lg w-full p-5 sm:p-6 shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#1C1E21]">
                  {editingProductId ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Quick and simple product addition with direct camera photo upload.
                </p>
              </div>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              {/* Product Photos Upload (Up to 3) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-neutral-700 font-semibold">
                    Product Photos ({productForm.images.length}/3)
                  </label>
                  <span className="text-[11px] text-neutral-400">
                    {productForm.images.length >= 3 ? 'Max 3 photos' : 'Tap below to add'}
                  </span>
                </div>

                {/* Previews */}
                <div className="grid grid-cols-3 gap-2 mb-2.5">
                  {productForm.images.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC] group shadow-xs"
                    >
                      <img 
                        src={img} 
                        alt={`Photo ${idx + 1}`} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute top-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded-full font-medium">
                        {idx === 0 ? 'Cover' : `#${idx + 1}`}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-colors shadow-xs cursor-pointer"
                        title="Remove photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Empty Slot Placeholder */}
                  {productForm.images.length < 3 && (
                    <div className="relative aspect-[3/4] rounded-xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] flex flex-col items-center justify-center p-2 text-center">
                      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#11A0AB] shadow-xs mb-1">
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <span className="text-[10px] font-medium text-neutral-600">Slot {productForm.images.length + 1}</span>
                      <span className="text-[9px] text-neutral-400">Ready</span>
                    </div>
                  )}
                </div>

                {/* Direct Camera & Gallery Action Buttons */}
                {productForm.images.length < 3 && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputCameraRef.current?.click()}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-neutral-800 border border-[#CBD5E1] rounded-full text-xs font-medium transition-colors shadow-xs active:scale-95 cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-[#11A0AB]" />
                      <span>Take Photo</span>
                    </button>
                    <input
                      ref={fileInputCameraRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputGalleryRef.current?.click()}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-neutral-800 border border-[#CBD5E1] rounded-full text-xs font-medium transition-colors shadow-xs active:scale-95 cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-[#11A0AB]" />
                      <span>Choose Gallery</span>
                    </button>
                    <input
                      ref={fileInputGalleryRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Product Title (Required) */}
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Pure Mulberry Silk Anarkali Set"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#11A0AB]/30"
                />
              </div>

              {/* Price & Original MRP in 2 Columns */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="e.g. 1899"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#11A0AB]/30"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    MRP / Original (₹) <span className="font-normal text-neutral-400 text-[10px]">(optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                    placeholder="e.g. 2499"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#11A0AB]/30"
                  />
                </div>
              </div>

              {/* Stock Units Stepper */}
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Stock Units Available *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-28 px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#11A0AB]/30"
                  />
                  <div className="flex items-center gap-1.5">
                    {Number(productForm.stock) > 0 ? (
                      <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>In Stock</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1">
                        <X className="w-3.5 h-3.5" />
                        <span>Out of Stock</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description (Optional) */}
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Description / Details <span className="font-normal text-neutral-400 text-[10px]">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Fabric, embroidery, fit, care instructions..."
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#11A0AB]/30"
                />
              </div>

              {/* Curve-Edged Submit & Cancel Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#11A0AB] hover:bg-[#0E848D] text-white rounded-full text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  {editingProductId ? 'Update Product' : 'Save Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
