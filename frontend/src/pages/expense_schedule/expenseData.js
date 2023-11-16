const data = {
  Commission: {
    Seller: {
      Gandum: {
        Formula: 1,
        Info: '% of total amount',
      },
      Kapaas: {
        Formula: 1,
        Info: '% of total amount',
      },
      Sarson: {
        Formula: 2.5,
        Info: '% of total amount',
      },
      Mirch: {
        Formula: 5,
        Info: '% of total amount',
      },
      Moonji: {
        Formula: 3,
        Info: '% of total amount',
      },
      Others: {
        Formula: 3,
        Info: '% of total amount',
      },
    },
    Buyer: {
      Gandum: {
        Formula: 0.5,
        Info: '% of total amount',
      },
      Kapaas: {
        Formula: 1,
        Info: '% of total amount',
      },
      Others: {
        Formula: 1.5,
        Info: '% of total amount',
      },
    },
  },
  Mazduri: {
    Seller: {
      Gandum: {
        Formula: {
          CompleteBag: 20,
          IncompleteBag: 12,
        },
        Info: '',
      },
      Kapaas: {
        Formula: {
          PerMand: 17,
        },
        Info: '',
      },
      Sarson: {
        Formula: {
          CompleteBag: 20,
          IncompleteBag: 12,
        },
        Info: '',
      },
      Mirch: {
        Formula: {
          PerKg: 2,
        },
        Info: '',
      },
      Moonji: {
        Formula: {
          CompleteBag: 15,
        },
        Info: '',
      },
      Others: {
        Formula: {
          CompleteBag: 20,
          IncompleteBag: 12,
        },
        Info: '',
      },
    },
    Buyer: {
      Gandum: {
        Formula: {
          CompleteBag: 10,
          IncompleteBag: 6,
        },
        Info: '',
      },
      Kapaas: {
        Formula: {
          PerMand: 3,
        },
        Info: '',
      },
      Others: {
        Formula: {
          CompleteBagMember: 4,
          CompleteBagNonMember: 5,
        },
        Info: '',
      },
    },
  },
  Brokery: {
    Seller: {
      Gandum: {
        Formula: 0.16,
        Info: '% of total amount',
      },
      Kapaas: {
        Formula: 0.16,
        Info: '% of total amount',
      },
      Sarson: {
        Formula: 0.14,
        Info: '% of total amount',
      },
      Mirch: {
        Formula: 0.14,
        Info: '% of total amount',
      },
      Moonji: {
        Formula: 0.14,
        Info: '% of total amount',
      },
      Others: {
        Formula: 0.14,
        Info: '% of total amount',
      },
    },
    Buyer: null,
  },
  'Market Fee': {
    Seller: null,
    Buyer: {
      Gandum: {
        Formula: 2,
        Info: 'per Quintal (only for non-member)',
      },
      Kapaas: {
        Formula: 2,
        Info: 'per Quintal (only for non-member)',
      },
      Others: {
        Formula: 2,
        Info: 'per Quintal (only for non-member)',
      },
    },
  },
  Sootli: {
    Seller: null,
    Buyer: {
      Gandum: {
        Formula: {
          CompleteBag: 4,
          IncompleteBag: 2,
        },
        Info: '',
      },
      Others: {
        Formula: {
          CompleteBag: 4,
          IncompleteBag: 2,
        },
        Info: '',
      },
      Kapaas: {
        Formula: null,
        Info: 'Not Applicable',
      },
    },
  },
  Ghisai: {
    Seller: null,
    Buyer: {
      Kapaas: {
        Formula: {
          PerMand: 4,
        },
        Info: '',
      },
      Gandum: {
        Formula: null,
        Info: 'Not Applicable',
      },
      Others: {
        Formula: null,
        Info: 'Not Applicable',
      },
    },
  },
  _id: '6521f847696a500cf5cd3b64',
  __v: 0,
}

export default data
