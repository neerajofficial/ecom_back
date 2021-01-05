const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');
const Product = require('./../models/product');

const errorObj = (message, code) => {
	const error = new Error(message);
	error.statusCode = code;
	throw error;
}

exports.getProducts = async (req, res, next) => {
	const products = await Product.find();
	if (!products) return errorObj('Error while fetching.', 404);
	res.status(200).json({
		products: products
	});
}

exports.postProduct = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return errorObj('Validation Failed', 422);
	if (!req.file) return errorObj('No Image', 422);

	const prod_name = req.body.prod_name;
	const prod_price = req.body.prod_price;
	const image = req.file.path;
	const description = req.body.description;
	const user_id = req.body.user_id;

	const product = new Product({
		prod_name: prod_name,
		prod_price: prod_price,
		image: image,
		description: description,
		user_id: user_id
	})

	const products = await product.save();
	if (!products) return errorObj('Error in saving', 500);
	res.status(201).json({
		products: products
	});
}

exports.getProduct = async (req, res, next) => {
	const prod_id = req.params.id;
	const product = await Product.findById(prod_id);
	if (!product) return errorObj('Not Found', 404);
	res.status(200).json({
		product: product
	})
}

exports.updateProduct = async (req, res, next) => {
	const prod_id = req.params.id;
	const prod_name = req.body.prod_name;
	const prod_price = req.body.prod_price;
	const description = req.body.description;
	const user_id = req.body.user_id;
	let image = req.body.image;
	if (req.file) {
		image = req.file.path;
	}
	if (!image) return errorObj('No Image', 422);
	const product = await Product.findById(prod_id);
	if (!product) return errorObj('No Product', 500);

	if (image !== product.image) clearImage(product.image);
	product.prod_name = prod_name;
	product.prod_price = prod_price;
	product.image = image;
	product.description = description;
	const updatedProduct = await product.save();
	
	if (!updatedProduct) return errorObj('Error while updating', 400);
	res.status(200).json({
		product: updatedProduct
	});
}

exports.deleteProduct = async (req, res, next) => {
	const prod_id = req.params.id;
	const product = await Product.findById(prod_id);
	if (!product) return errorObj('No Product', 500);
	clearImage(product.image);
	const removeProduct = await Product.findByIdAndRemove(prod_id);
	if (!removeProduct) return errorObj('Error while deleting', 400);
	res.status(200).json({
		message: 'Product Removed'
	});
}

const clearImage = filePath => {
	filePath = path.join(__dirname, '..', filePath);
	fs.unlink(filePath, err => console.log(err))
}