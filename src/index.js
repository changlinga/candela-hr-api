require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { DepartmentService, UserService } = require("./services");

// Initialize department
DepartmentService.initialize();
UserService.initialize();

const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

// routes
app.use("/api", require("./routes"));

app.listen(port, () => console.log(`Listening on port ${port}!`));
