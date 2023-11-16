const express = require("express");
const router = express.Router();
const Dc = require("../models/Dc");
const Accounts = require("../models/Accounts");

// {Create Operation} ADMIN
router.post("/create", async (req, res) => {
  let success = false;
  try {
    //store data
    const { name, detail, amount, DbCr, selectedDate, adminDetail, firmId } =
      req.body; // de-Structure
    // Conditionally set the 'date' field
    const dateToUse = selectedDate ? selectedDate : Date.now();
    let dc = await Dc.create({
      name: name,
      detail: detail,
      amount: amount,
      DbCr: DbCr,
      adminDetail,
      firmId,
      date: dateToUse,
    });
    success = true;
    res.send({ success, dc });
  } catch (error) {
    res.status(500).json({ success, error: error.message });
  }
});

// {Read/Fetch Operation} ADMIN
router.get("/read", async (req, res) => {
  const dc = await Dc.find({}); // fetch all data
  res.json(dc);
});

// {Search Operation} ADMIN
router.get("/search/:name/:firmId", async (req, res) => {
  let success = false;
  try {
    const dc = await Dc.find({
      name: req.params.name,
      firmId: req.params.firmId,
    });
    res.send({ success, dc });
  } catch (error) {
    res.status(500).json({ success, error: error.message });
  }
});

// {Search Single Operation} ADMIN
router.get("/searchSingle/:name/:firmId", async (req, res) => {
  let success = false;
  try {
    const accounts = await Accounts.findOne({
      name: req.params.name,
      firmId: req.params.firmId,
    }); //
    success = true;
    res.send({ success, accounts });
  } catch (error) {
    res.status(500).json({ success, error: error.message });
  }
});

// {Update Operation} ADMIN
router.put("/update/:id", async (req, res) => {
  let success = false;
  try {
    const { name, detail, amount, DbCr } = req.body; //De-Structure

    // Create a new data object
    const newData = {};
    if (name) {
      newData.name = name;
    }
    if (detail) {
      newData.detail = detail;
    }
    if (amount) {
      newData.amount = amount;
    }
    if (DbCr) {
      newData.DbCr = DbCr;
    }
    //Find the document to be updated and update it
    let dc = await Dc.findById(req.params.id);
    if (!dc) {
      res.status(404).send("Document not found");
    } else {
      dc = await Dc.findByIdAndUpdate(
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
    //Find the Document to be deleted and delete it
    let dc = await Dc.findById(req.params.id);
    if (!dc) {
      res.status(404).send("Document not found");
    } else {
      dc = await Dc.findByIdAndDelete(req.params.id);
      success = true;
      res.send({
        success,
        message: "Document at id : " + req.params.id + " Has been deleted",
      });
    }
  } catch (error) {
    res.status(500).json({ success, error: error.message });
  }
});

module.exports = router;
