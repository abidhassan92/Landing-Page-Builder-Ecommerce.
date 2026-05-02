
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { LandingPage } from '../types';
import PageBuilderModal from '../components/PageBuilderModal';
import { PlusCircleIcon, EditIcon, TrashIcon, ExternalLinkIcon } from '../components/Icon';

const ManagePages: React.FC = () => {
    const { pages, addPage, updatePage, deletePage, setCurrentPage, setCurrentPageId } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pageToEdit, setPageToEdit] = useState<LandingPage | null>(null);

    const handleOpenCreateModal = () => {
        setPageToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (page: LandingPage) => {
        setPageToEdit(page);
        setIsModalOpen(true);
    };

    const handleSavePage = (pageData: Omit<LandingPage, 'id' | 'createdAt'> | LandingPage) => {
        if ('id' in pageData) {
            updatePage(pageData);
        } else {
            addPage(pageData);
        }
    };
    
    const handleViewPage = (pageId: string) => {
        setCurrentPageId(pageId);
        setCurrentPage('/page');
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Your Landing Pages</h2>
                <button
                    onClick={handleOpenCreateModal}
                    className="flex items-center px-4 py-2 rounded-md bg-primary text-dark-bg font-bold hover:bg-opacity-80 transition-colors"
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Create New Page
                </button>
            </div>
            
            <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-dark-border/50">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-300">Title</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Template</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Products</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Created At</th>
                                <th className="p-4 text-sm font-semibold text-gray-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pages.map(page => (
                                <tr key={page.id} className="border-b border-dark-border last:border-b-0 hover:bg-dark-border/30">
                                    <td className="p-4 font-medium">{page.title}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 text-xs rounded-full bg-secondary/20 text-secondary/90 capitalize">
                                            {page.template.replace('-', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-400">{page.productIds.length}</td>
                                    <td className="p-4 text-gray-400">{new Date(page.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <div className="flex justify-end items-center space-x-3">
                                            <button onClick={() => handleViewPage(page.id)} className="text-gray-400 hover:text-primary transition-colors" aria-label={`View page ${page.title}`}>
                                                <ExternalLinkIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleOpenEditModal(page)} className="text-gray-400 hover:text-primary transition-colors" aria-label={`Edit page ${page.title}`}>
                                                <EditIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => deletePage(page.id)} className="text-gray-400 hover:text-red-500 transition-colors" aria-label={`Delete page ${page.title}`}>
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

            <PageBuilderModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePage}
                pageToEdit={pageToEdit}
            />
        </div>
    );
};

export default ManagePages;