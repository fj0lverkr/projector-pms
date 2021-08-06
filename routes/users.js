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
    userData.getUserCountry().then((countryCode) => {
      renderProfile(res, req.user, data, countryCode);
    });
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
        req.body.newFirstName === "" ||
        req.body.newFirstName === req.body.oldFirstName
      ) {
        res.send({ success: false, reason: "" });
      } else {
        let newFirstName = req.body.newFirstName;
        userData
          .updateUserSimpleField(req.user.id, "first_name", newFirstName)
          .then((sqlResult) => {
            oktaClient.getUser(req.user.id).then((oktaUser) => {
              oktaUser.profile.firstName = newFirstName;
              oktaUser.update().then(() => {
                res.send(sqlResult);
              });
            });
          })
          .catch((sqlErr) => {
            console.log(sqlErr);
            res.send({ success: false, reason: sqlErr });
          });
      }
      break;
    case "updateLastName":
      if (
        req.body.newLastName === "" ||
        req.body.newLastName === req.body.oldLastName
      ) {
        res.send({ success: false, reason: "" });
      } else {
        let newLastName = req.body.newLastName;
        userData
          .updateUserSimpleField(req.user.id, "last_name", newLastName)
          .then((sqlResult) => {
            oktaClient.getUser(req.user.id).then((oktaUser) => {
              oktaUser.profile.lastName = newLastName;
              oktaUser.update().then(() => {
                res.send(sqlResult);
              });
            });
          })
          .catch((sqlErr) => {
            console.log(sqlErr);
            res.send({ success: false, reason: sqlErr });
          });
      }
      break;
    case "updateEmail":
      if (req.body.newEmail === "" || req.body.newEmail === req.body.oldEmail) {
        res.send({ success: false, reason: "" });
      } else if (
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.newEmail)
      ) {
        req.send({ success: false, reason: "String is not a valid e-mail." });
      } else {
        let newEmail = req.body.newEmail.toLowerCase();
        oktaClient.getUser(req.user.id).then((oktaUser) => {
          oktaUser.profile.email = newEmail;
          oktaUser
            .update()
            .then(() => {
              res.send({ success: true, reason: "Email updated." });
            })
            .catch((e) => {
              console.log(JSON.stringify(e));
              res.send({
                success: false,
                reason:
                  "Okta API error: " + e.errorCauses[0].errorSummary + ".",
              });
            });
        });
      }
      break;
    case "updateSecondaryEmail":
      if (req.body.newEmail === req.body.oldEmail) {
        res.send({ success: false, reason: "" });
      } else if (
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
          req.body.newEmail
        ) &&
        req.body.newEmail != ""
      ) {
        req.send({ success: false, reason: "String is not a valid e-mail." });
      } else {
        let newEmail = req.body.newEmail.toLowerCase();
        oktaClient.getUser(req.user.id).then((oktaUser) => {
          oktaUser.profile.secondEmail = newEmail;
          oktaUser
            .update()
            .then(() => {
              res.send({ success: true, reason: "Secondary email updated." });
            })
            .catch((e) => {
              res.send({
                success: false,
                reason:
                  "Okta API error: " + e.errorCauses[0].errorSummary + ".",
              });
            });
        });
      }
      break;
    case "updateMobile":
      if (req.body.newMobile === req.body.oldMobile) {
        res.send({ success: false, reason: "" });
      } else {
        let newMobile = req.body.newMobile;
        oktaClient.getUser(req.user.id).then((oktaUser) => {
          oktaUser.profile.mobilePhone = newMobile;
          oktaUser
            .update()
            .then(() => {
              res.send({ success: true, reason: "Mobile phone updated." });
            })
            .catch((e) => {
              res.send({
                success: false,
                reason:
                  "Okta API error: " + e.errorCauses[0].errorSummary + ".",
              });
            });
        });
      }
      break;
    case "updateProfilePicture":
      if (
        req.body.newDataUrl === "" ||
        req.body.newDataUrl === req.body.oldDataUrl
        /*TODO validate filetype again.
           This was done client-side already but needs server-side recheck for security.
      */
      ) {
        res.send({ success: false, reason: "" });
      } else {
        let newDataUrl = req.body.newDataUrl;
        userData
          .updateUserSimpleField(req.user.id, "profile_picture", newDataUrl)
          .then((_) => {
            res.send({ success: true, reason: "Profile picture updated." });
          })
          .catch((sqlErr) => {
            console.log(sqlErr);
            res.send({ success: false, reason: sqlErr });
          });
      }
      break;
    default:
      res.send({
        success: false,
        reason: "Invalid action '" + req.body.action + "'",
      });
      break;
  }
});

const renderProfile = (res, oktaUser, extraInfo, countryCode = "") => {
  res.render("profile", {
    profileUser: oktaUser,
    profilePicture: extraInfo.profile_picture,
    profileRoleName: extraInfo.role_name,
    profileRoleSuper: extraInfo.role_super,
    profileAlias: extraInfo.alias,
    profileCountry: countryCode,
  });
};

module.exports = router;
