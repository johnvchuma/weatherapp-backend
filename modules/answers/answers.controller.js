const { ObjectId } = require("mongodb");
const { getDb } = require("../../mongodb");
let db;

const answerQuestion = (req, res) => {
  db = getDb();
  const { answer, userId, questionId } = req.body;
  db.collection("answers")
    .insertOne({ answer, userId, questionId })
    .then((answer) => {
      let answers = [];

      db.collection("answers")
        .find({ questionId })
        .forEach((answer) => answers.push(answer))
        .then(() => {
          if (answers.length == 2) {
            res.status(200).json({
              completed: true,
              answers: answers
            });
          } else {
            res.status(200).json({ completed: false, answer });
          }
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        status: false,
        message: "Internal server error"
      });
    });
};

module.exports = {
  answerQuestion
};
