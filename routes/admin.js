const express = require("express");
const router = express.Router();

const userData = require("../util/userData");
const oktaClient = require("../util/oktaClient");

//Admin root page
router.get("/", (req, res) => {
  let oktaUserList = [];
  let oktaUserIdList = userData.getAllOktaUsers();
  oktaUserIdList.forEach((oktaId) => {
    oktaClient.getUser(oktaId).then((user) => {
      oktaUserList.push(user);
    });
  });
  res.render("admin/dashboard", { userList: oktaUserList });
});

module.exports = router;
