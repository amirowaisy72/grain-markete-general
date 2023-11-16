const mongoose = require("mongoose");
const { Schema } = mongoose;

const expenseSchema = new mongoose.Schema({
  firmId: {
    type: String,
  },
  schedule: {
    Commission: {
      Seller: {
        Gandum: {
          Formula: Number,
          Info: String,
        },
        Kapaas: {
          Formula: Number,
          Info: String,
        },
        Sarson: {
          Formula: Number,
          Info: String,
        },
        Mirch: {
          Formula: Number,
          Info: String,
        },
        Moonji: {
          Formula: Number,
          Info: String,
        },
        Others: {
          Formula: Number,
          Info: String,
        },
      },
      Buyer: {
        Gandum: {
          Formula: Number,
          Info: String,
        },
        Kapaas: {
          Formula: Number,
          Info: String,
        },
        Others: {
          Formula: Number,
          Info: String,
        },
      },
    },
    Mazduri: {
      Seller: {
        Gandum: {
          Formula: {
            CompleteBag: Number,
            IncompleteBag: Number,
          },
          Info: String,
        },
        Kapaas: {
          Formula: {
            PerMand: Number,
          },
          Info: String,
        },
        Sarson: {
          Formula: {
            CompleteBag: Number,
            IncompleteBag: Number,
          },
          Info: String,
        },
        Mirch: {
          Formula: {
            PerKg: Number,
          },
          Info: String,
        },
        Moonji: {
          Formula: {
            CompleteBag: Number,
          },
          Info: String,
        },
        Others: {
          Formula: {
            CompleteBag: Number,
            IncompleteBag: Number,
          },
          Info: String,
        },
      },
      Buyer: {
        Gandum: {
          Formula: {
            CompleteBag: Number,
            IncompleteBag: Number,
          },
          Info: String,
        },
        Kapaas: {
          Formula: {
            PerMand: Number,
          },
          Info: String,
        },
        Others: {
          Formula: {
            CompleteBag: Number,
            IncompleteBag: Number,
          },
          Info: String,
        },
      },
    },
    Brokery: {
      Seller: {
        Gandum: {
          Formula: Number,
          Info: String,
        },
        Kapaas: {
          Formula: Number,
          Info: String,
        },
        Sarson: {
          Formula: Number,
          Info: String,
        },
        Mirch: {
          Formula: Number,
          Info: String,
        },
        Moonji: {
          Formula: Number,
          Info: String,
        },
        Others: {
          Formula: Number,
          Info: String,
        },
      },
      Buyer: Boolean, // If Buyer is an object, define its schema here
    },
    Accountant: {
      Seller: {
        Gandum: {
          Formula: Number,
          Info: String,
        },
        Kapaas: {
          Formula: Number,
          Info: String,
        },
        Sarson: {
          Formula: Number,
          Info: String,
        },
        Mirch: {
          Formula: Number,
          Info: String,
        },
        Moonji: {
          Formula: Number,
          Info: String,
        },
        Others: {
          Formula: Number,
          Info: String,
        },
      },
      Buyer: Boolean, // If Buyer is an object, define its schema here
    },
    "Market Fee": {
      Seller: Boolean, // If Seller is an object, define its schema here
      Buyer: {
        Gandum: {
          Formula: Number,
          Info: String,
        },
        Kapaas: {
          Formula: Number,
          Info: String,
        },
        Others: {
          Formula: Number,
          Info: String,
        },
      },
    },
    Sootli: {
      Seller: Boolean,
      Buyer: {
        Gandum: {
          Formula: {
            CompleteBag: Number,
            IncompleteBag: Number,
          },
          Info: String,
        },
        Others: {
          Formula: {
            CompleteBag: Number,
            IncompleteBag: Number,
          },
          Info: String,
        },
        Kapaas: {
          Formula: String, // Modify the data type as needed
          Info: String,
        },
      },
    },
    Ghisai: {
      Seller: Boolean,
      Buyer: {
        Kapaas: {
          Formula: {
            PerMand: Number,
          },
          Info: String,
        },
        Gandum: {
          Formula: String, // Modify the data type as needed
          Info: String,
        },
        Others: {
          Formula: String, // Modify the data type as needed
          Info: String,
        },
      },
    },
    Silai: {
      Seller: Boolean,
      Buyer: {
        Gandum: {
          Formula: {
            CompleteBag: Number,
            IncompleteBag: Number,
          },
          Info: String,
        },
        Others: {
          Formula: {
            CompleteBag: Number,
            IncompleteBag: Number,
          },
          Info: String,
        },
        Kapaas: {
          Formula: String, // Modify the data type as needed
          Info: String,
        },
      },
    },
  },
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
