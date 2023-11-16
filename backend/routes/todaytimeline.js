const express = require("express");
const router = express.Router();
const Accounts = require("../models/Accounts");
const CashDebitCredit = require("../models/CashDebitCredit");
const CashPoints = require("../models/CashPoints");
const Dc = require("../models/Dc");
const Stock = require("../models/Stock");

router.get("/read/:firmId", async (req, res) => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Define an empty array to store results from all collections
    const allResults = [];

    // Define a function to extract the timestamp from the date field
    const extractTimestamp = (dateStr) => new Date(dateStr).getTime();

    // Query documents for today from each collection and apply the specified filters
    const accountsDocs = await Accounts.find({
      date: {
        $gte: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          0,
          0,
          0
        ).toISOString(),
        $lt: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 1,
          0,
          0,
          0
        ).toISOString(),
      },
      firmId: req.params.firmId,
    })
      .sort({ date: 1 })
      .exec();

    const cashDebitCreditDocs = await CashDebitCredit.find({
      date: {
        $gte: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          0,
          0,
          0
        ).toISOString(),
        $lt: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 1,
          0,
          0,
          0
        ).toISOString(),
      },
      firmId: req.params.firmId,
    })
      .sort({ date: 1 })
      .exec();

    const cashPointsDocs = await CashPoints.find({
      date: {
        $gte: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          0,
          0,
          0
        ).toISOString(),
        $lt: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 1,
          0,
          0,
          0
        ).toISOString(),
      },
      firmId: req.params.firmId,
    })
      .sort({ date: 1 })
      .exec();

    const dcDocs = await Dc.find({
      date: {
        $gte: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          0,
          0,
          0
        ).toISOString(),
        $lt: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 1,
          0,
          0,
          0
        ).toISOString(),
      },
      firmId: req.params.firmId,
      // Filter out specific names ('Comission', 'Mazduri', 'Brokery', 'Accountant')
      name: {
        $nin: ["Commission", "Mazduri", "Brokery", "Accountant", "Markete Fee"],
      },
    })
      .sort({ date: 1 })
      .exec();

    const stockDocs = await Stock.find({
      date: {
        $gte: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          0,
          0,
          0
        ).toISOString(),
        $lt: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 1,
          0,
          0,
          0
        ).toISOString(),
      },
      firmId: req.params.firmId,
    })
      .sort({ date: 1 })
      .exec();

    // Helper function to determine query type based on the presence of 'expenseList'
    const getQueryType = (doc) => (doc.expenseList ? "Invoice" : "Non-Invoice");

    // Process and format documents, adding queryType and collectionName fields
    const formatAndPushResults = (docs, collectionName) => {
      return docs.map((doc) => {
        const queryType = getQueryType(doc);
        return {
          ...doc.toObject(), // Convert Mongoose document to plain JavaScript object
          queryType,
          collectionName,
        };
      });
    };

    // Process and format documents for each collection
    const formattedAccountsDocs = formatAndPushResults(
      accountsDocs,
      "Accounts"
    );
    const formattedCashDebitCreditDocs = formatAndPushResults(
      cashDebitCreditDocs,
      "CashDebitCredit"
    );
    const formattedCashPointsDocs = formatAndPushResults(
      cashPointsDocs,
      "CashPoints"
    );
    const formattedDcDocs = formatAndPushResults(dcDocs, "Dc");
    const formattedStockDocs = formatAndPushResults(stockDocs, "Stock");

    // Combine all formatted documents
    const allFormattedDocs = [
      ...formattedAccountsDocs,
      ...formattedCashDebitCreditDocs,
      ...formattedCashPointsDocs,
      ...formattedDcDocs,
      ...formattedStockDocs,
    ];

    // Sort allFormattedDocs by date (ascending)
    allFormattedDocs.sort(
      (a, b) => extractTimestamp(a.date) - extractTimestamp(b.date)
    );

    // Send the sorted results as the response
    res.json(allFormattedDocs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/getNewUpdate", async (req, res) => {
  try {
    const newUpdate = {
      status: false,
      update: [
        { label: "ورژن", content: "2.0.0" },
        { label: "ریلیز ڈیٹ", content: "2023-11-16" },
        {
          label: "تفصیل",
          content: "اس اپ ڈیٹ میں نئی خصوصیات اور بہتریاں شامل ہیں۔",
        },
        { label: "مصنف", content: "آپ کا ٹیم" },
      ],
      downloadLink:
        "https://drive.google.com/drive/folders/1K3U3A2Waba5qqlXOeufzthvVkZlEbQ4E?usp=sharing",
    };

    res.status(200).json({ success: true, data: newUpdate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
