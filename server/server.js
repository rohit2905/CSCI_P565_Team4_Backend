// const express = require("express");
// const mongoose = require("mongoose");
// const Customer = require("./routes/customerRoutes");
// const app = express();

// // Connect to MongoDB
// mongoose
//   .connect(
//     "mongodb+srv://root-learn:root12345@kirthi-cluster.lrfcvon.mongodb.net/mernapp",
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Error connecting to MongoDB:", err));

// // Define routes
// app.use("/api/customers", require("./routes/customerRoutes"));

// app.post("/api/customers", async (req, res) => {
//   try {
//     // Extract customer data from request body
//     const { name, email, phoneNumber, customerId } = req.body;

//     // Create a new instance of Customer model
//     const newCustomer = new Customer({
//       name,
//       email,
//       phoneNumber,
//       customerId,
//     });

//     // Save the new customer to the database
//     await newCustomer.save();

//     // Send success response to the client
//     res.status(201).json({ message: "Customer data saved successfully" });
//   } catch (error) {
//     // Handle any errors that occur during database operation
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const { MongoClient, ObjectID } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;
const mongoURL = "mongodb+srv://root:root1234@deliverwise.ycjpjzr.mongodb.net/";

// Connect to MongoDB
MongoClient.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    console.log("Connected to MongoDB");
    const db = client.db();

    // Define routes
    app.get("/users", (req, res) => {
      db.collection("users")
        .find()
        .toArray()
        .then((result) => {
          res.json(result);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          res.status(500).json({ error: "Internal server error" });
        });
    });

    app.get("/users/search", (req, res) => {
      const { username, email } = req.query; // Get the name and email query parameters

      // Construct the filter based on the provided search criteria
      const filter = {};

      if (name) {
        filter.username = username;
      }

      if (email) {
        filter.email = email;
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
