const router = require("express").Router();
const itemRouter = require("./clothingItems");
const userRouter = require("./users");
const { NotFoundError } = require("../utils/errors");

router.use("/items", itemRouter);
router.use("/users", userRouter);

router.use((req, res, next) => {
  next(new NotFoundError());
});

module.exports = router;
