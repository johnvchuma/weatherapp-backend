const jwt = require("jsonwebtoken");
const { User } = require("../models");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../", ".env") });

module.exports.validateJWT = async (req, res, next) => {
  const headers = req.headers["authorization"];
  const tokens = headers.split(" ")[1];

  if (tokens == null) return res.sendStatus(401);
  jwt.verify(tokens, process.env.ACCESS_TOKEN, (error, user) => {
    if (error) return res.sendStatus(403).send(error);
    req.user = user;
    next();
  });
};
