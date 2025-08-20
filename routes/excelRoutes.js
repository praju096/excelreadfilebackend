const express = require("express");
const router = express.Router();
const { uploadExcelData } = require("../controllers/excelController");
const { excelValidator } = require("../validators/excelValidator");

router.post("/uploadexcel", excelValidator, uploadExcelData);

module.exports = router;
