import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Product } from '../types';
import ProductBuilderModal from '../components/ProductBuilderModal';
import { PlusCircleIcon, EditIcon, TrashIcon } from '../components/Icon';

const ManageProducts: React.FC = () => {
    const { products, addProduct, updateProduct, deleteProduct, settings } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);

    const handleOpenCreateModal = () => {
        setProductToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (product: Product) => {
        setProductToEdit(product);
        setIsModalOpen(true);
    };

    const handleSaveProduct = (productData: Omit<Product, 'id'> | Product) => {
        if ('id' in productData) {
            updateProduct(productData);
        } else {
            addProduct(productData);
        }
    };

    const handleAdjustStock = (product: Product, adjustment: number) => {
        const newStock = product.stock + adjustment;
        if (newStock >= 0) {
            updateProduct({ ...product, stock: newStock });
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Your Products</h2>
                <button
                    onClick={handleOpenCreateModal}
                    className="flex items-center px-4 py-2 rounded-md bg-primary text-dark-bg font-bold hover:bg-opacity-80 transition-colors"
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Create New Product
                </button>
            </div>
            
            <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-dark-border/50">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-300">Image</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Name</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Price</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Stock</th>
                                <th className="p-4 text-sm font-semibold text-gray-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} className="border-b border-dark-border last:border-b-0 hover:bg-dark-border/30">
                                    <td className="p-4 align-middle">
                                        <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                                    </td>
                                    <td className="p-4 font-medium align-middle">{product.name}</td>
                                    <td className="p-4 text-gray-300 align-middle">${product.price.toFixed(2)}</td>
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleAdjustStock(product, -1)}
                                                disabled={product.stock === 0}
                                                className="p-1 rounded-full bg-dark-border hover:bg-secondary text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label={`Decrease stock for ${product.name}`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <span className={`font-medium w-8 text-center ${product.stock === 0 ? 'text-gray-500' : product.stock < settings.lowStockThreshold ? 'text-red-400' : 'text-gray-300'}`}>
                                                {product.stock}
                                            </span>
                                            <button
                                                onClick={() => handleAdjustStock(product, 1)}
                                                className="p-1 rounded-full bg-dark-border hover:bg-primary/80 text-white transition-colors"
                                                aria-label={`Increase stock for ${product.name}`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-6-6h12" />
                                                </svg>
                                            </button>
                                            <div className="w-16">
                                                {product.stock > 0 && product.stock < settings.lowStockThreshold && (
                                                    <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">Low</span>
                                                )}
                                                {product.stock === 0 && (
                                                    <span className="px-2 py-1 text-xs rounded-full bg-gray-600/50 text-gray-400">Out</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="flex justify-end items-center space-x-3">
                                            <button onClick={() => handleOpenEditModal(product)} className="text-gray-400 hover:text-primary transition-colors" aria-label={`Edit product ${product.name}`}>
                                                <EditIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => deleteProduct(product.id)} className="text-gray-400 hover:text-red-500 transition-colors" aria-label={`Delete product ${product.name}`}>
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ProductBuilderModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProduct}
                productToEdit={productToEdit}
            />
        </div>
    );
};

export default ManageProducts;