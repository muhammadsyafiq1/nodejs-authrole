import express from "express"
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/Product.js"
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/products', verifyUser ,getProducts)
router.get('/product/:id', getProductById)
router.post('/product', verifyUser , createProduct)
router.patch('/product/:id', updateProduct)
router.delete('/product/:id', deleteProduct)

export default router