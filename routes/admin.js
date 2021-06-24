const express = require("express");
const router = express.Router();

const userData = require("../util/userData");
const oktaClient = require("../util/oktaClient");

//Admin root page
router.get("/", (req, res) => {

  res.render("admin/dashboard");
});

module.exports = router;
