const express = require("express");
const router = express.Router();

const userData = require("../util/userData");
const oktaClient = require("../util/oktaClient");

//User logout (other routes are defined by OIDC middleware)
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/callback", (req, res) => {
  res.redirect("/dashboard");
});

router.get("/profile", (req, res) => {
  if (!req.userContext) {
    return res.status(401).render("unauthenticated");
  }
  userData.getUserProfile(req.user.id).then((data) => {
    renderProfile(res, req.user, data);
  });
});

router.get("/profile/:userId", (req, res) => {
  if (!req.userContext) {
    return res.status(401).render("unauthenticated");
  }
  oktaClient
    .getUser(req.params.userId)
    .then((user) => {
      userData.getUserProfile(user.id).then((data) => {
        renderProfile(res, user, data);
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/users/profile");
    });
});

const renderProfile = (res, oktaUser, extraInfo) => {
  res.render("profile", {
    profileUser: oktaUser,
    profilePicture: extraInfo.profile_picture,
      profileRoleName: extraInfo.role_name
  });
};

module.exports = router;
