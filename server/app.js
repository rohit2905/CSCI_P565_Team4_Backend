// import modules
const express = require('express');
const {json, urlencoded} = express;
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const path = require('path');

const passport = require("passport");
const passportSetup = require("./passport");
const authRoute = require("./routes/auth");

// server
const app = express();

/*

TODO: CRON JOB for hitting the deployment url for every 30 min.
Reason: free verson of Render goes down after sometime of inactivity
*/

app.get('/', (req, res) => {
    res.send('Backend Service for DeliverWise Running');
});

// db
mongoose.connect(process.env.ENV === 'test' ?process.env.MONGO_URI_TEST:process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Database Connectecd...")).catch((err) => console.log("Database Connection Error", err));

// middleware
app.use(morgan("dev"));
app.use(cors({origin: true, credentials: true}));
app.use(json());
app.use("/auth", authRoute);
app.use(urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressValidator());

// routes
const userRoutes = require("./routes/user");
app.use("/", userRoutes);

const chatRoutes = require("./routes/chatRoutes");
app.use("/", chatRoutes);

const messageRoutes = require("./routes/messageRoutes");
app.use("/", messageRoutes);

const serviceRoutes = require("./routes/serviceRoutes");
app.use("/", serviceRoutes);

const authRoutes = require("./routes/auth");
app.use("/", authRoutes)

const reviewRoutes = require("./routes/reviewRoutes");
app.use("/", reviewRoutes)

module.exports = app;
