import React, { useState, useEffect } from 'react';
import type { Product } from '../types';

interface ProductBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id'> | Product) => void;
  productToEdit?: Product | null;
}

const ProductBuilderModal: React.FC<ProductBuilderModalProps> = ({ isOpen, onClose, onSave, productToEdit }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setPrice(String(productToEdit.price));
      setDescription(productToEdit.description);
      setImageUrl(productToEdit.imageUrl);
      setStock(String(productToEdit.stock));
    } else {
      setName('');
      setPrice('');
      setDescription('');
      setImageUrl('');
      setStock('');
    }
  }, [productToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
        name,
        price: parseFloat(price) || 0,
        description,
        imageUrl,
        stock: parseInt(stock) || 0,
    };

    if (productToEdit) {
        onSave({ ...productToEdit, ...productData });
    } else {
        onSave(productData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-dark-card rounded-lg shadow-2xl p-8 w-full max-w-2xl border border-dark-border transform transition-all duration-300 animate-slide-in-up" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-primary mb-6">{productToEdit ? 'Edit Product' : 'Create New Product'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none" required />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">Price</label>
              <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} step="0.01" min="0" className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none" required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                <input type="url" id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none" required />
            </div>
            <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-300 mb-2">Stock Quantity</label>
                <div className="flex items-center">
                    <button 
                        type="button" 
                        onClick={() => setStock(s => String(Math.max(0, (Number(s) || 0) - 1)))}
                        disabled={Number(stock) <= 0}
                        className="px-3 py-2 rounded-l-md bg-dark-bg border border-dark-border border-r-0 hover:bg-secondary text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Decrease stock by one"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                    </button>
                    <input 
                        type="number" 
                        id="stock" 
                        value={stock} 
                        onChange={e => setStock(e.target.value)} 
                        min="0" 
                        className="w-full bg-dark-bg border-y border-dark-border px-3 py-2 text-white text-center focus:ring-2 focus:ring-primary focus:outline-none focus:z-10 appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                        required 
                    />
                    <button 
                        type="button" 
                        onClick={() => setStock(s => String((Number(s) || 0) + 1))} 
                        className="px-3 py-2 rounded-r-md bg-dark-bg border border-dark-border border-l-0 hover:bg-primary/80 text-white transition-colors"
                        aria-label="Increase stock by one"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-6-6h12" />
                        </svg>
                    </button>
                </div>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none" required />
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-dark-border text-white hover:bg-gray-600 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-md bg-primary text-dark-bg font-bold hover:bg-opacity-80 transition-colors">Save Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductBuilderModal;