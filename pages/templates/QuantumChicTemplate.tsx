import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import type { Product, LandingPage, Order } from '../../types';

interface QuantumChicTemplateProps {
    page: LandingPage;
}

const shippingCost = 8.00;

const Feature: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-dark-card rounded-full text-primary">
            {icon}
        </div>
        <div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="mt-1 text-gray-400">{children}</p>
        </div>
    </div>
);

const QuantumChicTemplate: React.FC<QuantumChicTemplateProps> = ({ page }) => {
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
            courier: 'Quantum Express',
        });
        setPlacedOrder(newOrder);
        setOrderSuccess(true);
        window.scrollTo(0,0);
    }, [formData, addOrder, page.id, selectedProduct]);

    if (!mainProduct) {
        return <div className="bg-black min-h-screen flex items-center justify-center"><p className="text-gray-300">Product for this page is not available.</p></div>
    }

    if (orderSuccess) {
        const trackingUrl = `https://track-your-order.com/tracking?courier=${encodeURIComponent(placedOrder?.courier || '')}&id=${placedOrder?.trackingId}`;

        return (
            <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white p-8 text-center animate-fade-in">
                <h1 className="text-5xl font-bold text-primary mb-4">Thank You</h1>
                <p className="text-xl text-gray-300">Your order has been placed successfully.</p>
                <p className="text-gray-400 mt-2">Our team will contact you shortly to confirm the details.</p>
                {placedOrder?.trackingId && (
                    <a
                        href={trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-8 inline-block px-6 py-3 rounded-md bg-dark-card border border-dark-border text-primary font-semibold hover:bg-dark-border transition-colors"
                    >
                        Track Your Order
                    </a>
                )}
            </div>
        );
    }

    return (
        <div className="bg-black text-gray-200 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <section className="min-h-screen flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/2 w-full h-96 lg:h-screen bg-cover bg-center" style={{ backgroundImage: `url(${mainProduct.imageUrl})` }}></div>
                    <div className="lg:w-1/2 w-full p-8 md:p-16 lg:p-24 flex flex-col justify-center items-start text-left animate-fade-in">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">{page.title}</h1>
                        <p className="mt-6 text-lg text-gray-400 max-w-lg">{page.description}</p>
                        <p className="mt-6 text-4xl font-bold text-primary">${mainProduct.price.toFixed(2)}</p>
                        <button onClick={handleScrollToOrder} className="mt-8 bg-primary text-black font-bold py-4 px-10 rounded-md text-lg transform hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-primary/50">
                            Secure Your Order
                        </button>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-8">
                     <h2 className="text-4xl font-bold text-center mb-16 text-white">Experience the Future</h2>
                     <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                        <Feature title="Atomic Precision" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>}>
                            Engineered with quantum-level accuracy for unparalleled performance and reliability.
                        </Feature>
                         <Feature title="Sleek Aesthetics" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>}>
                            A minimalist design that combines futuristic style with everyday elegance.
                        </Feature>
                     </div>
                </section>
                
                 {/* Related Products Section */}
                 {relatedProducts.length > 0 && (
                    <section className="py-20 px-8 bg-dark-bg">
                        <h2 className="text-4xl font-bold text-center mb-16 text-white">You Might Also Like</h2>
                        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedProducts.map(product => (
                                <div key={product.id} className="bg-dark-card border border-dark-border rounded-lg p-6 text-center flex flex-col">
                                    <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4"/>
                                    <h3 className="text-xl font-semibold text-white flex-grow">{product.name}</h3>
                                    <p className="text-gray-400 mt-2 text-sm">{product.description}</p>
                                    <p className="text-2xl font-bold text-primary mt-4">${product.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                
                {/* Order Form Section */}
                <section ref={orderFormRef} id="order-form" className="py-20 bg-black">
                     <div className="max-w-2xl mx-auto px-8">
                        <h2 className="text-4xl font-bold text-center mb-10 text-white">Place Your Order</h2>
                        <div className="bg-dark-card rounded-lg shadow-2xl p-8 border border-dark-border">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Product Selection */}
                                <div className="border-b border-dark-border pb-6 mb-6">
                                    <h3 className="text-xl font-semibold text-primary mb-4">Select Product</h3>
                                    <div className="space-y-3">
                                        {pageProducts.map(product => (
                                            <div key={product.id} className={`flex items-center space-x-4 p-3 rounded-lg border-2 cursor-pointer transition-colors ${selectedProduct?.id === product.id ? 'border-primary bg-primary/10' : 'border-dark-border bg-dark-bg'}`} onClick={() => setSelectedProduct(product)}>
                                                <input
                                                    type="radio"
                                                    id={`product-${product.id}`}
                                                    name="productSelection"
                                                    value={product.id}
                                                    checked={selectedProduct?.id === product.id}
                                                    onChange={() => setSelectedProduct(product)}
                                                    className="form-radio h-5 w-5 bg-dark-bg border-dark-border text-primary focus:ring-primary focus:ring-2"
                                                />
                                                <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-md object-cover"/>
                                                <label htmlFor={`product-${product.id}`} className="flex-grow font-medium text-white cursor-pointer">{product.name}</label>
                                                <p className="font-semibold text-gray-300">${product.price.toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Order Summary */}
                                {selectedProduct && (
                                    <div className="space-y-2 text-gray-400">
                                      <div className="flex justify-between"><p>Subtotal</p><p>${selectedProduct.price.toFixed(2)}</p></div>
                                      <div className="flex justify-between"><p>Shipping</p><p>${shippingCost.toFixed(2)}</p></div>
                                      <div className="flex justify-between font-bold text-2xl mt-2 pt-2 border-t border-dark-border text-white"><p>Total</p><p>${total.toFixed(2)}</p></div>
                                    </div>
                                )}

                                {/* Form Fields */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your full name" className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-3 text-white focus:ring-2 focus:ring-primary focus:outline-none"/>
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Your phone number" className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-3 text-white focus:ring-2 focus:ring-primary focus:outline-none"/>
                                </div>
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">Shipping Address</label>
                                    <textarea id="address" name="address" value={formData.address} onChange={handleChange} required rows={3} placeholder="Your full shipping address" className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-3 text-white focus:ring-2 focus:ring-primary focus:outline-none"></textarea>
                                </div>

                                <button type="submit" disabled={!selectedProduct} className="w-full bg-primary text-black text-xl font-bold py-4 px-6 rounded-md shadow-lg transform hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed">
                                    Finalize Order &mdash; ${total.toFixed(2)}
                                </button>
                            </form>
                        </div>
                     </div>
                </section>

                {/* Footer */}
                <footer className="text-center py-10">
                    <p className="text-gray-500">&copy; {new Date().getFullYear()} Quantum Inc. All Rights Reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default QuantumChicTemplate;