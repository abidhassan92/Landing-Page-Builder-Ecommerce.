import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { LandingPage, Product, Order, Settings, Customer, CustomTemplate } from '../types';
import { INITIAL_PRODUCTS, INITIAL_LANDING_PAGES, INITIAL_ORDERS } from '../constants';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AppContextType {
  products: Product[];
  pages: LandingPage[];
  orders: Order[];
  customers: Customer[];
  settings: Settings;
  customTemplates: CustomTemplate[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addPage: (page: Omit<LandingPage, 'id' | 'createdAt'>) => void;
  updatePage: (page: LandingPage) => void;
  deletePage: (pageId: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'orderedAt' | 'status' | 'trackingId'>) => Order;
  updateOrder: (order: Order) => void;
  updateSettings: (newSettings: Settings) => void;
  getPageById: (pageId: string) => LandingPage | undefined;
  addCustomTemplate: (template: Omit<CustomTemplate, 'id'>) => void;
  updateCustomTemplate: (template: CustomTemplate) => void;
  deleteCustomTemplate: (templateId: string) => void;
  getCustomTemplateById: (templateId: string) => CustomTemplate | undefined;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  currentPageId: string | null;
  setCurrentPageId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useLocalStorage<Product[]>('products', INITIAL_PRODUCTS);
  const [pages, setPages] = useLocalStorage<LandingPage[]>('landing_pages', INITIAL_LANDING_PAGES);
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', INITIAL_ORDERS);
  const [settings, setSettings] = useLocalStorage<Settings>('settings', { facebookPixelId: '', lowStockThreshold: 10 });
  const [customTemplates, setCustomTemplates] = useLocalStorage<CustomTemplate[]>('custom_templates', []);
  
  const [initialState] = useState(() => {
    const previewId = localStorage.getItem('previewPageId');
    if (previewId) {
      localStorage.removeItem('previewPageId');
      return { currentPage: '/page', currentPageId: previewId };
    }
    return { currentPage: '/', currentPageId: null };
  });

  const [currentPage, setCurrentPage] = useState<string>(initialState.currentPage);
  const [currentPageId, setCurrentPageId] = useState<string | null>(initialState.currentPageId);

  const addProduct = useCallback((productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
        ...productData,
        id: `prod_${Date.now()}`,
    };
    setProducts(prev => [...prev, newProduct]);
  }, [setProducts]);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  }, [setProducts]);

  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  }, [setProducts]);

  const addPage = useCallback((pageData: Omit<LandingPage, 'id' | 'createdAt'>) => {
    const newPage: LandingPage = {
      ...pageData,
      id: `page_${Date.now()}`,
      // FIX: Removed extra 'new' keyword.
      createdAt: new Date().toISOString(),
    };
    setPages(prev => [...prev, newPage]);
  }, [setPages]);

  const updatePage = useCallback((updatedPage: LandingPage) => {
    setPages(prev => prev.map(p => p.id === updatedPage.id ? updatedPage : p));
  }, [setPages]);

  const deletePage = useCallback((pageId: string) => {
    setPages(prev => prev.filter(p => p.id !== pageId));
  }, [setPages]);

  const addOrder = useCallback((orderData: Omit<Order, 'id' | 'orderedAt' | 'status' | 'trackingId'>) => {
    const timestamp = Date.now();
    const courierPrefix = orderData.courier.substring(0, 2).toUpperCase();
    const newOrder: Order = {
      ...orderData,
      id: `order_${timestamp}`,
      // FIX: Removed extra 'new' keyword.
      orderedAt: new Date().toISOString(),
      status: 'Pending',
      trackingId: `${courierPrefix}${timestamp}`,
    };

    setProducts(prevProducts => 
        prevProducts.map(p => {
            const orderedProduct = newOrder.products.find(op => op.id === p.id);
            if (orderedProduct) {
                return { ...p, stock: p.stock - 1 };
            }
            return p;
        })
    );
    
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }, [setOrders, setProducts]);

  const updateOrder = useCallback((updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  }, [setOrders]);

  const updateSettings = useCallback((newSettings: Settings) => {
    setSettings(newSettings);
  }, [setSettings]);

  const getPageById = useCallback((pageId: string) => {
    return pages.find(p => p.id === pageId);
  }, [pages]);

  const addCustomTemplate = useCallback((templateData: Omit<CustomTemplate, 'id'>) => {
    const newTemplate: CustomTemplate = {
        ...templateData,
        id: `ctpl_${Date.now()}`,
    };
    setCustomTemplates(prev => [...prev, newTemplate]);
  }, [setCustomTemplates]);

  const updateCustomTemplate = useCallback((updatedTemplate: CustomTemplate) => {
      setCustomTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
  }, [setCustomTemplates]);

  const deleteCustomTemplate = useCallback((templateId: string) => {
      setCustomTemplates(prev => prev.filter(t => t.id !== templateId));
  }, [setCustomTemplates]);

  const getCustomTemplateById = useCallback((templateId: string) => {
      // Find the template, ensuring it has the new 'structure' property.
      // This provides a safeguard against old data from localStorage.
      const template = customTemplates.find(t => t.id === templateId);
      return template && 'structure' in template ? template : undefined;
  }, [customTemplates]);

  const customers = useMemo(() => {
    const customerMap = new Map<string, Customer>();
    const sortedOrders = [...orders].sort((a, b) => new Date(a.orderedAt).getTime() - new Date(b.orderedAt).getTime());
    sortedOrders.forEach(order => {
        const phone = order.customerPhone;
        if (!customerMap.has(phone)) {
            customerMap.set(phone, {
                phone: phone,
                email: order.customerEmail,
                name: order.customerName,
                totalOrders: 0,
                totalSpent: 0,
                firstOrder: order.orderedAt,
                lastOrder: order.orderedAt,
            });
        }
        const customer = customerMap.get(phone)!;
        customer.totalOrders += 1;
        customer.totalSpent += order.total;
        customer.lastOrder = order.orderedAt;
        customer.name = order.customerName;
        customer.email = order.customerEmail;
    });
    return Array.from(customerMap.values()).sort((a, b) => new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime());
  }, [orders]);

  const value = {
    products,
    pages,
    orders,
    customers,
    settings,
    customTemplates,
    addProduct,
    updateProduct,
    deleteProduct,
    addPage,
    updatePage,
    deletePage,
    addOrder,
    updateOrder,
    updateSettings,
    getPageById,
    addCustomTemplate,
    updateCustomTemplate,
    deleteCustomTemplate,
    getCustomTemplateById,
    currentPage,
    setCurrentPage,
    currentPageId,
    setCurrentPageId,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};