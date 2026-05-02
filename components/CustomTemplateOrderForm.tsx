import React, { useState, useCallback, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Product, LandingPage, Order } from '../types';

interface CustomTemplateOrderFormProps {
    products: Product[];
    page: LandingPage;
    onOrderSuccess: (order: Order) => void;
}

const shippingCost = 8.00;

const CustomTemplateOrderForm: React.FC<CustomTemplateOrderFormProps> = ({ products, page, onOrderSuccess }) => {
    const { addOrder } = useAppContext();
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0] || null);
    
    const total = useMemo(() => {
        return selectedProduct ? selectedProduct.price + shippingCost : shippingCost;
    }, [selectedProduct]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedProduct) {
            alert('Please select a product.');
            return;
        }
        const newOrder = addOrder({
            customerName: formData.name,
            customerPhone: formData.phone,
            customerAddress: formData.address,
            products: [selectedProduct],
            total: selectedProduct.price + shippingCost,
            landingPageId: page.id,
            courier: 'Default Courier',
        });
        onOrderSuccess(newOrder);
    }, [formData, addOrder, page.id, selectedProduct, onOrderSuccess]);

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="custom-template-order-form-container">
            <h3>Complete Your Order</h3>
            <form onSubmit={handleSubmit} className="custom-template-order-form">
                <div className="product-selection">
                    <h4>Select a Product</h4>
                    {products.map(product => (
                        <div key={product.id} className="product-option" onClick={() => setSelectedProduct(product)}>
                            <input 
                                type="radio" 
                                id={`custom-${product.id}`} 
                                name="product-selection" 
                                value={product.id}
                                checked={selectedProduct?.id === product.id}
                                onChange={() => setSelectedProduct(product)}
                            />
                            <label htmlFor={`custom-${product.id}`}>{product.name} - <strong>${product.price.toFixed(2)}</strong></label>
                        </div>
                    ))}
                </div>

                {selectedProduct && (
                    <div className="order-summary">
                        <div className="price-details"><span>Subtotal:</span> <span>${selectedProduct.price.toFixed(2)}</span></div>
                        <div className="price-details"><span>Shipping:</span> <span>${shippingCost.toFixed(2)}</span></div>
                        <div className="price-details total"><strong>Total:</strong> <strong>${total.toFixed(2)}</strong></div>
                    </div>
                )}
                
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <textarea id="address" name="address" value={formData.address} onChange={handleChange} required rows={3}></textarea>
                </div>
                <button type="submit" className="submit-button" disabled={!selectedProduct}>
                    Place Order - ${total.toFixed(2)}
                </button>
            </form>
            <style>{`
                .custom-template-order-form-container { border: 1px solid #eee; padding: 20px; margin-top: 20px; border-radius: 8px; background: #fff; color: #333; }
                .custom-template-order-form-container h3, .custom-template-order-form-container h4 { margin-top: 0; text-align: center; }
                .custom-template-order-form { display: flex; flex-direction: column; gap: 15px; }
                .form-group { display: flex; flex-direction: column; }
                .form-group label { margin-bottom: 5px; font-weight: bold; color: #555; }
                .form-group input, .form-group textarea { padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 1em; }
                .submit-button { background-color: #007bff; color: white; padding: 12px; border: none; border-radius: 4px; font-size: 1.1em; cursor: pointer; transition: background-color 0.2s; }
                .submit-button:hover { background-color: #0056b3; }
                .submit-button:disabled { background-color: #cccccc; cursor: not-allowed; }
                .order-summary { margin-bottom: 15px; padding: 15px; border: 1px dashed #ddd; border-radius: 4px; }
                .price-details { display: flex; justify-content: space-between; margin-top: 5px; }
                .price-details.total { font-size: 1.1em; margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee; }
                .product-selection { margin-bottom: 15px; }
                .product-option { display: flex; align-items: center; gap: 10px; padding: 10px; border: 1px solid #eee; border-radius: 4px; cursor: pointer; }
                .product-option:has(input:checked) { background-color: #e7f1ff; border-color: #007bff; }
                .product-option label { cursor: pointer; width: 100%; }
            `}</style>
        </div>
    );
};

export default CustomTemplateOrderForm;