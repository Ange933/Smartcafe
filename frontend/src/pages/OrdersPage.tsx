/**
 * Page de gestion des commandes
 */

import { useEffect, useState } from 'react';
import { orderService } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Order {
  order_id: number;
  order_number: string;
  status: string;
  total_amount: number;
  customer_name: string;
  table_number: string;
  order_date: string;
  items: any;
}

const OrdersPage = () => {
  const { user } = useAuth();
  const canManage = user?.role === 'ADMIN' || user?.role === 'WAITER';
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [selectedStatus]);

  const loadOrders = async () => {
    try {
      const response = await orderService.getAll(selectedStatus || undefined);
      setOrders(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      loadOrders();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PREPARING: 'bg-orange-100 text-orange-800',
      READY: 'bg-green-100 text-green-800',
      DELIVERED: 'bg-blue-100 text-blue-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      PENDING: 'En attente',
      PREPARING: 'En préparation',
      READY: 'Prêt',
      DELIVERED: 'Livré',
      CANCELLED: 'Annulé',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'CUSTOMER' ? 'Mes Commandes' : 'Commandes'}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            {user?.role === 'CUSTOMER' 
              ? 'Historique de vos commandes'
              : 'Suivi et gestion des commandes en temps réel'
            }
          </p>
        </div>
      </div>

      {/* Filtre par statut */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filtrer par statut
        </label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        >
          <option value="">Tous les statuts</option>
          <option value="PENDING">En attente</option>
          <option value="PREPARING">En préparation</option>
          <option value="READY">Prêt</option>
          <option value="DELIVERED">Livré</option>
          <option value="CANCELLED">Annulé</option>
        </select>
      </div>

      {/* Liste des commandes */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      N° Commande
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Client
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Table
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Montant
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Statut
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {orders.map((order) => (
                    <tr key={order.order_id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                        {order.order_number}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {order.customer_name || 'Client'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {order.table_number || '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {parseFloat(order.total_amount.toString()).toFixed(2)}€
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {canManage ? (
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.order_id, e.target.value)
                            }
                            className="text-sm rounded-md border-gray-300"
                          >
                            <option value="PREPARING">En préparation</option>
                            <option value="READY">Prêt</option>
                            <option value="CANCELLED">Annulé</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucune commande trouvée</p>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
