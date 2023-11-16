const express = require("express");
const mongoose = require("mongoose");
const Accounts = require("../models/Accounts");
const Dc = require("../models/Dc");
const Stock = require("../models/Stock");
const router = express.Router();

router.post("/createOnlySeller", async (req, res) => {
  let success = false;
  let errorOccured = "Could not find error";
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get Data from user
    let {
      customer,
      crop,
      quantity,
      rate,
      totalAmount,
      calculatedExpenses,
      totalPayableAmount,
      weightStatement,
      adminDetail,
      firmId,
    } = req.body;

    totalPayableAmount = Math.round(totalPayableAmount);

    // First check if the account exists or not
    const accountExist = await Accounts.findOne({
      name: customer,
      firmId: firmId,
    }).session(session);

    if (!accountExist) {
      success = false;
      errorOccured =
        "یہ اکاؤنٹ موجود نہیں ہے۔ برائے مہربانی پہلے اس اکاؤنٹ کو رجسٹر کریں۔";
    } else {
      // Next step: post data into Dc Model
      const dc = await Dc.create(
        [
          {
            name: customer,
            detail: "انوائس",
            amount: totalPayableAmount,
            DbCr: "Credit",
            crop: crop,
            quantity: quantity,
            rate: rate,
            totalAmount: totalAmount,
            calculatedExpenses: calculatedExpenses,
            totalPayableAmount: totalPayableAmount,
            weightStatement: weightStatement,
            adminDetail,
            firmId,
            date: Date.now(),
          },
        ],
        { session }
      );
      if (!dc) {
        success = false;
        errorOccured = "Some Problem Occured while creating Dc entry";
      } else {
        // Next: Stock entry. Proceed only if previously success is true
        const stock = await Stock.create(
          [
            {
              crop: crop,
              inout: "In",
              quantity: quantity,
              description: "انوائس",
              customer: customer,
              rate: rate,
              totalAmount: totalAmount,
              calculatedExpenses: calculatedExpenses,
              totalPayableAmount: totalPayableAmount,
              weightStatement: weightStatement,
              adminDetail,
              firmId,
            },
          ],
          { session }
        );

        if (!stock) {
          success = false;
          errorOccured = "Some Problem Occured while creating Stock entry";
          await session.abortTransaction();
        } else {
          const recognizedExpenses = [
            "Commission",
            "Mazduri",
            "Brokery",
            "Accountant",
          ];

          for (const expenseType in calculatedExpenses) {
            if (recognizedExpenses.includes(expenseType)) {
              const currentExpense = calculatedExpenses[expenseType];

              // Check if an account with the expense name already exists
              const existingAccount = await Accounts.findOne({
                name: expenseType,
                firmId: firmId,
              }).session(session);

              if (!existingAccount) {
                // Create a new account for the recognized expense with the name
                await Accounts.create(
                  [
                    {
                      name: expenseType, // Add the name of the recognized expense
                      status: "Regular",
                      adminDetail,
                      firmId,
                    },
                  ],
                  { session }
                );
              }

              // Create Dc entry for the recognized expense
              await Dc.create(
                [
                  {
                    name: expenseType,
                    detail: "انوائس",
                    amount: Math.round(currentExpense.expenseCalculated), // Use your specific logic for amount
                    DbCr: "Credit",
                    crop: crop,
                    quantity: quantity,
                    rate: rate,
                    totalAmount: totalAmount,
                    calculatedExpenses: calculatedExpenses,
                    totalPayableAmount: totalPayableAmount,
                    weightStatement: weightStatement,
                    adminDetail,
                    otherDetail: `${customer} - Seller`,
                    firmId,
                    date: Date.now(),
                  },
                ],
                { session }
              );
            }
          }

          let commit = await session.commitTransaction();
          if (!commit) {
            success = false;
            errorOccured = "Some Problem Occured while making transaction";
          } else {
            success = true;
          }
        }
      }
    }

    if (success) {
      res.send({ success, message: "انٹری کامیابی سے کر دی گئی ہے۔" });
    } else {
      res.send({ success, error: errorOccured });
    }
  } catch (error) {
    success = false;
    errorOccured = error.message;
    await session.abortTransaction();
    res.status(500).json({ success, error: errorOccured });
  } finally {
    session.endSession();
  }
});

router.post("/createBuyerSeller", async (req, res) => {
  let success = true; // Assume success initially
  let errorOccured = "Could not find error";
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get Data from user
    const { allInvoices, adminDetail, firmId } = req.body;

    for (const invoice of allInvoices) {
      // Destructure invoice data
      let {
        customerType,
        customer,
        crop,
        quantity,
        rate,
        totalAmount,
        calculatedExpenses,
        totalPayableAmount,
        weightStatement,
      } = invoice;

      totalPayableAmount = Math.round(totalPayableAmount);

      // First check if the account exists or not
      const accountExist = await Accounts.findOne({
        name: customer,
        firmId,
      }).session(session);

      if (!accountExist) {
        success = false;
        errorOccured =
          "یہ اکاؤنٹ موجود نہیں ہے۔ برائے مہربانی پہلے اس اکاؤنٹ کو رجسٹر کریں۔";
        break; // Exit the loop on the first error
      }

      // Next step: post data into Dc Model
      const dc = await Dc.create(
        [
          {
            name: customer,
            detail: "انوائس",
            amount: totalPayableAmount,
            DbCr: customerType === "Seller" ? "Credit" : "Debit",
            crop: crop,
            quantity: quantity,
            rate: rate,
            totalAmount: totalAmount,
            calculatedExpenses: calculatedExpenses,
            totalPayableAmount: totalPayableAmount,
            weightStatement: weightStatement,
            adminDetail,
            firmId,
            date: Date.now(),
          },
        ],
        { session }
      );

      if (!dc) {
        success = false;
        errorOccured = "Some Problem Occured while creating Dc entry";
        break; // Exit the loop on the first error
      }

      let stock = "check if it is necessary or not";
      // Check if the length of allInvoices is greater than 1
      if (allInvoices.length < 1) {
        // Next: Stock entry. Proceed only if previously success is true
        stock = await Stock.create(
          [
            {
              crop: crop,
              inout: "Out",
              quantity: quantity,
              description: "انوائس",
              customer: customer,
              rate: rate,
              totalAmount: totalAmount,
              calculatedExpenses: calculatedExpenses,
              totalPayableAmount: totalPayableAmount,
              weightStatement: weightStatement,
              adminDetail,
              firmId,
            },
          ],
          { session }
        );
      }

      if (!stock) {
        success = false;
        errorOccured = "Some Problem Occured while creating Stock entry";
        break; // Exit the loop on the first error
      }

      const recognizedExpenses = [
        "Commission",
        "Mazduri",
        "Market Fee",
        "Brokery",
        "Accountant",
      ];

      for (const expenseType in calculatedExpenses) {
        if (recognizedExpenses.includes(expenseType)) {
          const currentExpense = calculatedExpenses[expenseType];

          // Check if an account with the expense name already exists
          const existingAccount = await Accounts.findOne({
            name: expenseType,
            firmId,
          }).session(session);

          if (!existingAccount) {
            // Create a new account for the recognized expense with the name
            await Accounts.create(
              [
                {
                  name: expenseType, // Add the name of the recognized expense
                  status: "Regular",
                  adminDetail,
                  firmId,
                },
              ],
              { session }
            );
          }

          // Create Dc entry for the recognized expense
          await Dc.create(
            [
              {
                name: expenseType,
                detail: `انوائس`,
                amount: Math.round(currentExpense.expenseCalculated), // Use your specific logic for amount
                DbCr: "Credit",
                crop: crop,
                quantity: quantity,
                rate: rate,
                totalAmount: totalAmount,
                calculatedExpenses: calculatedExpenses,
                totalPayableAmount: totalPayableAmount,
                weightStatement: weightStatement,
                adminDetail,
                otherDetail: `${customer} - ${customerType}`,
                firmId,
                date: Date.now(),
              },
            ],
            { session }
          );
        }
      }
    }

    if (success) {
      await session.commitTransaction();
      res.send({ success: true, message: "انٹری کامیابی سے کر دی گئی ہے۔" });
    } else {
      await session.abortTransaction();
      res.status(500).json({ success: false, error: errorOccured });
    }
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, error: error.message });
  } finally {
    session.endSession();
  }
});

module.exports = router;
