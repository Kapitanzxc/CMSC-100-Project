// Controls the get and post routes
const controller = require('./controller');

module.exports = (app) => {

  console.log('Server is now at router');
  
  // Allow Cross Origin Resource Sharing
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    next();
  })


  // User registration/login route
  app.post('/register', controller.register);
  app.get('/users', controller.getUsers);
  app.post('/login', controller.login);
  app.get('/user-by-id', controller.getUserById);

  // Shopping Cart end points
  app.post('/add-to-cart', controller.addToCart);
  app.get('/cart', controller.getCart);
  app.post('/remove-cart', controller.removeFromCart)
  app.get('/total-price', controller.totalPrice);
  app.post('/check-out', controller.checkout);

  // Product Listings end points
  app.get('/find-all', controller.findAll) 
  app.get('/sort-products', controller.sortProducts) 
  app.get('/all-orders', controller.getAllOrders) 
  app.post('/add-product', controller.addProduct);
  app.get('/products', controller.getCart);
  
  // Transactions end points
  app.get('/all-transactions', controller.allTransactions);
  app.get('/transaction-by-id', controller.getTransaction);
  app.get('/user-transaction', controller.getTransactionsOfUser);
  app.post('/cancel-transaction', controller.cancelTransaction);
  app.post('/confirm-transaction', controller.confirmTransaction);
  app.get('/all-incomes', controller.getIncomebyProduct);
  app.get('/weekly-sales', controller.getSalesByWeek);
  app.get('/monthly-sales', controller.getSalesByMonth);
  app.get('/yearly-sales', controller.getSalesByYear);


   // Fallback route for unknown endpoints
   app.use((req, res) => {
    res.status(404).json({ error: 'Route not found.' });
  });

  // Error-handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error.' });
  });
 }