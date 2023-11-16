const mongoose = require("mongoose");
const { Schema } = mongoose;

const AccountsSchema = new Schema({
  //Primary key --> Foriegn Key Definition
  // user:{
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'model name'
  // },
  //All required fields here
  name: {
    type: String,
  },
  mobileNumbers: {
    type: [String],
  },
  address: {
    type: String,
  },
  guarranter: {
    type: String,
  },
  idCardNumber: {
    type: String, // Add the ID card number field
  },
  status: {
    type: String,
  },
  accountType: {
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

module.exports = mongoose.model("accounts", AccountsSchema);
