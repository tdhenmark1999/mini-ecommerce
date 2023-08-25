import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// router.get('/', async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.status(200).json(products);
//     } catch (err) {
//         res.status(500).json({ error: "Failed to fetch products" });
//     }
// });

router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: "Failed to add product" });
    }
});

export default router;
