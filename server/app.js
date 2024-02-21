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

// endpoint fo retriggering render
app.get('/trigger', (req, res) => {
    res.send('Backend Service at render Re-triggered!!!');
}); 

console.log(process.env.MONGO_URI);
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


const port = process.env.PORT || 8080;
const server = app.listen(port, () => console.log(`Backend Server is running on port ${port}`));

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: process.env.REACT_APP_API_URL,
    },
  });

