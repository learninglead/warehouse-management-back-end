const { Router } = require("express");
const router = Router();

//import controllers
const {
  createWarehouse,
  getAllWarehouse,
} = require("../controllers/warehouse.controller");
const { authPurchaseHandler } = require("../middlewares/auth.middleware");

router.post("/warehouses", authPurchaseHandler, createWarehouse);
router.get("/warehouses", authPurchaseHandler, getAllWarehouse);

module.exports = router;
