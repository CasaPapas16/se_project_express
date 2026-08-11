const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const allowedPublicRoutes = [
  { path: "/signin", method: "POST" },
  { path: "/signup", method: "POST" },
  { path: "/items", method: "GET" },
];

const auth = (req, res, next) => {
  const { path, method, headers } = req;

  const isPublicRoute = allowedPublicRoutes.some(
    (route) => route.path === path && route.method === method
  );

  if (isPublicRoute) {
    return next();
  }

  const { authorization } = headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  req.user = payload;
  return next();
};

module.exports = auth;
