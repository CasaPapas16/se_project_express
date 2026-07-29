const User = require("../models/user");
const {
  DEFAULT_ERROR_STATUS,
  VALIDATION_ERROR_STATUS,
  CAST_ERROR_STATUS,
  NOT_FOUND_ERROR_STATUS,
} = require("../utils/errors");

// GET /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(NOT_FOUND_ERROR_STATUS)
        .send({ message: "Invalid data" });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
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

const getUser = (req, res) => {
  const { userId } = req.params;

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

module.exports = { getUsers, createUser, getUser };
