import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Package, 
  FolderTree, 
  CreditCard, 
  Settings, 
  Check, 
  RotateCcw, 
  ExternalLink,
  MessageSquare,
  PhoneCall,
  Sparkles,
  Tag,
  Search,
  Eye
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FashionPlaceholder } from './Placeholders';
import { LotusIcon } from './Header';

export const AdminPanel = ({ onClose }) => {
  const navigate = useNavigate();
  const { 
    products, 
    categories, 
    orders,
    updateOrderStatus,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    resetAllData,
    storeConfig,
    setStoreConfig,
    showToast
  } = useStore();

  // Admin Active Tab: 'products' | 'categories' | 'orders' | 'settings'
  // Per user instruction: "categories should be controllable from the admin panel product tab"
  // So within the products tab, we have a clear view toggle: 'items' or 'categories'
  const [adminTab, setAdminTab] = useState('products');
  const [productSubTab, setProductSubTab] = useState('items'); // 'items' | 'categories'

  // Product Form State (for Add or Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    subtitle: '',
    categorySlug: 'ethnic-wear',
    subCategorySlug: 'kurtas-sets',
    price: '',
    originalPrice: '',
    tag: '',
    description: '',
    fabric: '',
    placeholderKey: 'kurta',
    imageUrl: '',
    inStock: true,
    featured: false
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
      categorySlug: categories[0]?.slug || 'ethnic-wear',
      subCategorySlug: categories[2]?.slug || 'kurtas-sets',
      price: '',
      originalPrice: '',
      tag: 'New',
      description: '',
      fabric: 'Fine Artisanal Fabric',
      placeholderKey: 'kurta',
      imageUrl: '',
      inStock: true,
      featured: false
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProductId(prod.id);
    setProductForm({
      title: prod.title,
      subtitle: prod.subtitle || '',
      categorySlug: prod.categorySlug,
      subCategorySlug: prod.subCategorySlug || '',
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      tag: prod.tag || '',
      description: prod.description || '',
      fabric: prod.fabric || '',
      placeholderKey: prod.placeholderKey || 'kurta',
      imageUrl: prod.imageUrl || '',
      inStock: prod.inStock ?? true,
      featured: prod.featured ?? false
    });
    setIsProductModalOpen(true);
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

    if (editingProductId) {
      updateProduct(editingProductId, productForm);
    } else {
      addProduct(productForm);
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
                Catalog & Category Management System
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
            <CreditCard className="w-3.5 h-3.5" />
            <span>Orders & Gateway Notice</span>
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
                        <FashionPlaceholder 
                          type={prod.placeholderKey || 'kurta'} 
                          imageUrl={prod.imageUrl}
                          alt={prod.title}
                          className="w-full h-full object-cover"
                        />
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

                        <p className="text-[11px] text-neutral-500 line-clamp-1 mt-1 font-light">
                          {prod.fabric || prod.description}
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
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: ORDERS & TRACKING MANAGEMENT */}
        {adminTab === 'orders' && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* ShonkuWEB Notice Banner */}
            <div className="bg-white rounded-2xl border-2 border-[#D7BEA8] p-6 shadow-card text-center relative overflow-hidden">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-800 mb-3">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#221B16] font-medium mb-1.5">
                Online Payment Gateway & Live Checkout
              </h3>
              
              <div className="bg-[#FAF4EC] p-3.5 rounded-xl border border-[#DECBB8] text-xs sm:text-sm text-[#3E332B] font-medium mb-4 max-w-xl mx-auto">
                "Please contact team <span className="text-brand-800 font-bold underline">ShonkuWEB</span> for application of the Payment Gateway to access this feature."
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <a
                  href={`https://wa.me/919830000000?text=${encodeURIComponent('Hello Team ShonkuWEB, please help apply and activate the Payment Gateway for Kundan Works.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#20BE5A] text-white rounded-lg text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp ShonkuWEB</span>
                </a>
                <a
                  href={`tel:${storeConfig.shonkuWebDetails.applicationContact}`}
                  className="px-4 py-2 bg-[#241F1C] hover:bg-[#3B332D] text-white rounded-lg text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#D9B58B]" />
                  <span>Call {storeConfig.shonkuWebDetails.applicationContact}</span>
                </a>
              </div>
            </div>

            {/* Live Storefront Order Tracking Management */}
            <div className="bg-white rounded-2xl border border-[#EAE0D4] p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE0D4]">
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#221B16]">
                    Customer Shipments & Order Tracking ({orders.length})
                  </h3>
                  <p className="text-xs text-neutral-500 font-light">
                    Update dispatch status, courier AWB, and live storefront tracking steps.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/order');
                  }}
                  className="text-xs font-semibold text-brand-800 hover:text-brand-900 bg-brand-100/70 hover:bg-brand-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Storefront Tracker</span>
                </button>
              </div>

              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE0D4] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#EAE0D4]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#221B16]">#{o.id}</span>
                        <span className="text-neutral-400">•</span>
                        <span className="text-xs text-neutral-600 font-medium">{o.customerName} ({o.phone})</span>
                        <span className="text-neutral-400">•</span>
                        <span className="text-[11px] text-neutral-500">{o.date}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-serif font-bold text-[#1E1A17]">₹{o.total?.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-brand-100 text-brand-900">
                          {o.statusTitle}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      <div className="sm:col-span-6 text-xs text-neutral-600">
                        <p className="font-medium text-neutral-800">
                          {o.items?.map(i => `${i.title} (${i.size}) x${i.quantity}`).join(', ')}
                        </p>
                        <p className="text-[11px] text-neutral-500 mt-0.5 font-mono">
                          Courier: {o.courierName} | AWB: {o.awbNumber}
                        </p>
                      </div>

                      {/* Status changer dropdown */}
                      <div className="sm:col-span-6 flex items-center justify-end gap-2 text-xs">
                        <span className="text-neutral-500 text-[11px]">Set Step:</span>
                        <select
                          value={o.currentStep}
                          onChange={(e) => {
                            const step = Number(e.target.value);
                            const titles = {
                              1: 'Order Confirmed',
                              2: 'Artisanal Crafting',
                              3: 'Dispatched',
                              4: 'Out for Delivery',
                              5: 'Delivered'
                            };
                            updateOrderStatus(o.id, titles[step], step);
                          }}
                          className="bg-white border border-[#DAC6B4] rounded-lg p-1.5 text-xs text-[#282422] font-medium focus:outline-none focus:ring-1 focus:ring-brand-500"
                        >
                          <option value={1}>1. Confirmed</option>
                          <option value={2}>2. Crafting</option>
                          <option value={3}>3. Dispatched</option>
                          <option value={4}>4. Out for Delivery</option>
                          <option value={5}>5. Delivered</option>
                        </select>

                        <button
                          onClick={() => {
                            onClose();
                            navigate('/order');
                          }}
                          className="px-2.5 py-1.5 bg-[#25211E] text-white rounded-lg text-[11px] font-medium hover:bg-neutral-800 transition-colors"
                          title="Preview in Storefront"
                        >
                          Track
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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

              <div className="pt-4 border-t border-[#EAE0D4] flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-neutral-800">Reset Initial Data</h4>
                  <p className="text-[11px] text-neutral-500">Restore default demo products & categories matching design</p>
                </div>
                <button
                  onClick={resetAllData}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data</span>
                </button>
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

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="2999"
                    className="w-full p-2.5 bg-white border border-[#DAC6B4] rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                    placeholder="3999"
                    className="w-full p-2.5 bg-white border border-[#DAC6B4] rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Category *</label>
                  <select
                    value={productForm.categorySlug}
                    onChange={(e) => setProductForm(prev => ({ ...prev, categorySlug: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-[#DAC6B4] rounded-lg text-sm"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Collection Tag</label>
                  <input
                    type="text"
                    value={productForm.tag}
                    onChange={(e) => setProductForm(prev => ({ ...prev, tag: e.target.value }))}
                    placeholder="Bestseller / Trending / New"
                    className="w-full p-2.5 bg-white border border-[#DAC6B4] rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Placeholder Style</label>
                <select
                  value={productForm.placeholderKey}
                  onChange={(e) => setProductForm(prev => ({ ...prev, placeholderKey: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-[#DAC6B4] rounded-lg text-sm"
                >
                  <option value="hero_anarkali">Rose Anarkali Silhouette</option>
                  <option value="ethnic_featured">Mustard Ochre Kurti</option>
                  <option value="western_featured">Crisp Linen Shirt & Denim</option>
                  <option value="kurta">Terracotta Kurta on Hanger</option>
                  <option value="top">Folded Ivory Tops</option>
                  <option value="saree">Rose Pink Pleated Saree</option>
                  <option value="bottom">Camel Pleated Pants</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Custom Image URL (Optional)</label>
                <input
                  type="url"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-white border border-[#DAC6B4] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Fabric & Craft Details</label>
                <input
                  type="text"
                  value={productForm.fabric}
                  onChange={(e) => setProductForm(prev => ({ ...prev, fabric: e.target.value }))}
                  placeholder="e.g. Pure Chanderi Silk with Zari Border"
                  className="w-full p-2.5 bg-white border border-[#DAC6B4] rounded-lg text-sm"
                />
              </div>

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

    </div>
  );
};
