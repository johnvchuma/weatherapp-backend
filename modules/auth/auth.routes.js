const { Router } = require("express");
const router = Router();
const { login, register } = require("./auth.controller");

router.post("/register", register);
router.post("/login", login);

module.exports = router;
