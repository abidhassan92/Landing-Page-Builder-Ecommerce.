import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { CustomTemplate } from '../types';
import TemplateBuilderModal from '../components/TemplateBuilderModal';
import { PlusCircleIcon, EditIcon, TrashIcon } from '../components/Icon';

const ManageTemplates: React.FC = () => {
    const { customTemplates, addCustomTemplate, updateCustomTemplate, deleteCustomTemplate } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [templateToEdit, setTemplateToEdit] = useState<CustomTemplate | null>(null);

    const handleOpenCreateModal = () => {
        setTemplateToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (template: CustomTemplate) => {
        setTemplateToEdit(template);
        setIsModalOpen(true);
    };

    const handleSaveTemplate = (templateData: Omit<CustomTemplate, 'id'> | CustomTemplate) => {
        if ('id' in templateData) {
            updateCustomTemplate(templateData);
        } else {
            addCustomTemplate(templateData);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Custom Templates</h2>
                <button
                    onClick={handleOpenCreateModal}
                    className="flex items-center px-4 py-2 rounded-md bg-primary text-dark-bg font-bold hover:bg-opacity-80 transition-colors"
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Create New Template
                </button>
            </div>
            
            <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-dark-border/50">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-300">Template Name</th>
                                <th className="p-4 text-sm font-semibold text-gray-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customTemplates.length > 0 ? customTemplates.map(template => (
                                <tr key={template.id} className="border-b border-dark-border last:border-b-0 hover:bg-dark-border/30">
                                    <td className="p-4 font-medium">{template.name}</td>
                                    <td className="p-4">
                                        <div className="flex justify-end items-center space-x-3">
                                            <button onClick={() => handleOpenEditModal(template)} className="text-gray-400 hover:text-primary transition-colors" aria-label={`Edit template ${template.name}`}>
                                                <EditIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => deleteCustomTemplate(template.id)} className="text-gray-400 hover:text-red-500 transition-colors" aria-label={`Delete template ${template.name}`}>
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={2} className="p-8 text-center text-gray-400">
                                        You haven't created any custom templates yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <TemplateBuilderModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTemplate}
                templateToEdit={templateToEdit}
            />
        </div>
    );
};

export default ManageTemplates;
