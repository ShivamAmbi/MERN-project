'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import ProtectedRoute from '@/components/ProtectedRoute';
import Modal from '@/components/Modal';
import api from '@/lib/api';
import { MenuItem, Category } from '@/types';

export default function AdminMenuItemsPage() {
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    categoryId: '',
    ingredients: '',
    allergy: '',
    protein: '',
    carbs: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        api.get('/admin/menu-items'),
        api.get('/admin/categories'),
      ]);
      setItems(itemsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/admin/menu-items/${editingItem.id}`, formData);
      } else {
        await api.post('/admin/menu-items', formData);
      }
      handleCloseModal();
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to save menu item');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      imageUrl: item.imageUrl || '',
      categoryId: item.categoryId,
      ingredients: item.ingredients || '',
      allergy: item.allergy || '',
      protein: item.protein || '',
      carbs: item.carbs || '',
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    resetForm();
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/admin/menu-items/${id}`);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete menu item');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      imageUrl: '',
      categoryId: '',
      ingredients: '',
      allergy: '',
      protein: '',
      carbs: '',
    });
    setEditingItem(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Define columns
  const columns = useMemo<ColumnDef<MenuItem>[]>(
    () => [
      {
        accessorKey: 'imageUrl',
        header: 'Image',
        cell: ({ row }) => (
          <div className="w-16 h-16 flex-shrink-0">
            {row.original.imageUrl ? (
              <img
                src={row.original.imageUrl}
                alt={row.original.name}
                className="w-16 h-16 object-cover rounded"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
            )}
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <button
              className="flex items-center space-x-1 hover:text-gray-700"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              <span>Name</span>
              {column.getIsSorted() && (
                <span className="ml-1">
                  {column.getIsSorted() === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          );
        },
        cell: ({ row }) => (
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate" title={row.original.name}>
              {row.original.name}
            </div>
            {row.original.description && (
              <div className="text-sm text-gray-500 truncate" title={row.original.description}>
                {row.original.description}
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'category.name',
        header: ({ column }) => {
          return (
            <button
              className="flex items-center space-x-1 hover:text-gray-700"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              <span>Category</span>
              {column.getIsSorted() && (
                <span className="ml-1">
                  {column.getIsSorted() === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          );
        },
        cell: ({ row }) => (
          <div className="text-sm text-gray-500">{row.original.category.name}</div>
        ),
      },
      {
        accessorKey: 'price',
        header: ({ column }) => {
          return (
            <button
              className="flex items-center space-x-1 hover:text-gray-700"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              <span>Price</span>
              {column.getIsSorted() && (
                <span className="ml-1">
                  {column.getIsSorted() === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          );
        },
        cell: ({ row }) => (
          <div className="text-sm font-medium text-gray-900">
            ${row.original.price.toFixed(2)}
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(row.original)}
              className="text-primary-600 hover:text-primary-900 text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="text-red-600 hover:text-red-900 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  // Initialize table
  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      const item = row.original;
      return (
        item.name.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.category.name.toLowerCase().includes(search) ||
        item.price.toString().includes(search) ||
        item.ingredients?.toLowerCase().includes(search) ||
        item.allergy?.toLowerCase().includes(search) ||
        false
      );
    },
  });

  return (
    <ProtectedRoute requireAuth requireAdmin>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Menu Items</h1>
          <button
            onClick={handleAddNew}
            className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
          >
            + Add New Item
          </button>
        </div>

        {/* Modal for Add/Edit */}
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          footer={
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="menu-item-form"
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                {editingItem ? 'Update' : 'Create'}
              </button>
            </div>
          }
        >
          <form id="menu-item-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ingredients (comma-separated)
              </label>
              <input
                type="text"
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                placeholder="wheat,tomato,salt"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Allergens (comma-separated, or "none")
              </label>
              <input
                type="text"
                value={formData.allergy}
                onChange={(e) => setFormData({ ...formData, allergy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                placeholder="gluten,dairy or none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Protein (e.g., "12g")
                </label>
                <input
                  type="text"
                  value={formData.protein}
                  onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                  placeholder="12g"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Carbs (e.g., "45g")
                </label>
                <input
                  type="text"
                  value={formData.carbs}
                  onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                  placeholder="45g"
                />
              </div>
            </div>
          </form>
        </Modal>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Search and Controls */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Search */}
                <div className="flex-1 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search items by name, description, category, price..."
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                {/* Items per page */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-700">Show:</label>
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                      table.setPageSize(Number(e.target.value));
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                  >
                    {[5, 10, 20, 30, 50].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden">
              <table className="w-full divide-y divide-gray-200 table-fixed">
                <colgroup>
                  <col className="w-24" /> {/* Image */}
                  <col className="w-auto" /> {/* Name */}
                  <col className="w-32" /> {/* Category */}
                  <col className="w-24" /> {/* Price */}
                  <col className="w-32" /> {/* Actions */}
                </colgroup>
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        {globalFilter
                          ? 'No items found matching your search.'
                          : 'No menu items found. Create your first item!'}
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        {row.getVisibleCells().map((cell) => {
                          const columnId = cell.column.id;
                          const isNameColumn = columnId === 'name';
                          
                          return (
                            <td
                              key={cell.id}
                              className={`px-4 py-4 ${isNameColumn ? '' : 'whitespace-nowrap'}`}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) *
                      table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length
                  )}
                </span>{' '}
                of <span className="font-medium">{table.getFilteredRowModel().rows.length}</span>{' '}
                results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  {'<<'}
                </button>
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page{' '}
                  <span className="font-medium">
                    {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                  </span>
                </span>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>
                <button
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  {'>>'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

