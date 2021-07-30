const express = require("express");
const router = express.Router();

const userData = require("../util/userData");
const oktaClient = require("../util/oktaClient");
const oktaPoster = require("../util/oktaPost");

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
  console.log(
    req.user.profile.firstName + ", " + res.locals.user.profile.firstName
  );
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

/***
Ajax related routes, make sure to check if the user doing the POST is allowed to.
***/

router.post("/ajax", (req, res) => {
  if (!req.userContext) {
    res.send({
      success: false,
      reason: "401 Unauthized",
    });
  }
  switch (req.body.action) {
    case "updateAlias":
      if (
        req.body.newAlias === "" ||
        req.body.newAlias.toLowerCase() === req.body.oldAlias.toLowerCase()
      ) {
        res.send({ success: false, reason: "" });
      } else {
        userData
          .updateUserAlias(req.user.id, req.body.newAlias)
          .then((result) => {
            res.send(result);
          });
      }
      break;
    case "updateFirstName":
      if (
        req.body.newLastName === "" ||
        req.body.newFirstName === req.body.oldLastName
      ) {
        res.send({ success: false, reason: "" });
      } else {
        let newFirstName = req.body.newFirstName;
        let data = JSON.stringify({
          profile: { firstName: newFirstName },
        });
        let path = "/api/v1/users/" + req.user.id;
        oktaPoster
          .oktaPost(data, path)
          .then((result) => {
            if (
              result &&
              result.profile &&
              result.profile.firstName === newFirstName
            ) {
              userData
                .updateUserSimpleField(req.user.id, "firstName", newFirstName)
                .then((sqlResult) => {
                  req.user.profile.firstName = newFirstName;
                  res.locals.user.profile.firstName = newFirstName;
                  console.log(
                    req.user.profile.firstName +
                      ", " +
                      res.locals.user.profile.firstName
                  );
                  res.send(sqlResult);
                })
                .catch((sqlErr) => {
                  console.log(sqlErr);
                  res.send({ success: false, reason: sqlErr });
                });
            } else {
              res.send({
                success: false,
                reason: "Error saving first name to Okta.",
              });
            }
          })
          .catch((err) => {
            console.log(err);
            res.send({
              success: false,
              reason: "Error saving first name to Okta.",
            });
          });
      }
      break;
    default:
      res.send("Invalid action '" + req.body.action + "'");
      break;
  }
});

const renderProfile = (res, oktaUser, extraInfo) => {
  res.render("profile", {
    profileUser: oktaUser,
    profilePicture: extraInfo.profile_picture,
    profileRoleName: extraInfo.role_name,
    profileRoleSuper: extraInfo.role_super,
    profileAlias: extraInfo.alias,
  });
};

module.exports = router;
