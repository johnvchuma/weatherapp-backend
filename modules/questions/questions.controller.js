const { ObjectId } = require("mongodb");
const { getDb } = require("../../mongodb");

let db;

const getQuestions = (req, res) => {
  db = getDb();
  let questions = [];
  db.collection("questions")
    .find()
    .forEach((question) => questions.push(question))
    .then(() => res.status(200).json(questions))
    .catch((err) => {
      res.status(500).send("Could not find questions");
      console.log(err);
    });
};
const addQuestion = (req, res) => {
  db = getDb();
  const { question } = req.body;
  db.collection("questions")
    .insertOne({ question, answered: false })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).send("Could not add question");
    });
};

const updateQuestion = (req, res) => {
  db = getDb();
  const id = req.params.id;
  db.collection("questions")
    .updateOne({ _id: ObjectId(id) }, { $set: req.body })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).send("Could not add question");
    });
};

const deleteQuestion = (req, res) => {
  db = getDb();
  const id = req.params.id;
  db.collection("questions")
    .deleteOne({ _id: ObjectId(id) })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).send("Could not delete question");
    });
};

const answeredQuestions = (req, res) => {
  db = getDb();
  const userId = req.params.userId;
  let answers = [];
  let questionsId = [];
  let questions = [];
  db.collection("answers")
    .find({ userId })
    .forEach((answer) => {
      answers.push(answer);
      questionsId.push(ObjectId(answer.questionId));
    })
    .then(() => {
      db.collection("questions")
        .find({ _id: { $in: questionsId } })
        .forEach((question) => questions.push(question))
        .then(() => {
          let joined = [];
          answers.forEach((answer) => {
            questions.forEach((question) => {
              if (answer.questionId == question._id) {
                joined.push({ question, answer });
              }
            });
          });
          res.status(200).json({ status: true, body: joined });
        })
        .catch((err) => {
          res.status(500).json({
            status: false,
            message: "Internal server error",
            error: err
          });
        });
    });
};

const unansweredQuestions = (req, res) => {
  db = getDb();
  const userId = req.params.userId;
  let questionsId = [];
  let questions = [];
  db.collection("answers")
    .find({ userId })
    .forEach((answer) => questionsId.push(ObjectId(answer.questionId)))
    .then(() => {
      db.collection("questions")
        .find({ $and: [{ answered: false }, { _id: { $nin: questionsId } }] })
        .forEach((question) => questions.push(question))
        .then(() => {
          res.status(200).json({ status: true, body: questions });
        })
        .catch((err) => {
          res.status(500).json({
            status: false,
            message: "Internal server error",
            error: err
          });
        });
    });
};
module.exports = {
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  answeredQuestions,
  unansweredQuestions
};
