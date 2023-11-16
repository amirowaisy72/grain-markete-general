const mongoose = require("mongoose");
const { Schema } = mongoose;

const StockSchema = new Schema({
  //Primary key --> Foriegn Key Definition
  // user:{
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'model name'
  // },
  //All required fields here// crop, inout, quantity, description
  crop: {
    type: String,
  },
  inout: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  description: {
    type: String,
  },
  customer: {
    type: String,
  },
  crop: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  rate: {
    type: Number,
  },
  totalAmount: {
    type: Number,
  },
  calculatedExpenses: {
    type: mongoose.Schema.Types.Mixed,
  },
  totalPayableAmount: {
    type: Number,
  },
  weightStatement: {
    type: String,
  },
  adminDetail: {
    type: Object,
  },
  firmId: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("stock", StockSchema);
