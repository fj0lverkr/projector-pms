const express = require("express");
const router = express.Router();

//Home
router.get("/", (req, res) => {
  if (!req.userContext) {
    res.render("index");
  }
  res.render("index");
});

module.exports = router;
