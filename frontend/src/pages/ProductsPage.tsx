/**
 * Page de gestion des produits
 */

import { useEffect, useState } from 'react';
import { productService, categoryService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

interface Product {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  category_name: string;
  is_available: boolean;
  preparation_time?: number;
}

interface Category {
  id: number;
  name: string;
}

const ProductsPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    category_id: 0,
    name: '',
    description: '',
    price: 0,
    preparation_time: 15,
    is_available: true,
  });

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productService.getAll(selectedCategory);
      setProducts(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, formData);
        alert('Produit modifié avec succès !');
      } else {
        await productService.create(formData);
        alert('Produit créé avec succès !');
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      category_id: product.category_id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      preparation_time: product.preparation_time || 15,
      is_available: product.is_available,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      await productService.delete(id);
      alert('Produit supprimé avec succès !');
      loadProducts();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({
      category_id: categories[0]?.id || 0,
      name: '',
      description: '',
      price: 0,
      preparation_time: 15,
      is_available: true,
    });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    resetForm();
    setIsModalOpen(true);
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
          <h1 className="text-3xl font-bold text-gray-900">Produits</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gestion du menu et des produits disponibles
          </p>
        </div>
        {isAdmin && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={openAddModal}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
            >
              Ajouter un produit
            </button>
          </div>
        )}
      </div>

      {/* Filtre par catégorie */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filtrer par catégorie
        </label>
        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : undefined)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Liste des produits */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    product.is_available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.is_available ? 'Disponible' : 'Indisponible'}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">{product.category_name}</span>
                <span className="text-lg font-bold text-primary-600">
                  {product.price}€
                </span>
              </div>
              {isAdmin && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 bg-primary-100 text-primary-700 hover:bg-primary-200 px-3 py-1 rounded text-sm font-medium"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded text-sm font-medium"
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal d'ajout/modification */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Catégorie *
            </label>
            <select
              required
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: parseInt(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prix (€) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Temps de préparation (min)
              </label>
              <input
                type="number"
                min="1"
                value={formData.preparation_time}
                onChange={(e) =>
                  setFormData({ ...formData, preparation_time: parseInt(e.target.value) })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_available"
              checked={formData.is_available}
              onChange={(e) =>
                setFormData({ ...formData, is_available: e.target.checked })
              }
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="is_available" className="ml-2 block text-sm text-gray-900">
              Produit disponible
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {editingProduct ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
          <button
            onClick={openAddModal}
            className="mt-4 text-primary-600 hover:text-primary-800"
          >
            Créer le premier produit
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
