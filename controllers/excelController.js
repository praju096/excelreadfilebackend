const db = require("../config/db");
const { validationResult } = require("express-validator");

exports.uploadExcelData = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const data = req.body;

  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ message: "No data received" });
  }

  const insertQuery = `
    INSERT INTO employee_data 
    (EEID, Full_Name, Job_Title, Department, Business_Unit, Gender, Ethnicity, Age, Hire_Date, Annual_Salary, Bonus_Percentage, Country, City, Exit_Date)
    VALUES ?
  `;

  const chunkSize = 500;
  const values = data.map((row) => [
    row.EEID || null,
    row.Full_Name || null,
    row.Job_Title || null,
    row.Department || null,
    row.Business_Unit || null,
    row.Gender || null,
    row.Ethnicity || null,
    row.Age || null,
    row.Hire_Date || null,
    row.Annual_Salary || null,
    row.Bonus_Percentage || null,
    row.Country || null,
    row.City || null,
    row.Exit_Date || null,
  ]);

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    for (let i = 0; i < values.length; i += chunkSize) {
      const chunk = values.slice(i, i + chunkSize);
      await connection.query(insertQuery, [chunk]);
    }

    await connection.commit();

    res.json({ message: `${data.length} rows inserted successfully` });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("Insert failed:", err.sqlMessage || err.message);
    res
      .status(500)
      .json({ message: "Insert failed", error: err.sqlMessage || err.message });
  }
};
