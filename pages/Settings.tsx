
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Settings: React.FC = () => {
    const { settings, updateSettings } = useAppContext();
    const [pixelId, setPixelId] = useState(settings.facebookPixelId);
    const [lowStockThreshold, setLowStockThreshold] = useState(settings.lowStockThreshold);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettings({ facebookPixelId: pixelId, lowStockThreshold: Number(lowStockThreshold) });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="max-w-xl mx-auto animate-fade-in">
            <div className="bg-dark-card border border-dark-border rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
                <form onSubmit={handleSave}>
                    <div className="mb-6">
                        <label htmlFor="pixelId" className="block text-sm font-medium text-gray-300 mb-2">Facebook Pixel ID</label>
                        <input
                            type="text"
                            id="pixelId"
                            value={pixelId}
                            onChange={(e) => setPixelId(e.target.value)}
                            placeholder="Enter your Pixel ID"
                            className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                         <p className="text-xs text-gray-500 mt-2">This ID will be added to all your landing pages for tracking.</p>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-300 mb-2">Low Stock Threshold</label>
                        <input
                            type="number"
                            id="lowStockThreshold"
                            value={lowStockThreshold}
                            onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                            min="0"
                            className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                         <p className="text-xs text-gray-500 mt-2">Get alerts when product stock falls below this number.</p>
                    </div>

                    <div className="flex items-center">
                         <button
                            type="submit"
                            className="px-6 py-2 rounded-md bg-primary text-dark-bg font-bold hover:bg-opacity-80 transition-colors"
                        >
                            Save Settings
                        </button>
                        {isSaved && <span className="ml-4 text-green-400 animate-fade-in">Saved!</span>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;