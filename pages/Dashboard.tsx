
import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { PagesIcon, OrdersIcon, ProductIcon } from '../components/Icon';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6 flex items-center space-x-4 transform hover:scale-105 hover:border-primary transition-all duration-300">
        <div className="p-3 rounded-full bg-primary/10 text-primary">{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const { pages, orders, products, settings } = useAppContext();
    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

    const lowStockProducts = useMemo(() => 
        products.filter(p => p.stock > 0 && p.stock < settings.lowStockThreshold), 
        [products, settings.lowStockThreshold]
    );

    const outOfStockProducts = useMemo(() =>
        products.filter(p => p.stock === 0),
        [products]
    );

    const lowStockCount = lowStockProducts.length + outOfStockProducts.length;

    return (
        <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Pages" value={pages.length} icon={<PagesIcon className="w-6 h-6"/>} />
                <StatCard title="Total Orders" value={orders.length} icon={<OrdersIcon className="w-6 h-6"/>} />
                <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={<span className="text-xl font-bold">$</span>} />
                {lowStockCount > 0 && (
                     <StatCard title="Stock Alerts" value={lowStockCount} icon={<ProductIcon className="w-6 h-6 text-red-400"/>} />
                )}
            </div>

            {lowStockCount > 0 && (
                <div className="mt-8 bg-dark-card border border-dark-border rounded-lg p-6 animate-slide-in-up">
                    <h3 className="text-xl font-semibold text-white mb-4">Stock Alerts</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-dark-border text-sm text-gray-400">
                                    <th className="py-3 px-2">Product</th>
                                    <th className="py-3 px-2">Stock Left</th>
                                    <th className="py-3 px-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lowStockProducts.map(product => (
                                    <tr key={product.id} className="border-b border-dark-border hover:bg-dark-border/50">
                                        <td className="py-3 px-2">{product.name}</td>
                                        <td className="py-3 px-2 font-medium text-red-400">{product.stock}</td>
                                        <td className="py-3 px-2">
                                            <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">Low Stock</span>
                                        </td>
                                    </tr>
                                ))}
                                {outOfStockProducts.map(product => (
                                    <tr key={product.id} className="border-b border-dark-border last:border-b-0 hover:bg-dark-border/50">
                                        <td className="py-3 px-2">{product.name}</td>
                                        <td className="py-3 px-2 font-medium text-gray-500">{product.stock}</td>
                                        <td className="py-3 px-2">
                                            <span className="px-2 py-1 text-xs rounded-full bg-gray-600/50 text-gray-400">Out of Stock</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="mt-8 bg-dark-card border border-dark-border rounded-lg p-6 animate-slide-in-up">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-dark-border text-sm text-gray-400">
                                <th className="py-3 px-2">Customer</th>
                                <th className="py-3 px-2">Total</th>
                                <th className="py-3 px-2">Status</th>
                                <th className="py-3 px-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.slice(0, 5).map(order => (
                                <tr key={order.id} className="border-b border-dark-border hover:bg-dark-border/50">
                                    <td className="py-3 px-2">{order.customerName}</td>
                                    <td className="py-3 px-2">${order.total.toFixed(2)}</td>
                                    <td className="py-3 px-2">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                                            order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400' :
                                            order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                        }`}>{order.status}</span>
                                    </td>
                                    <td className="py-3 px-2 text-sm text-gray-400">{new Date(order.orderedAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;