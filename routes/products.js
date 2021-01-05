const express = require('express');
const { body } = require('express-validator');

const productController = require('./../controllers/products');
const isAuth = require('./../middleware/is-auth');

const router = express.Router();

router.get('/auth-products', isAuth, productController.getProducts);

router.post('/add-product', isAuth, [
		body('prod_name')
			.trim()
			.isLength({min: 5}),
		body('description')
			.trim()
			.isLength({min: 5})
	], productController.postProduct);

router.get('/products', productController.getProducts);
router.get('/product/:id', productController.getProduct);
router.put('/product/:id', isAuth, productController.updateProduct);
router.delete('/product/:id', isAuth, productController.deleteProduct);

module.exports = router;