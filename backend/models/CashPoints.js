const mongoose = require("mongoose");
const { Schema } = mongoose;

const CashPointsSchema = new Schema({
  //Primary key --> Foriegn Key Definition
  // user:{
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'model name'
  // },
  //All required fields here
  name: {
    type: String,
  },
  balance: {
    type: Number,
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

module.exports = mongoose.model("cashpoints", CashPointsSchema);
