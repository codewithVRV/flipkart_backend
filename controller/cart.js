const Cart = require('../model/cart');

module.exports.getAllCarts = (req, res) => {
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;
	const startDate = req.query.startdate || new Date('1970-1-1');
	const endDate = req.query.enddate || new Date();

	console.log(startDate, endDate);

	Cart.find({
	})
		.select('-_id -products._id')
		.limit(limit)
		.sort({ id: sort })
		.then((carts) => {
			res.json(carts);
		})
		.catch((err) => console.log(err));
};

module.exports.getCartsbyUserid = (req, res) => {
	const userId = req.params.userid;
	const startDate = req.query.startdate || new Date('1970-1-1');
	const endDate = req.query.enddate || new Date();

	console.log(startDate, endDate);
	Cart.find({
		userId,
	})
		.select('-_id -products._id')
		.then((carts) => {
			res.json(carts);
		})
		.catch((err) => console.log(err));
};

module.exports.getSingleCart = (req, res) => {
	const id = req.params.id;
	Cart.findOne({
		id,
	})
		.select('-_id -products._id')
		.then((cart) => res.json(cart))
		.catch((err) => console.log(err));
};

module.exports.addCart = (req, res) => {
	if (typeof req.body == undefined) {
		res.json({
			status: 'error',
			message: 'data is undefined',
		});
	} else {
		//     let cartCount = 0;
		// Cart.find().countDocuments(function (err, count) {
		//   cartCount = count
		//   })

		//     .then(() => {
		const cart = {
			id: 11,
			userId: req.body.userId,
			date: req.body.date,
			products: req.body.products,
		};
		// cart.save()
		//   .then(cart => res.json(cart))
		//   .catch(err => console.log(err))

		res.json(cart);
		// })

		//res.json({...req.body,id:Cart.find().count()+1})
	}
};

module.exports.editCart = async (req, res) => {
	if (typeof req.body == undefined ) {
		res.json({
			status: 'error',
			message: 'something went wrong! check your sent data',
		});
	} else {
		let cart = await Cart.findOne({userId: req.body.userId});
		console.log(cart);
		if(!cart) {
			const cartCount = await Cart.find({}).countDocuments();
			cart = new Cart({
				id: cartCount+1,
				userId: req.body.userId,
				products: [],
				date: new Date()
			});
		}
		console.log(cart);

		let foundProduct = false;
		cart.products = cart.products.map(product => {
			if(product.productId == req.body.productId) {
				product.quantity++;
				foundProduct = true;
			}
			return product;
		});
		if(!foundProduct) {
			cart.products.push({productId: req.body.productId, quantity: 1});
		}
		await cart.save();
		return res.json(cart);
	}
};

module.exports.updateProductToCart = async (req, res) => {
	if (typeof req.body == undefined ) {
		res.json({
			status: 'error',
			message: 'something went wrong! check your sent data',
		});
	} else {
		let cart = await Cart.findOne({userId: req.body.userId});
		console.log(cart);
		if(!cart) {
			return res.status(404).json({
				data: {},
				message: 'no cart found for the user'
			})
		}
		console.log(cart);

		let foundProduct = false;
		cart.products = cart.products.map(product => {
			if(product.productId == req.body.productId) {
				product.quantity = req.body.quantity;
				foundProduct = true;
			}
			return product;
		});
		if(!foundProduct) {
			cart.products.push({productId: req.body.productId, quantity: req.body.quantity});
		}
		cart.products = cart.products.filter(product => product.quantity != 0);
		await cart.save();
		return res.json(cart);
	}
};

module.exports.deleteCart = (req, res) => {
	if (req.params.id == null) {
		res.json({
			status: 'error',
			message: 'cart id should be provided',
		});
	} else {
		Cart.findOne({ id: req.params.id })
			.select('-_id -products._id')
			.then((cart) => {
				res.json(cart);
			})
			.catch((err) => console.log(err));
	}
};
