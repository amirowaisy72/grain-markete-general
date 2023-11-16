const express = require("express");
const router = express.Router();
const Accounts = require("../models/Accounts");
const Dc = require("../models/Dc");

// {Create Operation} ADMIN
router.post("/create", async (req, res) => {
  let success = false;
  try {
    //store data
    let {
      name,
      mobileNumbers,
      address,
      guarranter,
      idCardNumber,
      status,
      accountType,
      adminDetail,
      firmId,
    } = req.body; // de-Structure

    if (guarranter === "") {
      guarranter = "خود";
    }

    const dup = await Accounts.findOne({
      name: name,
      firmId: firmId,
    });
    if (!dup) {
      //Check guarranter account
      const guarranterAccount = await Accounts.findOne({
        name: guarranter,
        firmId: firmId,
      });
      if (!guarranterAccount && guarranter !== "خود") {
        success = false;
        res.send({
          success,
          error:
            " گارنٹراکاؤنٹ سسٹم میں موجود نہیں ہے۔ براہ کرم پہلے اس شخص کا اکاؤنٹ بنائیں",
        });
      } else {
        let accounts = await Accounts.create({
          name,
          mobileNumbers, // Use the array of mobile numbers
          address,
          guarranter,
          idCardNumber, // Add the idCardNumber
          status,
          accountType,
          adminDetail,
          firmId,
        });
        success = true;
        res.send({ success, accounts });
      }
    } else {
      res.send({
        success,
        error: "اس عنوان کے ساتھ ایک اور اکاؤنٹ پہلے سے موجود ہے",
      });
    }
  } catch (error) {
    res.status(500).json({ success, error: error.message });
  }
});

// {Read/Fetch Operation} ADMIN
router.get("/read/:firmId", async (req, res) => {
  const accounts = await Accounts.find({ firmId: req.params.firmId }); // fetch all data
  res.json(accounts);
});

// {Search Operation} ADMIN
router.get("/search/:name/:firmId", async (req, res) => {
  try {
    // Step 1: Search for the account
    const accounts = await Accounts.findOne({
      name: new RegExp(req.params.name, "i"),
      firmId: req.params.firmId,
    });

    if (!accounts) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    // Step 2: Fetch documents from Dc modal where name matches
    const documents = await Dc.find({ name: accounts.name });

    // Step 3: Calculate the balance
    let balance = 0;

    documents.forEach((doc) => {
      // Assuming doc.amount is the field representing the amount
      if (doc.DbCr === "Credit") {
        balance += doc.amount;
      } else if (doc.DbCr === "Debit") {
        balance -= doc.amount;
      }
    });

    // Step 4: Send the response with balance
    res.json({ success: true, accounts, balance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// {Search All Operation} ADMIN
router.get("/searchAll/:name", async (req, res) => {
  let success = false;
  try {
    const accounts = await Accounts.find({
      name: new RegExp(req.params.name, "i"),
    }); // fetch all apps where keyword like this // fetch data according to given keyword
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
    let {
      name,
      mobileNumbers,
      address,
      guarranter,
      titleChange,
      idCard,
      status,
      accountType,
    } = req.body; //De-Structure

    if (guarranter === "") {
      guarranter = "خود";
    }

    // Create a new data object
    const newData = {};
    if (name) {
      newData.name = name;
    }
    if (mobileNumbers) {
      newData.mobileNumbers = mobileNumbers;
    }
    if (address) {
      newData.address = address;
    }
    if (guarranter) {
      newData.guarranter = guarranter;
    }
    if (titleChange) {
      newData.titleChange = titleChange;
    }
    if (idCard) {
      newData.idCardNumber = idCard;
    }
    if (status) {
      newData.status = status;
    }
    if (accountType) {
      newData.accountType = accountType;
    }
    //Find the document to be updated and update it
    let accounts = await Accounts.findById(req.params.id);
    if (!accounts) {
      success = false;
      res.send({
        success,
        error: "Document not found",
      });
    } else {
      if (titleChange) {
        //it will only proceed if there is change in account title
        const dup = await Accounts.findOne({
          name: name,
        });
        if (!dup) {
          //Check wheather guarranter account exists or not
          const guarranterAccount = await Accounts.findOne({
            name: guarranter,
          });
          if (!guarranterAccount && guarranter !== "خود") {
            success = false;
            res.send({
              success,
              error:
                " گارنٹراکاؤنٹ سسٹم میں موجود نہیں ہے۔ براہ کرم پہلے اس شخص کا اکاؤنٹ بنائیں",
            });
          } else {
            const accountId = req.params.id;

            // Retrieve the name from the Accounts model using the ID
            const account = await Accounts.findById(accountId);
            const nameToUpdate = account.name;

            // Update all documents in the Dc model where the 'name' field matches 'nameToUpdate'
            await Dc.updateMany(
              { name: nameToUpdate },
              { $set: { name: name } }
            );

            accounts = await Accounts.findByIdAndUpdate(
              req.params.id,
              { $set: newData },
              { new: true }
            );
            success = true;
            res.send({
              success,
              message:
                "Document has been updated at Document id : " + req.params.id,
            });
          }
        } else {
          {
            success = false;
            res.send({
              success,
              error: "اس نام کے ساتھ ایک اور اکاؤنٹ پہلے سے موجود ہے",
            });
          }
        }
      } else {
        //Check wheather guarranter account exists or not
        const guarranterAccount = await Accounts.findOne({
          name: guarranter,
        });
        if (!guarranterAccount && guarranter !== "خود") {
          success = false;
          res.send({
            success,
            error:
              " گارنٹراکاؤنٹ سسٹم میں موجود نہیں ہے۔ براہ کرم پہلے اس شخص کا اکاؤنٹ بنائیں",
          });
        } else {
          accounts = await Accounts.findByIdAndUpdate(
            req.params.id,
            { $set: newData },
            { new: true }
          );
          success = true;
          res.send({
            success,
            message:
              "Document has been updated at Document id : " + req.params.id,
          });
        }
      }
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
    let accounts = await Accounts.findById(req.params.id);
    if (!accounts) {
      res.status(404).send("Document not found");
    } else {
      accounts = await Accounts.findByIdAndDelete(req.params.id);
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

router.get("/accountsBlock/:firmId", async (req, res) => {
  try {
    const totalAccounts = await Accounts.countDocuments({
      firmId: req.params.firmId,
    });

    const regularAccounts = await Accounts.countDocuments({
      status: "Regular",
      firmId: req.params.firmId,
    });

    const highRiskAccounts = await Accounts.countDocuments({
      status: "High Risk",
      firmId: req.params.firmId,
    });

    const blackListedAccounts = await Accounts.countDocuments({
      status: "Black List",
      firmId: req.params.firmId,
    });

    const result = {
      totalAccounts,
      regularAccounts,
      highRiskAccounts,
      blackListedAccounts,
    };

    res.json(result);
  } catch (error) {
    // Handle any errors here
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/getAddresses/:firmId", async (req, res) => {
  try {
    console.log(req.params.firmId);
    // Fetch only those accounts from the Accounts model where the address field exists
    const accounts = await Accounts.find(
      { address: { $exists: true }, firmId: req.params.firmId },
      "address"
    );

    // Extract unique addresses from the accounts
    const uniqueAddresses = [
      ...new Set(accounts.map((account) => account.address)),
    ];

    // Arrange the data in the specified pattern
    const formattedAddresses = uniqueAddresses.map((address) => ({
      name: address,
    }));

    res.json({ addresses: formattedAddresses });
  } catch (error) {
    console.error("Error fetching addresses:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/guarranters/:customer/:firmId", async (req, res) => {
  try {
    const customer = req.params.customer;

    // Find the document where the customer is the name and get guarranter
    const guarrantyTaken = await Accounts.findOne({
      name: customer,
      firmId: req.params.firmId,
    }).select("guarranter");

    // Find the document where the guarranter is the customer and get the name
    const guarrantyGiven = await Accounts.findOne({
      guarranter: customer,
      firmId: req.params.firmId,
    }).select("name");

    res.send({
      guarrantyGiven: guarrantyGiven?.name,
      guarrantyTaken: guarrantyTaken?.guarranter,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
