const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const errorRoutes = require('./routes/error');

const app = express();

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images');
	},
	filename: (req, file, cb) => {
		cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
	}
})

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		cb(null, true)
	} else {
		cb(null, false)
	}
};

app.use(bodyParser.json());

app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	next();
})

app.use('/auth', authRoutes);

app.use(productRoutes);

app.use(errorRoutes);

app.use((error, req, res, next) => {
	console.log(error);
	const status = error.statusCode;
	const message = error.message;
	res.status(status).json({
		message: message
	})
})

const url = `mongodb+srv://neerajsingh:${process.env.MONGO_PASSWORD}@myecom.xn6g1.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(url,
	{useNewUrlParser: true,
	 	useUnifiedTopology: true },
	err => {
	    if (!err) console.log('Connection successful');
	});
		
app.listen(process.env.PORT || 4000);
