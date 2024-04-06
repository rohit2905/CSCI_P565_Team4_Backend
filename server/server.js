const express = require("express");
const { MongoClient, ObjectID } = require("mongodb");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const reviewRoutes = require("./routes/review.routes");
app.use(cors());

//middleware to parse JSON file
app.use(express.json());

// to accept the form data in API GUI

app.use(express.urlencoded({ extended: false }));

//routes
app.use("/api/reviews", reviewRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// backend testing
app.get("/", (req, res) => {
  res.send("Backend is working successfully");
});

// connect to mongodb server
mongoose
  .connect("mongodb+srv://root:root1234@deliverwise.ycjpjzr.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(() => {
    console.log("Connection Failed");
  });
