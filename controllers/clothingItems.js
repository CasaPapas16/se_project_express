const ClothingItem = require("../models/clothingItem");
const {
  DEFAULT_ERROR_STATUS,
  VALIDATION_ERROR_STATUS,
  CAST_ERROR_STATUS,
  NOT_FOUND_ERROR_STATUS,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageURL, imageUrl } = req.body;
  const userId = req.user && req.user._id;
  const normalizedImageUrl = imageURL || imageUrl;

  console.log("Authenticated user ID:", userId);

  ClothingItem.create({ name, weather, imageURL: normalizedImageUrl })
    .then((item) => {
      res.status(201).send({
        data: {
          ...item.toObject(),
          imageUrl: item.imageURL,
        },
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(VALIDATION_ERROR_STATUS)
          .send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR_STATUS).send({ message: err.message });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(CAST_ERROR_STATUS).send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR_STATUS).send({ message: err.message });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL, imageUrl } = req.body;
  const normalizedImageUrl = imageURL || imageUrl;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: { imageURL: normalizedImageUrl } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_STATUS)
          .send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(CAST_ERROR_STATUS).send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR_STATUS).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(200).send({}))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_STATUS)
          .send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(CAST_ERROR_STATUS).send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR_STATUS).send({ message: err.message });
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
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_STATUS)
          .send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(CAST_ERROR_STATUS).send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR_STATUS).send({ message: err.message });
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
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_STATUS)
          .send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(CAST_ERROR_STATUS).send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR_STATUS).send({ message: err.message });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
