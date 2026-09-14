import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_CONFIG, INITIAL_ORDERS } from '../data/initialData';

const StoreContext = createContext();

// 4 Fulfillment Stages
export const ORDER_STAGES = [
  { step: 1, key: 'confirmed', label: 'Order Confirmed', desc: 'Order verified & confirmed by studio' },
  { step: 2, key: 'packed', label: 'Packed', desc: 'Garments quality inspected & packaged in luxury boutique box' },
  { step: 3, key: 'shipped', label: 'Shipped', desc: 'Handed over to express courier partner with live tracking' },
  { step: 4, key: 'delivered', label: 'Delivered', desc: 'Package delivered safely to your doorstep' }
];

export const StoreProvider = ({ children }) => {
  // Load persisted state or fallback to initial defaults
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('kundan_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        const legacyDummyIds = ['cat_ethnic', 'cat_western', 'cat_kurtas', 'cat_tops', 'cat_sarees', 'cat_bottoms'];
        return parsed.filter(c => !legacyDummyIds.includes(c.id));
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
        const legacyDummyIds = ['prod_1', 'prod_2', 'prod_3', 'prod_4', 'prod_5', 'prod_6'];
        return parsed.filter(p => !legacyDummyIds.includes(p.id));
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
        const legacyDummyIds = ['KW-1001', 'KW-1002', 'KW-1003'];
        return parsed.filter(o => !legacyDummyIds.includes(o.id));
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
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'cart' | 'contact' | 'order'
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('kundan_cart');
      return saved ? JSON.parse(saved) : [];
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

  // Sync to local storage
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

  // Cart operations
  const addToCart = (product, size = 'M', quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id && item.size === size);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { product, size, quantity }];
    });
    showToast(`Added "${product.title}" to bag`);
  };

  const removeFromCart = (productId, size) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.size === size)));
    showToast('Item removed from bag', 'info');
  };

  const updateCartQuantity = (productId, size, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId && item.size === size) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  // Admin Product Operations
  const addProduct = (newProduct) => {
    const images = Array.isArray(newProduct.images) ? newProduct.images : (newProduct.imageUrl ? [newProduct.imageUrl] : []);
    const stockNum = newProduct.stock !== undefined ? Math.max(0, Number(newProduct.stock) || 0) : 10;
    const item = {
      ...newProduct,
      id: `prod_${Date.now()}`,
      stock: stockNum,
      inStock: stockNum > 0,
      price: Number(newProduct.price) || 0,
      originalPrice: Number(newProduct.originalPrice) || Number(newProduct.price) || 0,
      images,
      imageUrl: images[0] || newProduct.imageUrl || ''
    };
    setProducts(prev => [item, ...prev]);
    showToast(`Product "${item.title}" created (Stock: ${stockNum} units)`);
    return item;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const images = updatedFields.images !== undefined
          ? (Array.isArray(updatedFields.images) ? updatedFields.images : [])
          : (p.images || (p.imageUrl ? [p.imageUrl] : []));
        const stockNum = updatedFields.stock !== undefined 
          ? Math.max(0, Number(updatedFields.stock) || 0)
          : (p.stock !== undefined ? Math.max(0, Number(p.stock) || 0) : 10);
        return {
          ...p,
          ...updatedFields,
          stock: stockNum,
          inStock: stockNum > 0,
          images,
          imageUrl: images[0] || updatedFields.imageUrl || p.imageUrl || '',
          price: Number(updatedFields.price !== undefined ? updatedFields.price : p.price),
          originalPrice: Number(updatedFields.originalPrice !== undefined ? updatedFields.originalPrice : (updatedFields.price !== undefined ? updatedFields.price : p.originalPrice))
        };
      }
      return p;
    }));
    showToast('Product updated successfully');
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product deleted', 'info');
  };

  // Admin Category Operations
  const addCategory = (newCat) => {
    const slug = newCat.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const item = {
      ...newCat,
      id: `cat_${Date.now()}`,
      slug: newCat.slug || slug,
      displayType: newCat.displayType || 'circular_pill',
      placeholderKey: newCat.placeholderKey || 'kurta',
      order: categories.length + 1
    };
    setCategories(prev => [...prev, item]);
    showToast(`Category "${item.name}" added`);
    return item;
  };

  const updateCategory = (id, updatedFields) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === id) {
        const slug = updatedFields.name 
          ? updatedFields.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') 
          : cat.slug;
        return { ...cat, ...updatedFields, slug: updatedFields.slug || slug };
      }
      return cat;
    }));
    showToast('Category updated successfully');
  };

  const deleteCategory = (id) => {
    const catToDelete = categories.find(c => c.id === id);
    if (!catToDelete) return;
    
    // Check if products belong to this category
    const hasProducts = products.some(p => p.categorySlug === catToDelete.slug || p.subCategorySlug === catToDelete.slug);
    if (hasProducts) {
      showToast(`Notice: Some products belong to "${catToDelete.name}". Reassign them if needed.`, 'info');
    }

    setCategories(prev => prev.filter(c => c.id !== id));
    showToast(`Category "${catToDelete.name}" removed`, 'info');
  };

  // Order Operations
  const createOrder = (orderData) => {
    const stage1 = ORDER_STAGES[0];
    const newOrder = {
      id: orderData.id || `KW-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      customerName: orderData.name || '',
      phone: orderData.phone || '',
      shippingAddress: orderData.location || '',
      decision: orderData.decision || 'pending', // 'pending' | 'accepted' | 'rejected'
      currentStep: orderData.currentStep || 1,
      status: stage1.key,
      statusTitle: stage1.label,
      statusDescription: stage1.desc,
      courierName: 'Boutique Express Logistics',
      awbNumber: `KW-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedDelivery: 'Estimated 4-6 business days',
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      total: orderData.total || 0,
      ...orderData
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const trackOrder = (query) => {
    if (!query) return null;
    const q = query.trim().toLowerCase();
    return orders.find(o => 
      o.id.toLowerCase() === q || 
      o.phone.includes(q) || 
      (o.awbNumber && o.awbNumber.toLowerCase() === q)
    );
  };

  const updateOrderStatus = (orderId, newStatus, currentStep) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          currentStep: currentStep ?? o.currentStep
        };
      }
      return o;
    }));
    showToast(`Order ${orderId} updated to ${newStatus}`);
  };

  const updateOrderDecision = (orderId, decision) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;
    const previousDecision = targetOrder.decision;

    // Automatically reduce product stock when admin accepts an order
    if (decision === 'accepted' && previousDecision !== 'accepted') {
      if (Array.isArray(targetOrder.items) && targetOrder.items.length > 0) {
        setProducts(prevProducts => {
          return prevProducts.map(p => {
            const orderedItem = targetOrder.items.find(it => it.product?.id === p.id);
            if (orderedItem) {
              const qty = Number(orderedItem.quantity) || 1;
              const currentStock = p.stock !== undefined ? Number(p.stock) : 10;
              const nextStock = Math.max(0, currentStock - qty);
              return {
                ...p,
                stock: nextStock,
                inStock: nextStock > 0
              };
            }
            return p;
          });
        });
      }
    }

    // Restore product stock if a previously accepted order is now rejected or moved to pending
    if (decision !== 'accepted' && previousDecision === 'accepted') {
      if (Array.isArray(targetOrder.items) && targetOrder.items.length > 0) {
        setProducts(prevProducts => {
          return prevProducts.map(p => {
            const orderedItem = targetOrder.items.find(it => it.product?.id === p.id);
            if (orderedItem) {
              const qty = Number(orderedItem.quantity) || 1;
              const currentStock = p.stock !== undefined ? Number(p.stock) : 0;
              const nextStock = currentStock + qty;
              return {
                ...p,
                stock: nextStock,
                inStock: nextStock > 0
              };
            }
            return p;
          });
        });
      }
    }

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        if (decision === 'rejected') {
          return {
            ...o,
            decision: 'rejected',
            status: 'rejected',
            statusTitle: 'Order Rejected',
            statusDescription: 'This order was declined by the studio. Please contact support on WhatsApp.'
          };
        } else if (decision === 'accepted') {
          const step = o.currentStep || 1;
          const stage = ORDER_STAGES[step - 1] || ORDER_STAGES[0];
          return {
            ...o,
            decision: 'accepted',
            status: stage.key,
            statusTitle: stage.label,
            statusDescription: stage.desc
          };
        } else {
          return {
            ...o,
            decision: 'pending'
          };
        }
      }
      return o;
    }));

    if (decision === 'accepted') {
      showToast(`Order ${orderId} accepted • Stock deducted automatically`, 'success');
    } else if (decision === 'rejected') {
      showToast(`Order ${orderId} rejected${previousDecision === 'accepted' ? ' • Stock restored' : ''}`, 'info');
    } else {
      showToast(`Order ${orderId} set to pending review`, 'info');
    }
  };

  const updateOrderStage = (orderId, stepNumber) => {
    const step = Math.min(Math.max(1, Number(stepNumber) || 1), 4);
    const stage = ORDER_STAGES[step - 1];
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          currentStep: step,
          status: stage.key,
          statusTitle: stage.label,
          statusDescription: stage.desc
        };
      }
      return o;
    }));
    showToast(`Order ${orderId} fulfillment set to "${stage.label}"`);
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast(`Order ${orderId} removed`, 'info');
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
        setStoreConfig,
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
        showToast
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
