import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import type { Product, LandingPage, Order } from '../../types';

// --- Helper Components ---

const shippingCost = 80.00;

const BenefitIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-excel-tan"><path d="M17.625 10.375L12 16L6.375 10.375L7.4375 9.3125L12 13.875L16.5625 9.3125L17.625 10.375Z"></path></svg>
);

const CtaButton: React.FC<{ onClick: (e: React.MouseEvent<HTMLButtonElement>) => void }> = ({ onClick }) => {
    return (
        <button
            type="button"
            className="w-full max-w-md mx-auto block text-center bg-excel-tan text-black text-2xl font-bold py-4 px-6 rounded-md shadow-lg transform hover:scale-105 transition-transform duration-300 animate-pulse"
            onClick={onClick}
        >
            অর্ডার করুন
        </button>
    );
};

const FeatureItem: React.FC<{text:string}> = ({text}) => (
    <div className="flex items-center space-x-4 p-4 border-y-2 border-dashed border-excel-gold/20 bg-excel-card/50">
        <BenefitIcon />
        <p className="text-gray-200 text-lg font-medium">{text}</p>
    </div>
);

const SectionTitle: React.FC<{children:React.ReactNode, className?:string}> = ({children, className}) => (
    <div className={`text-center py-3 my-6 bg-excel-card border-y-2 border-excel-gold/50 shadow-lg ${className}`}>
         <h2 className="text-2xl font-bold text-excel-tan">{children}</h2>
    </div>
);

const Divider: React.FC = () => (
     <div className="h-1 bg-repeat-x bg-center" style={{backgroundImage: "url('https://i.ibb.co/JqjT2W6/divider.png')"}}></div>
);

interface ExcelMinoxTemplateProps {
    page: LandingPage;
}

const ExcelMinoxTemplate: React.FC<ExcelMinoxTemplateProps> = ({ page }) => {
    const { addOrder, products: allProducts } = useAppContext();
    const orderFormRef = useRef<HTMLDivElement>(null);
    
    const pageProducts = useMemo(() => {
        return page.productIds.map(id => allProducts.find(p => p.id === id)).filter((p): p is Product => !!p);
    }, [page.productIds, allProducts]);

    const mainProduct = pageProducts[0];
    const relatedProducts = pageProducts.slice(1);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(mainProduct || null);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
    const [formData, setFormData] = useState({ name: '', phone: '', address: '', notes: '' });
    
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
        if (!selectedProduct) {
            alert("Please select a product to order.");
            return;
        }
        const newOrder = addOrder({
            customerName: formData.name,
            customerPhone: formData.phone,
            customerAddress: formData.address,
            products: [selectedProduct],
            total: selectedProduct.price + shippingCost,
            landingPageId: page.id,
            courier: 'Pathao Courier', // Default courier
        });
        setPlacedOrder(newOrder);
        setOrderSuccess(true);
        window.scrollTo(0,0);
    }, [formData, addOrder, page.id, selectedProduct]);

    if (!mainProduct) {
        return <div className="bg-excel-dark min-h-screen flex items-center justify-center text-white p-4">This landing page has no products assigned.</div>
    }

    if (orderSuccess) {
        const trackingUrl = `https://track-your-order.com/tracking?courier=${encodeURIComponent(placedOrder?.courier || '')}&id=${placedOrder?.trackingId}`;
        return (
            <div className="bg-excel-dark min-h-screen flex flex-col items-center justify-center text-white p-4 text-center">
                <h1 className="text-4xl font-bold text-excel-tan mb-4">ধন্যবাদ!</h1>
                <p className="text-xl">আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে।</p>
                <p className="text-gray-300 mt-2">আমাদের একজন প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবে।</p>
                {placedOrder?.trackingId && (
                     <a
                        href={trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-8 inline-block px-6 py-3 rounded-md bg-excel-card border-2 border-excel-gold/50 text-excel-tan font-semibold hover:bg-excel-gold/20 transition-colors"
                    >
                        Track Your Order
                    </a>
                )}
            </div>
        );
    }

    return (
        <div className="bg-excel-dark text-white font-sans">
            <div className="max-w-3xl mx-auto">
                
                <header className="text-center py-6 px-4">
                    <h1 className="text-3xl font-bold text-excel-tan">{mainProduct.name}</h1>
                    <p className="text-lg text-gray-300">{mainProduct.description}</p>
                </header>

                <section className="text-center px-4">
                    <img src={mainProduct.imageUrl} alt={mainProduct.name} className="w-full rounded-lg" />
                </section>
                
                <div className="p-4"><CtaButton onClick={handleScrollToOrder} /></div>
                
                <Divider />

                <section className="my-4">
                    <SectionTitle>উপকারিতাঃ</SectionTitle>
                    <div className="space-y-3 px-4">
                        <FeatureItem text="একদম খালি গালে চাপ দাড়ি গজাবে।" />
                        <FeatureItem text="পাতলা দাড়ি ঘন হবে।" />
                        <FeatureItem text="কোঁকড়ানো দাড়ি সোজা হবে।" />
                        <FeatureItem text="দাড়ির গ্যাপ ফিলাপ করে ঘন চাপ দাড়ি গজাবে।" />
                    </div>
                </section>
                
                {relatedProducts.length > 0 && (
                    <>
                        <Divider />
                        <section className="my-8 px-4">
                            <SectionTitle>অন্যান্য প্রোডাক্টস</SectionTitle>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {relatedProducts.map(product => (
                                    <div key={product.id} className="bg-excel-card border-2 border-excel-gold/30 rounded-lg p-4 text-center">
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4"/>
                                        <h3 className="text-xl font-semibold text-excel-tan">{product.name}</h3>
                                        <p className="text-gray-300 mt-2">{product.description}</p>
                                        <p className="text-2xl font-bold text-white mt-4">৳ {product.price.toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                )}

                <div className="p-4"><CtaButton onClick={handleScrollToOrder} /></div>

                <section ref={orderFormRef} id="order-form" className="my-10 p-4">
                    <SectionTitle>প্রোডাক্ট সিলেক্ট করুনঃ</SectionTitle>
                    <div className="border-2 border-excel-gold/50 rounded-lg bg-excel-card p-4 space-y-4">
                        {pageProducts.map(product => (
                            <div key={product.id} className="flex items-center space-x-4 p-2 rounded cursor-pointer hover:bg-excel-gold/10" onClick={() => setSelectedProduct(product)}>
                                <input 
                                    type="radio" 
                                    id={`product-${product.id}`} 
                                    name="product" 
                                    value={product.id} 
                                    checked={selectedProduct?.id === product.id} 
                                    onChange={() => setSelectedProduct(product)}
                                    className="form-radio w-5 h-5 text-excel-tan bg-excel-dark border-excel-gold/50 focus:ring-excel-tan" 
                                />
                                <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded"/>
                                <label htmlFor={`product-${product.id}`} className="flex-grow text-gray-200 cursor-pointer">{product.name}</label>
                                <span className="font-semibold text-lg">৳ {product.price.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                        <SectionTitle>অর্ডার ফর্মটি পূরণ করুনঃ</SectionTitle>
                        
                        <div className="space-y-4">
                          <div>
                              <label htmlFor="name" className="block text-lg font-medium text-gray-300 mb-2">নাম <span className="text-red-500">*</span></label>
                              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="আপনার নাম লিখুন" className="w-full bg-excel-dark border-2 border-excel-gold/50 rounded-md px-4 py-3 text-white focus:ring-2 focus:ring-excel-tan focus:outline-none"/>
                          </div>
                          <div>
                             <label htmlFor="phone" className="block text-lg font-medium text-gray-300 mb-2">মোবাইল <span className="text-red-500">*</span></label>
                             <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="017XXXXXXXX" className="w-full bg-excel-dark border-2 border-excel-gold/50 rounded-md px-4 py-3 text-white focus:ring-2 focus:ring-excel-tan focus:outline-none"/>
                          </div>
                          <div>
                             <label htmlFor="address" className="block text-lg font-medium text-gray-300 mb-2">সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span></label>
                             <textarea id="address" name="address" value={formData.address} onChange={handleChange} required rows={3} placeholder="গ্রামঃ ইউনিয়নঃ উপজেলাঃ জেলাঃ হোম ডেলিভারি পেতে সম্পূর্ণ ঠিকানা" className="w-full bg-excel-dark border-2 border-excel-gold/50 rounded-md px-4 py-3 text-white focus:ring-2 focus:ring-excel-tan focus:outline-none"></textarea>
                          </div>
                           <div>
                             <label htmlFor="notes" className="block text-lg font-medium text-gray-300 mb-2">Order notes (optional)</label>
                             <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Notes about your order, e.g. special notes for delivery." className="w-full bg-excel-dark border-2 border-excel-gold/50 rounded-md px-4 py-3 text-white focus:ring-2 focus:ring-excel-tan focus:outline-none"></textarea>
                          </div>
                        </div>

                        {selectedProduct && (
                            <div className="border-2 border-excel-gold/50 rounded-lg bg-excel-card p-4 space-y-3">
                                <SectionTitle className="my-0">কি অর্ডার করেছেন দেখে নিনঃ</SectionTitle>
                                <div className="flex justify-between font-semibold text-gray-300 border-b border-excel-gold/20 pb-2"><p>Product</p> <p>Subtotal</p></div>
                                <div className="flex justify-between items-center text-gray-300"><p>{selectedProduct.name} x 1</p> <p>৳ {selectedProduct.price.toFixed(2)}</p></div>
                                <div className="flex justify-between text-gray-300 border-t border-excel-gold/20 pt-2"><p>Subtotal</p> <p>৳ {selectedProduct.price.toFixed(2)}</p></div>
                                <div className="flex justify-between text-gray-300"><p>Shipping</p> <p>৳ {shippingCost.toFixed(2)}</p></div>
                                <div className="flex justify-between font-bold text-lg text-white border-t-2 border-excel-gold/40 pt-2"><p>Total</p> <p>৳ {total.toFixed(2)}</p></div>
                            </div>
                        )}
                        
                        <div className="text-center p-4 bg-excel-tan/10 border-2 border-excel-tan/30 rounded-md">
                            <h3 className="font-bold text-excel-tan text-xl">ক্যাশ অন ডেলিভারি</h3>
                            <div className="my-2 p-3 bg-excel-tan rounded-md text-black font-semibold">কোন টাকা অগ্রিম ছাড়াই অর্ডার করুন।</div>
                        </div>

                        <button type="submit" disabled={!selectedProduct} className="w-full bg-excel-tan text-black text-2xl font-bold py-4 px-6 rounded-md shadow-lg transform hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                           অর্ডার সম্পূর্ণ করুন ৳ {total.toFixed(2)}
                        </button>
                        <p className="text-xs text-center text-gray-400">Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.</p>
                    </form>
                </section>
                
                <footer className="text-center py-8 text-gray-400 px-4 space-y-2">
                    <h3 className="font-bold text-lg text-gray-200">CONTACT US</h3>
                    <p>HM Plaza, Road#02, Sector#03, Uttara, Dhaka 1230</p>
                    <p>+880 1796901614</p>
                    <p>admin@excelshopbd.com</p>
                    <div className="mt-6">
                        <h3 className="font-bold text-lg text-gray-200">FOLLOW US</h3>
                        <a href="https://m.me/excelshopbd23" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">m.me/excelshopbd23</a>
                    </div>
                    <p className="text-xs pt-6">&copy; {new Date().getFullYear()} EXCEL SHOP BD. CREATED BY IGUAZU DIGITAL LTD.</p>
                </footer>
            </div>
        </div>
    );
};

export default ExcelMinoxTemplate;