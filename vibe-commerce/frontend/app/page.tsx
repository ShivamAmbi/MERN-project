import Link from 'next/link';
import api from '@/lib/api';
import { MenuItem } from '@/types';

async function getFeaturedItems(): Promise<MenuItem[]> {
  try {
    const response = await api.get('/menu/items');
    return response.data.slice(0, 6); // Get first 6 items
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const featuredItems = await getFeaturedItems();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Vibe Commerce
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Delicious food delivered to your door
        </p>
        <Link
          href="/menu"
          className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 inline-block"
        >
          Browse Menu
        </Link>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map((item) => (
            <Link
              key={item.id}
              href={`/menu/${item.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                <p className="text-2xl font-bold text-primary-600">
                  ${item.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
        {featuredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No menu items available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}

