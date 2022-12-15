const { Router } = require("express");
const { answerQuestion, updateAnswer } = require("./answers.controller");
const router = Router();

router.post("/", answerQuestion);
router.patch("/:answerId", updateAnswer);

module.exports = router;
