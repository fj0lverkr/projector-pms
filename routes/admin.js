const express = require("express");
const router = express.Router();

const userData = require("../util/userData");

//Admin root page
router.get("/", (req, res) => {
  userData.getAllOktaUsers().then((uData) => {
    userData.getAllAppRoles().then((rData) => {
      res.render("admin/dashboard", { currentUser: req.user, userList: uData, roleList: rData });
    });
  });
});

//Post to admin root page
router.post("/ajax", (req, res) => {
  console.log("posting to /admin/ " + JSON.stringify(req.body));
  switch (req.body.action) {
    case "updateRole":
      userData.setAppRole(req.body.userId, req.body.roleId).then((result) => {
        res.send(result);
      });
      break;
    default:
      res.render("/");
  }
});
module.exports = router;
