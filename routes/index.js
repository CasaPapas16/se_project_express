const router = require("express").Router();
const itemRouter = require("./clothingItems");

router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

module.exports = router;
