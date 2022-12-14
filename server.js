const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("./mongodb");
const QuestionRoutes = require("./modules/questions/questions.routes");
const AuthRoutes = require("./modules/auth/auth.routes");
const AnswersRoutes = require("./modules/answers/answers.routes");
const app = express();

app.use(express.json());
app.use("/questions", QuestionRoutes);
app.use("/auth", AuthRoutes);
app.use("/answers", AnswersRoutes);
app.get("/", (req, res) => {
  res.send("Server is working fine");
});

connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } else {
    console.log(err);
  }
});
