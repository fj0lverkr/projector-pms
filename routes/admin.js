const express = require("express");
const router = express.Router();

const userData = require("../util/userData");

//Admin root page
router.get("/", (req, res) => {
  userData.getAllOktaUsers().then((uData) => {
      userData.getAllAppRoles().then((rData) => {
    res.render("admin/dashboard", { userList: uData, roleList: rData });
      });
  });
});

//Post to admin root page
router.post("/", (req, res) => {
    switch(req.params['action']) {
        default:
            res.redirect("/");
    }
});
module.exports = router;
