'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { MenuItem } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function MenuItemPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [params.id]);

  const fetchItem = async () => {
    try {
      const response = await api.get(`/menu/items/${params.id}`);
      setItem(response.data);
    } catch (error) {
      console.error('Failed to fetch item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      setAddingToCart(true);
      await api.post('/cart/items', {
        menuItemId: item?.id,
        quantity,
      });
      router.push('/cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Item Not Found</h1>
          <button
            onClick={() => router.push('/menu')}
            className="text-primary-600 hover:text-primary-700"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-lg">No Image Available</span>
              </div>
            )}
          </div>
          <div className="md:w-1/2 p-8">
            <div className="mb-4">
              <span className="text-sm text-gray-500">{item.category.name}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.name}</h1>
            <p className="text-4xl font-bold text-primary-600 mb-6">
              ${item.price.toFixed(2)}
            </p>
            {item.description && (
              <p className="text-gray-600 mb-6">{item.description}</p>
            )}

            {/* Ingredients */}
            {item.ingredients && (
              <div className="mb-6 pb-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Ingredients</h2>
                <div className="flex flex-wrap gap-2">
                  {item.ingredients.split(',').map((ingredient, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {ingredient.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Allergy Information */}
            {item.allergy && (
              <div className="mb-6 pb-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Allergens</h2>
                {item.allergy.toLowerCase() === 'none' ? (
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    ✓ No Allergens
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {item.allergy.split(',').map((allergen, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                      >
                        ⚠ {allergen.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Nutrition Information */}
            {(item.protein || item.carbs) && (
              <div className="mb-8 pb-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Nutrition Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  {item.protein && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Protein</p>
                      <p className="text-2xl font-bold text-blue-600">{item.protein}</p>
                    </div>
                  )}
                  {item.carbs && (
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Carbohydrates</p>
                      <p className="text-2xl font-bold text-orange-600">{item.carbs}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

