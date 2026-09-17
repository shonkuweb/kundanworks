import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_CONFIG, INITIAL_ORDERS } from '../data/initialData';
import { api } from '../services/api';

const StoreContext = createContext();

// 4 Fulfillment Stages
export const ORDER_STAGES = [
  { step: 1, key: 'confirmed', label: 'Order Confirmed', desc: 'Order verified & confirmed by studio' },
  { step: 2, key: 'packed', label: 'Packed', desc: 'Garments quality inspected & packaged in luxury boutique box' },
  { step: 3, key: 'shipped', label: 'Shipped', desc: 'Handed over to express courier partner with live tracking' },
  { step: 4, key: 'delivered', label: 'Delivered', desc: 'Package delivered safely to your doorstep' }
];

export const StoreProvider = ({ children }) => {
  // 1. Initial State from localStorage (instant render without flicker)
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('kundan_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const legacyDummyIds = ['cat_ethnic', 'cat_western', 'cat_kurtas', 'cat_tops', 'cat_sarees', 'cat_bottoms'];
          return parsed.filter(c => c && !legacyDummyIds.includes(c.id));
        }
      }
      return INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('kundan_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const legacyDummyIds = ['prod_1', 'prod_2', 'prod_3', 'prod_4', 'prod_5', 'prod_6'];
          return parsed
            .filter(p => p && !legacyDummyIds.includes(p.id))
            .map(p => ({
              ...p,
              title: p.title || p.name || 'Untitled Piece',
              name: p.name || p.title || 'Untitled Piece',
              category: p.category || 'Collection',
              categorySlug: p.categorySlug || p.categoryId || (p.category ? String(p.category).toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'general'),
              price: Number(p.price) || 0,
              originalPrice: Number(p.originalPrice || p.price || 0),
              stock: p.stock !== undefined ? Number(p.stock) : 10,
              inStock: p.stock !== undefined ? Number(p.stock) > 0 : true,
              images: Array.isArray(p.images) ? p.images : (p.imageUrl ? [p.imageUrl] : []),
              imageUrl: (Array.isArray(p.images) && p.images[0]) || p.imageUrl || ''
            }));
        }
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('kundan_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const legacyDummyIds = ['KW-1001', 'KW-1002', 'KW-1003'];
          return parsed.filter(o => o && !legacyDummyIds.includes(o.id));
        }
      }
      return INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [storeConfig, setStoreConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('kundan_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.whatsappNumber === '+91 98765 43210' ||
          parsed.whatsappNumber === '918511556115' ||
          parsed.whatsappNumber === '+91 85115 56115'
        ) {
          parsed.whatsappNumber = '+91 85115 56155';
        }
        return parsed;
      }
      return INITIAL_CONFIG;
    } catch {
      return INITIAL_CONFIG;
    }
  });

  // Navigation & View States
  const [activeTab, setActiveTab] = useState('home');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Cart state with safe normalization
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('kundan_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed
            .filter(item => item && (item.product || item.id))
            .map(item => {
              const product = item.product || item;
              return {
                product: {
                  ...product,
                  id: product.id || `prod_${Date.now()}`,
                  title: product.title || product.name || 'Boutique Piece',
                  name: product.name || product.title || 'Boutique Piece',
                  price: Number(product.price) || 0,
                  originalPrice: Number(product.originalPrice || product.price) || 0,
                  images: Array.isArray(product.images) ? product.images : (product.imageUrl ? [product.imageUrl] : []),
                  imageUrl: (Array.isArray(product.images) && product.images[0]) || product.imageUrl || ''
                },
                quantity: Math.max(1, parseInt(item.quantity, 10) || 1)
              };
            });
        }
      }
      return [];
    } catch {
      return [];
    }
  });


  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // ==========================================
  // PostgreSQL Live Sync Engine
  // ==========================================
  const syncWithDatabase = async () => {
    try {
      const [pRes, cRes, oRes, cfgRes] = await Promise.allSettled([
        api.getProducts(),
        api.getCategories(),
        api.getOrders(),
        api.getConfig()
      ]);

      if (pRes.status === 'fulfilled' && Array.isArray(pRes.value)) {
        const dbProducts = pRes.value.map(p => ({
          ...p,
          title: p.name || p.title || 'Untitled Piece',
          name: p.name || p.title || 'Untitled Piece',
          category: p.category || 'Collection',
          categorySlug: p.categorySlug || p.categoryId || (p.category ? String(p.category).toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'general'),
          price: Number(p.price) || 0,
          originalPrice: Number(p.originalPrice || p.price || 0),
          stock: p.stock !== undefined ? Number(p.stock) : 10,
          inStock: p.stock !== undefined ? Number(p.stock) > 0 : true,
          images: Array.isArray(p.images) ? p.images : (p.imageUrl ? [p.imageUrl] : []),
          imageUrl: (Array.isArray(p.images) && p.images[0]) || p.imageUrl || ''
        }));
        setProducts(dbProducts);
      }

      if (cRes.status === 'fulfilled' && Array.isArray(cRes.value)) {
        setCategories(cRes.value);
      }

      if (oRes.status === 'fulfilled' && Array.isArray(oRes.value)) {
        const dbOrders = oRes.value.map(o => ({
          ...o,
          phone: o.customerPhone || o.phone || '',
          customerPhone: o.customerPhone || o.phone || '',
          name: o.customerName || o.name || '',
          customerName: o.customerName || o.name || '',
          shippingAddress: o.customerLocation || o.shippingAddress || '',
          customerLocation: o.customerLocation || o.shippingAddress || '',
          currentStep: o.stage || o.currentStep || 1,
          stage: o.stage || o.currentStep || 1,
          total: o.totalPrice !== undefined ? Number(o.totalPrice) : (Number(o.total) || 0),
          totalPrice: o.totalPrice !== undefined ? Number(o.totalPrice) : (Number(o.total) || 0),
          date: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : (o.date || ''),
          time: o.createdAt ? new Date(o.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : (o.time || ''),
          courierName: o.courierName || 'Boutique Express Logistics',
          awbNumber: o.awbNumber || `KW-EXP-${String(o.id || '').replace(/[^0-9]/g, '') || '102938'}`,
          estimatedDelivery: o.estimatedDelivery || 'Estimated 4-6 business days'
        }));

        // Merge remote orders with local orders - NEVER erase existing local orders!
        setOrders(prevLocal => {
          const currentList = Array.isArray(prevLocal) ? prevLocal : [];
          if (dbOrders.length === 0) return currentList;

          const merged = [...dbOrders];
          currentList.forEach(loc => {
            if (loc && loc.id && !merged.some(rem => rem.id === loc.id)) {
              merged.push(loc);
            }
          });
          return merged;
        });
      }

      if (cfgRes.status === 'fulfilled' && cfgRes.value && typeof cfgRes.value === 'object') {
        setStoreConfig(prev => ({ ...prev, ...cfgRes.value }));
      }
    } catch (err) {
      console.warn('[StoreContext] Database sync warning:', err.message);
    }
  };

  // Cross-tab synchronization for orders & live updates
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'kundan_orders' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setOrders(parsed);
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Mount sync + periodic background polling (every 15s)
  useEffect(() => {
    syncWithDatabase();
    const interval = setInterval(syncWithDatabase, 15000);
    return () => clearInterval(interval);
  }, []);

  // Sync to local storage for offline resiliency
  useEffect(() => {
    try {
      localStorage.setItem('kundan_categories', JSON.stringify(categories));
    } catch (err) {
      console.error('Failed to persist categories', err);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('kundan_products', JSON.stringify(products));
    } catch (err) {
      console.error('Failed to persist products', err);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('kundan_cart', JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to persist cart', err);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('kundan_config', JSON.stringify(storeConfig));
    } catch (err) {
      console.error('Failed to persist config', err);
    }
  }, [storeConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('kundan_orders', JSON.stringify(orders));
    } catch (err) {
      console.error('Failed to persist orders', err);
    }
  }, [orders]);

  // ==========================================
  // Cart Operations (No sizes - products are standalone)
  // ==========================================
  const addToCart = (product, sizeOrQty = 1, maybeQty = 1) => {
    if (!product) return;
    const safeProduct = {
      ...product,
      id: product.id,
      title: product.title || product.name || 'Boutique Piece',
      name: product.name || product.title || 'Boutique Piece',
      price: Number(product.price) || 0,
      originalPrice: Number(product.originalPrice || product.price) || 0,
      stock: product.stock !== undefined ? Number(product.stock) : 10,
      inStock: product.stock !== undefined ? Number(product.stock) > 0 : true,
      images: Array.isArray(product.images) ? product.images : (product.imageUrl ? [product.imageUrl] : []),
      imageUrl: (Array.isArray(product.images) && product.images[0]) || product.imageUrl || ''
    };
    const qty = typeof sizeOrQty === 'number'
      ? Math.max(1, parseInt(sizeOrQty, 10) || 1)
      : Math.max(1, parseInt(maybeQty, 10) || 1);

    setCart(prev => {
      const validPrev = Array.isArray(prev) ? prev.filter(Boolean) : [];
      const existingIndex = validPrev.findIndex(item => {
        const itemPId = item.product?.id || item.id;
        return itemPId === safeProduct.id;
      });

      if (existingIndex > -1) {
        const next = [...validPrev];
        next[existingIndex] = {
          ...next[existingIndex],
          product: safeProduct,
          quantity: (Number(next[existingIndex].quantity) || 1) + qty
        };
        return next;
      }
      return [...validPrev, { product: safeProduct, quantity: qty }];
    });
    showToast(`Added "${safeProduct.title}" to bag`);
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      if (!Array.isArray(prev)) return [];
      return prev.filter(item => {
        const itemPId = item.product?.id || item.id;
        return itemPId !== productId;
      });
    });
    showToast('Item removed from bag', 'info');
  };

  const updateCartQuantity = (productId, deltaOrSize, deltaParam) => {
    const delta = typeof deltaOrSize === 'number' ? deltaOrSize : (Number(deltaParam) || 0);
    setCart(prev => {
      if (!Array.isArray(prev)) return [];
      return prev
        .map(item => {
          const itemPId = item.product?.id || item.id;
          if (itemPId === productId) {
            const currentQty = Number(item.quantity) || 1;
            const newQty = currentQty + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = Array.isArray(cart) 
    ? cart.reduce((total, item) => total + (Number(item?.quantity) || 1), 0)
    : 0;

  const cartSubtotal = Array.isArray(cart)
    ? cart.reduce((total, item) => {
        const product = item?.product || item;
        const price = Number(product?.price) || 0;
        const qty = Number(item?.quantity) || 1;
        return total + (price * qty);
      }, 0)
    : 0;

  // ==========================================
  // Product Operations (PostgreSQL Synchronized)
  // ==========================================
  const addProduct = async (newProduct) => {
    const images = Array.isArray(newProduct.images) ? newProduct.images : (newProduct.imageUrl ? [newProduct.imageUrl] : []);
    const stockNum = newProduct.stock !== undefined ? Math.max(0, Number(newProduct.stock) || 0) : 10;
    const item = {
      ...newProduct,
      id: newProduct.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: newProduct.title || newProduct.name || 'Untitled Piece',
      title: newProduct.title || newProduct.name || 'Untitled Piece',
      stock: stockNum,
      inStock: stockNum > 0,
      price: Number(newProduct.price) || 0,
      originalPrice: Number(newProduct.originalPrice) || Number(newProduct.price) || 0,
      images,
      imageUrl: images[0] || newProduct.imageUrl || ''
    };

    // Optimistic UI update
    setProducts(prev => [item, ...prev]);

    // Persist to PostgreSQL database
    try {
      const created = await api.createProduct({
        id: item.id,
        name: item.name,
        subtitle: item.subtitle || '',
        price: item.price,
        category: item.category || 'Uncategorized',
        categoryId: item.categoryId || item.categorySlug || '',
        description: item.description || '',
        stock: item.stock,
        inStock: item.inStock,
        images: item.images
      });

      if (created) {
        setProducts(prev => prev.map(p => p.id === item.id ? {
          ...created,
          title: created.name || created.title,
          imageUrl: (created.images && created.images[0]) || created.imageUrl || item.imageUrl,
          stock: created.stock !== undefined ? Number(created.stock) : item.stock,
          inStock: created.inStock !== undefined ? created.inStock : item.inStock
        } : p));
      }
    } catch (err) {
      console.error('[StoreContext] PostgreSQL product save error:', err);
    }

    showToast(`Product "${item.title}" created (Stock: ${stockNum} units)`);
    return item;
  };

  const updateProduct = async (id, updatedFields) => {
    const images = updatedFields.images !== undefined
      ? (Array.isArray(updatedFields.images) ? updatedFields.images : [])
      : undefined;
    const stockNum = updatedFields.stock !== undefined 
      ? Math.max(0, Number(updatedFields.stock) || 0)
      : undefined;

    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const nextImages = images !== undefined ? images : (p.images || (p.imageUrl ? [p.imageUrl] : []));
        const nextStock = stockNum !== undefined ? stockNum : (p.stock !== undefined ? p.stock : 10);
        return {
          ...p,
          ...updatedFields,
          name: updatedFields.title || updatedFields.name || p.name || p.title,
          title: updatedFields.title || updatedFields.name || p.title || p.name,
          stock: nextStock,
          inStock: nextStock > 0,
          images: nextImages,
          imageUrl: nextImages[0] || updatedFields.imageUrl || p.imageUrl || '',
          price: Number(updatedFields.price !== undefined ? updatedFields.price : p.price),
          originalPrice: Number(updatedFields.originalPrice !== undefined ? updatedFields.originalPrice : (updatedFields.price !== undefined ? updatedFields.price : p.originalPrice))
        };
      }
      return p;
    }));

    try {
      await api.updateProduct(id, {
        name: updatedFields.title || updatedFields.name,
        subtitle: updatedFields.subtitle,
        price: updatedFields.price,
        category: updatedFields.category,
        categoryId: updatedFields.categoryId || updatedFields.categorySlug,
        description: updatedFields.description,
        stock: stockNum,
        inStock: stockNum !== undefined ? stockNum > 0 : undefined,
        images,
        sizes: updatedFields.sizes
      });
    } catch (err) {
      console.error('[StoreContext] PostgreSQL product update error:', err);
    }

    showToast('Product updated successfully');
  };

  const deleteProduct = async (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      await api.deleteProduct(id);
    } catch (err) {
      console.error('[StoreContext] PostgreSQL product delete error:', err);
    }
    showToast('Product deleted', 'info');
  };

  // ==========================================
  // Category Operations (PostgreSQL Synchronized)
  // ==========================================
  const addCategory = async (newCat) => {
    const slug = newCat.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const item = {
      ...newCat,
      id: newCat.id || `cat_${Date.now()}`,
      slug: newCat.slug || slug,
      displayType: newCat.displayType || 'circular_pill',
      placeholderKey: newCat.placeholderKey || 'kurta',
      order: categories.length + 1
    };
    setCategories(prev => [...prev, item]);

    try {
      await api.createCategory({
        id: item.id,
        name: item.name,
        slug: item.slug,
        image: item.image || ''
      });
    } catch (err) {
      console.error('[StoreContext] PostgreSQL category save error:', err);
    }

    showToast(`Category "${item.name}" added`);
    return item;
  };

  const updateCategory = async (id, updatedFields) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === id) {
        const slug = updatedFields.name 
          ? updatedFields.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') 
          : cat.slug;
        return { ...cat, ...updatedFields, slug: updatedFields.slug || slug };
      }
      return cat;
    }));

    try {
      await api.updateCategory(id, updatedFields);
    } catch (err) {
      console.error('[StoreContext] PostgreSQL category update error:', err);
    }

    showToast('Category updated successfully');
  };

  const deleteCategory = async (id) => {
    const catToDelete = categories.find(c => c.id === id);
    if (!catToDelete) return;
    
    setCategories(prev => prev.filter(c => c.id !== id));

    try {
      await api.deleteCategory(id);
    } catch (err) {
      console.error('[StoreContext] PostgreSQL category delete error:', err);
    }

    showToast(`Category "${catToDelete.name}" removed`, 'info');
  };


  // ==========================================
  // Order Operations & Live Tracking (Dual PostgreSQL + Local Synchronized)
  // ==========================================
  const saveOrdersLocally = (orderList) => {
    try {
      localStorage.setItem('kundan_orders', JSON.stringify(orderList));
    } catch (err) {
      console.error('Failed to save orders to localStorage:', err);
    }
  };

  const createOrder = async (orderData) => {
    const stage1 = ORDER_STAGES[0];
    const rawId = orderData.id || `KW-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderId = String(rawId).replace(/^#/, '').trim();

    const newOrder = {
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      customerName: orderData.name || orderData.customerName || '',
      phone: orderData.phone || orderData.customerPhone || '',
      customerPhone: orderData.phone || orderData.customerPhone || '',
      customerLocation: orderData.location || orderData.customerLocation || orderData.shippingAddress || '',
      shippingAddress: orderData.location || orderData.customerLocation || orderData.shippingAddress || '',
      decision: orderData.decision || 'pending',
      currentStep: orderData.currentStep || 1,
      stage: orderData.stage || orderData.currentStep || 1,
      status: stage1.key,
      statusTitle: stage1.label,
      statusDescription: stage1.desc,
      courierName: 'Boutique Express Logistics',
      awbNumber: `KW-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedDelivery: 'Estimated 4-6 business days',
      items: orderData.items || [],
      subtotal: orderData.subtotal || orderData.total || 0,
      total: orderData.total || orderData.subtotal || 0,
      totalPrice: orderData.total || orderData.subtotal || 0,
      ...orderData,
      id: orderId
    };

    // 1. Immediately update state and synchronously write to localStorage
    setOrders(prev => {
      const prevList = Array.isArray(prev) ? prev.filter(o => o && o.id !== newOrder.id) : [];
      const updated = [newOrder, ...prevList];
      saveOrdersLocally(updated);
      return updated;
    });

    // 2. Persist to PostgreSQL backend if reachable
    try {
      await api.createOrder({
        id: newOrder.id,
        customerName: newOrder.customerName,
        customerPhone: newOrder.customerPhone,
        customerLocation: newOrder.customerLocation,
        items: newOrder.items,
        totalPrice: newOrder.totalPrice,
        decision: newOrder.decision,
        stage: newOrder.currentStep,
        status: newOrder.status,
        statusTitle: newOrder.statusTitle,
        statusDescription: newOrder.statusDescription
      });
    } catch (err) {
      // Backend offline fallback - order remains safe in local state and localStorage
    }

    return newOrder;
  };

  /**
   * Live Order Tracking Query:
   * First searches local cache and localStorage; matches order ID, clean digits, phone, or AWB!
   */
  const trackOrder = async (queryStr) => {
    if (!queryStr) return null;
    const q = String(queryStr).trim();
    if (!q) return null;

    const cleanInput = q.replace(/^#/, '').trim().toLowerCase();
    const cleanDigits = q.replace(/[^0-9]/g, '');

    // Gather all known orders from memory and localStorage
    const getAllOrders = () => {
      const map = new Map();
      try {
        const fromStorage = JSON.parse(localStorage.getItem('kundan_orders') || '[]');
        if (Array.isArray(fromStorage)) fromStorage.forEach(o => o?.id && map.set(String(o.id).toLowerCase(), o));
      } catch {}
      if (Array.isArray(orders)) orders.forEach(o => o?.id && map.set(String(o.id).toLowerCase(), o));
      return Array.from(map.values());
    };

    const allOrders = getAllOrders();

    // 1. Search locally
    const foundLocal = allOrders.find(o => {
      if (!o) return false;
      const orderId = String(o.id || '').replace(/^#/, '').toLowerCase();
      const cleanOrderId = orderId.replace(/[^a-z0-9]/gi, '');
      const awb = String(o.awbNumber || '').toLowerCase();
      const phone = String(o.phone || o.customerPhone || '').replace(/[^0-9]/g, '');

      // Direct or alphanumeric match (e.g. 'KW-123456', '#KW-123456', 'kw123456')
      if (orderId === cleanInput) return true;
      if (cleanOrderId === cleanInput.replace(/[^a-z0-9]/gi, '')) return true;

      // Trailing 5-6 digits match (e.g. entering '123456' matches 'KW-123456')
      if (cleanDigits.length >= 5 && (orderId.includes(cleanDigits) || cleanOrderId.includes(cleanDigits))) return true;

      // Phone number match (last 10 digits)
      if (cleanDigits.length >= 10 && phone.endsWith(cleanDigits.slice(-10))) return true;

      // AWB match
      if (awb && (awb === cleanInput || (cleanDigits.length >= 5 && awb.includes(cleanDigits)))) return true;

      return false;
    });

    if (foundLocal) {
      return foundLocal;
    }

    // 2. Query backend API if not found locally
    try {
      const dbOrder = await api.trackOrder(cleanInput);
      if (dbOrder) {
        const formatted = {
          ...dbOrder,
          phone: dbOrder.customerPhone || dbOrder.phone || '',
          customerPhone: dbOrder.customerPhone || dbOrder.phone || '',
          name: dbOrder.customerName || dbOrder.name || '',
          customerName: dbOrder.customerName || dbOrder.name || '',
          shippingAddress: dbOrder.customerLocation || dbOrder.shippingAddress || '',
          customerLocation: dbOrder.customerLocation || dbOrder.shippingAddress || '',
          currentStep: dbOrder.stage || dbOrder.currentStep || 1,
          stage: dbOrder.stage || dbOrder.currentStep || 1,
          total: dbOrder.totalPrice !== undefined ? Number(dbOrder.totalPrice) : Number(dbOrder.total || 0),
          totalPrice: dbOrder.totalPrice !== undefined ? Number(dbOrder.totalPrice) : Number(dbOrder.total || 0),
          date: dbOrder.createdAt ? new Date(dbOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : (dbOrder.date || ''),
          time: dbOrder.createdAt ? new Date(dbOrder.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : (dbOrder.time || ''),
          courierName: dbOrder.courierName || 'Boutique Express Logistics',
          awbNumber: dbOrder.awbNumber || `KW-EXP-${String(dbOrder.id || '').replace(/[^0-9]/g, '') || '102938'}`,
          estimatedDelivery: (Number(dbOrder.stage) >= 4 || dbOrder.status === 'delivered') ? 'Delivered to Doorstep' : 'Estimated 4-6 business days'
        };

        setOrders(prev => {
          const prevList = Array.isArray(prev) ? prev.filter(o => o && o.id !== formatted.id) : [];
          const next = [formatted, ...prevList];
          saveOrdersLocally(next);
          return next;
        });

        return formatted;
      }
    } catch {
      // Backend not reached or not found
    }

    return null;
  };

  const updateOrderStatus = (orderId, newStatus, currentStep) => {
    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: newStatus,
            currentStep: currentStep ?? o.currentStep
          };
        }
        return o;
      });
      saveOrdersLocally(updated);
      return updated;
    });
    showToast(`Order ${orderId} updated to ${newStatus}`);
  };

  const updateOrderDecision = async (orderId, decision) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;
    const previousDecision = targetOrder.decision;

    let newStatus = targetOrder.status;
    let newStatusTitle = targetOrder.statusTitle;
    let newStatusDescription = targetOrder.statusDescription;

    if (decision === 'rejected') {
      newStatus = 'rejected';
      newStatusTitle = 'Order Rejected';
      newStatusDescription = 'This order was declined by the studio. Please contact support on WhatsApp.';
    } else if (decision === 'accepted') {
      const step = targetOrder.currentStep || 1;
      const stage = ORDER_STAGES[step - 1] || ORDER_STAGES[0];
      newStatus = stage.key;
      newStatusTitle = stage.label;
      newStatusDescription = stage.desc;
    } else {
      newStatus = 'pending';
    }

    // Update local state and localStorage immediately
    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            decision,
            status: newStatus,
            statusTitle: newStatusTitle,
            statusDescription: newStatusDescription
          };
        }
        return o;
      });
      saveOrdersLocally(updated);
      return updated;
    });

    // Update stock locally
    if (decision === 'accepted' && previousDecision !== 'accepted') {
      if (Array.isArray(targetOrder.items)) {
        setProducts(prevProducts => prevProducts.map(p => {
          const orderedItem = targetOrder.items.find(it => (it.product?.id || it.id) === p.id);
          if (orderedItem) {
            const qty = Number(orderedItem.quantity) || 1;
            const currentStock = p.stock !== undefined ? Number(p.stock) : 10;
            const nextStock = Math.max(0, currentStock - qty);
            return { ...p, stock: nextStock, inStock: nextStock > 0 };
          }
          return p;
        }));
      }
    } else if (decision !== 'accepted' && previousDecision === 'accepted') {
      if (Array.isArray(targetOrder.items)) {
        setProducts(prevProducts => prevProducts.map(p => {
          const orderedItem = targetOrder.items.find(it => (it.product?.id || it.id) === p.id);
          if (orderedItem) {
            const qty = Number(orderedItem.quantity) || 1;
            const currentStock = p.stock !== undefined ? Number(p.stock) : 0;
            const nextStock = currentStock + qty;
            return { ...p, stock: nextStock, inStock: nextStock > 0 };
          }
          return p;
        }));
      }
    }

    // Persist to PostgreSQL backend if reachable
    try {
      await api.updateOrder(orderId, {
        decision,
        status: newStatus,
        statusTitle: newStatusTitle,
        statusDescription: newStatusDescription
      });

      const refreshedProducts = await api.getProducts();
      if (Array.isArray(refreshedProducts)) {
        setProducts(refreshedProducts.map(p => ({
          ...p,
          title: p.name || p.title,
          price: Number(p.price) || 0,
          originalPrice: Number(p.originalPrice || p.price || 0),
          stock: p.stock !== undefined ? Number(p.stock) : 10,
          inStock: p.stock !== undefined ? Number(p.stock) > 0 : true,
          images: Array.isArray(p.images) ? p.images : [],
          imageUrl: (Array.isArray(p.images) && p.images[0]) || p.imageUrl || ''
        })));
      }
    } catch (err) {
      // Backend offline fallback
    }

    if (decision === 'accepted') {
      showToast(`Order ${orderId} accepted • Stock deducted automatically`, 'success');
    } else if (decision === 'rejected') {
      showToast(`Order ${orderId} rejected${previousDecision === 'accepted' ? ' • Stock restored' : ''}`, 'info');
    } else {
      showToast(`Order ${orderId} set to pending review`, 'info');
    }
  };

  const updateOrderStage = async (orderId, stepNumber) => {
    const step = Math.min(Math.max(1, Number(stepNumber) || 1), 4);
    const stage = ORDER_STAGES[step - 1];

    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            currentStep: step,
            stage: step,
            status: stage.key,
            statusTitle: stage.label,
            statusDescription: stage.desc
          };
        }
        return o;
      });
      saveOrdersLocally(updated);
      return updated;
    });

    try {
      await api.updateOrder(orderId, {
        stage: step,
        status: stage.key,
        statusTitle: stage.label,
        statusDescription: stage.desc
      });
    } catch (err) {
      // Backend offline fallback
    }

    showToast(`Order ${orderId} fulfillment set to "${stage.label}"`);
  };

  const deleteOrder = async (orderId) => {
    setOrders(prev => {
      const updated = prev.filter(o => o.id !== orderId);
      saveOrdersLocally(updated);
      return updated;
    });
    try {
      await api.deleteOrder(orderId);
    } catch (err) {
      // Backend offline fallback
    }
    showToast(`Order ${orderId} removed`, 'info');
  };

  // Update store config and persist to PostgreSQL
  const updateStoreConfig = async (newConfig) => {
    setStoreConfig(prev => {
      const merged = typeof newConfig === 'function' ? newConfig(prev) : { ...prev, ...newConfig };
      api.updateConfig(merged).catch(err => console.error('Failed to sync config to DB:', err));
      return merged;
    });
  };

  const resetAllData = () => {
    setCategories(INITIAL_CATEGORIES);
    setProducts(INITIAL_PRODUCTS);
    setStoreConfig(INITIAL_CONFIG);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    showToast('Store reset to initial catalogue data');
  };

  return (
    <StoreContext.Provider
      value={{
        categories,
        products,
        orders,
        setOrders,
        createOrder,
        trackOrder,
        updateOrderStatus,
        updateOrderDecision,
        updateOrderStage,
        deleteOrder,
        ORDER_STAGES,
        storeConfig,
        setStoreConfig: updateStoreConfig,
        activeTab,
        setActiveTab,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        isAdminOpen,
        setIsAdminOpen,
        isCartOpen,
        setIsCartOpen,
        isContactOpen,
        setIsContactOpen,
        selectedProduct,
        setSelectedProduct,
        cart,
        cartCount,
        cartSubtotal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        resetAllData,
        toast,
        showToast,
        syncWithDatabase
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
