var Customer = require('../models/customer.js');
var customerViewModel = require('../viewModels/customer.js');

module.exports = {

	registerRoutes: function(app) {
		app.get('/customer/register', this.register);
		app.post('/customer/register', this.processRegister);

		app.get('/customer/:id', this.home);
		app.get('/customer/:id/preferences', this.preferences);
		app.get('/orders/:id', this.orders);

		app.get('/customer/:id/update', this.update);
		app.post('/customer/update', this.processUpdate);

		app.get('/api/getCustomerById/:id', this.getCustomerById);
		app.get('/api/getCustomerByName/:name', this.getCustomerByName);
	},

	register: function(req, res, next) {
		res.render('customer/register');
	},

	processRegister: function(req, res, next) {
		// TODO: back-end validation (safety)
		var c = new Customer({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			address1: req.body.address1,
			address2: req.body.address2,
			city: req.body.city,
			state: req.body.state,
			zip: req.body.zip,
			phone: req.body.phone,
		});
		c.save(function(err) {
			if(err) return next(err);
			res.redirect(303, '/customer/' + c._id);
		});
	},

	home: function(req, res, next) {
		Customer.findById(req.params.id, function(err, customer) {
			if(err) return next(err);
			if(!customer) return next(); 	// pass this on to 404 handler
			customer.getOrders(function(err, orders) {
				if(err) return next(err);
				res.render('customer/home', customerViewModel(customer, orders));
			});
		});
	},

	preferences: function(req, res, next) {
		Customer.findById(req.params.id, function(err, customer) {
			if(err) return next(err);
			if(!customer) return next(); 	// pass this on to 404 handler
			customer.getOrders(function(err, orders) {
				if(err) return next(err);
				res.render('customer/preferences', customerViewModel(customer, orders));
			});
		});
	},

	orders: function(req, res, next) {
		Customer.findById(req.params.id, function(err, customer) {
			if(err) return next(err);
			if(!customer) return next(); 	// pass this on to 404 handler
			customer.getOrders(function(err, orders) {
				if(err) return next(err);
				res.render('customer/preferences', customerViewModel(customer, orders));
			});
		});
	},

	update: function(req, res, next) {
		Customer.findById(req.params.id, function(err, customer) {
			if(err) return next(err);
			if(!customer) return next(); 	// pass this on to 404 handler
			customer.getOrders(function(err, orders) {
				if(err) return next(err);
				res.render('customer/update', customerViewModel(customer, orders));
			});
		});
	},

	processUpdate: function(req, res) {
		Customer.findById(req.body.id, function(err, customer) {
			if(err) return res.send(500, 'Error occurred: database error.');
			if(!customer) return res.send(500, 'Error occurred: Not found.');
			if(req.body.firstName){
				if(typeof req.body.firstName !== 'string' ||
					req.body.firstName.trim() === '')
					return res.json({ error: 'Invalid name.'});
				customer.firstName = req.body.firstName;
				customer.lastName = req.body.lastName;
				customer.email = req.body.email;
				customer.address1 = req.body.address1;
				customer.address2 = req.body.address2;
				customer.city = req.body.city;
				customer.state = req.body.state;
				customer.zip = req.body.zip;
				customer.phone = req.body.phone;
			}
			// and so on....
			customer.save(function(err) {
			if(err) return next(err);
			res.redirect(303, '/customer/' + customer._id);
			});
		});
	},

	getCustomerById: function (req, res) {
		Customer.findById(req.params.id, function(err, customer) {
			if(err) return res.send(500, 'Error occurred: database error.');
				res.json(customer);	
		});
	},

	getCustomerByName: function (req, res) {
		Customer.findOne({firstName: req.params.name}, function(err, customers) {
			if(err) return res.send(500, 'Error occurred: database error.');
				res.json(customers);	
		});
	},
};
