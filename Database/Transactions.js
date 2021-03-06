const mongoose = require('mongoose')
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const transactionSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  transactionAmount: {
    type: Number,
    required: true
  },
  transactionDate: {
  	type: String,
  	required: true
  },
  transactionTime: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Transaction', transactionSchema)