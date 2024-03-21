const express = require("express");
const router = express.Router();
const getServices = require("../controllers/recommend.controllers");

router.get("/api/orders", getServices);

modules.export = router;
