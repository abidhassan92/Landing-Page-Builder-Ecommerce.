// FIX: Import React to resolve React.CSSProperties type.
import React from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  stock: number;
}

export interface LandingPage {
  id: string;
  title: string;
  description: string;
  productIds: string[];
  template: string; // e.g., 'excel-minox', 'aura-glow', or a custom template ID like 'ctpl_...'
  createdAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  customerAddress: string;
  products: Product[];
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderedAt: string;
  landingPageId: string;
  courier: string;
  trackingId?: string;
}

export interface Customer {
    phone: string;
    email?: string;
    name: string;
    totalOrders: number;
    totalSpent: number;
    firstOrder: string;
    lastOrder: string;
}

export interface Settings {
    facebookPixelId: string;
    lowStockThreshold: number;
}

export interface TemplateComponent {
  id: string;
  type: 'Heading' | 'Text' | 'Image' | 'OrderForm' | 'Button' | 'Hero';
  props: {
      styles?: React.CSSProperties;
      // Common props
      text?: string;
      
      // Heading props
      level?: 1 | 2 | 3; 

      // Image props
      src?: string;
      alt?: string;

      // Button/Link props
      link?: string;

      // Hero props
      title?: string;
      subtitle?: string;
      buttonText?: string;
      buttonLink?: string;
      backgroundImageUrl?: string;
  };
}

export interface CustomTemplate {
  id: string;
  name: string;
  structure: TemplateComponent[];
}