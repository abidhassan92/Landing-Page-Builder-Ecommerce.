
import type { Product, LandingPage, Order } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Quantum Watch',
    price: 349.99,
    imageUrl: 'https://picsum.photos/seed/quantumwatch/400/400',
    description: 'A sleek, futuristic watch that bends time to your will. Features a holographic display and atomic precision.',
    stock: 50,
  },
  {
    id: 'prod_2',
    name: 'Neutrino Sneakers',
    price: 189.50,
    imageUrl: 'https://picsum.photos/seed/neutrinoshoe/400/400',
    description: 'Light-as-air sneakers infused with neutrino-gel soles for an unparalleled zero-gravity feel.',
    stock: 120,
  },
  {
    id: 'prod_3',
    name: 'Galaxy Hoodie',
    price: 89.99,
    imageUrl: 'https://picsum.photos/seed/galaxyhoodie/400/400',
    description: 'A comfortable hoodie with a dynamic starfield pattern that shifts and twinkles in response to ambient light.',
    stock: 85,
  },
  {
    id: 'prod_4',
    name: 'Cyberpunk Goggles',
    price: 250.00,
    imageUrl: 'https://picsum.photos/seed/cybergoggles/400/400',
    description: 'AR-enabled goggles with a retro-futuristic design. See the world in a new light.',
    stock: 30,
  },
  {
    id: 'prod_aura_glow',
    name: 'Aura Glow Serum',
    price: 75.00,
    imageUrl: 'https://i.ibb.co/6y62S0s/auraproduct.png',
    description: 'A rejuvenating serum with hyaluronic acid and vitamin C for a radiant complexion.',
    stock: 200,
  }
];

export const INITIAL_LANDING_PAGES: LandingPage[] = [
    {
        id: 'page_1',
        title: 'Excel Minox Beard Growth',
        description: 'Landing page for the Excel Minox beard growth oil.',
        productIds: [], // Specific product is hardcoded in template for now
        template: 'excel-minox',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'page_2',
        title: 'Aura Glow Skincare',
        description: 'Landing page for the new Aura Glow serum.',
        productIds: ['prod_aura_glow'],
        template: 'aura-glow',
        createdAt: new Date().toISOString(),
    }
];

export const INITIAL_ORDERS: Order[] = [
    {
        id: 'order_1',
        customerName: 'Alex Ray',
        customerEmail: 'alex.ray@example.com',
        customerPhone: '01234567890',
        customerAddress: '123 Quantum Lane, Chronos City',
        products: [INITIAL_PRODUCTS[0]],
        total: 349.99,
        status: 'Delivered',
        orderedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        landingPageId: 'page_1',
        courier: 'Quantum Express',
        trackingId: 'QE123456789'
    },
    {
        id: 'order_2',
        customerName: 'Mia Wallace',
        customerEmail: 'mia.wallace@example.com',
        customerPhone: '01987654321',
        customerAddress: '456 Singularity Ave, Neutrino Town',
        products: [INITIAL_PRODUCTS[1], INITIAL_PRODUCTS[2]],
        total: 279.49,
        status: 'Shipped',
        orderedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        landingPageId: 'page_1',
        courier: 'Starlight Shipping',
        trackingId: 'SS987654321'
    }
];