const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/errors");

const createItem = (req, res, next) => {
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
      if (err.name === "ValidationError") {
        return next(new BadRequestError());
      }
      return next(err);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError());
      }
      return next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user && req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== String(userId)) {
        return next(new ForbiddenError());
      }

      return item.deleteOne().then(() => res.status(200).send({}));
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError());
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
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
        return next(new NotFoundError());
      }
      if (err.name === "CastError") {
        return next(new BadRequestError());
      }
      return next(err);
    });
};

const unlikeItem = (req, res, next) => {
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
        return next(new NotFoundError());
      }
      if (err.name === "CastError") {
        return next(new BadRequestError());
      }
      return next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
