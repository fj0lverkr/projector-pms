const express = require("express");
const router = express.Router();

const userData = require("../util/userData");
const oktaClient = require("../util/oktaClient");

//Admin root page
router.get("/", (req, res) => {
  userData.getAllOktaUsers().then((data) => {
    let oktaUserList = [];
    data.forEach((row) => {
      oktaClient.getUser(row["okta_id"]).then((user) => {
        oktaUserList.push(user);
        res.render("admin/dashboard", { userList: oktaUserList });
      });
    });
  });
});

module.exports = router;
