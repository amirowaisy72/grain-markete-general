const express = require("express");
const router = express.Router();
const Stock = require("../models/Stock");

// {Create Operation} ADMIN
router.post("/create", async (req, res) => {
  let success = false;
  try {
    //store data
    const { crop, inout, quantity, description, adminDetail, firmId } =
      req.body; // de-Structure
    let stock = await Stock.create({
      crop: crop,
      inout: inout,
      quantity: quantity,
      description: description,
      adminDetail,
      firmId,
    });
    success = true;
    res.send({ success, stock });
  } catch (error) {
    res.status(500).json({ success, error: error.message });
  }
});

// {Get crop name and tell the available stock} ADMIN
router.get("/quantity/:crop/:firmId", async (req, res) => {
  let success = false;
  try {
    // Extract the crop name from the request parameters
    const cropName = req.params.crop;

    // Find all stock entries for the specified crop in the database
    const stockEntries = await Stock.find({
      crop: cropName,
      firmId: req.params.firmId,
    });

    const cropRegistered = await Stock.findOne({
      name: new RegExp(cropName, "i"),
      firmId: req.params.firmId,
    });

    // Calculate the available stock by summing the input quantities and subtracting the output quantities
    let availableStock = 0;
    let availableStockDescription = "";
    if (stockEntries) {
      for (const entry of stockEntries) {
        if (entry.inout === "In") {
          availableStock += entry.quantity;
        } else if (entry.inout === "Out") {
          availableStock -= entry.quantity;
        }
      }
      availableStockDescription = "موجودہ اسٹاک :" + availableStock;
    } else {
      availableStockDescription =
        "اس فصل کی اسٹاک میں ابھی تک کوئی انٹری نہیں ہوئی";
    }

    // Send the response with the calculated available stock
    success = true;
    res.send({
      success,
      availableStock,
      availableStockDescription,
      cropRegistered,
    });
  } catch (error) {
    res.status(500).json({ success, error: error.message });
  }
});

// Get Lat Row Description of the Crop
router.get("/last-description/:crop", async (req, res) => {
  let success = false;
  try {
    // Extract the crop name from the request parameters
    const cropName = req.params.crop;

    // Find the last document in the Stock collection that matches the specified crop name
    const lastStockEntry = await Stock.findOne({ crop: cropName }).sort({
      _id: -1,
    });

    // If a matching document is found, retrieve its description
    let lastRowDescription = null;
    if (lastStockEntry) {
      lastRowDescription = lastStockEntry.description;
    }

    // Send the response with the last row description
    success = true;
    res.send({ success, lastRowDescription });
  } catch (error) {
    res.status(500).json({ success, error: error.message });
  }
});

// Get Entries of Crop
router.get("/entries/:crop/:firmId", async (req, res) => {
  const entries = await Stock.find({
    crop: req.params.crop,
    firmId: req.params.firmId,
  });
  res.send(entries);
});

//Get All Stock with Unique Crop Names and Quantities
router.get("/read/:firmId", async (req, res) => {
  let success = false;
  try {
    // Fetch all data from the Stock collection
    const allStock = await Stock.find({ firmId: req.params.firmId });

    // Create an empty object to store unique crop names and their quantities
    const cropQuantities = {};

    // Loop through the stock data to calculate quantities for each crop
    for (const stockEntry of allStock) {
      const { crop, inout, quantity } = stockEntry;

      // Check if the crop already exists in cropQuantities, if not, initialize it with 0 quantity
      if (!cropQuantities[crop]) {
        cropQuantities[crop] = 0;
      }

      // Update the quantity based on the inout (in or out)
      if (inout === "In") {
        cropQuantities[crop] += quantity;
      } else if (inout === "Out") {
        cropQuantities[crop] -= quantity;
      }
    }

    // Convert the cropQuantities object into an array of objects
    const cropQuantitiesArray = Object.keys(cropQuantities).map((crop) => ({
      crop,
      quantity: cropQuantities[crop],
    }));

    success = true;
    res.send({ success, cropQuantities: cropQuantitiesArray });
  } catch (error) {
    res.status(500).json({ success, error: error.message });
  }
});

//Get others crops names
router.get("/getOthers", async (req, res) => {
  let success = false;
  try {
    // Assuming you have a data source or a model named Stock that contains crop information.
    const allCrops = await Stock.find({ firmId: req.params.firmId }); // Replace 'find' with the appropriate method for fetching crops from your data source.

    // Define an array of crops to exclude (Cotton, Mirch, and Moonji).
    const excludedCrops = ["Gandum", "Kapaas", "Sarson", "Mirch", "Moonji"];

    // Filter the list to get crops other than the excluded ones.
    const otherCropsList = allCrops.filter(
      (crop) => !excludedCrops.includes(crop.crop)
    );

    // Create a set to store unique crop names without redundancy.
    const uniqueCrops = new Set();

    // Populate the unique crop names set.
    otherCropsList.forEach((crop) => uniqueCrops.add(crop.crop));

    // Convert the set back to an array if needed.
    const uniqueCropsArray = [...uniqueCrops];

    success = true;
    res.send({ success, otherCrops: uniqueCropsArray });
  } catch (error) {
    res.status(500).json({ success, error: error.message });
  }
});

// {Delete Operation} ADMIN
router.delete("/delete/:id", async (req, res) => {
  let success = false;
  try {
    //Find the Document to be deleted and delete it
    let stock = await Stock.findById(req.params.id);
    if (!stock) {
      res.status(404).send("Document not found");
    } else {
      stock = await Stock.findByIdAndDelete(req.params.id);
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
