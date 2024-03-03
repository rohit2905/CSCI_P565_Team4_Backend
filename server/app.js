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
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Database Connectecd...")).catch((err) => console.log("Database Connection Error", err));

// middleware
app.use(morgan("dev"));
app.use(cors({origin: true, credentials: true}));
app.use(json());
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

const port = process.env.PORT || 8080;
const server = app.listen(port, () => console.log(`Backend Server is running on port ${port}`));


// for chat app
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.DEPLOY_URL,
    },
  });

/*
TODO: Chats socket connections: kirthivasan pending
*/

/*
TODO: Searching and filtering: kirthivasan and shalini
*/