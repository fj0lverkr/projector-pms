const express = require("express");
const router = express.Router();

const userData = require("../util/userData");
const oPoster = require("../util/oktaPost");

//Admin root page
router.get("/", (req, res) => {
  userData.getAllOktaUsers().then((uData) => {
    userData.getAllAppRoles().then((rData) => {
      res.render("admin/dashboard", {
        currentUser: req.user,
        userList: uData,
        roleList: rData,
      });
    });
  });
});

/***
Ajax related routes go here.
Note that everything you send here requires the user to be an admin.
To keep things manageable, we'll create a route per topic
***/

// USERS
router.post("/users-ajax", (req, res) => {
  switch (req.body.action) {
    case "updateRole":
      userData.setAppRole(req.body.userId, req.body.roleId).then((result) => {
        res.send(result);
      });
      break;
    case "resetPassword":
      let data = JSON.stringify({ sendEmail: "true" });
      let path =
        "/api/v1/users/" + req.body.userId + "/lifecycle/reset_password";
      oPoster.oktaPost(data, path).then((_) => {
        res.send("OK");
      });
      break;
    default:
      res.send("Invalid action '" + req.body.action + "'");
  }
});
module.exports = router;
