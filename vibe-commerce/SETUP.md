# Quick Setup Guide

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Database Setup

1. **Create PostgreSQL Database:**
```bash
# Using psql
psql -U postgres
CREATE DATABASE vibe_commerce;
\q
```

2. **Configure Database Connection:**
   
   Create `backend/.env` file:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vibe_commerce?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars-long-for-security"
   JWT_EXPIRES_IN="7d"
   PORT=5000
   NODE_ENV="development"
   ```
   
   **Note:** Update the DATABASE_URL with your actual PostgreSQL credentials.

3. **Run Database Migrations:**
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

## Step 3: Create Admin User

After migrations, create an admin user:

```bash
cd backend
npx ts-node src/scripts/createAdmin.ts admin@vibe.com admin123 "Admin User"
```

Or use default values:
```bash
npx ts-node src/scripts/createAdmin.ts
# Default: admin@vibe.com / admin123
```

## Step 4: Configure Frontend

Create `frontend/.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Step 5: Start Development Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:5000

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:3000

## Step 6: Test the Application

1. Open http://localhost:3000
2. Register a new user or login with admin credentials
3. Browse the menu (if you've added items via admin)
4. Add items to cart
5. Place an order

## Admin Features

1. Login with admin account
2. Navigate to Admin Dashboard
3. Manage Categories
4. Manage Menu Items
5. View and manage Orders

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in backend/.env
- Verify database exists: `psql -l` to list databases

### Port Already in Use
- Backend: Change PORT in backend/.env
- Frontend: Change port with `npm run dev -- -p 3001`

### Prisma Issues
- Run `npx prisma generate` after schema changes
- Run `npx prisma migrate reset` to reset database (⚠️ deletes all data)

### CORS Issues
- Ensure backend is running before frontend
- Check NEXT_PUBLIC_API_URL in frontend/.env.local

## Next Steps

- Add sample menu items via admin panel
- Customize styling in `tailwind.config.ts`
- Add image upload functionality
- Implement order status notifications
- Add payment integration

