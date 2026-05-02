
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Order } from '../types';
import OrderEditModal from '../components/OrderEditModal';
import { EditIcon } from '../components/Icon';

const ManageOrders: React.FC = () => {
    const { orders, updateOrder } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);

    const handleOpenEditModal = (order: Order) => {
        setOrderToEdit(order);
        setIsModalOpen(true);
    };

    const handleSaveOrder = (updatedOrder: Order) => {
        updateOrder(updatedOrder);
    };

    return (
        <div className="animate-fade-in">
            <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-dark-border/50">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-300">Order ID</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Customer</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Total</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Status</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Courier</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Tracking ID</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Date</th>
                                <th className="p-4 text-sm font-semibold text-gray-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="border-b border-dark-border last:border-b-0 hover:bg-dark-border/30">
                                    <td className="p-4 text-xs font-mono text-gray-500 align-top">{order.id}</td>
                                    <td className="p-4 align-top">
                                        <div className="font-medium">{order.customerName}</div>
                                        {order.customerPhone && <div className="text-sm text-gray-400">{order.customerPhone}</div>}
                                    </td>
                                    <td className="p-4 font-medium align-top">${order.total.toFixed(2)}</td>
                                    <td className="p-4 align-top">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                                            order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400' :
                                            order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                        }`}>{order.status}</span>
                                    </td>
                                    <td className="p-4 text-gray-400 align-top">{order.courier}</td>
                                    <td className="p-4 text-xs font-mono text-gray-500 align-top">{order.trackingId || 'N/A'}</td>
                                    <td className="p-4 text-gray-400 align-top text-sm">{new Date(order.orderedAt).toLocaleDateString()}</td>
                                    <td className="p-4 align-top text-right">
                                         <button onClick={() => handleOpenEditModal(order)} className="text-gray-400 hover:text-primary transition-colors" aria-label={`Edit order ${order.id}`}>
                                            <EditIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <OrderEditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveOrder}
                orderToEdit={orderToEdit}
            />
        </div>
    );
};

export default ManageOrders;