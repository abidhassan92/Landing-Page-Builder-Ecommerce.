import React, { useState, useEffect, useMemo } from 'react';
import type { LandingPage, Product } from '../types';
import { useAppContext } from '../context/AppContext';

interface PageBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (page: Omit<LandingPage, 'id' | 'createdAt'> | LandingPage) => void;
  pageToEdit?: LandingPage | null;
}

const builtInTemplates = [
    { 
        id: 'excel-minox', 
        name: 'Excel Minox (Dark Theme)',
        description: 'A bold, dark-themed template ideal for single-product sales. Features strong call-to-actions and a traditional e-commerce layout.',
        imageUrl: 'https://i.ibb.co/6y402qf/excel-minox-thumb.png'
    },
    { 
        id: 'aura-glow', 
        name: 'Aura Glow (Light Theme)',
        description: 'A clean, elegant, and light-themed template perfect for beauty, skincare, or wellness products. Focuses on soft aesthetics.',
        imageUrl: 'https://i.ibb.co/bF9p0S5/aura-glow-thumb.png'
    },
    { 
        id: 'quantum-chic', 
        name: 'Quantum Chic (Minimalist Dark)',
        description: 'A sleek, modern, and minimalist dark theme for tech gadgets or high-end products. Emphasizes a premium feel with a large hero image.',
        imageUrl: 'https://i.ibb.co/hDkLqK7/quantum-chic-thumb.png'
    },
];

const PageBuilderModal: React.FC<PageBuilderModalProps> = ({ isOpen, onClose, onSave, pageToEdit }) => {
  const { products, customTemplates } = useAppContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [template, setTemplate] = useState(builtInTemplates[0].id);

  const allTemplates = useMemo(() => [
    ...builtInTemplates,
    ...customTemplates.map(t => ({ 
        id: t.id, 
        name: t.name, 
        description: 'A custom template created in the template builder.', 
        imageUrl: 'https://i.ibb.co/sK6fX6X/custom-template-placeholder.png'
    }))
  ], [customTemplates]);

  const selectedTemplateInfo = allTemplates.find(t => t.id === template);

  useEffect(() => {
    if (pageToEdit) {
      setTitle(pageToEdit.title);
      setDescription(pageToEdit.description);
      setSelectedProductIds(pageToEdit.productIds);
      setTemplate(pageToEdit.template);
    } else {
      setTitle('');
      setDescription('');
      setSelectedProductIds([]);
      setTemplate(builtInTemplates[0].id);
    }
  }, [pageToEdit, isOpen]);

  const handleProductToggle = (productId: string) => {
    setSelectedProductIds(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pageToEdit) {
        onSave({ ...pageToEdit, title, description, productIds: selectedProductIds, template });
    } else {
        onSave({ title, description, productIds: selectedProductIds, template });
    }
    onClose();
  };

  const handlePreview = () => {
    const previewId = `preview_${Date.now()}`;
    const previewPage: LandingPage = {
      id: previewId,
      title,
      description,
      productIds: selectedProductIds,
      template,
      createdAt: pageToEdit?.createdAt || new Date().toISOString(),
    };
    
    localStorage.setItem('previewPageData', JSON.stringify(previewPage));
    localStorage.setItem('previewPageId', previewId);
    
    const previewUrl = window.location.origin + window.location.pathname;
    window.open(previewUrl, '_blank')?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-dark-card rounded-lg shadow-2xl p-8 w-full max-w-2xl border border-dark-border transform transition-all duration-300 animate-slide-in-up" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-primary mb-6">{pageToEdit ? 'Edit Landing Page' : 'Create New Landing Page'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Page Title</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none" required />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Page Description</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none" required />
          </div>
          <div className="mb-6">
            <label htmlFor="template" className="block text-sm font-medium text-gray-300 mb-2">Template</label>
            <select id="template" value={template} onChange={e => setTemplate(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none">
                <optgroup label="Built-in Templates">
                  {builtInTemplates.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </optgroup>
                {customTemplates.length > 0 && (
                    <optgroup label="Custom Templates">
                        {customTemplates.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </optgroup>
                )}
            </select>
            {selectedTemplateInfo && (
                <div className="mt-4 p-4 border border-dark-border rounded-lg flex items-start space-x-4 bg-dark-bg transition-all duration-300 animate-fade-in">
                    <img src={selectedTemplateInfo.imageUrl} alt={selectedTemplateInfo.name} className="w-24 h-24 object-cover rounded-md flex-shrink-0 border border-dark-border"/>
                    <div>
                        <h4 className="font-semibold text-white">{selectedTemplateInfo.name}</h4>
                        <p className="text-sm text-gray-400 mt-1">{selectedTemplateInfo.description}</p>
                    </div>
                </div>
            )}
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-3">Select Products</h3>
            <p className="text-xs text-gray-500 mb-3">Select one or more products. The first product selected will be the main product on the page.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-48 overflow-y-auto p-2 border border-dark-border rounded-md">
              {products.map(product => (
                <div key={product.id} className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedProductIds.includes(product.id) ? 'border-primary bg-primary/10' : 'border-dark-border bg-dark-bg'}`} onClick={() => handleProductToggle(product.id)}>
                    <img src={product.imageUrl} alt={product.name} className="w-full h-20 object-cover rounded-md mb-2"/>
                    <p className="font-semibold text-sm text-center text-white">{product.name}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handlePreview}
              disabled={!title || selectedProductIds.length === 0}
              className="px-4 py-2 rounded-md bg-secondary text-white font-bold hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Preview
            </button>
            <div className="flex items-center space-x-4">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-dark-border text-white hover:bg-gray-600 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-md bg-primary text-dark-bg font-bold hover:bg-opacity-80 transition-colors" disabled={selectedProductIds.length === 0}>Save Page</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PageBuilderModal;