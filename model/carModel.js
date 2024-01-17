const mongoose = require("mongoose");

const manufacturerSchema = mongoose.Schema(
  {
    manufacturerName: {
      type: String,
    },
    manufacturerEmail: {
      type: String,
    },
    manufacturerAddr: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Manufacturer = mongoose.model("Manufacturer", manufacturerSchema);

const brandSchema = mongoose.Schema(
  {
    brandName: {
      type: String,
    },
    image: {
      type: String,
    },
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Manufacturer,
    },
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model("Brand", brandSchema);

// const optionSchema = mongoose.Schema({
//   color: {
//     type: String,
//   },
//   transmission: {
//     type: String,
//   },
//   engine: {
//     type: String,
//   },
//   styles: {
//     type: String,
//   },
// });

// const Option = mongoose.model("Option", optionSchema);

const modelSchema = mongoose.Schema(
  {
    modelName: {
      type: String,
    },
    image: {
      type: String,
    },
    style: {
      type: String,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Brand,
    },
    // option: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: Option,
    // },
  },
  {
    timestamps: true,
  }
);
const Model = mongoose.model("Model", modelSchema);

const dealerSchema = mongoose.Schema(
  {
    image: {
      type: String,
    },
    dealerName: {
      type: String,
    },
    dealerAddr: {
      type: String,
    },
    dealerPhone: {
      type: String,
    },
    dealerEmail: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Dealer = mongoose.model("Dealer", dealerSchema);

const manufacturerVehicleSchema = mongoose.Schema(
  {
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Manufacturer,
    },
    model: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Model,
    },
    vin: {
      type: String,
    },
    price: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ManufacturerVehicle = mongoose.model(
  "ManufacturerVehicle",
  manufacturerVehicleSchema
);

const dealerVehicleSchema = mongoose.Schema(
  {
    vehicleStatus: {
      type: String,
    },
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Dealer,
    },
    manufacturerVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ManufacturerVehicle,
    },
    price: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const DealerVehicle = mongoose.model("DealerVehicle", dealerVehicleSchema);

const customerSchema = mongoose.Schema(
  {
    customerName: {
      type: String,
    },
    customerAddr: {
      type: String,
    },
    customerPhone: {
      type: String,
    },
    customerGender: {
      type: String,
    },
    customerAnnualIncome: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("Customer", customerSchema);

const saleSchema = mongoose.Schema(
  {
    dealerVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DealerVehicle,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Customer,
    },
  },
  {
    timestamps: true,
  }
);

const Sale = mongoose.model("Sale", saleSchema);

const MoreImageSchema = mongoose.Schema({
  vehicleModel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Model,
  },
  image: {
    type: String,
  },
});

const MoreImage = mongoose.model("MoreImage", MoreImageSchema);

const MoreInfoSchema = mongoose.Schema({
  vehicleModel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Model,
  },
  description: {
    type: String,
  },
});

const MoreInfo = mongoose.model("MoreInfo", MoreInfoSchema);

module.exports = {
  Manufacturer,
  Brand,
  // Option,
  Model,
  ManufacturerVehicle,
  Dealer,
  DealerVehicle,
  Customer,
  Sale,
  MoreImage,
  MoreInfo,
};
