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

app.use(cors());

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

app.get("/api/recommend-courier", (req, res) => {
  const { size, destination, speed, budget } = req.query;
  if (!size || !destination || !speed || !budget) {
    return res.status(400).json({ error: "Required parameters are missing." });
  }

  let recommendation;
  if (
    size < 30 &&
    speed === "standard" &&
    budget === "$" &&
    destination === "domestic"
  ) {
    recommendation = {
      courier: courierRecommendations["small"],
      speed: "Standard",
      cost: "$",
      services: ["Tracking"],
    };
  } else if (
    size < 60 &&
    speed === "express" &&
    budget === "$$" &&
    destination === "international"
  ) {
    recommendation = {
      courier: courierRecommendations["medium"],
      speed: "Express",
      cost: "$$",
      services: ["Tracking", "Insurance"],
    };
  } else {
    recommendation = {
      courier: courierRecommendations["large"],
      speed: "Express",
      cost: "$$$",
      services: ["Tracking", "Insurance", "Same-day Delivery"],
    };
  }

  res.json({ recommendation });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
