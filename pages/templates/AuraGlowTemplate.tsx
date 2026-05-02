import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import type { Product, LandingPage, Order } from '../../types';

interface AuraGlowTemplateProps {
    page: LandingPage;
}

const shippingCost = 5.00;

const AuraGlowTemplate: React.FC<AuraGlowTemplateProps> = ({ page }) => {
    const { products: allProducts, addOrder } = useAppContext();
    const orderFormRef = useRef<HTMLDivElement>(null);

    const pageProducts = useMemo(() => {
        return page.productIds.map(id => allProducts.find(p => p.id === id)).filter((p): p is Product => !!p);
    }, [page.productIds, allProducts]);

    const mainProduct = pageProducts[0];
    const relatedProducts = pageProducts.slice(1);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(mainProduct || null);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    
    const total = selectedProduct ? selectedProduct.price + shippingCost : shippingCost;

    const handleScrollToOrder = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        orderFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedProduct) return;
        const newOrder = addOrder({
            customerName: formData.name,
            customerPhone: formData.phone,
            customerAddress: formData.address,
            products: [selectedProduct],
            total: selectedProduct.price + shippingCost,
            landingPageId: page.id,
            courier: 'Sundarban Courier', // Default courier
        });
        setPlacedOrder(newOrder);
        setOrderSuccess(true);
        window.scrollTo(0,0);
    }, [formData, addOrder, page.id, selectedProduct]);

    if (!mainProduct) {
        return <div className="bg-aura-bg min-h-screen flex items-center justify-center"><p className="text-aura-text">Product not found for this page.</p></div>
    }

    if (orderSuccess) {
        const trackingUrl = `https://track-your-order.com/tracking?courier=${encodeURIComponent(placedOrder?.courier || '')}&id=${placedOrder?.trackingId}`;
        return (
            <div className="bg-aura-bg min-h-screen flex flex-col items-center justify-center text-aura-text p-8 text-center animate-fade-in">
                <h1 className="text-4xl font-serif text-aura-accent mb-4">Thank You!</h1>
                <p className="text-xl">Your order has been placed successfully.</p>
                <p className="text-aura-text-light mt-2">We will contact you shortly to confirm the details.</p>
                {placedOrder?.trackingId && (
                     <a
                        href={trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-8 inline-block px-6 py-3 rounded-full bg-white border border-gray-200 text-aura-accent font-semibold hover:bg-aura-accent/10 transition-colors shadow-md"
                    >
                        Track Your Order
                    </a>
                )}
            </div>
        );
    }

    return (
        <div className="bg-aura-bg text-aura-text font-sans">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <header className="text-center py-10">
                    <h1 className="text-5xl font-serif tracking-tight text-aura-text">Aura Glow</h1>
                    <p className="text-aura-text-light mt-2">Discover Your Inner Radiance</p>
                </header>

                {/* Hero */}
                <section className="flex flex-col md:flex-row items-center gap-8 py-10">
                    <div className="md:w-1/2 animate-fade-in">
                        <img src={mainProduct.imageUrl} alt={mainProduct.name} className="rounded-lg shadow-xl w-full" />
                    </div>
                    <div className="md:w-1/2 text-center md:text-left animate-slide-in-up">
                        <h2 className="text-4xl font-bold leading-tight">{page.title}</h2>
                        <p className="mt-4 text-lg text-aura-text-light">{page.description}</p>
                        <p className="mt-4 text-3xl font-serif text-aura-accent">${mainProduct.price.toFixed(2)}</p>
                        <button onClick={handleScrollToOrder} className="mt-6 w-full md:w-auto bg-aura-accent text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
                            Order Now
                        </button>
                    </div>
                </section>

                {/* Benefits */}
                <section className="py-16">
                     <h2 className="text-3xl font-bold text-center mb-10">Why You'll Love It</h2>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-4"><h3 className="font-semibold text-lg">Deep Hydration</h3><p className="text-aura-text-light mt-1">Locks in moisture for a plump, dewy look.</p></div>
                        <div className="p-4"><h3 className="font-semibold text-lg">Brightens Skin</h3><p className="text-aura-text-light mt-1">Reduces dark spots and evens out skin tone.</p></div>
                        <div className="p-4"><h3 className="font-semibold text-lg">Natural Ingredients</h3><p className="text-aura-text-light mt-1">Vegan, cruelty-free, and gentle on all skin types.</p></div>
                     </div>
                </section>
                
                 {/* Related Products */}
                 {relatedProducts.length > 0 && (
                     <section className="py-16">
                        <h2 className="text-3xl font-bold text-center mb-10">Complete the Routine</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedProducts.map(product => (
                                <div key={product.id} className="bg-white rounded-lg shadow-md p-6 text-center">
                                    <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover rounded-md mx-auto mb-4"/>
                                    <h3 className="font-semibold text-lg">{product.name}</h3>
                                    <p className="text-aura-text-light text-sm mt-1">{product.description}</p>
                                    <p className="text-xl font-serif text-aura-accent mt-3">${product.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                     </section>
                 )}
                
                {/* Order Form */}
                <section ref={orderFormRef} id="order-form" className="py-20">
                     <h2 className="text-3xl font-bold text-center mb-10">Complete Your Order</h2>
                     <div className="max-w-2xl mx-auto bg-aura-card rounded-lg shadow-xl p-8 border border-gray-200">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Product Selection */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-aura-text">Select a Product</h3>
                                {pageProducts.map(product => (
                                    <div key={product.id} className={`flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer ${selectedProduct?.id === product.id ? 'border-aura-accent bg-aura-accent/5' : 'border-gray-200'}`} onClick={() => setSelectedProduct(product)}>
                                        <input
                                            type="radio"
                                            id={`product-${product.id}`}
                                            name="productSelection"
                                            value={product.id}
                                            checked={selectedProduct?.id === product.id}
                                            onChange={() => setSelectedProduct(product)}
                                            className="form-radio h-5 w-5 text-aura-accent focus:ring-aura-accent"
                                        />
                                        <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-md object-cover"/>
                                        <label htmlFor={`product-${product.id}`} className="flex-grow font-medium cursor-pointer">{product.name}</label>
                                        <p className="font-semibold">${product.price.toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            {selectedProduct && (
                                <div className="border-b border-t py-4">
                                    <div className="flex justify-between mt-4 text-aura-text-light"><p>Subtotal</p><p>${selectedProduct.price.toFixed(2)}</p></div>
                                    <div className="flex justify-between text-aura-text-light"><p>Shipping</p><p>${shippingCost.toFixed(2)}</p></div>
                                    <div className="flex justify-between font-bold text-xl mt-2 pt-2 border-t"><p>Total</p><p>${total.toFixed(2)}</p></div>
                                </div>
                            )}

                            {/* Form Fields */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-aura-text-light mb-1">Full Name</label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Your Name" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-aura-accent focus:border-aura-accent"/>
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-aura-text-light mb-1">Phone Number</label>
                                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="For delivery updates" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-aura-accent focus:border-aura-accent"/>
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-aura-text-light mb-1">Shipping Address</label>
                                <textarea id="address" name="address" value={formData.address} onChange={handleChange} required rows={3} placeholder="123 Beauty Lane, City, State, ZIP" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-aura-accent focus:border-aura-accent"></textarea>
                            </div>

                            <button type="submit" disabled={!selectedProduct} className="w-full bg-aura-accent text-white text-lg font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                Place Order &mdash; ${total.toFixed(2)}
                            </button>
                        </form>
                     </div>
                </section>

                {/* Footer */}
                <footer className="text-center py-10 border-t">
                    <p className="text-aura-text-light">&copy; {new Date().getFullYear()} Aura Glow. All Rights Reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default AuraGlowTemplate;