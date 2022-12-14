const { getDb } = require("../../mongodb");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

let db;
const login = (req, res) => {
  db = getDb();
  const { email, phone, password } = req.body;
  db.collection("users")
    .findOne({ $or: [{ email }, { phone }] })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password).then((value) => {
          if (value) {
            res.status(200).json(user);
          } else {
            res.status(403).json({
              status: false,
              message: "Wrong password"
            });
          }
        });
      } else {
        res.status(404).send({
          status: false,
          message: "User is not registered"
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        status: false,
        message: "Internal server error"
      });
    });
};

const register = (req, res) => {
  db = getDb();
  const { email, password, phone } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  db.collection("users")
    .findOne({ $or: [{ email }, { phone }] })
    .then((user) => {
      if (!user) {
        db.collection("users")
          .insertOne({ phone, email, password: hashedPassword })
          .then((result) => {
            db.collection("users")
              .findOne({ _id: ObjectId(result.insertedId) })
              .then((user) => {
                res.status(200).json(user);
              });
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      } else {
        res.status(403).json({
          status: false,
          message: "User already exists"
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        status: false,
        message: "internal server error",
        error
      });
    });
};

module.exports = {
  login,
  register
};
