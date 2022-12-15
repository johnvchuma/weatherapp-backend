const { ObjectId } = require("mongodb");
const { getDb } = require("../../mongodb");
let db;

const answerQuestion = (req, res) => {
  db = getDb();
  const { answer, userId, questionId } = req.body;
  db.collection("answers")
    .insertOne({ answer, userId, questionId, correctAnswer: "" })
    .then((answer) => {
      let answers = [];
      let usersId = [];
      let users = [];
      db.collection("answers")
        .find({ questionId })
        .forEach((answer) => {
          usersId.push(ObjectId(answer.userId));
          answers.push(answer);
        })
        .then(() => {
          if (answers.length == 2) {
            db.collection("users")
              .find({ _id: { $in: usersId } })
              .forEach((user) => users.push(user))
              .then(() => {
                let joined = [];
                answers.forEach((answer) => {
                  users.forEach((user) => {
                    if (answer.userId == user._id) {
                      joined.push({ answer, user });
                    }
                  });
                });

                res.status(200).json({
                  completed: true,
                  answers: joined
                });
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

const updateAnswer = (req, res) => {
  db = getDb();
  const answerId = req.params.answerId;
  const { correctAnswer } = req.body;
  db.collection("answers")
    .updateOne({ _id: ObjectId(answerId) }, { $set: { correctAnswer } })
    .then((result) => {
      res.status(200).json(result);
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
  answerQuestion,
  updateAnswer
};
