import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Package, 
  Settings, 
  Check, 
  Sparkles, 
  Tag, 
  Search, 
  Eye,
  Camera,
  Image as ImageIcon,
  ShoppingBag,
  Truck,
  Box,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Phone,
  MessageCircle,
  ExternalLink,
  Lock,
  Unlock,
  Filter,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { useStore, ORDER_STAGES } from '../context/StoreContext';
import { FashionPlaceholder } from './Placeholders';
import { LotusIcon } from './Header';

// Client-side image compression helper: keeps aspect ratio, max 1200px dimension, high-performance JPEG
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
    categories, 
    orders,
    updateOrderDecision,
    updateOrderStage,
    deleteOrder,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    storeConfig, 
    setStoreConfig, 
    showToast 
  } = useStore();

  // Admin Active Tab: 'products' | 'orders' | 'settings'
  const [adminTab, setAdminTab] = useState('products');
  const [productSubTab, setProductSubTab] = useState('items'); // 'items' | 'categories'

  // Order Management State
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all'); // 'all' | 'pending' | 'accepted' | 'rejected'

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || null;

  // Ref inputs for camera and gallery
  const fileInputCameraRef = useRef(null);
  const fileInputGalleryRef = useRef(null);

  // Simplified Product Form State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    subtitle: '',
    categorySlug: '',
    price: '',
    stock: '10',
    description: '',
    images: [] // Up to 3 images
  });

  // Category Form State (for Add or Edit)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    subtitle: '',
    displayType: 'circular_pill', // 'featured_card' | 'circular_pill'
    placeholderKey: 'kurta',
    imageUrl: '',
    description: ''
  });

  // Filter products in admin
  const [adminSearch, setAdminSearch] = useState('');

  // Handle open product modal
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      title: '',
      subtitle: '',
      categorySlug: categories[0]?.slug || 'general',
      price: '',
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
      title: prod.title || '',
      subtitle: prod.subtitle || '',
      categorySlug: prod.categorySlug || (categories[0]?.slug || 'general'),
      price: prod.price ?? '',
      stock: prod.stock !== undefined ? String(prod.stock) : (prod.inStock === false ? '0' : '10'),
      description: prod.description || '',
      images: existingImages
    });
    setIsProductModalOpen(true);
  };

  // Handle uploading photos from camera or gallery (up to 3)
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

    // Reset input value so subsequent uploads of the same file trigger properly
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
    const payload = {
      title: productForm.title.trim(),
      subtitle: productForm.subtitle ? productForm.subtitle.trim() : '',
      categorySlug: productForm.categorySlug || (categories[0]?.slug || 'general'),
      price: Number(productForm.price),
      originalPrice: Number(productForm.price),
      stock: stockNum,
      inStock: stockNum > 0,
      description: productForm.description ? productForm.description.trim() : '',
      images: productForm.images,
      imageUrl: firstImage,
      gallery: productForm.images
    };

    if (editingProductId) {
      updateProduct(editingProductId, payload);
    } else {
      addProduct(payload);
    }
    setIsProductModalOpen(false);
  };

  // Handle open category modal
  const handleOpenAddCategory = () => {
    setEditingCategoryId(null);
    setCategoryForm({
      name: '',
      subtitle: '',
      displayType: 'circular_pill',
      placeholderKey: 'kurta',
      imageUrl: '',
      description: ''
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setCategoryForm({
      name: cat.name,
      subtitle: cat.subtitle || '',
      displayType: cat.displayType || 'circular_pill',
      placeholderKey: cat.placeholderKey || 'kurta',
      imageUrl: cat.imageUrl || '',
      description: cat.description || ''
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    if (editingCategoryId) {
      updateCategory(editingCategoryId, categoryForm);
    } else {
      addCategory(categoryForm);
    }
    setIsCategoryModalOpen(false);
  };

  const filteredAdminProducts = products.filter(p => 
    p.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
    p.categorySlug.toLowerCase().includes(adminSearch.toLowerCase())
  );

  // Orders filtering and counts
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
  const rejectedOrdersCount = orders.filter(o => o.decision === 'rejected').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#FAF8F5] flex flex-col">
      
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-20 bg-[#241F1C] text-white border-b border-[#38312C] shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LotusIcon className="w-6 h-5 text-[#D9B58B]" color="#D9B58B" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-sm sm:text-base font-semibold tracking-wider uppercase text-[#FAF8F5]">
                  Kundan Works Admin
                </h1>
                <span className="text-[10px] bg-[#A77D5E] px-2 py-0.5 rounded-full font-sans tracking-wide">
                  Store Manager
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-light">
                Catalog, Category & Order Management System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3B332D] hover:bg-[#4E443D] text-[#FAF8F5] rounded-lg text-xs tracking-wider uppercase font-medium transition-colors"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Close Admin</span>
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-white/10 pt-1">
          <button
            onClick={() => setAdminTab('products')}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
              adminTab === 'products'
                ? 'border-[#D9B58B] text-[#D9B58B]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Products & Categories</span>
          </button>

          <button
            onClick={() => setAdminTab('orders')}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
              adminTab === 'orders'
                ? 'border-[#D9B58B] text-[#D9B58B]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-neutral-950 font-bold text-[10px] rounded-full animate-pulse">
                {pendingOrdersCount} new
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('settings')}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
              adminTab === 'settings'
                ? 'border-[#D9B58B] text-[#D9B58B]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Boutique Settings</span>
          </button>
        </div>
      </header>

      {/* Admin Content Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 pb-24">
        
        {/* TAB 1: PRODUCTS & CATEGORIES */}
        {adminTab === 'products' && (
          <div className="space-y-6">
            
            {/* Subtab Toggle for Products vs Categories */}
            <div className="bg-white p-2 rounded-xl border border-[#EAE0D4] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1 bg-[#F4ECE3] p-1 rounded-lg">
                <button
                  onClick={() => setProductSubTab('items')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    productSubTab === 'items'
                      ? 'bg-white text-brand-900 shadow-xs font-semibold'
                      : 'text-[#645244] hover:text-brand-900'
                  }`}
                >
                  Manage Products ({products.length})
                </button>
                <button
                  onClick={() => setProductSubTab('categories')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    productSubTab === 'categories'
                      ? 'bg-white text-brand-900 shadow-xs font-semibold'
                      : 'text-[#645244] hover:text-brand-900'
                  }`}
                >
                  Control Categories ({categories.length})
                </button>
              </div>

              <div>
                {productSubTab === 'items' ? (
                  <button
                    onClick={handleOpenAddProduct}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-xs uppercase tracking-wider font-medium shadow-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                ) : (
                  <button
                    onClick={handleOpenAddCategory}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#241F1C] hover:bg-[#3B332D] text-white rounded-lg text-xs uppercase tracking-wider font-medium shadow-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Category</span>
                  </button>
                )}
              </div>
            </div>

            {/* SUBTAB CONTENT A: PRODUCTS LIST */}
            {productSubTab === 'items' && (
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    placeholder="Search product inventory..."
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E2D5C8] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                {/* Product Grid / Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAdminProducts.map(prod => (
                    <div 
                      key={prod.id} 
                      className="bg-white rounded-xl border border-[#EAE0D4] p-3.5 shadow-xs flex gap-3.5 items-start relative hover:border-brand-300 transition-all"
                    >
                      {/* Thumbnail */}
                      <div className="w-20 h-24 rounded-lg overflow-hidden shrink-0 bg-[#F4ECE3] relative border border-[#E5DACD]">
                        {(prod.images && prod.images.length > 0) ? (
                          <img 
                            src={prod.images[0]} 
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
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-[10px] uppercase font-semibold text-brand-700 tracking-wider">
                            {prod.categorySlug}
                          </span>
                          {prod.tag && (
                            <span className="text-[9px] bg-brand-100 text-brand-800 px-1.5 py-0.2 rounded font-medium">
                              {prod.tag}
                            </span>
                          )}
                        </div>

                        <h4 className="font-serif text-sm font-medium text-[#221B16] line-clamp-1">
                          {prod.title}
                        </h4>

                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="font-serif font-bold text-sm text-[#1E1A17]">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                          {prod.originalPrice > prod.price && (
                            <span className="text-xs text-neutral-400 line-through">
                              ₹{prod.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                            (prod.stock ?? 10) > 3 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : (prod.stock ?? 10) > 0 
                                ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {(prod.stock ?? 10) > 0 ? `Stock: ${prod.stock ?? 10} units` : 'Out of Stock'}
                          </span>
                        </div>

                        <p className="text-[11px] text-neutral-500 line-clamp-1 mt-1 font-light">
                          {prod.description || prod.subtitle || ''}
                        </p>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#F2ECE4]">
                          <button
                            onClick={() => {
                              onClose();
                              navigate(`/product/${prod.id}`);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#221B16] hover:text-brand-800"
                            title="Open separate product page"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Page</span>
                          </button>
                          <span className="text-neutral-300">•</span>
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-700 hover:text-brand-900"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <span className="text-neutral-300">•</span>
                          <button
                            onClick={() => deleteProduct(prod.id)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 hover:text-rose-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredAdminProducts.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-[#DAC8B8] p-6">
                      <p className="font-serif text-base text-[#3E3834] mb-1">No products found</p>
                      <p className="text-xs text-neutral-500 mb-4">You can add your first design with photos by clicking below.</p>
                      <button
                        onClick={handleOpenAddProduct}
                        className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-xs uppercase tracking-wider font-medium shadow-xs"
                      >
                        + Add First Product
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUBTAB CONTENT B: CATEGORIES CONTROLLER */}
            {productSubTab === 'categories' && (
              <div className="space-y-6">
                <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-xl text-xs text-amber-900 leading-relaxed">
                  <span className="font-semibold block mb-0.5">Category Architecture Info:</span>
                  Categories set to <span className="font-semibold underline">Featured Card</span> render as the large hero category cards on the homepage (like Ethnic Wear & Western Wear). Categories set to <span className="font-semibold underline">Circular Pill</span> render in the circular avatar bar below it.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <div 
                      key={cat.id} 
                      className="bg-white rounded-xl border border-[#EAE0D4] p-4 shadow-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-[#F4ECE3] border border-[#DECBB8] flex items-center justify-center">
                          <FashionPlaceholder 
                            type={cat.placeholderKey || 'kurta'} 
                            imageUrl={cat.imageUrl}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif font-semibold text-sm text-[#221B16]">
                              {cat.name}
                            </h4>
                            <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                              cat.displayType === 'featured_card'
                                ? 'bg-[#241F1C] text-[#FAF8F5]'
                                : 'bg-[#EAE0D4] text-[#6A5342]'
                            }`}>
                              {cat.displayType === 'featured_card' ? 'Featured Card' : 'Circular Pill'}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 font-serif italic mt-0.5">
                            {cat.subtitle || 'No subtitle'}
                          </p>
                          <p className="text-[10px] text-neutral-400 mt-1">
                            Slug: <span className="font-mono">{cat.slug}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditCategory(cat)}
                          className="p-2 text-brand-700 hover:bg-[#F4ECE3] rounded-lg transition-colors"
                          title="Edit Category"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCategory(cat.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {categories.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-[#DAC8B8] p-6">
                      <p className="font-serif text-base text-[#3E3834] mb-1">No categories created yet</p>
                      <p className="text-xs text-neutral-500 mb-4">Create your boutique categories to organize your collections.</p>
                      <button
                        onClick={handleOpenAddCategory}
                        className="px-4 py-2 bg-[#241F1C] hover:bg-[#3B332D] text-white rounded-lg text-xs uppercase tracking-wider font-medium shadow-xs"
                      >
                        + Create First Category
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: ORDERS */}
        {adminTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Header / Filter Toolbar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE0D4] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-medium text-[#221B16] flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-700" />
                  <span>Customer Orders ({orders.length})</span>
                </h2>
                <p className="text-xs text-neutral-500 font-light mt-0.5">
                  Real-time orders received from customers via WhatsApp checkout. Click any card to review details, manage stock, and update fulfillment.
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative min-w-[240px]">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by ID, name, or phone..."
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#DAC8B8] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-brand-700"
                  />
                  {orderSearchQuery && (
                    <button
                      onClick={() => setOrderSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-1 bg-[#F4ECE3] p-1 rounded-xl overflow-x-auto">
                  <button
                    onClick={() => setOrderStatusFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      orderStatusFilter === 'all'
                        ? 'bg-white text-[#221B16] shadow-xs font-semibold'
                        : 'text-[#645244] hover:text-[#221B16]'
                    }`}
                  >
                    All ({orders.length})
                  </button>
                  <button
                    onClick={() => setOrderStatusFilter('pending')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
                      orderStatusFilter === 'pending'
                        ? 'bg-amber-500 text-neutral-950 shadow-xs font-bold'
                        : 'text-[#645244] hover:text-[#221B16]'
                    }`}
                  >
                    <span>Pending</span>
                    {pendingOrdersCount > 0 && (
                      <span className={`px-1 py-0.2 rounded-full text-[9px] ${orderStatusFilter === 'pending' ? 'bg-neutral-950 text-amber-300' : 'bg-amber-200 text-amber-900'}`}>
                        {pendingOrdersCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setOrderStatusFilter('accepted')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      orderStatusFilter === 'accepted'
                        ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                        : 'text-[#645244] hover:text-[#221B16]'
                    }`}
                  >
                    Accepted ({acceptedOrdersCount})
                  </button>
                  <button
                    onClick={() => setOrderStatusFilter('rejected')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      orderStatusFilter === 'rejected'
                        ? 'bg-rose-600 text-white shadow-xs font-semibold'
                        : 'text-[#645244] hover:text-[#221B16]'
                    }`}
                  >
                    Rejected ({rejectedOrdersCount})
                  </button>
                </div>
              </div>
            </div>

            {/* Orders Cards Grid */}
            {filteredOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map((order) => {
                  const currentStageObj = ORDER_STAGES[(order.currentStep || 1) - 1] || ORDER_STAGES[0];
                  const isAccepted = order.decision === 'accepted';
                  const isRejected = order.decision === 'rejected';
                  const isPending = order.decision === 'pending';

                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className={`bg-white rounded-2xl border transition-all p-5 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between group relative ${
                        isPending 
                          ? 'border-amber-300 hover:border-amber-400 ring-1 ring-amber-100' 
                          : isRejected 
                            ? 'border-rose-200 hover:border-rose-300' 
                            : 'border-[#EAE0D4] hover:border-brand-600'
                      }`}
                    >
                      {/* Top Row: Order ID and Status Pill */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-sm font-bold text-[#221B16] tracking-tight group-hover:text-brand-700 transition-colors">
                              #{order.id}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-neutral-400 mt-0.5">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            <span>{order.date}</span>
                            {order.time && <span>• {order.time}</span>}
                          </div>
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

                      {/* Customer Info Preview */}
                      <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EFE5DB] space-y-1.5 mb-4 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-neutral-900 truncate">{order.customerName || 'Guest Customer'}</span>
                          <span className="font-mono text-[11px] text-neutral-600">{order.phone}</span>
                        </div>
                        {order.shippingAddress && (
                          <div className="flex items-center gap-1 text-[11px] text-neutral-500 truncate">
                            <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                            <span className="truncate">{order.shippingAddress}</span>
                          </div>
                        )}
                      </div>

                      {/* Ordered Items Preview & Total */}
                      <div className="pt-2 border-t border-[#F0E6DC] flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {/* Image avatars of items */}
                          <div className="flex -space-x-2 overflow-hidden">
                            {(order.items || []).slice(0, 3).map((item, idx) => {
                              const img = item.product?.images?.[0] || item.product?.imageUrl;
                              return (
                                <div key={idx} className="w-7 h-7 rounded-full bg-neutral-200 border-2 border-white overflow-hidden shrink-0">
                                  {img ? (
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full bg-[#EAE0D4] flex items-center justify-center text-[8px] font-bold text-neutral-600">
                                      KW
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <span className="text-xs text-neutral-600 font-light">
                            {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="font-serif font-semibold text-sm text-[#221B16]">
                            ₹{(order.total || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Fulfillment Stage Mini Track for Accepted Orders */}
                      {isAccepted && (
                        <div className="mt-3 pt-2.5 border-t border-dashed border-[#EAE0D4]">
                          <div className="flex items-center justify-between text-[10px] text-neutral-500 mb-1">
                            <span className="font-medium text-emerald-800">Stage {order.currentStep || 1} of 4:</span>
                            <span className="font-semibold text-neutral-800">{currentStageObj.label}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-1">
                            {ORDER_STAGES.map((s) => (
                              <div
                                key={s.step}
                                className={`h-1.5 rounded-full transition-all ${
                                  (order.currentStep || 1) >= s.step
                                    ? 'bg-emerald-600'
                                    : 'bg-neutral-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Call to action arrow */}
                      <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-brand-700 font-medium group-hover:text-brand-900 transition-colors">
                        <span>View & Manage Order</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-[#D7BEA8] p-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#FAF5EE] border border-[#EAE0D4] flex items-center justify-center mx-auto text-brand-700">
                  <ShoppingBag className="w-7 h-7 stroke-[1.6]" />
                </div>
                {orders.length === 0 ? (
                  <>
                    <h3 className="font-serif text-lg text-[#221B16] font-medium">No Customer Orders Yet</h3>
                    <p className="text-xs text-neutral-500 max-w-md mx-auto font-light leading-relaxed">
                      Real orders will automatically log here as soon as a shopper completes the checkout form and clicks "Buy via WhatsApp".
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="font-serif text-lg text-[#221B16] font-medium">No Matching Orders</h3>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto font-light">
                      No orders found matching "{orderSearchQuery}" with status "{orderStatusFilter}". Try clearing your search.
                    </p>
                    <button
                      onClick={() => { setOrderSearchQuery(''); setOrderStatusFilter('all'); }}
                      className="px-3.5 py-1.5 bg-[#241F1C] text-white rounded-lg text-xs font-medium cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </>
                )}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: SETTINGS */}
        {adminTab === 'settings' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#EAE0D4] p-6 shadow-xs space-y-5">
            <h3 className="font-serif text-lg font-medium text-[#221B16] pb-3 border-b border-[#EAE0D4]">
              Store & Branding Configuration
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">Store Name</label>
                <input
                  type="text"
                  value={storeConfig.storeName}
                  onChange={(e) => setStoreConfig(prev => ({ ...prev, storeName: e.target.value }))}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#DECBB8] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={storeConfig.tagline}
                  onChange={(e) => setStoreConfig(prev => ({ ...prev, tagline: e.target.value }))}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#DECBB8] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">Announcement Strip Text</label>
                <input
                  type="text"
                  value={storeConfig.promoBanner}
                  onChange={(e) => setStoreConfig(prev => ({ ...prev, promoBanner: e.target.value }))}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#DECBB8] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">Boutique WhatsApp Number</label>
                <input
                  type="text"
                  value={storeConfig.whatsappNumber}
                  onChange={(e) => setStoreConfig(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#DECBB8] rounded-lg text-sm"
                />
              </div>

            </div>
          </div>
        )}

      </main>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#D7BEA8] max-w-lg w-full p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE0D4] mb-4">
              <h3 className="font-serif text-lg font-medium text-[#221B16]">
                {editingProductId ? 'Edit Product' : 'Add New Design'}
              </h3>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full text-neutral-500 hover:bg-[#EDE2D4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Product Title */}
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Mulberry Silk Anarkali Set"
                  className="w-full p-2.5 bg-white border border-[#DAC6B4] rounded-lg text-sm"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Subtitle / Short Note</label>
                <input
                  type="text"
                  value={productForm.subtitle}
                  onChange={(e) => setProductForm(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="e.g. Pure handwoven elegance"
                  className="w-full p-2.5 bg-white border border-[#DAC6B4] rounded-lg text-sm"
                />
              </div>

              {/* Single Price Input Area, Stock Availability & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="2999"
                    className="w-full p-2.5 bg-white border border-[#DAC6B4] rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Stock Availability (Units) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                    placeholder="10"
                    className="w-full p-2.5 bg-white border border-[#DAC6B4] rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Category *</label>
                  <select
                    value={productForm.categorySlug}
                    onChange={(e) => setProductForm(prev => ({ ...prev, categorySlug: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-[#DAC6B4] rounded-lg text-sm"
                  >
                    {categories.length === 0 ? (
                      <option value="general">General Collection</option>
                    ) : (
                      categories.map(c => (
                        <option key={c.id} value={c.slug}>{c.name}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* Stock Live Status Indicator */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-500 font-medium">Availability Status:</span>
                {Number(productForm.stock) > 0 ? (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>In Stock ({productForm.stock} units)</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 font-medium flex items-center gap-1">
                    <X className="w-3 h-3 text-rose-600" />
                    <span>Out of Stock (0 units)</span>
                  </span>
                )}
                <span className="text-[11px] text-neutral-400 font-light hidden sm:inline">
                  • Stock automatically deducts when you accept an order
                </span>
              </div>

              {/* Direct Camera or Gallery Photos Upload (Up to 3 per product) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-neutral-700 font-medium">
                    Product Photos ({productForm.images.length}/3)
                  </label>
                  <span className="text-[11px] text-neutral-500">
                    {productForm.images.length >= 3 ? 'Maximum 3 photos reached' : 'Direct from Camera or Gallery'}
                  </span>
                </div>

                {/* Uploaded Photos Preview Thumbnails */}
                <div className="grid grid-cols-3 gap-2.5 mb-3">
                  {productForm.images.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="relative aspect-[3/4] rounded-lg overflow-hidden border border-[#D7BEA8] bg-[#F2ECE4] shadow-xs group"
                    >
                      <img 
                        src={img} 
                        alt={`Photo ${idx + 1}`} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute top-1 left-1 bg-black/65 text-white text-[9px] px-1.5 py-0.5 rounded font-medium">
                        {idx === 0 ? 'Cover' : `#${idx + 1}`}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-rose-600/90 hover:bg-rose-700 text-white rounded-full transition-colors shadow-xs"
                        title="Remove photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Empty Slot Placeholder if < 3 */}
                  {productForm.images.length < 3 && (
                    <div className="relative aspect-[3/4] rounded-lg border-2 border-dashed border-[#D5BEA8] bg-[#F7F2EB] flex flex-col items-center justify-center p-2 text-center">
                      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-brand-700 shadow-xs mb-1">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-medium text-neutral-700">Slot {productForm.images.length + 1}</span>
                      <span className="text-[9px] text-neutral-400">Available</span>
                    </div>
                  )}
                </div>

                {/* Camera & Gallery Direct Buttons */}
                {productForm.images.length < 3 && (
                  <div className="grid grid-cols-2 gap-2">
                    {/* Camera direct button (capture="environment") */}
                    <button
                      type="button"
                      onClick={() => fileInputCameraRef.current?.click()}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-[#D7BEA8] hover:bg-[#F3ECE4] text-neutral-800 rounded-lg transition-colors shadow-xs active:scale-95 cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-brand-700" />
                      <span className="font-medium text-xs">Take Photo</span>
                    </button>
                    <input
                      ref={fileInputCameraRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    {/* Gallery direct button */}
                    <button
                      type="button"
                      onClick={() => fileInputGalleryRef.current?.click()}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-[#D7BEA8] hover:bg-[#F3ECE4] text-neutral-800 rounded-lg transition-colors shadow-xs active:scale-95 cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-brand-700" />
                      <span className="font-medium text-xs">Choose Gallery</span>
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

              {/* Description textarea */}
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the silhouette, embroidery, occasion and fit..."
                  className="w-full p-2.5 bg-white border border-[#DAC6B4] rounded-lg text-sm"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAE0D4]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-lg font-medium shadow-xs"
                >
                  {editingProductId ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CATEGORY */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#D7BEA8] max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE0D4] mb-4">
              <h3 className="font-serif text-lg font-medium text-[#221B16]">
                {editingCategoryId ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 rounded-full text-neutral-500 hover:bg-[#EDE2D4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. DUPATTAS & STOLES"
                  className="w-full p-2.5 bg-white border border-[#DAC6B4] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={categoryForm.subtitle}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="e.g. Ethereal Silks"
                  className="w-full p-2.5 bg-white border border-[#DAC6B4] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Homepage Display Presentation *</label>
                <select
                  value={categoryForm.displayType}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, displayType: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-[#DAC6B4] rounded-lg text-sm"
                >
                  <option value="featured_card">Featured Large Card (like Ethnic / Western Wear)</option>
                  <option value="circular_pill">Circular Pill Avatar (like Kurtas, Sarees, etc.)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Placeholder Style</label>
                <select
                  value={categoryForm.placeholderKey}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, placeholderKey: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-[#DAC6B4] rounded-lg text-sm"
                >
                  <option value="kurta">Kurta Silhouette</option>
                  <option value="top">Shirts & Tops</option>
                  <option value="saree">Saree Pleats</option>
                  <option value="bottom">Tailored Bottoms</option>
                  <option value="ethnic_featured">Ethnic Wear Card</option>
                  <option value="western_featured">Western Wear Card</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAE0D4]">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#241F1C] hover:bg-[#3B332D] text-white rounded-lg font-medium shadow-xs"
                >
                  {editingCategoryId ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER DETAILS POPUP WITH 4-STAGE SLIDER & ACCEPT/REJECT */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#FAF8F5] rounded-2xl sm:rounded-3xl border border-[#D7BEA8] max-w-2xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-fadeIn my-auto">
            
            {/* Modal Header */}
            <div className="bg-[#241F1C] text-white px-5 py-4 flex items-center justify-between border-b border-[#3E352F] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#3E352F] border border-[#52463F] flex items-center justify-center text-[#D9B58B]">
                  <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono text-base sm:text-lg font-bold text-white tracking-tight">
                      #{selectedOrder.id}
                    </h3>
                    {selectedOrder.decision === 'pending' && (
                      <span className="text-[10px] px-2 py-0.5 bg-amber-500 text-neutral-950 font-bold rounded-full uppercase tracking-wider">
                        Pending
                      </span>
                    )}
                    {selectedOrder.decision === 'accepted' && (
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-600 text-white font-bold rounded-full uppercase tracking-wider">
                        Accepted
                      </span>
                    )}
                    {selectedOrder.decision === 'rejected' && (
                      <span className="text-[10px] px-2 py-0.5 bg-rose-600 text-white font-bold rounded-full uppercase tracking-wider">
                        Rejected
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-300 font-light">
                    Placed on {selectedOrder.date} {selectedOrder.time ? `at ${selectedOrder.time}` : ''}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderId(null)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              
              {/* 1. Customer Details & Direct WhatsApp Action */}
              <div className="bg-white rounded-2xl border border-[#EAE0D4] p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#F0E6DC]">
                  <span className="text-[11px] text-[#8C6D52] font-semibold uppercase tracking-wider">
                    Customer Information
                  </span>
                  {selectedOrder.phone && (
                    <a
                      href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hi ${selectedOrder.customerName}, this is Kundan Works regarding your order #${selectedOrder.id}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Customer</span>
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] text-neutral-400 block mb-0.5">Full Name</span>
                    <span className="font-semibold text-neutral-900 text-sm">{selectedOrder.customerName || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-400 block mb-0.5">Mobile Number</span>
                    <span className="font-mono font-medium text-neutral-900">{selectedOrder.phone || 'Not specified'}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[11px] text-neutral-400 block mb-0.5">Delivery Address / Location</span>
                    <div className="flex items-start gap-1.5 text-neutral-800">
                      <MapPin className="w-3.5 h-3.5 text-brand-600 mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{selectedOrder.shippingAddress || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Ordered Items List */}
              <div className="bg-white rounded-2xl border border-[#EAE0D4] p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#F0E6DC]">
                  <span className="text-[11px] text-[#8C6D52] font-semibold uppercase tracking-wider">
                    Ordered Ensemble ({selectedOrder.items?.length || 0})
                  </span>
                  <span className="text-xs text-neutral-400 font-light">
                    Complimentary Express Delivery
                  </span>
                </div>

                <div className="divide-y divide-[#F0E6DC]">
                  {(selectedOrder.items || []).map((item, idx) => {
                    const itemImg = item.product?.images?.[0] || item.product?.imageUrl;
                    return (
                      <div key={idx} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-16 rounded-xl bg-neutral-100 overflow-hidden shrink-0 border border-[#E0D2C2]">
                            {itemImg ? (
                              <img src={itemImg} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <FashionPlaceholder category="kurta" className="w-full h-full" iconClassName="w-5 h-5 text-neutral-300" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-neutral-900 line-clamp-1">
                              {item.product?.title || 'Boutique Piece'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[11px] px-2 py-0.5 bg-[#FAF8F5] border border-[#E0D2C2] rounded-md font-medium text-neutral-700">
                                Size: {item.size}
                              </span>
                              <span className="text-[11px] text-neutral-500">
                                Qty: {item.quantity}
                              </span>
                            </div>
                            {item.product?.id && (
                              <a
                                href={`/product/${item.product.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-brand-700 hover:underline mt-1"
                              >
                                <span>View Product</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-serif font-semibold text-xs sm:text-sm text-neutral-900 block">
                            ₹{((item.product?.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            (₹{item.product?.price || 0} each)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-[#DECBB8] flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-700">Total Order Value</span>
                  <span className="font-serif text-lg font-bold text-brand-900">
                    ₹{(selectedOrder.total || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* 3. Accept vs Reject Decision Controls */}
              <div className="bg-white rounded-2xl border border-[#EAE0D4] p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#F0E6DC]">
                  <span className="text-[11px] text-[#8C6D52] font-semibold uppercase tracking-wider">
                    Studio Order Decision
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Required to unlock fulfillment
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  {/* Accept Button */}
                  <button
                    type="button"
                    onClick={() => updateOrderDecision(selectedOrder.id, 'accepted')}
                    className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedOrder.decision === 'accepted'
                        ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-600/30'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{selectedOrder.decision === 'accepted' ? '✓ Order Accepted' : 'Accept Order'}</span>
                  </button>

                  {/* Reject Button */}
                  <button
                    type="button"
                    onClick={() => updateOrderDecision(selectedOrder.id, 'rejected')}
                    className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedOrder.decision === 'rejected'
                        ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-600/30'
                        : 'bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100'
                    }`}
                  >
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>{selectedOrder.decision === 'rejected' ? '✕ Order Rejected' : 'Reject Order'}</span>
                  </button>
                </div>

                {/* Helpful status notice */}
                <div className="mt-2 text-xs">
                  {selectedOrder.decision === 'pending' && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Action Needed:</strong> Select <strong>Accept Order</strong> to confirm and automatically deduct inventory stock, or <strong>Reject Order</strong> to decline.
                      </span>
                    </div>
                  )}
                  {selectedOrder.decision === 'accepted' && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Order Accepted!</strong> Inventory stock has been automatically deducted. The 4-stage fulfillment slider below is now unlocked.
                      </span>
                    </div>
                  )}
                  {selectedOrder.decision === 'rejected' && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Order Marked as Rejected:</strong> The fulfillment slider is disabled. Product stock has been safely restored.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. The 4-Stage Fulfillment Slider */}
              {/* Slider is disabled if admin does not accept the order */}
              {(() => {
                const isSliderDisabled = selectedOrder.decision !== 'accepted';
                const currentStepVal = selectedOrder.currentStep || 1;
                const currentStageObj = ORDER_STAGES[currentStepVal - 1] || ORDER_STAGES[0];
                const progressFillPct = ((currentStepVal - 1) / (ORDER_STAGES.length - 1)) * 100;

                return (
                  <div className={`bg-white rounded-2xl border transition-all p-4 sm:p-6 shadow-xs space-y-4 ${
                    isSliderDisabled ? 'border-neutral-300 opacity-60' : 'border-[#D7BEA8]'
                  }`}>
                    {/* Header of Slider Section */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DC]">
                      <div className="flex items-center gap-2">
                        {isSliderDisabled ? (
                          <div className="p-1.5 rounded-lg bg-neutral-200 text-neutral-600">
                            <Lock className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                            <Truck className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <span className="font-serif text-sm font-medium text-neutral-900 block">
                            Fulfillment Lifecycle (4 Stages)
                          </span>
                          <span className="text-[11px] text-neutral-500 font-light">
                            {isSliderDisabled
                              ? 'Slider disabled — Accept order to unlock'
                              : `Current Stage: ${currentStageObj.label}`}
                          </span>
                        </div>
                      </div>

                      {/* Lock/Active Badge */}
                      <div>
                        {isSliderDisabled ? (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-300 font-medium">
                            <Lock className="w-3 h-3" />
                            Disabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
                            <Unlock className="w-3 h-3" />
                            Unlocked
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 4 Milestones Visual Stepper */}
                    <div className="relative pt-4 pb-2">
                      {/* Connecting Line Behind Buttons */}
                      <div className="absolute top-8 left-6 right-6 h-1 bg-neutral-200 rounded-full z-0">
                        <div 
                          className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                          style={{ width: `${progressFillPct}%` }}
                        />
                      </div>

                      {/* The 4 Stage Milestone Buttons */}
                      <div className="relative z-10 grid grid-cols-4 gap-2 text-center">
                        {ORDER_STAGES.map((st) => {
                          const isCompleted = currentStepVal > st.step;
                          const isCurrent = currentStepVal === st.step;

                          return (
                            <button
                              key={st.step}
                              type="button"
                              disabled={isSliderDisabled}
                              onClick={() => updateOrderStage(selectedOrder.id, st.step)}
                              className={`flex flex-col items-center group transition-all ${
                                isSliderDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                              }`}
                            >
                              {/* Circle indicator */}
                              <div
                                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                                  isCompleted
                                    ? 'bg-emerald-600 text-white'
                                    : isCurrent
                                      ? 'bg-brand-700 text-white ring-4 ring-brand-700/20 scale-110'
                                      : 'bg-white text-neutral-500 border border-neutral-300'
                                }`}
                              >
                                {isCompleted ? (
                                  <Check className="w-4 h-4 stroke-[3]" />
                                ) : (
                                  <span>{st.step}</span>
                                )}
                              </div>

                              {/* Label */}
                              <span className={`text-[11px] sm:text-xs font-semibold mt-2 block transition-colors leading-tight ${
                                isCurrent 
                                  ? 'text-brand-900 font-bold' 
                                  : isCompleted 
                                    ? 'text-emerald-900' 
                                    : 'text-neutral-500'
                              }`}>
                                {st.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* The Interactive Native Range Slider */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between items-center text-[10px] text-neutral-400 px-1 font-mono">
                        <span>1. Confirmed</span>
                        <span>2. Packed</span>
                        <span>3. Shipped</span>
                        <span>4. Delivered</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="4"
                        step="1"
                        value={currentStepVal}
                        disabled={isSliderDisabled}
                        onChange={(e) => updateOrderStage(selectedOrder.id, Number(e.target.value))}
                        className="w-full h-2.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-brand-700 disabled:cursor-not-allowed disabled:accent-neutral-400"
                      />
                    </div>

                    {/* Stage Description Box */}
                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE0D4] text-xs">
                      <div className="flex items-center gap-2 font-semibold text-neutral-900">
                        <Truck className="w-3.5 h-3.5 text-brand-700" />
                        <span>Stage {currentStepVal}: {currentStageObj.label}</span>
                      </div>
                      <p className="text-[11px] text-neutral-600 font-light mt-0.5">
                        {currentStageObj.desc}
                      </p>
                    </div>

                  </div>
                );
              })()}

            </div>

            {/* Modal Footer */}
            <div className="bg-[#FAF8F5] px-5 py-3.5 border-t border-[#EAE0D4] flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete order #${selectedOrder.id}? This cannot be undone.`)) {
                    deleteOrder(selectedOrder.id);
                    setSelectedOrderId(null);
                  }
                }}
                className="px-3 py-2 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Order</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOrderId(null)}
                className="px-5 py-2 bg-[#241F1C] hover:bg-[#3B332D] text-white rounded-xl text-xs uppercase tracking-wider font-semibold shadow-xs transition-all cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
