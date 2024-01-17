const express = require("express");
const CarController = require("../controller/carController");
const auth = require("../middlewares/auth");

const router = express.Router();

// post or create route
router.post("/manufacturer", CarController.createManufacturer);
router.post("/brand", CarController.createBrand);
router.post("/option", CarController.createOption);
router.post("/model", CarController.createModel);
router.post("/manufacturerVehicle", CarController.createManufacturerVehicle);
router.post("/dealer", CarController.createDealer);
router.post("/dealerVehicle", CarController.createDealerVehicle);
router.post("/customer", CarController.createCustomer);
router.post("/sale", CarController.createSale);

// get or fetch route
router.get("/brand", CarController.getBrand);
router.get("/model", CarController.getModel);
router.get("/model/:brandId", CarController.getModelByBrand);
router.get("/manufacturerVehicle", CarController.getManufacturerVehicle);
router.get("/dealer", CarController.getDealer);
router.get("/customer", CarController.getCustomer);
router.get("/dealerVehicle/:modelId", CarController.getDealerVehiclesByModel);
router.get("/dealerVehicle-brand/:brandId", CarController.dealerVehiclesByBrandId);
router.get("/dealerVehicle-pagination", CarController.getAllDealerVehiclesPagination);
router.get("/get-dealer-vehicle-price-search", CarController.getDealerVehicleByPrice);
router.get(
  "/dealerVehicles/:dealerId",
  CarController.getDealerVehiclesByDealerId
);
router.get("/dealerVehicle", CarController.getDealerVehicle);
router.get("/sales", CarController.getSales);
router.get("/sales-by-vin", CarController.getVin);
router.get("/salesByDealer/:dealerId", CarController.getSalesByDealers);
router.get("/topBrandsBySales", CarController.getTopBrandsBySales);
router.get("/sales-past-three-years", CarController.getSalesThreeYearsPast);
router.get("/top-brand-sales", CarController.getTopBrandsBySalesTotalAmount);


// update routes
router.put("/update-manufacturer/:id", CarController.updateManufacturer);

module.exports = router;


