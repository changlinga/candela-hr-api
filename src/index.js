require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const DepartmentService = require("./services/DepartmentService");

// Initialize department
DepartmentService.initialize();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

// routes
app.use("/api", require("./routes"));

app.listen(port, () => console.log(`Listening on port ${port}!`));
