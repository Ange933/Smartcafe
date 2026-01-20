/**
 * Page de gestion des tables avec prise de commande
 */

import { useEffect, useState } from 'react';
import { tableService, productService, categoryService, orderService } from '../services/api';
import Modal from '../components/Modal';

interface Table {
  id: number;
  table_number: string;
  capacity: number;
  status: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const TablesPage = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pour la prise de commande
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const response = await tableService.getAll();
      setTables(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (tableId: number, newStatus: string) => {
    try {
      await tableService.updateStatus(tableId, newStatus);
      loadTables();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const openOrderModal = async (table: Table) => {
    setSelectedTable(table);
    setShowOrderModal(true);
    setCart([]);
    
    // Charger le menu
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        categoryService.getAll(),
        productService.getAll(),
      ]);
      setCategories(categoriesRes.data.data);
      setProducts(productsRes.data.data);
      if (categoriesRes.data.data.length > 0) {
        setSelectedCategory(categoriesRes.data.data[0].id);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du menu:', error);
    }
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
  };

  const handleCreateOrder = async () => {
    if (cart.length === 0 || !selectedTable) return;

    try {
      const orderData = {
        table_id: selectedTable.id,
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.price
        }))
      };

      await orderService.create(orderData);
      
      // Fermer le modal et rafraîchir
      setShowOrderModal(false);
      setCart([]);
      setSelectedTable(null);
      
      // Mettre la table en "Occupée"
      await tableService.updateStatus(selectedTable.id, 'OCCUPIED');
      loadTables();
      
      alert('Commande créée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      alert('Erreur lors de la création de la commande');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      AVAILABLE: 'bg-green-500',
      OCCUPIED: 'bg-red-500',
      RESERVED: 'bg-yellow-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      AVAILABLE: 'Disponible',
      OCCUPIED: 'Occupée',
      RESERVED: 'Réservée',
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
          <h1 className="text-3xl font-bold text-gray-900">Tables</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gestion et suivi des tables du restaurant
          </p>
        </div>
      </div>

      {/* Grille des tables */}
      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow"
          >
            <div className={`h-2 ${getStatusColor(table.status)}`}></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {table.table_number}
                </h3>
                <span className="text-sm text-gray-500">
                  Capacité : {table.capacity}
                </span>
              </div>
              
              <div className="mb-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    table.status === 'AVAILABLE'
                      ? 'bg-green-100 text-green-800'
                      : table.status === 'OCCUPIED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {getStatusLabel(table.status)}
                </span>
              </div>

              <select
                value={table.status}
                onChange={(e) => handleStatusChange(table.id, e.target.value)}
                className="mt-2 block w-full text-sm rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="AVAILABLE">Disponible</option>
                <option value="OCCUPIED">Occupée</option>
                <option value="RESERVED">Réservée</option>
              </select>

              <button
                onClick={() => openOrderModal(table)}
                className="mt-3 w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                Prendre commande
              </button>
            </div>
          </div>
        ))}
      </div>

      {tables.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucune table trouvée</p>
        </div>
      )}

      {/* Légende */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Légende</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span className="text-sm text-gray-700">Disponible</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span className="text-sm text-gray-700">Occupée</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span className="text-sm text-gray-700">Réservée</span>
          </div>
        </div>
      </div>

      {/* Modal de prise de commande */}
      <Modal
        isOpen={showOrderModal}
        onClose={() => {
          setShowOrderModal(false);
          setCart([]);
          setSelectedTable(null);
        }}
        title={`Commande - ${selectedTable?.table_number}`}
      >
        <div className="grid grid-cols-3 gap-6">
          {/* Menu */}
          <div className="col-span-2">
            {/* Catégories */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Produits */}
            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {products
                .filter(p => p.category_id === selectedCategory)
                .map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="text-left p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors"
                  >
                    <h4 className="font-semibold text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                    <p className="text-lg font-bold text-primary-600 mt-2">
                      {Number(product.price).toFixed(2)}€
                    </p>
                  </button>
                ))}
            </div>
          </div>

          {/* Panier */}
          <div className="col-span-1 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-4">Panier</h3>
            
            {cart.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucun produit sélectionné</p>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.product.id} className="bg-white p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-bold text-primary-600">
                          {(Number(item.product.price) * item.quantity).toFixed(2)}€
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl text-primary-600">
                      {getTotalAmount().toFixed(2)}€
                    </span>
                  </div>
                  
                  <button
                    onClick={handleCreateOrder}
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Valider la commande
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TablesPage;
