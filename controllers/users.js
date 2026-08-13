const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  DEFAULT_ERROR_STATUS,
  VALIDATION_ERROR_STATUS,
  CAST_ERROR_STATUS,
  UNAUTHORIZED_ERROR_STATUS,
  NOT_FOUND_ERROR_STATUS,
  CONFLICT_ERROR_STATUS,
} = require("../utils/errors");


const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!password || typeof password !== "string") {
    return res
      .status(VALIDATION_ERROR_STATUS)
      .send({ message: "Invalid data" });
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userResponse = user.toObject();
      delete userResponse.password;
      return res.status(201).send(userResponse);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(VALIDATION_ERROR_STATUS)
          .send({ message: "Invalid data" });
      }
      if (err.code === 11000) {
        return res
          .status(CONFLICT_ERROR_STATUS)
          .send({ message: "conflict error." });
      }
      return res
        .status(DEFAULT_ERROR_STATUS)
        .send({ message: "An error has occurred on the server." });
    });
};


const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(UNAUTHORIZED_ERROR_STATUS)
        .send({ message: "Incorrect email or password" });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user && req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_STATUS)
          .send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(CAST_ERROR_STATUS).send({ message: "Invalid data" });
      }
      return res
        .status(DEFAULT_ERROR_STATUS)
        .send({ message: "An error has occurred on the server." });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user && req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_STATUS)
          .send({ message: "User not found" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(VALIDATION_ERROR_STATUS)
          .send({ message: "Invalid data" });
      }
      return res
        .status(DEFAULT_ERROR_STATUS)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
