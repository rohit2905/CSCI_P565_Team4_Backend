// const express = require("express");
// const { MongoClient, ObjectID } = require("mongodb");
// const cors = require("cors");
// const app = express();
// const PORT = process.env.PORT || 3000;
// const mongoURL = "mongodb+srv://root:root1234@deliverwise.ycjpjzr.mongodb.net/";

// app.use(cors());

// // Connect to MongoDB
// MongoClient.connect(mongoURL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then((client) => {
//     console.log("Connected to MongoDB");
//     const db = client.db();

//     app.get("/users", (req, res) => {
//       const { email } = req.query;

//       // Find the user by email
//       db.collection("users")
//         .findOne({ email })
//         .then((user) => {
//           if (!user) {
//             res.status(404).json({ error: "User not found" });
//           } else {
//             res.json(user);
//           }
//         })
//         .catch((error) => {
//           console.error("Error searching user:", error);
//           res.status(500).json({ error: "Internal server error" });
//         });
//     });

//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Error connecting to MongoDB:", error);
//   });

const express = require("express");
const { MongoClient, ObjectID } = require("mongodb");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
const mongoURL = "mongodb+srv://root:root1234@deliverwise.ycjpjzr.mongodb.net/";
const orderRoutes = require("./routes/Orders.routes");
app.use(cors());

//middleware to parse JSON file
app.use(express.json());

const courierRecommendations = {
  small: "USPS",
  medium: "DHL",
  large: "UPS",
};

// Endpoint to find a user by email
app.get("/users", (req, res) => {
  const { email } = req.query;

  // Connect to MongoDB
  MongoClient.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((client) => {
      console.log("Connected to MongoDB");
      const db = client.db();

      // Find the user by email in the "users" collection
      db.collection("users")
        .findOne({ email })
        .then((user) => {
          if (!user) {
            res.status(404).json({ error: "User not found" });
          } else {
            res.json(user);
          }
        })
        .catch((error) => {
          console.error("Error searching user:", error);
          res.status(500).json({ error: "Internal server error" });
        });
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

app.get("/services", (req, res) => {
  const { searchField } = req.query;
  MongoClient.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((client) => {
      console.log("Connected to MongoDB");
      const db = client.db();

      db.collection("services")
        .find({ ServiceId: searchField })
        .then((services) => {
          if (services.length === 0) {
            res.status(404).json({ error: "Service not found" });
          } else {
            res.json(services);
          }
        })
        .catch((error) => {
          console.error("Error fetching services:", error);
          res.status(500).json({ error: "Internal server error" });
        });
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
