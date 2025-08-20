const { body }= require("express-validator");

exports.excelValidator = [
  body("*.EEID").notEmpty().withMessage("EEID is required"),
  body("*.Full_Name").notEmpty().withMessage("Full_Name is required"),
  body("*.Department").notEmpty().withMessage("Department is required")
];
