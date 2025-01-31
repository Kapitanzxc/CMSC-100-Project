const mongoose = require('mongoose')
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const { v4: uuidv4 } = require('uuid')

const SECRET_KEY = 'secretkey'

console.log('Server is now at controller');
// mongodb://localhost:27017/
// Connects to mongodb 
mongoose.connect('mongodb://0.0.0.0:27017/PROJECT', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error: ', err));

// Product Schema
const Product = mongoose.model('Products', {
  productId: { type: String, required: true, unique: true }, 
  name: { type: String, required: true }, 
  description: { type: String, required: true }, 
  type: { type: Number, required: true, enum: [1, 2] }, 
  quantity: { type: Number, required: true, default: 0 }, 
  price: { type: Number, required: true }, 
  image: { type: String, required: true }, 
}, 'Products');

// User Schema
const User = mongoose.model('Users', {
  firstName: { type: String, required: false, unique: false },
  middleName: { type: String, required: false, unique: false },
  lastName: { type: String, required: false, unique: false },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: { type: Array, default: [] },
  transactions: { type: Array, default: [] }
}, 'Users');

// Transaction Schema
const Transaction = mongoose.model('Transactions', {
  transactionId: { type: String, required: true, unique: true }, 
  productId: { type: String, required: true }, 
  name: { type: String, required: true }, 
  orderQuantity: { type: Number, required: true, min: 1 }, 
  orderStatus: { type: Number, required: true, enum: [0, 1, 2], default: 0 }, 
  email: { type: String, required: true},
  dateOrdered: { type: Date, default: Date.now}, 
  timeOrdered: { type: String, default: () => new Date().toLocaleTimeString()}
}, 'Transactions'); 

//======================================================= PRODUCTS =======================================================
// Returns array of products
exports.findAll = (req, res, next) => {
  Product.find((err, products) => {
    if (!err) { res.send(products) }
  })
}

// Adding a product listing
exports.addProduct = async (req, res) => {
  try {
      console.log('Adding product in controller.js...')
      const { productId, name, description, type, quantity, price, image } = req.body;
      // const hashPassword = await bcrypt.hash(password, 10);
      const newProduct = new Product({ productId, name, description, type, quantity, price, image});
      // Assign the _id to productId before saving
      // newProduct.productId = newProduct._id.toString(); 
      await newProduct.save();
      res.status(201).json({ message: 'Product added successfully.' });
  } catch (error) {
      res.status(500).json({ error: 'Error adding product.' });
  }
};

// Sorts products in ascending or descending order by name, type, price, quantity
// test with: http://localhost:3001/sort-products?sortField=price&sortOrder=asc
exports.sortProducts = async (req, res) => {
  try {
    const { sortField, sortOrder  } = req.query;
    // Validate `sortField`
    const validFields = ['name', 'price', 'quantity', 'type'];
    if (!validFields.includes(sortField)) {
      return res.status(400).json({ error: `Invalid sortField. Valid options: ${validFields.join(', ')}` });
    }

    // Validate and normalize `sortOrder`
    const sortOrderValue = sortOrder.toLowerCase() === 'asc' ? 1 : -1;

    // Perform sorting
    const sortedProducts = await Product.find().sort({ [sortField]: sortOrderValue });
    // Return sorted products
    res.status(200).json(sortedProducts);
  } catch (error) {
    console.error('Error sorting products:', error.message);
    res.status(500).json({ error: 'Unable to get sorted products.' });
  }
};

// ======================================================= USERS =======================================================
// Controller for registering a user
exports.register = async (req, res) => {
  try {
    console.log('Registering user in controller.js...');
    const { firstName, middleName, lastName, email, username, password } = req.body;

    // Check if the email already exists
    const existingUserEmail = await User.findOne({
      email: email 
    });

    if (existingUserEmail) {
      return res.status(400).json({ error: 'Email already exists.' });
    }
    // Check if the username already exists
    const existingUserName = await User.findOne({
      username: username 
    });
    if (existingUserName) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstName,
      middleName,
      lastName,
      email,
      username,
      password: hashPassword
    });

    // Save the user
    await newUser.save();

    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    console.error('Error during user registration:', error.message);
    res.status(500).json({ error: 'Error signing up.' });
  }
};

// Controller for getting all users
exports.getUsers = async (req, res) => {
  try {
      const users = await User.find();
      res.status(200).json({ users });
  } catch (error) {
      res.status(500).json({ error: 'Unable to get users.' });
  }
};

// Controller for getting one user based on Id
exports.getUserById = async (req, res) => {
  try {
    // Finds user's database
    const { userId } = req.query;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user
    res.status(200).json({ user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving user' });
  }
};


// Controller for logging in a user
exports.login = async (req, res) => {
  console.log('Logging in....');
  try {
      console.log('Login request received');
      
      const { username, password } = req.body;
      console.log(req.body)
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(401).json({ error: 'Invalid credentials.' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid credentials.' });
      }
      const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1hr' });
      res.json({ message: 'Login successful', token: token, userId: user._id});
  } catch (error) {
      res.status(500).json({ error: 'Error logging in' });
  }
};

// ======================================================= USERS CART =======================================================
// Add products to user's cart
exports.addToCart = async (req, res) => {
  try {
    // Receives the request  body
    const { userId, productId, quantity} = req.body;

    // Check credentials
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if product id exists
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Find the product's index from the user's cart array
    const cartItemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

    if (cartItemIndex !== -1) {
      // Update quantity and  total price
      const updatedQuantity = user.cart[cartItemIndex].quantity + quantity;
      const updatedPrice = user.cart[cartItemIndex].totalPrice + product.price;
      // Update user's data
      await User.updateOne(
        { _id: userId, 'cart.productId': productId },  
        { $set: { 
          'cart.$.quantity': updatedQuantity,
          'cart.$.totalPrice': updatedPrice
        }} 
      );
    } else {
      const totalPrice = product.price
      await User.updateOne(
        { _id: userId },  
        { $push: { cart: { productId, quantity, totalPrice} } }  
      );
    }

    // Return updated cart
    const updatedUser = await User.findById(userId);
    res.status(200).json({ message: 'Product added to cart', cart: updatedUser.cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding to cart' });
  }
};

// Fetch user's cart
exports.getCart = async (req, res) => {
  try {
    // Finds user's database
    const { userId } = req.query;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Cart that will be returned
    const detailed_cart = [];

    // Loop through user's cart array
    for (let cartItem of user.cart) {
      const product = await Product.findOne( {productId: cartItem.productId} );
      
      if (!product) {
        return res.status(404).json({ error: `Product with ID ${cartItem.productId} not found` });
      }

      // Push products' details to the array
      detailed_cart.push({
        productId: product.productId,
        name: product.name, 
        quantity: cartItem.quantity,
        totalPrice: cartItem.totalPrice
      });
    }
    // Return the detailed_cart
    res.status(200).json({ cart: detailed_cart });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving cart' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Filter user's cart by removing the product with the declared productID
    user.cart = user.cart.filter(item => item.productId.toString() !== productId);
    // Save user
    await user.save();

    res.status(200).json({ message: 'Product removed from cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ error: 'Error removing from cart' });
  }
};

exports.totalPrice = async (req, res) => {
  try {
    // Finds user's database
    const { userId } = req.query;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    let totalPrice = 0

    // Loop through user's cart array
    for (let cartItem of user.cart) {
      const product = await Product.findOne( {productId: cartItem.productId} );
      
      if (!product) {
        return res.status(404).json({ error: `Product with ID ${cartItem.productId} not found` });
      }

      // Computes for total price
      totalPrice += product.price * cartItem.quantity
    }

    res.status(200).json({ message: 'Product removed from cart', totalPrice: totalPrice });
  } catch (error) {
    res.status(500).json({ error: 'Error removing from cart' });
  }
};

// ======================================================= TRANSACTIONS =======================================================

exports.checkout = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Check credentials
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the product's index from the user's cart array
    const cartItemIndex = user.cart.findIndex(item => item.productId.toString() === productId);
    if (cartItemIndex === -1) {
      return res.status(400).json({ error: 'Product not in cart' });
    }

    const cartQuantity = user.cart[cartItemIndex].quantity;

    // Check if product exists and has enough stock
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.quantity < cartQuantity) {
      return res.status(400).json({ error: 'Not enough product quantity' });
    }

    // Generate UUID for transaction
    const generateUUID = async () => {
      let transactionId;
      while (true) {
        try {
          transactionId = uuidv4().toString();
          const existingTransaction = await Transaction.findOne({ transactionId });
          if (!existingTransaction) break;
        } catch (error) {
          console.error("Error checking transaction ID:", error);
        }
      }
      console.log("Generated transaction ID:", transactionId);
      return transactionId;
    };

    const transactionId = await generateUUID();

    const newTransaction = new Transaction({
      transactionId,
      productId: product._id,
      name: product.name,
      orderQuantity: cartQuantity,
      email: user.email,
    });

    // Save transaction
    await newTransaction.save();

    // Remove item from user's cart
    user.cart.splice(cartItemIndex, 1);
    await user.save();

    // Update user's transactions
    await User.updateOne(
      { _id: userId },
      { $push: { transactions: { transactionId } } }
    );

    // Update product quantity
    await Product.updateOne(
      { productId },
      { $inc: { quantity: -cartQuantity } } // Decrease the quantity
    );

    res.status(200).json({ message: 'Transaction added' });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ error: 'Error adding to transaction' });
  }
};

exports.getTransactionsOfUser = async (req, res) => {
  try {
    const { userId } = req.query;
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If the user has no transactions, return an empty array
    if (!user.transactions || user.transactions.length === 0) {
      return res.status(200).json({ transactions: [] });
    }
    // Extracts transaction Ids from the user's transaction array
    const transactionIds = user.transactions.map((transaction) => transaction.transactionId);

    // Fetch the transaction documents from user's transactions
    const transactions = await Transaction.find({
      transactionId: { $in: transactionIds }  
    });

    return res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user transactions' });
  }
};

exports.cancelTransaction = async (req, res) => {
  try {
    const { transactionId } = req.body;

     // Check if transaction is existing
     const transaction = await Transaction.findOne({transactionId});
     if (!transaction) {
       return res.status(404).json({ error: 'Transaction not found' });
     }
     
     const productId = transaction.productId

     // Check if product id exists
     const product = await Product.findById(productId);
     if (!product) {
       return res.status(404).json({ error: 'Product not found' });
     } 

    // Search by the transactionId
    await Transaction.updateOne(
      { transactionId: transactionId },
      // Set the new status
      {$set: {
          orderStatus: 2
      }}
    );

    // Update product quantity
     await Product.updateOne(
      { _id: productId },  
      { $set: { quantity: product.quantity + transaction.orderQuantity} }  
    );

    await product.save();
    
    res.status(200).json({ message: 'Transaction cancelled' });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user transactions' });
  }
};

exports.confirmTransaction = async (req, res) => {
  try {
    const { transactionId } = req.body;

     // Check if transaction is existing
     const transaction = await Transaction.findOne({transactionId});
     if (!transaction) {
       return res.status(404).json({ error: 'Transaction not found' });
     }
     
     const productId = transaction.productId

     // Check if product id exists
     const product = await Product.findById(productId);
     if (!product) {
       return res.status(404).json({ error: 'Product not found' });
     } 

    // Search by the transactionId
    await Transaction.updateOne(
      { transactionId: transactionId },
      // Set the new status
      {$set: {
          orderStatus: 1
      }}
    );

    // No need to update product quantity, as qty is automatically deducted when user adds to cart
    //  await Product.updateOne(
    //   { _id: productId },  
    //   { $set: { quantity: product.quantity + transaction.orderQuantity} }  
    // );

    await product.save();
    
    res.status(200).json({ message: 'Transaction cancelled' });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user transactions' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'No users found' });
    }

    const allOrders = [];

    for (const user of users) {
      let totalPrice = 0;

      // Aggregate cart details for each user
      for (let cartItem of user.cart) {
        const product = await Product.findOne({ productId: cartItem.productId });

        if (!product) {
          return res
            .status(404)
            .json({ error: `Product with ID ${cartItem.productId} not found` });
        }

        totalPrice += product.price * cartItem.quantity;
      }

      // Push the user's order details to allOrders
      // if (product.orderStatus === 1) {
        allOrders.push({
          userId: user._id,
          userName: user.name, // Include user's name if available
          totalPrice: totalPrice,
          cart: user.cart,
        });
      // }
    }

    res.status(200).json({ orders: allOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
};


exports.getIncomebyProduct = async (req, res) => {
  try {
    // const { productId } = req.query;
    
    // // Check if product exists
    // const product = await Product.findById(productId);
    // if (!product) {
    //   return res.status(404).json({ error: 'Product not found' });
    // }

    // Fetch all transactions of the product
    // get total income by product
    const products = await Product.find();
    // const transactions = await Transaction.find();
    const allProductIncomes = [];
    let totalIncome = 0;

    for (const product of products) {
      let totalProductIncome = 0;
      const transactions = await Transaction.find({ productId: product._id, orderStatus: 1});

      // Aggregate cart details for each user
      if (transactions) {
        for (let transaction of transactions) {
          if (transaction.orderStatus == 1) {
              totalProductIncome = totalProductIncome + (product.price * transaction.orderQuantity);
           }// console.log("Computing total income...");
          // console.log(product.price);
          // console.log(transaction.orderQuantity);
          // console.log(totalIncome);
        }
      }

      console.log("Total product income of ", product.name,totalProductIncome);
      totalIncome += totalProductIncome;
      console.log("Total income is now ", totalIncome);

      // Push the user's order details to allOrders
      // if (product.orderStatus === 1) {
        allProductIncomes.push({
          productId: product._id,
          productName: product.name,
          totalProductIncome: totalProductIncome
        });
      // }
    }

    res.status(200).json({ incomes: allProductIncomes, totalIncome });
  } catch (error) {
    console.error('Error getting all product incomes:', error);
    res.status(500).json({ error: 'Error getting all product incomes' });
  }
};


exports.allTransactions = (req, res, next) => {
  Transaction.find((err, transactions) => {
    if (!err) { res.send(transactions) }
  })
}

exports.getTransaction = async (req, res) => {
  try {
    const { transactionId } = req.body;

     // Check if transaction is existing
     const transaction = await Transaction.findOne({transactionId});
     if (!transaction) {
       return res.status(404).json({ error: 'Transaction not found' });
     }
     
     const productId = transaction.productId

     // Check if product id exists
     const product = await Product.findById(productId);
     if (!product) {
       return res.status(404).json({ error: 'Product not found' });
     } 

    // // Search by the transactionId
    // await Transaction.updateOne(
    //   { transactionId: transactionId },
    //   // Set the new status
    //   {$set: {
    //       orderStatus: 2
    //   }}
    // );

    // // Update product quantity
    //  await Product.updateOne(
    //   { _id: productId },  
    //   { $set: { quantity: product.quantity + transaction.orderQuantity} }  
    // );

    // await product.save();
    
    res.status(200).json({ transaction, product });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching single transaction' });
  }
};

exports.getSalesByWeek = async (req, res) => {
  try {
    const transactions = await Transaction.aggregate([
      {
        $match: {
          orderStatus: 1 // Include only transactions with orderStatus == 1
        }
      },
      {
        $addFields: {
          productIdObject: { $toObjectId: "$productId" } // Convert string to ObjectId
        }
      },
      {
        $lookup: {
          from: 'Products', // Replace 'products' with your actual product collection name
          localField: 'productIdObject', // Assuming you have a 'productId' field in your Transaction model
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      {
        $unwind: '$productInfo'
      },
      {
        $sort: {
          "dateOrdered": 1 // Sort ascending (1) or descending (-1)
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$dateOrdered" },
            month: { $month: "$dateOrdered" },
            week: { $week: "$dateOrdered" }
          },
          totalIncome: {
            $sum: { $multiply: ["$orderQuantity", "$productInfo.price"] }
          },
          transactions: { 
            $push: {
              transactionId: "$transactionId",
              productId: "$productId",
              productName: "$productInfo.name",
              productPrice: "$productInfo.price",
              quantity: "$orderQuantity",
              dateOrdered: "$dateOrdered",
              email: "$email"
            }
           }
        }
      }
    ]);

    console.log(transactions)
    res.status(200).json({ transactions });
  } catch (error) {
    console.error('Error getting weekly sales:', error);
    res.status(500).json({ error: 'Error getting weekly sales' });
  }
};

exports.getSalesByMonth = async (req, res) => {
  try {
    const transactions = await Transaction.aggregate([
      {
        $match: {
          orderStatus: 1 // Include only transactions with orderStatus == 1
        }
      },
      {
        $addFields: {
          productIdObject: { $toObjectId: "$productId" } // Convert string to ObjectId
        }
      },
      {
        $lookup: {
          from: 'Products', // Replace 'products' with your actual product collection name
          localField: 'productIdObject', // Assuming you have a 'productId' field in your Transaction model
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      {
        $unwind: '$productInfo'
      },
      {
        $sort: {
          "dateOrdered": 1 // Sort ascending (1) or descending (-1)
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$dateOrdered" },
            month: { $month: "$dateOrdered" }
            // week: { $week: "$dateOrdered" }
          },
          totalIncome: {
            $sum: { $multiply: ["$orderQuantity", "$productInfo.price"] }
          },
          transactions: { 
            $push: {
              transactionId: "$transactionId",
              productId: "$productId",
              productName: "$productInfo.name",
              productPrice: "$productInfo.price",
              quantity: "$orderQuantity",
              dateOrdered: "$dateOrdered",
              email: "$email"
            }
           }
        }
      }
    ]);

    res.status(200).json({ transactions});
  } catch (error) {
    console.error('Error getting monthly sales:', error);
    res.status(500).json({ error: 'Error getting monthly sales' });
  }
};

exports.getSalesByYear = async (req, res) => {
  try {
    const transactions = await Transaction.aggregate([
      {
        $match: {
          orderStatus: 1 // Include only transactions with orderStatus == 1
        }
      },
      {
        $addFields: {
          productIdObject: { $toObjectId: "$productId" } // Convert string to ObjectId
        }
      },
      {
        $lookup: {
          from: 'Products', // Replace 'products' with your actual product collection name
          localField: 'productIdObject', // Assuming you have a 'productId' field in your Transaction model
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      {
        $unwind: '$productInfo'
      },
      {
        $sort: {
          "dateOrdered": 1 // Sort ascending (1) or descending (-1)
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$dateOrdered" }
            // week: { $week: "$dateOrdered" }
            // month: { $month: "$dateOrdered" }
          },
          totalIncome: {
            $sum: { $multiply: ["$orderQuantity", "$productInfo.price"] }
          },
          transactions: { 
            $push: {
              transactionId: "$transactionId",
              productId: "$productId",
              productName: "$productInfo.name",
              productPrice: "$productInfo.price",
              quantity: "$orderQuantity",
              dateOrdered: "$dateOrdered",
              email: "$email"
            }
           }
        }
      }
    ]);

    res.status(200).json({ transactions});
  } catch (error) {
    console.error('Error getting annual sales:', error);
    res.status(500).json({ error: 'Error getting annual sales' });
  }
};

// Create Admin User function
const createAdminUser = async () => {
  try {
    // Check if the admin user already exists
    const adminExists = await User.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists.');
      return;
    }

    // Create a new admin user with a hashed password
    const hashedPassword = await bcrypt.hash('admin', 10);
    const adminUser = new User({
      email: 'admin@agri.com',
      username: 'admin',
      password: hashedPassword,
      cart: [],
    });

    // Save the admin user to the database
    await adminUser.save();
    console.log('Admin user created successfully.');
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  }
};

// Call the function to create an admin user when the app starts
createAdminUser();
