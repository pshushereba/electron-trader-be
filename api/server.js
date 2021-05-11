require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");

// Routers and Middleware
const authRouter = require("../auth/auth-router.js");
const userRouter = require("../users/users-router.js");

const server = express();

server.use(cors());
server.use(helmet());
server.use(express.json());

server.use("/api/auth", authRouter);
server.use("/api/users", userRouter);

server.get("/", (req, res) => {
  res.send("<h1>Electron Trader</h1>");
});

module.exports = server;