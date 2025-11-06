import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create categories
  const appetizer = await prisma.category.upsert({
    where: { name: 'Appetizers' },
    update: {},
    create: { name: 'Appetizers' },
  });

  const mainCourse = await prisma.category.upsert({
    where: { name: 'Main Course' },
    update: {},
    create: { name: 'Main Course' },
  });

  const dessert = await prisma.category.upsert({
    where: { name: 'Desserts' },
    update: {},
    create: { name: 'Desserts' },
  });

  const beverages = await prisma.category.upsert({
    where: { name: 'Beverages' },
    update: {},
    create: { name: 'Beverages' },
  });

  console.log('✅ Categories created');

  // Create sample menu items
  const menuItems = [
    // Appetizers
    {
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan cheese',
      price: 8.99,
      categoryId: appetizer.id,
      imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop',
    },
    {
      name: 'Chicken Wings',
      description: 'Crispy chicken wings with your choice of sauce - Buffalo, BBQ, or Honey Mustard',
      price: 12.99,
      categoryId: appetizer.id,
      imageUrl: 'https://images.unsplash.com/photo-1527477396000-e27137b2a0c7?w=800&h=600&fit=crop',
    },
    {
      name: 'Mozzarella Sticks',
      description: 'Golden fried mozzarella sticks served with marinara sauce',
      price: 7.99,
      categoryId: appetizer.id,
      imageUrl: 'https://images.unsplash.com/photo-1618164436269-4ac0b47eb0f4?w=800&h=600&fit=crop',
    },
    {
      name: 'Bruschetta',
      description: 'Toasted bread topped with fresh tomatoes, basil, garlic, and olive oil',
      price: 6.99,
      categoryId: appetizer.id,
      imageUrl: 'https://images.unsplash.com/photo-1572441713132-51c75654db73?w=800&h=600&fit=crop',
    },
    {
      name: 'Onion Rings',
      description: 'Crispy beer-battered onion rings with ranch dipping sauce',
      price: 5.99,
      categoryId: appetizer.id,
      imageUrl: 'https://images.unsplash.com/photo-1615367427256-7baea85cbf5e?w=800&h=600&fit=crop',
    },
    
    // Main Course
    {
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon grilled to perfection, served with roasted vegetables and lemon butter sauce',
      price: 24.99,
      categoryId: mainCourse.id,
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop',
    },
    {
      name: 'Ribeye Steak',
      description: 'Premium 12oz ribeye steak, cooked to your preference, served with mashed potatoes and seasonal vegetables',
      price: 32.99,
      categoryId: mainCourse.id,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop',
    },
    {
      name: 'Pasta Carbonara',
      description: 'Creamy pasta with crispy bacon, parmesan cheese, and black pepper',
      price: 16.99,
      categoryId: mainCourse.id,
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop',
    },
    {
      name: 'Chicken Parmesan',
      description: 'Breaded chicken breast topped with marinara sauce and melted mozzarella, served over pasta',
      price: 18.99,
      categoryId: mainCourse.id,
      imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&h=600&fit=crop',
    },
    {
      name: 'BBQ Pulled Pork Sandwich',
      description: 'Slow-cooked pulled pork with house BBQ sauce, coleslaw, and pickles on a brioche bun',
      price: 14.99,
      categoryId: mainCourse.id,
      imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&h=600&fit=crop',
    },
    {
      name: 'Margherita Pizza',
      description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil',
      price: 15.99,
      categoryId: mainCourse.id,
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop',
    },
    {
      name: 'Beef Burger',
      description: 'Angus beef patty with lettuce, tomato, onion, pickles, and special sauce on a sesame bun',
      price: 13.99,
      categoryId: mainCourse.id,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
    },
    {
      name: 'Fish and Chips',
      description: 'Beer-battered cod with crispy fries, coleslaw, and tartar sauce',
      price: 17.99,
      categoryId: mainCourse.id,
      imageUrl: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800&h=600&fit=crop',
    },
    
    // Desserts
    {
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
      price: 8.99,
      categoryId: dessert.id,
      imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop',
    },
    {
      name: 'New York Cheesecake',
      description: 'Creamy cheesecake with graham cracker crust and berry compote',
      price: 7.99,
      categoryId: dessert.id,
      imageUrl: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800&h=600&fit=crop',
    },
    {
      name: 'Ice Cream Sundae',
      description: 'Vanilla ice cream with hot fudge, caramel, whipped cream, and a cherry on top',
      price: 6.99,
      categoryId: dessert.id,
      imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop',
    },
    {
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
      price: 9.99,
      categoryId: dessert.id,
      imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop',
    },
    
    // Beverages
    {
      name: 'Fresh Orange Juice',
      description: 'Freshly squeezed orange juice, served cold',
      price: 4.99,
      categoryId: beverages.id,
      imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=600&fit=crop',
    },
    {
      name: 'Premium Coffee',
      description: 'Rich, aromatic coffee blend, served hot',
      price: 3.99,
      categoryId: beverages.id,
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=600&fit=crop',
    },
    {
      name: 'Iced Tea',
      description: 'Refreshing iced tea with lemon, sweetened to perfection',
      price: 3.49,
      categoryId: beverages.id,
      imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=600&fit=crop',
    },
    {
      name: 'Fresh Lemonade',
      description: 'Homemade lemonade with fresh lemons and a hint of mint',
      price: 4.49,
      categoryId: beverages.id,
      imageUrl: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2fdc?w=800&h=600&fit=crop',
    },
    {
      name: 'Coca Cola',
      description: 'Classic Coca Cola, served ice cold',
      price: 2.99,
      categoryId: beverages.id,
      imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&h=600&fit=crop',
    },
  ];

  let createdCount = 0;
  let skippedCount = 0;

  for (const item of menuItems) {
    try {
      // Check if item exists, if exists update it (to add image URLs), otherwise create it
      const existing = await prisma.menuItem.findFirst({
        where: { name: item.name },
      });
      
      if (!existing) {
        await prisma.menuItem.create({
          data: item,
        });
        createdCount++;
        console.log(`  ✓ Created: ${item.name}`);
      } else {
        // Update existing item to add image URL if it doesn't have one
        await prisma.menuItem.update({
          where: { id: existing.id },
          data: {
            imageUrl: item.imageUrl,
            description: item.description,
            price: item.price,
          },
        });
        skippedCount++;
        console.log(`  ↻ Updated: ${item.name} (added image URL)`);
      }
    } catch (error: any) {
      console.error(`  ✗ Error processing ${item.name}:`, error.message);
    }
  }

  console.log(`✅ Menu items processed: ${createdCount} created, ${skippedCount} skipped`);

  // Create admin user if doesn't exist
  const adminEmail = 'admin@vibe.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    await prisma.cart.create({
      data: {
        userId: admin.id,
      },
    });

    console.log('✅ Admin user created (admin@vibe.com / admin123)');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

