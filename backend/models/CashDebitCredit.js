const mongoose = require("mongoose");
const { Schema } = mongoose;

const CashDcSchema = new Schema({
  //Primary key --> Foriegn Key Definition
  // user:{
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'model name'
  // },
  //All required fields here
  cashPoint: {
    type: String,
    index: true,
  },
  transactionType: {
    type: String,
  },
  amount: {
    type: Number,
  },
  source: {
    type: String,
  },
  customer: {
    type: String,
  },
  detail: {
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
  },
});

module.exports = mongoose.model("cashdc", CashDcSchema);
