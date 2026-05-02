
import React, { useState, useEffect } from 'react';
import type { Order } from '../types';

interface OrderEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Order) => void;
  orderToEdit: Order | null;
}

const statusOptions: Order['status'][] = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

const OrderEditModal: React.FC<OrderEditModalProps> = ({ isOpen, onClose, onSave, orderToEdit }) => {
  const [status, setStatus] = useState<Order['status']>('Pending');
  const [courier, setCourier] = useState('');
  const [trackingId, setTrackingId] = useState('');

  useEffect(() => {
    if (orderToEdit) {
      setStatus(orderToEdit.status);
      setCourier(orderToEdit.courier);
      setTrackingId(orderToEdit.trackingId || '');
    }
  }, [orderToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderToEdit) {
        onSave({ ...orderToEdit, status, courier, trackingId });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-dark-card rounded-lg shadow-2xl p-8 w-full max-w-lg border border-dark-border transform transition-all duration-300 animate-slide-in-up" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-primary mb-6">Edit Order</h2>
        <p className="text-sm text-gray-400 mb-4 font-mono">ID: {orderToEdit?.id}</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">Order Status</label>
            <select
              id="status"
              value={status}
              onChange={e => setStatus(e.target.value as Order['status'])}
              className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none"
            >
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="courier" className="block text-sm font-medium text-gray-300 mb-2">Courier</label>
            <input type="text" id="courier" value={courier} onChange={e => setCourier(e.target.value)} placeholder="e.g., FedEx, DHL" className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none" required />
          </div>
          <div className="mb-6">
            <label htmlFor="trackingId" className="block text-sm font-medium text-gray-300 mb-2">Tracking ID (Optional)</label>
            <input type="text" id="trackingId" value={trackingId} onChange={e => setTrackingId(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-primary focus:outline-none" />
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-dark-border text-white hover:bg-gray-600 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-md bg-primary text-dark-bg font-bold hover:bg-opacity-80 transition-colors">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderEditModal;
