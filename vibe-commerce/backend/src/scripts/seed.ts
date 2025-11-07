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

  // Create sample menu items with ingredients, allergy, protein, carbs
  const menuItems = [
    // Appetizers
    {
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan cheese',
      price: 8.99,
      categoryId: appetizer.id,
      imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop',
      ingredients: 'romaine lettuce,caesar dressing,croutons,parmesan cheese,anchovies,lemon',
      allergy: 'gluten,dairy',
      protein: '8g',
      carbs: '15g',
    },
    {
      name: 'Chicken Wings',
      description: 'Crispy chicken wings with your choice of sauce - Buffalo, BBQ, or Honey Mustard',
      price: 12.99,
      categoryId: appetizer.id,
      imageUrl: 'https://media.istockphoto.com/id/835903320/photo/baked-chicken-wings-with-sesame-seeds-and-sweet-chili-sauce-on-white-wooden-board.jpg?s=612x612&w=0&k=20&c=SH8ZCkEKuWD_wxulpntIJ0uD4yRnUf9UXovQwSwrmmA=',
      ingredients: 'chicken wings,flour,spices,buffalo sauce,bbq sauce,honey mustard',
      allergy: 'gluten',
      protein: '25g',
      carbs: '12g',
    },
    {
      name: 'Mozzarella Sticks',
      description: 'Golden fried mozzarella sticks served with marinara sauce',
      price: 7.99,
      categoryId: appetizer.id,
      imageUrl: 'https://www.shutterstock.com/image-photo/mozzarella-sticks-popular-fast-food-600nw-2515501397.jpg',
      ingredients: 'mozzarella cheese,breadcrumbs,flour,eggs,marinara sauce',
      allergy: 'dairy,gluten,eggs',
      protein: '15g',
      carbs: '28g',
    },
    {
      name: 'Bruschetta',
      description: 'Toasted bread topped with fresh tomatoes, basil, garlic, and olive oil',
      price: 6.99,
      categoryId: appetizer.id,
      imageUrl: 'https://media.istockphoto.com/id/469381932/photo/bruschetta-with-tomato-and-basil.jpg?s=612x612&w=0&k=20&c=xgDMFeEiE25lDspQ4ggrmXJ23bUsCwO4EVXrB7sMu1M=',
      ingredients: 'bread,tomatoes,basil,garlic,olive oil,salt',
      allergy: 'gluten',
      protein: '5g',
      carbs: '22g',
    },
    {
      name: 'Onion Rings',
      description: 'Crispy beer-battered onion rings with ranch dipping sauce',
      price: 5.99,
      categoryId: appetizer.id,
      imageUrl: 'https://media.istockphoto.com/id/865789218/photo/onion-rings-with-ketchup.jpg?s=612x612&w=0&k=20&c=XxCAWLfOicCFWfZz0tRv1qoDMZM7UdQlfLaMJT6GoS8=',
      ingredients: 'onions,flour,beer,eggs,ranch dressing,spices',
      allergy: 'gluten,eggs,dairy',
      protein: '4g',
      carbs: '35g',
    },
    
    // Main Course
    {
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon grilled to perfection, served with roasted vegetables and lemon butter sauce',
      price: 24.99,
      categoryId: mainCourse.id,
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop',
      ingredients: 'salmon,lemon,butter,vegetables,olive oil,herbs,salt,pepper',
      allergy: 'fish,dairy',
      protein: '35g',
      carbs: '8g',
    },
    {
      name: 'Ribeye Steak',
      description: 'Premium 12oz ribeye steak, cooked to your preference, served with mashed potatoes and seasonal vegetables',
      price: 32.99,
      categoryId: mainCourse.id,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop',
      ingredients: 'ribeye steak,potatoes,butter,cream,vegetables,garlic,herbs',
      allergy: 'dairy',
      protein: '45g',
      carbs: '25g',
    },
    {
      name: 'Pasta Carbonara',
      description: 'Creamy pasta with crispy bacon, parmesan cheese, and black pepper',
      price: 16.99,
      categoryId: mainCourse.id,
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop',
      ingredients: 'wheat pasta,bacon,eggs,parmesan cheese,black pepper,garlic',
      allergy: 'gluten,eggs,dairy',
      protein: '18g',
      carbs: '52g',
    },
    {
      name: 'Chicken Parmesan',
      description: 'Breaded chicken breast topped with marinara sauce and melted mozzarella, served over pasta',
      price: 18.99,
      categoryId: mainCourse.id,
      imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&h=600&fit=crop',
      ingredients: 'chicken breast,breadcrumbs,flour,eggs,marinara sauce,mozzarella cheese,pasta',
      allergy: 'gluten,eggs,dairy',
      protein: '32g',
      carbs: '48g',
    },
    {
      name: 'BBQ Pulled Pork Sandwich',
      description: 'Slow-cooked pulled pork with house BBQ sauce, coleslaw, and pickles on a brioche bun',
      price: 14.99,
      categoryId: mainCourse.id,
      imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&h=600&fit=crop',
      ingredients: 'pork shoulder,bbq sauce,brioche bun,coleslaw,pickles,onions',
      allergy: 'gluten',
      protein: '28g',
      carbs: '42g',
    },
    {
      name: 'Margherita Pizza',
      description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil',
      price: 15.99,
      categoryId: mainCourse.id,
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop',
      ingredients: 'pizza dough,tomato sauce,mozzarella cheese,basil,olive oil,garlic',
      allergy: 'gluten,dairy',
      protein: '15g',
      carbs: '58g',
    },
    {
      name: 'Beef Burger',
      description: 'Angus beef patty with lettuce, tomato, onion, pickles, and special sauce on a sesame bun',
      price: 13.99,
      categoryId: mainCourse.id,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
      ingredients: 'beef patty,sesame bun,lettuce,tomato,onion,pickles,special sauce,cheese',
      allergy: 'gluten,dairy',
      protein: '22g',
      carbs: '30g',
    },
    {
      name: 'Fish and Chips',
      description: 'Beer-battered cod with crispy fries, coleslaw, and tartar sauce',
      price: 17.99,
      categoryId: mainCourse.id,
      imageUrl: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800&h=600&fit=crop',
      ingredients: 'cod fish,beer,flour,potatoes,eggs,coleslaw,tartar sauce,lemon',
      allergy: 'fish,gluten,eggs',
      protein: '26g',
      carbs: '55g',
    },
    
    // Desserts
    {
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
      price: 8.99,
      categoryId: dessert.id,
      imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop',
      ingredients: 'chocolate,flour,eggs,butter,sugar,vanilla ice cream',
      allergy: 'gluten,eggs,dairy',
      protein: '6g',
      carbs: '45g',
    },
    {
      name: 'New York Cheesecake',
      description: 'Creamy cheesecake with graham cracker crust and berry compote',
      price: 7.99,
      categoryId: dessert.id,
      imageUrl: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800&h=600&fit=crop',
      ingredients: 'cream cheese,graham crackers,eggs,sugar,berries,butter',
      allergy: 'gluten,eggs,dairy',
      protein: '8g',
      carbs: '38g',
    },
    {
      name: 'Ice Cream Sundae',
      description: 'Vanilla ice cream with hot fudge, caramel, whipped cream, and a cherry on top',
      price: 6.99,
      categoryId: dessert.id,
      imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop',
      ingredients: 'vanilla ice cream,chocolate fudge,caramel,whipped cream,cherry',
      allergy: 'dairy',
      protein: '5g',
      carbs: '42g',
    },
    {
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
      price: 9.99,
      categoryId: dessert.id,
      imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop',
      ingredients: 'ladyfingers,coffee,mascarpone cheese,eggs,sugar,cocoa powder',
      allergy: 'gluten,eggs,dairy',
      protein: '7g',
      carbs: '35g',
    },
    
    // Beverages
    {
      name: 'Fresh Orange Juice',
      description: 'Freshly squeezed orange juice, served cold',
      price: 4.99,
      categoryId: beverages.id,
      imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=600&fit=crop',
      ingredients: 'oranges',
      allergy: 'none',
      protein: '2g',
      carbs: '26g',
    },
    {
      name: 'Premium Coffee',
      description: 'Rich, aromatic coffee blend, served hot',
      price: 3.99,
      categoryId: beverages.id,
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=600&fit=crop',
      ingredients: 'coffee beans,water',
      allergy: 'none',
      protein: '0g',
      carbs: '0g',
    },
    {
      name: 'Iced Tea',
      description: 'Refreshing iced tea with lemon, sweetened to perfection',
      price: 3.49,
      categoryId: beverages.id,
      imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=600&fit=crop',
      ingredients: 'tea leaves,water,lemon,sugar',
      allergy: 'none',
      protein: '0g',
      carbs: '12g',
    },
    {
      name: 'Fresh Lemonade',
      description: 'Homemade lemonade with fresh lemons and a hint of mint',
      price: 4.49,
      categoryId: beverages.id,
      imageUrl: 'https://media.istockphoto.com/id/181856842/photo/lemonade.jpg?s=612x612&w=0&k=20&c=mzfE8fJFRUyXGPaHBsWO18k9uH_NEq6aQIjcqRXzXH4=',
      ingredients: 'lemons,water,sugar,mint',
      allergy: 'none',
      protein: '0g',
      carbs: '28g',
    },
    {
      name: 'Coca Cola',
      description: 'Classic Coca Cola, served ice cold',
      price: 2.99,
      categoryId: beverages.id,
      imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&h=600&fit=crop',
      ingredients: 'carbonated water,high fructose corn syrup,caramel color,phosphoric acid,natural flavors,caffeine',
      allergy: 'none',
      protein: '0g',
      carbs: '39g',
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
        // Update existing item with all new fields
        await prisma.menuItem.update({
          where: { id: existing.id },
          data: {
            imageUrl: item.imageUrl,
            description: item.description,
            price: item.price,
            ingredients: item.ingredients,
            allergy: item.allergy,
            protein: item.protein,
            carbs: item.carbs,
          },
        });
        skippedCount++;
        console.log(`  ↻ Updated: ${item.name} (added nutrition info)`);
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

