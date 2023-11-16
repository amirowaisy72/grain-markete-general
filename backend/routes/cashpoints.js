const express = require("express");
const router = express.Router();
const CashPoints = require("../models/CashPoints");
const CashDc = require("../models/CashDebitCredit");

// {Create Operation} ADMIN
router.post("/create", async (req, res) => {
  let success = false;
  try {
    //store data
    const { name, balance, adminDetail, firmId } = req.body; // de-Structure
    const dateToUse = Date.now();
    const dup = await CashPoints.findOne({
      name: name,
      firmId: firmId,
    });
    if (!dup) {
      //Create Cash Point
      let cashpoints = await CashPoints.create({
        name: name,
        balance: balance,
        adminDetail,
        firmId,
      });

      //Create Cash Debit/Credit Query
      const cashDc = await CashDc.create({
        cashPoint: name,
        transactionType: "Deposit",
        amount: balance,
        source: "By Yourself",
        customer: "",
        detail: "Cash Point Initialized",
        date: dateToUse,
        adminDetail,
        firmId,
      });
      success = true;
      res.send({ success, cashpoints });
    } else {
      res.send({
        success,
        error: "Another Cash Point already exists with this title",
      });
    }
  } catch (error) {
    res.status(500).json({ success, error: error.message });
  }
});

// {Read/Fetch Operation} ADMIN
router.get("/read/:firmId", async (req, res) => {
  const cashpoints = await CashPoints.find({ firmId: req.params.firmId }); // fetch all data
  res.json(cashpoints);
});

// {Search Operation} ADMIN
router.get("/search/:name/:firmId", async (req, res) => {
  let success = false;
  try {
    const cashpoints = await CashPoints.findOne({
      name: new RegExp(req.params.name, "i"),
      firmId: req.params.firmId,
    }); // Fetch Single Cash Point where keyword is like this
    success = true;
    res.send({ success, cashpoints });
  } catch (error) {
    res.status(500).json({ success, error: error.message });
  }
});

// {Search All Operation} ADMIN
router.get("/searchAll/:name/:firmId", async (req, res) => {
  let success = false;
  try {
    const cashpoints = await CashPoints.find({
      name: new RegExp(req.params.name, "i"),
      firmId: req.params.firmId,
    }); // Fetch All Cash Points where keyword is like this
    success = true;
    res.send({ success, cashpoints });
  } catch (error) {
    res.status(500).json({ success, error: error.message });
  }
});

// {Update Operation} ADMIN
router.put("/update/:id", async (req, res) => {
  let success = false;
  try {
    const { name, balance } = req.body; //De-Structure

    // Create a new data object
    const newData = {};
    if (name) {
      newData.name = name;
    }
    if (balance) {
      newData.balance = balance;
    }

    //Find the document to be updated and update it
    let cashpoints = await CashPoints.findById(req.params.id);
    if (!cashpoints) {
      res.status(404).send("Document not found");
    } else {
      cashpoints = await CashPoints.findByIdAndUpdate(
        req.params.id,
        { $set: newData },
        { new: true }
      );
      success = true;
      res.send({
        success,
        message: "Document has been updated at Document id : " + req.params.id,
      });
    }
  } catch (error) {
    res.status(500).json({ success, error: error.message });
  }
});

// {Delete Operation} ADMIN
router.delete("/delete/:id", async (req, res) => {
  let success = false;
  try {
    // Find the Document to be deleted and delete it
    let cashpoints = await CashPoints.findById(req.params.id);
    if (!cashpoints) {
      return res.status(404).send("Document not found");
    }

    // Delete All Debit/credit Entries
    await CashDc.deleteMany({ cashPoint: cashpoints.name });

    // Now, you can delete the main document
    cashpoints = await CashPoints.findByIdAndDelete(req.params.id);
    success = true;
    return res.send({
      success,
      message: "Document at id : " + req.params.id + " has been deleted",
    });
  } catch (error) {
    return res.status(500).json({ success, error: error.message });
  }
});

module.exports = router;
