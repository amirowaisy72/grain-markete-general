const connecToMongoose = require("./db");
const express = require("express");
const app = express();
connecToMongoose();
var cors = require("cors");

app.use(express.json());
app.use(cors());
//Available Routes
app.use("/accounts", require("./routes/accounts.js"));
app.use("/debitcredit", require("./routes/debitcredit.js"));
app.use("/cashpoints", require("./routes/cashpoints.js"));
app.use("/cashdebitcredit", require("./routes/cashdebitcredit.js"));
app.use("/stock", require("./routes/stock.js"));
app.use("/invoice", require("./routes/invoice.js"));
app.use("/todaytimeline", require("./routes/todaytimeline.js"));
app.use("/expenseFormulas", require("./routes/expenseFormulas.js"));
app.use("/adminRoles", require("./routes/adminRoles.js"));
app.use("/address", require("./routes/address.js"));

app.listen(5000, () => {
  console.log("listening at port 5000");
});

// const mongoose = require('mongoose');
// const express = require('express');
// const app = express();
// const cors = require('cors');
// const connecToMongoose = require('./db');

// app.use(express.json());
// app.use(cors());

// // Connect to MongoDB based on the provided database name
// app.use((req, res, next) => {
//   const mongoDbName = req.header('Mongo-Db-Name'); // Read the database name from the request header
//   if (!mongoDbName) {
//     return res.status(400).json({ message: 'Mongo-Db-Name header not provided.' });
//   }

//   // Modify the URL to include the dynamic database name
//   const url = `mongodb+srv://amirowaisy72:iVVKYSj5rugATyVg@cluster0.mpb1bfz.mongodb.net/${mongoDbName}`;
//   mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

//   console.log('Connected to MongoDB:', mongoDbName);
//   next();
// });

// // Define your routes here

// app.listen(5000, () => {
//   console.log('Listening at port 5000');
// });
