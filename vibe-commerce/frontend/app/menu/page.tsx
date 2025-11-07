'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { MenuItem, Category } from '@/types';

type ViewMode = 'grid-4' | 'grid-6' | 'list';

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid-4');

  useEffect(() => {
    // Load saved view preference
    const savedView = localStorage.getItem('menuViewMode') as ViewMode;
    if (savedView && ['grid-4', 'grid-6', 'list'].includes(savedView)) {
      setViewMode(savedView);
    }
    fetchCategories();
    fetchItems();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [selectedCategory]);

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('menuViewMode', mode);
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/menu/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const url = selectedCategory
        ? `/menu/items?categoryId=${selectedCategory}`
        : '/menu/items';
      const response = await api.get(url);
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGridClasses = () => {
    switch (viewMode) {
      case 'grid-4':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4';
      case 'grid-6':
        return 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3';
      case 'list':
        return 'space-y-4';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Our Menu</h1>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => handleViewChange('grid-4')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'grid-4'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="4 items per row"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => handleViewChange('grid-6')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'grid-6'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="6 items per row"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM8 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H9a1 1 0 01-1-1V4zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </button>
          <button
            onClick={() => handleViewChange('list')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="List view with descriptions"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === ''
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading menu...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No items found in this category.</p>
        </div>
      ) : viewMode === 'list' ? (
        // List View with Descriptions
        <div className="space-y-4">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/menu/${item.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col sm:flex-row"
            >
              <div className="sm:w-48 flex-shrink-0">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-48 sm:h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-48 sm:h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              <div className="flex-1 p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {item.category.name}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{item.description || 'No description available.'}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <p className="text-2xl font-bold text-primary-600">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        // Grid View (4 or 6 items)
        <div className={getGridClasses()}>
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/menu/${item.id}`}
              className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                viewMode === 'grid-6' ? 'p-2' : 'p-0'
              }`}
            >
              <div className={viewMode === 'grid-6' ? '' : 'relative'}>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className={`w-full object-cover ${
                      viewMode === 'grid-6' ? 'h-32 rounded' : 'h-48'
                    }`}
                  />
                ) : (
                  <div
                    className={`w-full bg-gray-200 flex items-center justify-center ${
                      viewMode === 'grid-6' ? 'h-32 rounded' : 'h-48'
                    }`}
                  >
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
              </div>
              <div className={viewMode === 'grid-6' ? 'p-2' : 'p-4'}>
                <h3
                  className={`font-semibold mb-1 ${
                    viewMode === 'grid-6' ? 'text-sm' : 'text-lg'
                  }`}
                >
                  {item.name}
                </h3>
                {viewMode === 'grid-4' && (
                  <>
                    <p className="text-xs text-gray-500 mb-1">{item.category.name}</p>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                  </>
                )}
                <p
                  className={`font-bold text-primary-600 ${
                    viewMode === 'grid-6' ? 'text-sm' : 'text-xl'
                  }`}
                >
                  ${item.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

