const mongoose = require("mongoose");
const { Schema } = mongoose;

const DcSchema = new Schema({
  //Primary key --> Foriegn Key Definition
  // user:{
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'model name'
  // },
  //All required fields here
  name: {
    type: String,
    index: true,
  },
  detail: {
    type: String,
  },
  amount: {
    type: Number,
  },
  DbCr: {
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
  otherDetail: {
    type: String,
  },
  firmId: {
    type: String,
  },
  date: {
    type: Date,
  },
});

module.exports = mongoose.model("Dc", DcSchema);
