const {
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  answeredQuestions,
  unansweredQuestions
} = require("./questions.controller");

const { Router } = require("express");
const router = Router();

router.get("/", getQuestions);
router.post("/add", addQuestion);
router.patch("/update/:id", updateQuestion);
router.delete("/delete/:id", deleteQuestion);
router.get("/answered/:userId", answeredQuestions);
router.get("/unanswered/:userId", unansweredQuestions);

module.exports = router;
