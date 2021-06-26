const express = require("express");
const router = express.Router();

const userData = require("../util/userData");

//Admin root page
router.get("/", (req, res) => {
  userData.getAllOktaUsers().then((data) => {
    res.render("admin/dashboard", { userList: data });
  });
});

module.exports = router;
