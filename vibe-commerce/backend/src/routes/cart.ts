import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();
const prisma = new PrismaClient();

// Get cart
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user!.userId },
      include: {
        items: {
          include: {
            menuItem: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    // Auto-create cart if it doesn't exist
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: req.user!.userId,
        },
        include: {
          items: {
            include: {
              menuItem: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });
    }

    res.json(cart);
  } catch (error: any) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch cart',
      details: error.message 
    });
  }
});

// Add item to cart
router.post('/items', authenticate, async (req: AuthRequest, res) => {
  try {
    const { menuItemId, quantity } = req.body;

    if (!menuItemId || quantity === undefined) {
      return res.status(400).json({ error: 'Menu item ID and quantity required' });
    }

    // Verify menu item exists
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!cart) {
      // Auto-create cart if it doesn't exist
      cart = await prisma.cart.create({
        data: {
          userId: req.user!.userId,
        },
      });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_menuItemId: {
          cartId: cart.id,
          menuItemId,
        },
      },
    });

    if (existingItem) {
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          menuItem: {
            include: {
              category: true,
            },
          },
        },
      });
      return res.json(updated);
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        menuItemId,
        quantity,
      },
      include: {
        menuItem: {
          include: {
            category: true,
          },
        },
      },
    });

    res.status(201).json(cartItem);
  } catch (error: any) {
    console.error('Add to cart error:', error);
    // Provide more detailed error message
    const errorMessage = error.message || 'Failed to add item to cart';
    res.status(500).json({ 
      error: 'Failed to add item to cart',
      details: errorMessage 
    });
  }
});

// Update cart item quantity
router.put('/items/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { quantity } = req.body;
    const cartItemId = req.params.id;

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem || cartItem.cartId !== cart.id) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });
      return res.json({ message: 'Item removed from cart' });
    }

    const updated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        menuItem: true,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// Remove item from cart
router.delete('/items/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const cartItemId = req.params.id;

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem || cartItem.cartId !== cart.id) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Clear cart
router.delete('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

export default router;

