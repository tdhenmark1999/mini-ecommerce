import express from 'express';
import User from '../models/User.js';

const router = express.Router();


router.post('/add-to-cart', async (req, res) => {
    const { product, userId } = req.body;

    // return res.status(400).send(req.body);

    if (!req.body) {
        console.log('No body in the request');
        return res.status(400).send({ error: 'No body in the request' });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).send({ error: 'User not found' });

    const itemIndex = user.cart.findIndex(p => p.product.id.toString() === product.id.toString());

    if (itemIndex > -1) {
        // Product exists in cart, increment quantity
        user.cart[itemIndex].quantity += 1;
    } else {
        // Product does not exist in cart, add new item
        user.cart.push({ product: product, quantity: 1 }); // Ensure productData is a full product object
    }

    await user.save();
    res.send({ message: 'Added to cart', cart: user.cart });
});


router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId).populate('cart.product');

        if (!user) return res.status(404).send({ error: 'User not found' });

        res.send({ cart: user.cart });
    } catch (error) {
        console.error("Error fetching cart", error);
        res.status(500).send({ error: 'Server error' });
    }
});

router.post('/:userId/remove-product', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { productId } = req.body;

        const user = await User.findById(userId);

        if (!user) return res.status(404).send({ error: 'User not found' });

        const itemIndex = user.cart.findIndex(p => p.product.id.toString() === productId.toString());

        if (itemIndex === -1) {
            return res.status(404).send({ error: 'Product not found in cart' });
        }

        user.cart.splice(itemIndex, 1);

        await user.save();
        res.send({ message: 'Removed product from cart', cart: user.cart });

    } catch (error) {
        console.error("Error removing product from cart", error);
        res.status(500).send({ error: 'Server error' });
    }
});


router.post('/:userId/decrease-quantity', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { productId } = req.body;

        const user = await User.findById(userId);

        if (!user) return res.status(404).send({ error: 'User not found' });

        const itemIndex = user.cart.findIndex(p => p.product.id.toString() === productId.toString());

        if (itemIndex === -1) {
            return res.status(404).send({ error: 'Product not found in cart' });
        }

        if (user.cart[itemIndex].quantity > 1) {
            user.cart[itemIndex].quantity -= 1;
        } else {
            user.cart.splice(itemIndex, 1);
        }

        await user.save();
        res.send({ message: 'Updated cart', cart: user.cart });

    } catch (error) {
        console.error("Error decreasing product quantity", error);
        res.status(500).send({ error: 'Server error' });
    }
});



router.post('/:userId/checkout', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) return res.status(404).send({ error: 'User not found' });

        user.cart = []; // Empty the cart

        await user.save();

        res.send({ message: 'Checkout successful, Payment method: Cash' });

    } catch (error) {
        console.error("Error during checkout", error);
        res.status(500).send({ error: 'Server error' });
    }
});

router.get('/:userId/cart', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) return res.status(404).send({ error: 'User not found' });
        res.send(user.cart);
    } catch (error) {
        console.error("Error fetching cart", error);
        res.status(500).send({ error: 'Server error' });
    }
});

export default router;
