const express = require("express");
const router = express.Router();
const CashDc = require("../models/CashDebitCredit");
const CashPoints = require("../models/CashPoints");
const Dc = require("../models/Dc");

// Create CashDC Entry
router.post("/create", async (req, res) => {
  try {
    const {
      cashPoint,
      transactionType,
      amount,
      source,
      customerName,
      description,
      selectedDate,
      adminDetail,
      firmId,
    } = req.body;

    // Conditionally set the 'date' field
    const dateToUse = selectedDate ? selectedDate : Date.now();

    // Find the balance for the specified cashPoint
    const balanceCheck = await CashPoints.findOne({
      name: cashPoint,
      firmId: firmId,
    });

    let balance = balanceCheck.balance;
    const cashPointId = balanceCheck._id;

    if (transactionType === "Take Out" && balance < amount) {
      // Insufficient balance
      return res
        .status(400)
        .json({ success: false, error: "Insufficient balance" });
    } else {
      //Update cash point balance
      if (transactionType === "Take Out") {
        balance = parseInt(balance) - parseInt(amount);
      } else {
        balance = parseInt(balance) + parseInt(amount);
      }

      const newData = {
        balance: balance,
      };

      let updateCashPoint = await CashPoints.findByIdAndUpdate(
        cashPointId,
        { $set: newData },
        { new: true }
      );

      //Create Accounts Debit/Credit Entry
      if (customerName !== "") {
        let dc = await Dc.create({
          name: customerName,
          detail: description,
          amount: amount,
          DbCr: transactionType === "Take Out" ? "Debit" : "Credit",
          adminDetail,
          firmId,
          date: dateToUse,
        });
      }

      //Create Cash Debit/Credit Entry
      const cashDc = await CashDc.create({
        cashPoint,
        transactionType,
        amount,
        source,
        customer: source === "By Customer" ? customerName : "",
        detail: description,
        adminDetail,
        firmId,
        date: dateToUse,
      });

      res.json({ success: true, cashDc });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch All CashDC Entries
router.get("/read/:cashPoint/:firmId", async (req, res) => {
  try {
    const cashDcEntries = await CashDc.find({
      cashPoint: req.params.cashPoint,
      firmId: req.params.firmId,
    });
    res.json(cashDcEntries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update CashDC Entry by ID
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      cashPoint,
      transactionType,
      amount,
      source,
      customerName,
      description,
    } = req.body;

    const newData = {
      cashPoint,
      transactionType,
      amount,
      source,
      customer: source === "By Customer" ? customerName : "",
      detail: description,
    };

    const cashDc = await CashDc.findByIdAndUpdate(id, newData, { new: true });

    if (!cashDc) {
      res.status(404).send("CashDC Entry not found");
    } else {
      res.json(cashDc);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete/:id/:cashPoint", async (req, res) => {
  try {
    const { id } = req.params;
    let cashDc = await CashDc.findById(id);

    if (!cashDc) {
      res.status(404).send("CashDC Entry not found");
    } else {
      // Find all CashDC entries with the same cashPoint and exclude the one with the same ID
      const cashDcEntries = await CashDc.find({
        cashPoint: req.params.cashPoint,
        _id: { $ne: id }, // Exclude the entry with the same ID
      });

      // Initialize a balance variable
      let balance = 0;

      // Calculate the updated balance
      for (const entry of cashDcEntries) {
        if (entry.transactionType === "Deposit") {
          balance += entry.amount;
        } else {
          balance -= entry.amount;
        }
      }

      if (balance < 0) {
        res.status(400).json({
          error:
            "You cannot delete this entry because it results in a negative balance.",
        });
      } else {
        // Update Cash Points Table
        const cashPointEntry = await CashPoints.findOne({
          name: req.params.cashPoint,
        });
        // Update the balance in the CashPoints entry
        cashPointEntry.balance = balance;
        await cashPointEntry.save(); // Save the updated entry

        // Delete the CashDC entry
        cashDc = await CashDc.findByIdAndDelete(id);
        const success = true;
        res.send({
          success,
          message: "Document at id : " + id + " has been deleted",
        });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
