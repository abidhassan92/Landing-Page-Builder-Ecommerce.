
import React from 'react';
import { useAppContext } from '../context/AppContext';

const CRM: React.FC = () => {
    const { customers } = useAppContext();

    return (
        <div className="animate-fade-in">
             <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-dark-border/50">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-300">Customer</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Total Orders</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Total Spent</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Last Order</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(customer => (
                                <tr key={customer.phone} className="border-b border-dark-border last:border-b-0 hover:bg-dark-border/30">
                                    <td className="p-4">
                                        <div>{customer.name}</div>
                                        <div className="text-sm text-gray-400">{customer.phone}</div>
                                        {customer.email && <div className="text-sm text-gray-500">{customer.email}</div>}
                                    </td>
                                    <td className="p-4 text-center">{customer.totalOrders}</td>
                                    <td className="p-4 font-medium">${customer.totalSpent.toFixed(2)}</td>
                                    <td className="p-4 text-gray-400">{new Date(customer.lastOrder).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CRM;