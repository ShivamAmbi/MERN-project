import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();
const prisma = new PrismaClient();

// Apply auth middleware to all admin routes
router.use(authenticate);
router.use(requireAdmin);

// Categories
router.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({
      data: { name },
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: { name },
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    await prisma.category.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Menu Items
router.post('/menu-items', async (req, res) => {
  try {
    const { name, description, price, imageUrl, categoryId, ingredients, allergy, protein, carbs } = req.body;
    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        categoryId,
        ingredients,
        allergy,
        protein,
        carbs,
      },
      include: {
        category: true,
      },
    });
    res.status(201).json(menuItem);
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
});

router.get('/menu-items', async (req, res) => {
  try {
    const items = await prisma.menuItem.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

router.put('/menu-items/:id', async (req, res) => {
  try {
    const { name, description, price, imageUrl, categoryId, ingredients, allergy, protein, carbs } = req.body;
    const menuItem = await prisma.menuItem.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        imageUrl,
        categoryId,
        ingredients,
        allergy,
        protein,
        carbs,
      },
      include: {
        category: true,
      },
    });
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

router.delete('/menu-items/:id', async (req, res) => {
  try {
    await prisma.menuItem.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

// Orders management
router.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;

