const CarDb = require("../model/carModel");
const mongoose = require("mongoose");

// create manufacturer
const createManufacturer = async (req, res) => {
  try {
    const manufacturer = await CarDb.Manufacturer.create(req.body);
    console.log(manufacturer);
    res.status(200).json(manufacturer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create brand
const createBrand = async (req, res) => {
  try {
    const brand = await CarDb.Brand.create(req.body);
    console.log(brand);
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create option
const createOption = async (req, res) => {
  try {
    const option = await CarDb.Option.create(req.body);
    console.log(option);
    res.status(200).json(option);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create model
const createModel = async (req, res) => {
  try {
    const model = await CarDb.Model.create(req.body);
    console.log(model);
    res.status(200).json(model);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create manufacturer vehicle
const createManufacturerVehicle = async (req, res) => {
  try {
    const manufacturerVehicle = await CarDb.ManufacturerVehicle.create(
      req.body
    );
    console.log(manufacturerVehicle);
    res.status(200).json(manufacturerVehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create dealer
const createDealer = async (req, res) => {
  try {
    const dealer = await CarDb.Dealer.create(req.body);
    console.log(dealer);
    res.status(200).json(dealer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create dealer vehicle
const createDealerVehicle = async (req, res) => {
  try {
    const dealerVehicle = await CarDb.DealerVehicle.create(req.body);
    console.log(dealerVehicle);
    res.status(200).json(dealerVehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create customer
const createCustomer = async (req, res) => {
  try {
    const customer = await CarDb.Customer.create(req.body);
    console.log(customer);
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create sale
const createSale = async (req, res) => {
  try {
    const sale = await CarDb.Sale.create(req.body);
    console.log(sale);
    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// fetch all brand
const getBrand = async (req, res) => {
  try {
    const brand = await CarDb.Brand.find().populate("manufacturer");
    console.log(brand);
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// //fetch all model
// const getModel = async (req, res) => {
//   const page = parseInt(req.query.page) || 1; // Get the requested page or default to 1
//   const limit = parseInt(req.query.limit) || 10; // Get the limit of items per page or default to 10

//   try {
//     const totalModels = await CarDb.Model.countDocuments();
//     const totalPages = Math.ceil(totalModels / limit);

//     const models = await CarDb.Model.find()
//       .populate("brand")
//       .skip((page - 1) * limit) // Skip items based on the page
//       .limit(limit); // Limit the number of items per page

//     res.status(200).json({
//       models,
//       currentPage: page,
//       totalPages,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

//fetch all model
const getModel = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const brandFilter = req.query.brand;
  const styleFilter = req.query.style; // New style filter parameter

  try {
    let query = CarDb.Model.find().populate("brand");

    if (brandFilter) {
      query = query.populate({
        path: "brand",
        match: { brandName: brandFilter },
      });
    }

    if (styleFilter) {
      // Filter by car style if style filter is provided
      query = query.where("style").equals(styleFilter); // Assuming 'carStyle' is the field name for car style
    }

    const totalModels = await CarDb.Model.countDocuments(query);

    const models = await query.skip((page - 1) * limit).limit(limit);

    res.status(200).json({
      models,
      currentPage: page,
      totalPages: Math.ceil(totalModels / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get model by brand
const getModelByBrand = async (req, res) => {
  try {
    const brandId = req.params.brandId;
    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 10; // Number of items per page

    // Query the total count of models for the provided brandId
    const totalModelsCount = await CarDb.Model.countDocuments({
      brand: brandId,
    });

    const skip = (page - 1) * limit; // Calculate the offset

    // Query models based on the provided brandId with pagination
    const models = await CarDb.Model.find({ brand: brandId })
      .populate("brand")
      .limit(limit)
      .skip(skip);

    const totalPages = Math.ceil(totalModelsCount / limit); // Calculate total pages

    res.json({
      models,
      currentPage: page,
      totalPages: totalPages, // Include total pages in the response
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//fetch all manufacturer vehicle

const getManufacturerVehicle = async (req, res) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 to month because January is 0
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${month}/${day}/${year}`;
  };
  try {
    const manufacturerVehicle = await CarDb.ManufacturerVehicle.find()
      .populate("manufacturer")
      .populate({ path: "model", populate: "brand" });

    // Format createdAt and updatedAt fields to day, month, year format
    const formattedManufacturerVehicle = manufacturerVehicle.map((vehicle) => ({
      ...vehicle.toObject(),
      createdAt: formatDate(vehicle.createdAt),
      updatedAt: formatDate(vehicle.updatedAt),
    }));

    res.status(200).json(formattedManufacturerVehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// fetch all dealer
const getDealer = async (req, res) => {
  try {
    const dealer = await CarDb.Dealer.find();
    res.status(200).json(dealer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// fetch all dealer
const getCustomer = async (req, res) => {
  try {
    const customer = await CarDb.Customer.find();
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// fetch dealer vehicle
const getDealerVehicle = async (req, res) => {
  try {
    const searchQuery = req.query.query; // Assuming the VIN is passed as a query parameter

    const dealerVehicle = await CarDb.DealerVehicle.aggregate([
      {
        $lookup: {
          from: "dealers",
          localField: "dealer",
          foreignField: "_id",
          as: "dealerInfo",
        },
      },
      {
        $unwind: "$dealerInfo",
      },
      {
        $lookup: {
          from: "manufacturervehicles",
          localField: "manufacturerVehicle",
          foreignField: "_id",
          as: "manufacturerVehicleInfo",
        },
      },
      {
        $unwind: "$manufacturerVehicleInfo",
      },
      {
        $lookup: {
          from: "manufacturers",
          localField: "manufacturerVehicleInfo.manufacturer",
          foreignField: "_id",
          as: "manufacturerInfo",
        },
      },
      {
        $unwind: "$manufacturerInfo",
      },
      {
        $lookup: {
          from: "models",
          localField: "manufacturerVehicleInfo.model",
          foreignField: "_id",
          as: "modelInfo",
        },
      },
      {
        $unwind: "$modelInfo",
      },
      {
        $lookup: {
          from: "brands",
          localField: "modelInfo.brand",
          foreignField: "_id",
          as: "brandInfo",
        },
      },
      {
        $unwind: "$brandInfo",
      },
      {
        $addFields: {
          formattedCreatedAt: {
            $dateToString: {
              date: "$createdAt",
              format: "%m/%d/%Y",
            },
          },
          formattedUpdatedAt: {
            $dateToString: {
              date: "$updatedAt",
              format: "%m/%d/%Y",
            },
          },
        },
      },
      {
        $unset: ["createdAt", "updatedAt"],
      },
      {
        $addFields: {
          createdAt: "$formattedCreatedAt",
          updatedAt: "$formattedUpdatedAt",
        },
      },
      {
        $project: {
          formattedCreatedAt: 0,
          formattedUpdatedAt: 0,
        },
      },
      {
        $match: {
          "manufacturerVehicleInfo.vin": {
            $regex: new RegExp(searchQuery, "i"),
          },
        },
      },
    ]);

    res.status(200).json(dealerVehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//by models
// const getDealerVehiclesByModel = async (req, res) => {
//   try {
//     const modelId = req.params.modelId;
//     const page = parseInt(req.query.page) || 1; // Current page number
//     const limit = parseInt(req.query.limit) || 10; // Number of items per page

//     // Query the total count of models for the provided brandId
//     const totalModelsCount = await CarDb.DealerVehicle.countDocuments({
//       vehicleModel: modelId,
//     });

//     const skip = (page - 1) * limit; // Calculate the offset

//     // Query models based on the provided brandId with pagination
//     const models = await CarDb.DealerVehicle.find({ vehicleModel: modelId })
//       .populate({
//         path: "vehicleModel",
//         populate: { path: "brand" },
//       })
//       .populate("dealer")
//       .limit(limit)
//       .skip(skip);

//     const totalPages = Math.ceil(totalModelsCount / limit); // Calculate total pages
//     console.log(`totalPages: ${totalPages}`);

//     res.json({
//       models,
//       currentPage: page,
//       totalPages: totalPages, // Include total pages in the response
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

//getDealerVehiclesByModelv2
const getDealerVehiclesByModel = async (req, res) => {
  const modelId = req.params.modelId;
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 10; // Number of items per page
  const priceFilter = parseInt(req.query.price);

  try {
    const filter = {
      "modelInfo._id": new mongoose.Types.ObjectId(modelId),
    };

    if (!isNaN(priceFilter)) {
      filter.price = { $lte: priceFilter };
    }

    const result = await CarDb.DealerVehicle.aggregate([
      {
        $lookup: {
          from: "dealers",
          localField: "dealer",
          foreignField: "_id",
          as: "dealerInfo",
        },
      },
      {
        $unwind: "$dealerInfo",
      },
      {
        $lookup: {
          from: "manufacturervehicles",
          localField: "manufacturerVehicle",
          foreignField: "_id",
          as: "manufacturerVehicleInfo",
        },
      },
      {
        $unwind: "$manufacturerVehicleInfo",
      },
      {
        $lookup: {
          from: "models",
          localField: "manufacturerVehicleInfo.model",
          foreignField: "_id",
          as: "modelInfo",
        },
      },
      {
        $unwind: "$modelInfo",
      },
      {
        $lookup: {
          from: "brands",
          localField: "modelInfo.brand",
          foreignField: "_id",
          as: "brandInfo",
        },
      },
      {
        $unwind: "$brandInfo",
      },
      {
        $match: filter,
      },
      {
        $facet: {
          paginatedResults: [
            {
              $skip: (page - 1) * limit,
            },
            {
              $limit: limit,
            },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    const dealerVehicles = result[0].paginatedResults;
    const totalModelsCount =
      result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;

    const totalPages = Math.ceil(totalModelsCount / limit);

    res.json({
      dealerVehicles,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//by vehicles by dealer id
const getDealerVehiclesByDealerId = async (req, res) => {
  const dealerId = req.params.dealerId;
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 10; // Number of items per page

  try {
    const result = await CarDb.DealerVehicle.aggregate([
      {
        $lookup: {
          from: "dealers",
          localField: "dealer",
          foreignField: "_id",
          as: "dealerInfo",
        },
      },
      {
        $unwind: "$dealerInfo",
      },
      {
        $lookup: {
          from: "manufacturervehicles",
          localField: "manufacturerVehicle",
          foreignField: "_id",
          as: "manufacturerVehicleInfo",
        },
      },
      {
        $unwind: "$manufacturerVehicleInfo",
      },
      {
        $lookup: {
          from: "models",
          localField: "manufacturerVehicleInfo.model",
          foreignField: "_id",
          as: "modelInfo",
        },
      },
      {
        $unwind: "$modelInfo",
      },
      {
        $lookup: {
          from: "brands",
          localField: "modelInfo.brand",
          foreignField: "_id",
          as: "brandInfo",
        },
      },
      {
        $unwind: "$brandInfo",
      },
      {
        $match: {
          "dealerInfo._id": new mongoose.Types.ObjectId(dealerId),
        },
      },
      {
        $facet: {
          paginatedResults: [
            {
              $skip: (page - 1) * limit,
            },
            {
              $limit: limit,
            },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    const dealerVehicles = result[0].paginatedResults;

    if (!dealerVehicles || dealerVehicles.length === 0) {
      return res
        .status(404)
        .json({ message: "No dealer vehicles found for this model." });
    }

    const totalModelsCount =
      result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;
    const totalPages = Math.ceil(totalModelsCount / limit);

    res.json({
      dealerVehicles,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get dealervehiclebybrandid
const dealerVehiclesByBrandId = async (req, res) => {
  const brandId = req.params.brandId;
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 10; // Number of items per page

  try {
    const result = await CarDb.DealerVehicle.aggregate([
      {
        $lookup: {
          from: "dealers",
          localField: "dealer",
          foreignField: "_id",
          as: "dealerInfo",
        },
      },
      {
        $unwind: "$dealerInfo",
      },
      {
        $lookup: {
          from: "manufacturervehicles",
          localField: "manufacturerVehicle",
          foreignField: "_id",
          as: "manufacturerVehicleInfo",
        },
      },
      {
        $unwind: "$manufacturerVehicleInfo",
      },
      {
        $lookup: {
          from: "models",
          localField: "manufacturerVehicleInfo.model",
          foreignField: "_id",
          as: "modelInfo",
        },
      },
      {
        $unwind: "$modelInfo",
      },
      {
        $lookup: {
          from: "brands",
          localField: "modelInfo.brand",
          foreignField: "_id",
          as: "brandInfo",
        },
      },
      {
        $unwind: "$brandInfo",
      },
      {
        $match: {
          "brandInfo._id": new mongoose.Types.ObjectId(brandId),
        },
      },
      {
        $facet: {
          paginatedResults: [
            {
              $skip: (page - 1) * limit,
            },
            {
              $limit: limit,
            },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    const dealerVehicles = result[0].paginatedResults;

    if (!dealerVehicles || dealerVehicles.length === 0) {
      return res
        .status(404)
        .json({ message: "No dealer vehicles found for this model." });
    }

    const totalModelsCount =
      result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;
    const totalPages = Math.ceil(totalModelsCount / limit);

    res.json({
      dealerVehicles,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all dealer pagination
const getAllDealerVehiclesPagination = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 10; // Number of items per page
  const styleFilter = req.query.style;

  console.log(styleFilter);

  try {
    const pipeline = [
      {
        $lookup: {
          from: "dealers",
          localField: "dealer",
          foreignField: "_id",
          as: "dealerInfo",
        },
      },
      {
        $unwind: "$dealerInfo",
      },
      {
        $lookup: {
          from: "manufacturervehicles",
          localField: "manufacturerVehicle",
          foreignField: "_id",
          as: "manufacturerVehicleInfo",
        },
      },
      {
        $unwind: "$manufacturerVehicleInfo",
      },
      {
        $lookup: {
          from: "models",
          localField: "manufacturerVehicleInfo.model",
          foreignField: "_id",
          as: "modelInfo",
        },
      },
      {
        $unwind: "$modelInfo",
      },
      {
        $lookup: {
          from: "brands",
          localField: "modelInfo.brand",
          foreignField: "_id",
          as: "brandInfo",
        },
      },
      {
        $unwind: "$brandInfo",
      },
      // Check if styleFilter is provided and add $match stage accordingly
      ...(styleFilter
        ? [
            {
              $match: {
                "modelInfo.style": styleFilter,
              },
            },
          ]
        : []),
      {
        $facet: {
          paginatedResults: [
            {
              $skip: (page - 1) * limit,
            },
            {
              $limit: limit,
            },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ];

    const result = await CarDb.DealerVehicle.aggregate(pipeline);

    const dealerVehicles = result[0].paginatedResults;

    if (!dealerVehicles || dealerVehicles.length === 0) {
      return res
        .status(404)
        .json({ message: "No dealer vehicles found for this model." });
    }

    const totalModelsCount =
      result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;
    const totalPages = Math.ceil(totalModelsCount / limit);

    res.json({
      dealerVehicles,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





// fetch sales
const getSalesByDealers = async (req, res) => {
  try {
    const dealerId = req.params.dealerId;

    const sales = await CarDb.Sale.aggregate([
      {
        $lookup: {
          from: "dealervehicles", // Update this with your collection name
          localField: "dealerVehicle",
          foreignField: "_id",
          as: "dealerVehicleInfo",
        },
      },
      {
        $unwind: "$dealerVehicleInfo",
      },
      {
        $lookup: {
          from: "dealers", // Update this with your collection name
          localField: "dealerVehicleInfo.dealer",
          foreignField: "_id",
          as: "dealerInfo",
        },
      },
      {
        $unwind: "$dealerInfo", // In case it's an array after lookup
      },
      {
        $lookup: {
          from: "manufacturervehicles", // Update this with your collection name
          localField: "dealerVehicleInfo.manufacturerVehicle",
          foreignField: "_id",
          as: "manufacturerVehicleInfo",
        },
      },
      {
        $unwind: "$manufacturerVehicleInfo", // In case it's an array after lookup
      },
      {
        $lookup: {
          from: "models", // Update this with your customer collection name
          localField: "manufacturerVehicleInfo.model",
          foreignField: "_id",
          as: "modelInfo",
        },
      },
      {
        $unwind: "$modelInfo", // In case it's an array after lookup
      },
      {
        $lookup: {
          from: "brands", // Update this with your customer collection name
          localField: "modelInfo.brand",
          foreignField: "_id",
          as: "brandInfo",
        },
      },
      {
        $unwind: "$brandInfo", // In case it's an array after lookup
      },
      {
        $lookup: {
          from: "customers", // Update this with your customer collection name
          localField: "customer",
          foreignField: "_id",
          as: "customerInfo",
        },
      },
      {
        $unwind: "$customerInfo", // In case it's an array after lookup
      },
      {
        $addFields: {
          formattedCreatedAt: {
            $dateToString: {
              date: "$createdAt",
              format: "%m/%d/%Y", // Month Day, Year format
            },
          },
          formattedUpdatedAt: {
            $dateToString: {
              date: "$updatedAt",
              format: "%m/%d/%Y", // Month Day, Year format
            },
          },
        },
      },
      {
        $unset: ["createdAt", "updatedAt"], // Remove original fields
      },
      {
        $addFields: {
          createdAt: "$formattedCreatedAt", // Reassign formatted fields
          updatedAt: "$formattedUpdatedAt",
        },
      },

      {
        $project: {
          formattedCreatedAt: 0, // Remove intermediate fields
          formattedUpdatedAt: 0,
        },
      },
      {
        $match: {
          "dealerInfo._id": new mongoose.Types.ObjectId(dealerId),
        },
      },
    ]);

    console.log(sales); // This might log an empty array if no results are found
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: error.message });
  }
};

const getSales = async (req, res) => {
  try {
    const sales = await CarDb.Sale.aggregate([
      {
        $lookup: {
          from: "dealervehicles", // Update this with your collection name
          localField: "dealerVehicle",
          foreignField: "_id",
          as: "dealerVehicleInfo",
        },
      },
      {
        $unwind: "$dealerVehicleInfo", // In case it's an array after lookup
      },
      {
        $lookup: {
          from: "dealers", // Update this with your collection name
          localField: "dealerVehicleInfo.dealer",
          foreignField: "_id",
          as: "dealerInfo",
        },
      },
      {
        $unwind: "$dealerInfo", // In case it's an array after lookup
      },
      {
        $lookup: {
          from: "manufacturervehicles", // Update this with your collection name
          localField: "dealerVehicleInfo.manufacturerVehicle",
          foreignField: "_id",
          as: "manufacturerVehicleInfo",
        },
      },
      {
        $unwind: "$manufacturerVehicleInfo", // In case it's an array after lookup
      },
      {
        $lookup: {
          from: "models", // Update this with your collection name
          localField: "manufacturerVehicleInfo.model",
          foreignField: "_id",
          as: "modelInfo",
        },
      },
      {
        $unwind: "$modelInfo", // In case it's an array after lookup
      },
      {
        $lookup: {
          from: "brands", // Update this with your customer collection name
          localField: "modelInfo.brand",
          foreignField: "_id",
          as: "brandInfo",
        },
      },
      {
        $unwind: "$brandInfo", // In case it's an array after lookup
      },
      {
        $lookup: {
          from: "customers", // Update this with your customer collection name
          localField: "customer",
          foreignField: "_id",
          as: "customerInfo",
        },
      },
      {
        $unwind: "$customerInfo", // In case it's an array after lookup
      },
      {
        $addFields: {
          formattedCreatedAt: {
            $dateToString: {
              date: "$createdAt",
              format: "%m/%d/%Y", // Month Day, Year format
            },
          },
          formattedUpdatedAt: {
            $dateToString: {
              date: "$updatedAt",
              format: "%m/%d/%Y", // Month Day, Year format
            },
          },
        },
      },
      {
        $unset: ["createdAt", "updatedAt"], // Remove original fields
      },
      {
        $addFields: {
          createdAt: "$formattedCreatedAt", // Reassign formatted fields
          updatedAt: "$formattedUpdatedAt",
        },
      },

      {
        $project: {
          formattedCreatedAt: 0, // Remove intermediate fields
          formattedUpdatedAt: 0,
        },
      },
    ]);
    console.log(sales);
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getVin = async (req, res) => {
  try {
    const searchQuery = req.query.query; // Assuming the VIN is passed as a query parameter

    const sales = await CarDb.Sale.aggregate([
      {
        $lookup: {
          from: "dealervehicles",
          localField: "dealerVehicle",
          foreignField: "_id",
          as: "dealerVehicleInfo",
        },
      },
      {
        $unwind: "$dealerVehicleInfo",
      },
      {
        $lookup: {
          from: "dealers",
          localField: "dealerVehicleInfo.dealer",
          foreignField: "_id",
          as: "dealerInfo",
        },
      },
      {
        $unwind: "$dealerInfo",
      },
      {
        $lookup: {
          from: "manufacturervehicles",
          localField: "dealerVehicleInfo.manufacturerVehicle",
          foreignField: "_id",
          as: "manufacturerVehicleInfo",
        },
      },
      {
        $unwind: "$manufacturerVehicleInfo",
      },
      {
        $lookup: {
          from: "manufacturers",
          localField: "manufacturerVehicleInfo.manufacturer",
          foreignField: "_id",
          as: "manufacturerInfo",
        },
      },
      {
        $unwind: "$manufacturerInfo",
      },
      {
        $lookup: {
          from: "models",
          localField: "manufacturerVehicleInfo.model",
          foreignField: "_id",
          as: "modelInfo",
        },
      },
      {
        $unwind: "$modelInfo",
      },
      {
        $lookup: {
          from: "brands",
          localField: "modelInfo.brand",
          foreignField: "_id",
          as: "brandInfo",
        },
      },
      {
        $unwind: "$brandInfo",
      },
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customerInfo",
        },
      },
      {
        $unwind: "$customerInfo",
      },
      {
        $addFields: {
          formattedCreatedAt: {
            $dateToString: {
              date: "$createdAt",
              format: "%m/%d/%Y",
            },
          },
          formattedUpdatedAt: {
            $dateToString: {
              date: "$updatedAt",
              format: "%m/%d/%Y",
            },
          },
        },
      },
      {
        $unset: ["createdAt", "updatedAt"],
      },
      {
        $addFields: {
          createdAt: "$formattedCreatedAt",
          updatedAt: "$formattedUpdatedAt",
        },
      },
      {
        $project: {
          formattedCreatedAt: 0,
          formattedUpdatedAt: 0,
        },
      },
      // Adding a match stage to filter based on VIN
      {
        $match: {
          "manufacturerVehicleInfo.vin": {
            $regex: new RegExp(searchQuery, "i"),
          },
        },
      },
    ]);

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getTopBrandsBySales = async (req, res) => {
  try {
    const pastYearStartDate = new Date();
    pastYearStartDate.setFullYear(pastYearStartDate.getFullYear() - 1);

    const topBrands = await CarDb.Sale.aggregate([
      {
        $match: {
          createdAt: { $lte: pastYearStartDate }, // Match sales in the past year
        },
      },
      {
        $lookup: {
          from: "dealervehicles", // Update this with your collection name
          localField: "dealerVehicle",
          foreignField: "_id",
          as: "dealerVehicle",
        },
      },
      {
        $unwind: "$dealerVehicle", // In case it's an array after lookup
      },
      {
        // lookup is like outer left join
        $lookup: {
          from: "dealers", // Update this with your collection name
          localField: "dealerVehicle.dealer", // feild being reference
          foreignField: "_id", // how are they being reference, in this case using object id
          as: "dealer", // alias
        },
      },
      {
        $unwind: "$dealer", // In case it's an array after lookup
      },
      {
        $lookup: {
          from: "models", // Update this with your customer collection name
          localField: "dealerVehicle.vehicleModel",
          foreignField: "_id",
          as: "model",
        },
      },
      {
        $unwind: "$model", // In case it's an array after lookup
      },
      {
        $lookup: {
          from: "brands", // Update this with your customer collection name or table in your database
          localField: "model.brand",
          foreignField: "_id",
          as: "brand",
        },
      },
      {
        $unwind: "$brand", // In case it's an array after lookup
      },
      {
        $lookup: {
          from: "manufacturers", // Update this with your collection name
          localField: "brand.manufacturer",
          foreignField: "_id",
          as: "manufacturer",
        },
      },
      {
        $unwind: "$manufacturer", // In case it's an array after lookup
      },
      // {
      //   $lookup: {
      //     from: "brands", // Update this with your customer collection name
      //     localField: "vehicleModel.brand",
      //     foreignField: "_id",
      //     as: "brand",
      //   },
      // },
      // {
      //   $unwind: "$brand", // In case it's an array after lookup
      // },
      {
        $group: {
          _id: "$brand.brandName",
          totalSalesAmount: { $sum: 1 }, // Calculate total sales amount for each brand
          modelsSold: { $addToSet: "$model.modelName" },
          manufacturer: {
            $addToSet: "$manufacturer.manufacturerName",
          },
        },
      },
      {
        $sort: { totalSalesAmount: -1 }, // Sort by total sales amount in descending order
      },
      {
        $limit: 3, // Limit to top 2 brands
      },
    ]);

    res.status(200).json(topBrands);
  } catch (error) {
    console.error("Error fetching top brands:", error);
    res.status(500).json({ message: error.message });
  }
};

const getTopBrandsBySalesTotalAmount = async (req, res) => {
  try {
    const pastYearStartDate = new Date();
    pastYearStartDate.setFullYear(pastYearStartDate.getFullYear() - 1);

    const topBrands = await CarDb.Sale.aggregate([
      {
        $match: {
          createdAt: { $lte: pastYearStartDate }, // Match sales in the past year
        },
      },
      {
        $lookup: {
          from: "dealervehicles",
          localField: "dealerVehicle",
          foreignField: "_id",
          as: "dealerVehicleInfo",
        },
      },
      {
        $unwind: "$dealerVehicleInfo",
      },
      {
        $lookup: {
          from: "dealers",
          localField: "dealerVehicleInfo.dealer",
          foreignField: "_id",
          as: "dealerInfo",
        },
      },
      {
        $unwind: "$dealerInfo",
      },
      {
        $lookup: {
          from: "manufacturervehicles",
          localField: "dealerVehicleInfo.manufacturerVehicle",
          foreignField: "_id",
          as: "manufacturerVehicleInfo",
        },
      },
      {
        $unwind: "$manufacturerVehicleInfo",
      },
      {
        $lookup: {
          from: "manufacturers",
          localField: "manufacturerVehicleInfo.manufacturer",
          foreignField: "_id",
          as: "manufacturerInfo",
        },
      },
      {
        $unwind: "$manufacturerInfo",
      },
      {
        $lookup: {
          from: "models",
          localField: "manufacturerVehicleInfo.model",
          foreignField: "_id",
          as: "modelInfo",
        },
      },
      {
        $unwind: "$modelInfo",
      },
      {
        $lookup: {
          from: "brands",
          localField: "modelInfo.brand",
          foreignField: "_id",
          as: "brandInfo",
        },
      },
      {
        $unwind: "$brandInfo",
      },
      {
        $group: {
          _id: "$brandInfo.brandName", // Group by brand name
          totalSalesAmount: { $sum: "$dealerVehicleInfo.price" }, // Calculate total sales amount for each brand
        },
      },
      {
        $sort: { totalSalesAmount: -1 }, // Sort by total sales amount in descending order
      },
      {
        $limit: 2, // Limit to top 3 brands
      },
    ]);

    res.status(200).json(topBrands);
  } catch (error) {
    console.error("Error fetching top brands:", error);
    res.status(500).json({ message: error.message });
  }
};

const getSalesThreeYearsPast = async (req, res) => {
  try {
    const pastYearStartDate = new Date();
    pastYearStartDate.setFullYear(pastYearStartDate.getFullYear() - 3);

    const topBrands = await CarDb.Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: pastYearStartDate }, // Match sales from three years ago
        },
      },
      {
        $lookup: {
          from: "dealervehicles",
          localField: "dealerVehicle",
          foreignField: "_id",
          as: "dealerVehicleInfo",
        },
      },
      {
        $unwind: "$dealerVehicleInfo",
      },
      {
        $lookup: {
          from: "dealers",
          localField: "dealerVehicleInfo.dealer",
          foreignField: "_id",
          as: "dealerInfo",
        },
      },
      {
        $unwind: "$dealerInfo",
      },
      {
        $lookup: {
          from: "manufacturervehicles",
          localField: "dealerVehicleInfo.manufacturerVehicle",
          foreignField: "_id",
          as: "manufacturerVehicleInfo",
        },
      },
      {
        $unwind: "$manufacturerVehicleInfo",
      },
      {
        $lookup: {
          from: "manufacturers",
          localField: "manufacturerVehicleInfo.manufacturer",
          foreignField: "_id",
          as: "manufacturerInfo",
        },
      },
      {
        $unwind: "$manufacturerInfo",
      },
      {
        $lookup: {
          from: "models",
          localField: "manufacturerVehicleInfo.model",
          foreignField: "_id",
          as: "modelInfo",
        },
      },
      {
        $unwind: "$modelInfo",
      },
      {
        $lookup: {
          from: "brands",
          localField: "modelInfo.brand",
          foreignField: "_id",
          as: "brandInfo",
        },
      },
      {
        $unwind: "$brandInfo",
      },
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customerInfo",
        },
      },
      {
        $unwind: "$customerInfo",
      },
      {
        $addFields: {
          formattedCreatedAt: {
            $dateToString: { date: "$createdAt", format: "%m/%d/%Y" },
          },
          formattedUpdatedAt: {
            $dateToString: { date: "$updatedAt", format: "%m/%d/%Y" },
          },
        },
      },
      {
        $unset: ["createdAt", "updatedAt"],
      },
      {
        $addFields: {
          createdAt: "$formattedCreatedAt",
          updatedAt: "$formattedUpdatedAt",
        },
      },
      {
        $project: {
          formattedCreatedAt: 0,
          formattedUpdatedAt: 0,
        },
      },
      {
        $sort: { "dealerVehicleInfo.price": -1 },
      }, // Sort by total sales amount in descending order
    ]);
    res.status(200).json(topBrands);
  } catch (error) {
    console.error("Error fetching sales from three years ago:", error);
    res.status(500).json({ message: error.message });
  }
};

// update code

const updateManufacturer = async (req, res) => {
  try {
    const { id } = req.params;
    const manufacturer = await CarDb.Manufacturer.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!manufacturer) {
      res.status(401).json({ message: `no manufacturer with id:${id} found` });
    } else {
      res.status(200).json(manufacturer);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//search for manufacturer vehicle by vin
// const getManufacturerVehicleByVin = async(req,res) {

// }

const getDealerVehicleByPrice = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 10; // Number of items per page
  // const priceFilter = parseInt(req.query.query);
  const minPrice = parseInt(req.query.minPrice) || 0; // Minimum price (default to 0 if not provided)
  const maxPrice = parseInt(req.query.maxPrice) || Number.MAX_SAFE_INTEGER; // Maximum price (default to max safe integer if not provided)

  // console.log(priceFilter);
  try {
    const result = await CarDb.DealerVehicle.aggregate([
      {
        $lookup: {
          from: "dealers",
          localField: "dealer",
          foreignField: "_id",
          as: "dealerInfo",
        },
      },
      {
        $unwind: "$dealerInfo",
      },
      {
        $lookup: {
          from: "manufacturervehicles",
          localField: "manufacturerVehicle",
          foreignField: "_id",
          as: "manufacturerVehicleInfo",
        },
      },
      {
        $unwind: "$manufacturerVehicleInfo",
      },
      {
        $lookup: {
          from: "models",
          localField: "manufacturerVehicleInfo.model",
          foreignField: "_id",
          as: "modelInfo",
        },
      },
      {
        $unwind: "$modelInfo",
      },
      {
        $lookup: {
          from: "brands",
          localField: "modelInfo.brand",
          foreignField: "_id",
          as: "brandInfo",
        },
      },
      {
        $unwind: "$brandInfo",
      },
      {
        $match: {
          price: { $gte: minPrice, $lte: maxPrice },
        },
      },
      {
        $facet: {
          paginatedResults: [
            {
              $skip: (page - 1) * limit,
            },
            {
              $limit: limit,
            },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    const dealerVehicles = result[0].paginatedResults;
    const totalModelsCount =
      result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;

    const totalPages = Math.ceil(totalModelsCount / limit);

    res.json({
      dealerVehicles,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  //create
  createManufacturer,
  createBrand,
  createOption,
  createModel,
  createManufacturerVehicle,
  createDealer,
  createDealerVehicle,
  createCustomer,
  createSale,
  // fetch
  getBrand,
  getModel,
  getManufacturerVehicle,
  getDealer,
  getCustomer,
  getDealerVehicle,
  getSales,
  getTopBrandsBySales,
  getTopBrandsBySalesTotalAmount,
  // newaddedurl
  getModelByBrand,
  getDealerVehiclesByModel,
  getDealerVehiclesByDealerId,
  getSalesByDealers,
  getVin,
  getSalesThreeYearsPast,
  dealerVehiclesByBrandId,
  getAllDealerVehiclesPagination,
  // update
  updateManufacturer,
  getDealerVehicleByPrice
};
