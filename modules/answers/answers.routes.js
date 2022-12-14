const { Router } = require("express");
const { answerQuestion } = require("./answers.controller");
const router = Router();

router.post("/", answerQuestion);

module.exports = router;
