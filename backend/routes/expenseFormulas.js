const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Expense = require("../models/Expense");

const app = express();
// Middleware to parse JSON in the request body
app.use(bodyParser.json());

// POST endpoint to save expense data
router.post("/create", async (req, res) => {
  try {
    // Assuming req.body contains the data you want to save
    const expenseData = new Expense(req.body);
    const savedExpense = await expenseData.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT endpoint to update expense data for the first document
router.put("/update", async (req, res) => {
  try {
    // Assuming req.body contains the updated data
    const { expenses, firmId } = req.body;

    // Find the first document in the Expense collection
    const expenseToUpdate = await Expense.findOne({ firmId });

    if (!expenseToUpdate) {
      return res
        .status(404)
        .json({ success: false, error: "Expense document not found" });
    }

    // Update the document with the new data
    expenseToUpdate.set({ schedule: expenses });
    const savedExpense = await expenseToUpdate.save();

    res.status(200).json({ success: true, savedExpense });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Define the route to fetch the first Expense document
router.get("/read/:firmId", async (req, res) => {
  try {
    const expense = await Expense.findOne({ firmId: req.params.firmId });

    // Check if a document exists
    if (!expense) {
      return res
        .status(404)
        .json({ success: false, error: "Expense not found" });
    }

    // If a document exists, send it as a response
    res.status(200).json({ success: true, expense: expense.schedule });
  } catch (error) {
    // Handle any errors that occur during the query or processing
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/createExpenseSchedule", async (req, res) => {
  try {
    const { firmId } = req.body;
    const schedule = {
      Commission: {
        Seller: {
          Gandum: {
            Formula: 1,
            Info: "% of total amount",
          },
          Kapaas: {
            Formula: 1,
            Info: "% of total amount",
          },
          Sarson: {
            Formula: 2.5,
            Info: "% of total amount",
          },
          Mirch: {
            Formula: 5,
            Info: "% of total amount",
          },
          Moonji: {
            Formula: 3,
            Info: "% of total amount",
          },
          Others: {
            Formula: 3,
            Info: "% of total amount",
          },
        },
        Buyer: {
          Gandum: {
            Formula: 0.5,
            Info: "% of total amount",
          },
          Kapaas: {
            Formula: 1,
            Info: "% of total amount",
          },
          Others: {
            Formula: 1.5,
            Info: "% of total amount",
          },
        },
      },
      Mazduri: {
        Seller: {
          Gandum: {
            Formula: {
              CompleteBag: 25,
              IncompleteBag: 15,
            },
            Info: "",
          },
          Kapaas: {
            Formula: {
              PerMand: 20,
            },
            Info: "",
          },
          Sarson: {
            Formula: {
              CompleteBag: 25,
              IncompleteBag: 18,
            },
            Info: "",
          },
          Mirch: {
            Formula: {
              PerKg: 2,
            },
            Info: "",
          },
          Moonji: {
            Formula: {
              CompleteBag: 18,
            },
            Info: "",
          },
          Others: {
            Formula: {
              CompleteBag: 25,
              IncompleteBag: 15,
            },
            Info: "",
          },
        },
        Buyer: {
          Gandum: {
            Formula: {
              CompleteBag: 10,
              IncompleteBag: 6,
            },
            Info: "",
          },
          Kapaas: {
            Formula: {
              PerMand: 5,
            },
            Info: "",
          },
          Others: {
            Formula: {
              CompleteBag: 10,
              IncompleteBag: 6,
            },
            Info: "",
          },
        },
      },
      Brokery: {
        Seller: {
          Gandum: {
            Formula: 0.07,
            Info: "% of total amount",
          },
          Kapaas: {
            Formula: 0.07,
            Info: "% of total amount",
          },
          Sarson: {
            Formula: 0.2,
            Info: "% of total amount",
          },
          Mirch: {
            Formula: 0.2,
            Info: "% of total amount",
          },
          Moonji: {
            Formula: 0.2,
            Info: "% of total amount",
          },
          Others: {
            Formula: 0.2,
            Info: "% of total amount",
          },
        },
        Buyer: null,
      },
      Accountant: {
        Seller: {
          Gandum: {
            Formula: 0.1,
            Info: "% of total amount",
          },
          Kapaas: {
            Formula: 0.1,
            Info: "% of total amount",
          },
          Sarson: {
            Formula: 0.2,
            Info: "% of total amount",
          },
          Mirch: {
            Formula: 0.2,
            Info: "% of total amount",
          },
          Moonji: {
            Formula: 0.2,
            Info: "% of total amount",
          },
          Others: {
            Formula: 0.2,
            Info: "% of total amount",
          },
        },
        Buyer: null,
      },
      "Market Fee": {
        Buyer: {
          Gandum: {
            Formula: 2,
            Info: "per Quintal (only for non-member)",
          },
          Kapaas: {
            Formula: 2,
            Info: "per Quintal (only for non-member)",
          },
          Others: {
            Formula: 2,
            Info: "per Quintal (only for non-member)",
          },
        },
        Seller: null,
      },
      Sootli: {
        Buyer: {
          Gandum: {
            Formula: {
              CompleteBag: 4,
              IncompleteBag: 2,
            },
            Info: "",
          },
          Others: {
            Formula: {
              CompleteBag: 4,
              IncompleteBag: 2,
            },
            Info: "",
          },
          Kapaas: {
            Formula: null,
            Info: "Not Applicable",
          },
        },
        Seller: null,
      },
      Ghisai: {
        Buyer: {
          Kapaas: {
            Formula: {
              PerMand: 5,
            },
            Info: "",
          },
          Gandum: {
            Formula: null,
            Info: "Not Applicable",
          },
          Others: {
            Formula: null,
            Info: "Not Applicable",
          },
        },
        Seller: null,
      },
      Silai: {
        Buyer: {
          Gandum: {
            Formula: {
              CompleteBag: 2,
              IncompleteBag: 1,
            },
            Info: "",
          },
          Others: {
            Formula: {
              CompleteBag: 2,
              IncompleteBag: 1,
            },
            Info: "",
          },
          Kapaas: {
            Formula: null,
            Info: "Not Applicable",
          },
        },
        Seller: null,
      },
    };
    // Check if an expense with the given firmId already exists
    const existingExpense = await Expense.findOne({ firmId });

    if (existingExpense) {
      // Expense with the given firmId already exists
      return res
        .status(400)
        .json({ error: "Expense with this firmId already exists" });
    }

    // If no existing expense, create a new one
    const expenseData = new Expense({ firmId, schedule });
    const newExpense = await expenseData.save();

    return res.status(201).json({ success: true, expense: newExpense });
  } catch (error) {}
});

module.exports = router;
