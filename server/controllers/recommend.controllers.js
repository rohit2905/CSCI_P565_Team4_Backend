const getServices = async (req, res) => {
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
};

module.exports = getServices;
