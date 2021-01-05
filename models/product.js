const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
	prod_name: {
		type: String,
		required: true
	},
	prod_price: {
		type: Number,
		required: true
	},
	image: {
		type: String
	},
	description: {
		type: String
	},
	user_id: {
		type: Object,
		required: true
	}
}, {
	timestamp: true
});

module.exports = mongoose.model('Product', productSchema);