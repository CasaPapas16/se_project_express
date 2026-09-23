const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const { login, createUser } = require("./controllers/users");
const errorHandler = require("./middlewares/error-handler");
const {
  validateLoginBody,
  validateUserBody,
} = require("./middlewares/validation");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(cors());
app.use(express.json());

app.post("/signin", validateLoginBody, login);
app.post("/signup", validateUserBody, createUser);

const auth = require("./middlewares/auth");

app.use(auth);
app.use("/", mainRouter);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
