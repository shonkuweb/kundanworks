import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_CONFIG, INITIAL_ORDERS } from '../data/initialData';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Load persisted state or fallback to initial defaults
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('kundan_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('kundan_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('kundan_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [storeConfig, setStoreConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('kundan_config');
      return saved ? JSON.parse(saved) : INITIAL_CONFIG;
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
    const item = {
      ...newProduct,
      id: `prod_${Date.now()}`,
      inStock: newProduct.inStock ?? true,
      price: Number(newProduct.price) || 0,
      originalPrice: Number(newProduct.originalPrice) || Number(newProduct.price) || 0
    };
    setProducts(prev => [item, ...prev]);
    showToast(`Product "${item.title}" created successfully`);
    return item;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updatedFields,
          price: Number(updatedFields.price !== undefined ? updatedFields.price : p.price),
          originalPrice: Number(updatedFields.originalPrice !== undefined ? updatedFields.originalPrice : p.originalPrice)
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
        trackOrder,
        updateOrderStatus,
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
