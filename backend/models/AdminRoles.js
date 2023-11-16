const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminRolesSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
  allowedByAdmin: {
    type: Boolean,
  },
  active: {
    type: Boolean,
  },
  firmId: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const AdminRoles = mongoose.model("AdminRoles", adminRolesSchema);

module.exports = AdminRoles;
