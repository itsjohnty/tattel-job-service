const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const app = express();
const port = 8080;

// Database connection configuration
const config = {
  user: "tattel_server_admin",
  password: "Sql@1234",
  server: "tattel-2.database.windows.net",
  port: 1433,
  database: "tattel_2.0",
  options: {
    encrypt: true, // Use encryption (required for Azure SQL)
    trustServerCertificate: false, // Change to true for development only
  },
};

// Connect to the database
sql.connect(config, (err) => {
  if (err) {
    console.log("Error occurred while connecting to the database", err);
  } else {
    console.log("Connected to the database successfully");
  }
});

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

// Endpoint to fetch all jobs from the database
app.get("/fetch-jobs", (req, res) => {
  const query = "SELECT * FROM jobs";

  const request = new sql.Request();
  request.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching jobs:", err);
      res.status(500).json({ error: "Failed to fetch jobs" });
    } else {
      res.json(result.recordset);
    }
  });
});

// Endpoint to insert a new job into the database
app.post("/post-job", (req, res) => {
  const {
    organization_name,
    role,
    stipend,
    experience_years,
    location,
    job_description,
    other_details,
  } = req.body;

  const insertQuery = `
    INSERT INTO jobs (organization_name, role, stipend, experience_years, location, job_description, other_details)
    VALUES (@organization_name, @role, @stipend, @experience_years, @location, @job_description, @other_details)
  `;

  const request = new sql.Request();
  request.input("organization_name", sql.NVarChar, organization_name);
  request.input("role", sql.NVarChar, role);
  request.input("stipend", sql.Decimal, stipend);
  request.input("experience_years", sql.Int, experience_years);
  request.input("location", sql.NVarChar, location);
  request.input("job_description", sql.NVarChar, job_description);
  request.input("other_details", sql.NVarChar, other_details);

  request.query(insertQuery, (err, result) => {
    if (err) {
      console.error("Error inserting job:", err);
      res.status(500).json({ error: "Failed to insert job" });
    } else {
      console.log("Job inserted successfully");
      res.status(201).json({ message: "Job created successfully" });
    }
  });
});

// Endpoint to delete a job by its ID
app.delete("/delete-job/:job_id", (req, res) => {
  const job_id = req.params.job_id;

  const deleteQuery = "DELETE FROM jobs WHERE job_id = @job_id";

  const request = new sql.Request();
  request.input("job_id", sql.Int, job_id);

  request.query(deleteQuery, (err, result) => {
    if (err) {
      console.error("Error deleting job:", err);
      res.status(500).json({ error: "Failed to delete job" });
    } else if (result.rowsAffected[0] === 0) {
      res.status(404).json({ error: "Job not found" });
    } else {
      res.json({ message: "Job deleted successfully" });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
