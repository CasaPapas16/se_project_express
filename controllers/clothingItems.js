const ClothingItem = require("../models/clothingItem");
const {
  DEFAULT_ERROR_STATUS,
  VALIDATION_ERROR_STATUS,
  CAST_ERROR_STATUS,
  NOT_FOUND_ERROR_STATUS,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const userId = req.user && req.user._id;

  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: userId,
  })
    .then((item) => {
      res.status(201).send({
        data: {
          ...item.toObject(),
          imageUrl,
        },
      });
    })
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

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(CAST_ERROR_STATUS).send({ message: "Invalid data" });
      }
      return res
        .status(DEFAULT_ERROR_STATUS)
        .send({ message: "An error has occurred on the server." });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(200).send({}))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_STATUS)
          .send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(CAST_ERROR_STATUS).send({ message: "Invalid data" });
      }
      return res
        .status(DEFAULT_ERROR_STATUS)
        .send({ message: "An error has occurred on the server." });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user && req.user._id;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_STATUS)
          .send({ message: "Requested resource not found" });
      }
      if (err.name === "CastError") {
        return res.status(CAST_ERROR_STATUS).send({ message: "Invalid data" });
      }
      return res
        .status(DEFAULT_ERROR_STATUS)
        .send({ message: "An error has occurred on the server." });
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user && req.user._id;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_STATUS)
          .send({ message: "Requested resource not found" });
      }
      if (err.name === "CastError") {
        return res.status(CAST_ERROR_STATUS).send({ message: "Invalid data" });
      }
      return res
        .status(DEFAULT_ERROR_STATUS)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
