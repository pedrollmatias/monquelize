const express = require("express");
const router = express.Router();
// const path = require("path");

module.exports = (app) => {
  // const dirPath = path.join(__dirname, `api-${serverId}`, "product.api");
  // const api = require(dirPath);

  app.use("/users", router);

  router.get("/", (req, res) => {
    console.log("here");
    return res.json({ user: "Test" }).status(200);
  });
};
