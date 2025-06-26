const mongoose = require('mongoose');
require('dotenv').config();

const connectSalesDB = () => {
  return mongoose.createConnection(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectSalesDB;
