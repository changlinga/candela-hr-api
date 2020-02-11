require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI);

app.get("/", (req, res) => res.send("Candela HR API!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
