const express = require("express");
const https = require("https");
const dotenv = require("dotenv");
const router = express.Router();

const userData = require("../util/userData");

dotenv.config();

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
      const data = JSON.stringify({ sendEmail: "true" });
      const options = {
        hostname: process.env.OKTAORGURL.split("//", 2)[1],
        port: 443,
        path: "/api/v1/users/" + req.body.userId + "/lifecycle/reset_password",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "SSWS " + process.env.OKTATOKEN,
        },
      };
      const postreq = https.request(options, (postres) => {
        postres.on("data", () => {
          res.send("OK");
        });
      });
      postreq.on("error", (e) => {
        console.log("reset password error: " + e);
        res.send(e);
      });
      postreq.write(data);
      postreq.end();
      break;
    default:
      res.render("/");
  }
});
module.exports = router;
