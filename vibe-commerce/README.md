# Vibe Commerce - Restaurant E-Commerce Platform

A full-stack restaurant ordering platform built with Next.js, Express, TypeScript, PostgreSQL, and Prisma.

## Features

- **User Authentication**: Register, login, and role-based access control (Admin/User)
- **Menu Browsing**: View menu items organized by categories
- **Shopping Cart**: Add items, update quantities, and manage cart
- **Order Management**: Place orders and track order status
- **Admin Dashboard**: Manage menu items, categories, and orders (Admin only)

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Axios

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcryptjs

## Project Structure

```
vibe-commerce/
├── backend/
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth middleware
│   │   ├── utils/        # Helper functions
│   │   ├── types/        # TypeScript types
│   │   └── server.ts     # Express server
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── package.json
├── frontend/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   ├── lib/              # Utilities
│   ├── types/            # TypeScript types
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- PostgreSQL installed and running
- npm or yarn package manager

### 1. Database Setup

1. Create a PostgreSQL database:
```bash
createdb vibe_commerce
```

2. Update `backend/.env` with your database connection:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/vibe_commerce?schema=public"
```

### 2. Backend Setup

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
# Create .env.local file with:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Create Admin User

After running migrations, create an admin user using the Prisma Studio or by running:

```bash
cd backend
npx ts-node src/scripts/createAdmin.ts
```

Or manually create a user with role `ADMIN` in the database.

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/vibe_commerce?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Menu
- `GET /api/menu/categories` - Get all categories
- `GET /api/menu/items` - Get all menu items
- `GET /api/menu/items/:id` - Get single menu item

### Cart (Protected)
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders (Protected)
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order from cart

### Admin (Protected - Admin only)
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `GET /api/admin/menu-items` - Get all menu items
- `POST /api/admin/menu-items` - Create menu item
- `PUT /api/admin/menu-items/:id` - Update menu item
- `DELETE /api/admin/menu-items/:id` - Delete menu item
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status

## Development

### Backend Development
```bash
cd backend
npm run dev  # Runs with nodemon for hot reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Runs Next.js dev server
```

### Database Migrations
```bash
cd backend
npx prisma migrate dev  # Create new migration
npx prisma studio       # Open Prisma Studio to view data
```

## User Roles

- **USER**: Can browse menu, add to cart, place orders
- **ADMIN**: All user permissions + manage menu items, categories, and orders

## License

MIT

