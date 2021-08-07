const dotenv = require("dotenv");
const imageToBase64 = require("image-to-base64");
const dbc = require("../data/db");
const oktaClient = require("../util/oktaClient");
const UserAlias = require("../util/user-alias");

dotenv.config();

const getUserCountryFromIp = () => {
  let token = process.env.IPINFOTOKEN;
  return new Promise((resolve, reject) => {
    fetch("https://ipinfo.io/json?token=" + token, {
      headers: { Accept: "application/json" },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        resolve(resp.country);
      })
      .catch(() => {
        reject({ country: "us" });
      });
  });
};

const getAllAppRoles = () => {
  let dbName = process.env.DBNAME || "projector_dev";
  let query = "SELECT * FROM " + dbName + ".app_roles;";
  return new Promise((resolve, reject) => {
    dbc.query(query, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      }
      if (result.length > 0) {
        resolve(result);
      } else {
        console.log("No app roles in database.");
        reject("No app roles in database.");
      }
    });
  });
};

const getAllOktaUsers = () => {
  let dbName = process.env.DBNAME || "projector_dev";
  let query =
    "select okta_id, alias, first_name, last_name, user_role from " +
    dbName +
    ".user_extra;";
  return new Promise((resolve, reject) => {
    dbc.query(query, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      }
      if (result.length > 0) {
        resolve(result);
      } else {
        console.log("No users found in database");
        reject("No users found in database");
      }
    });
  });
};

const getUserIsSuper = (okta_id) => {
  let dbName = process.env.DBNAME || "projector_dev";
  let isSuperIntQuery = "select superUser from " + dbName + ".app_roles ARO ";
  isSuperIntQuery += "inner join " + dbName;
  isSuperIntQuery += ".user_extra UEX on UEX.user_role = ARO.idapp_roles ";
  isSuperIntQuery += "where UEX.okta_id = " + dbc.escape(okta_id) + ";";
  return new Promise((resolve, reject) => {
    dbc.query(isSuperIntQuery, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      }
      if (result.length > 0) {
        resolve(result[0].superUser);
      } else {
        setupUserExtraData(dbName, okta_id, 2).then(() => {
          dbc.query(isSuperIntQuery, function (err, result) {
            if (err) {
              console.log(err);
              reject(err);
            }
            resolve(result[0].superUser);
          });
        });
      }
    });
  });
};

const getUserProfile = (okta_id) => {
  let dbName = process.env.DBNAME || "projector_dev";
  let selectUserProfile =
    "select UEX.profile_picture, UEX.alias, ARO.name as role_name, ARO.superUser as role_super from " +
    dbName +
    ".user_extra UEX inner join " +
    dbName +
    ".app_roles ARO on ARO.idapp_roles = UEX.user_role " +
    "where UEX.okta_id = " +
    dbc.escape(okta_id) +
    ";";
  return new Promise((resolve, reject) => {
    dbc.query(selectUserProfile, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      }
      if (result.length > 0) {
        resolve(result[0]);
      } else {
        setupUserExtraData(dbName, okta_id, 2).then(() => {
          dbc.query(selectUserProfile, function (err, result) {
            if (err) {
              console.log(err);
              reject(err);
            }
            resolve(result[0]);
          });
        });
      }
    });
  });
};

const getUserAliasIsUnique = (alias) => {
  let dbName = process.env.DBNAME || "projector_dev";
  alias = alias.toLowerCase();
  let q =
    "SELECT okta_id FROM " +
    dbName +
    ".user_extra WHERE LOWER(alias) = " +
    dbc.escape(alias) +
    " LIMIT 1;";
  return new Promise((resolve, reject) => {
    dbc.query(q, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      }
      if (result && result.length > 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

const updateUserAlias = (okta_id, newAlias) => {
  let dbName = process.env.DBNAME || "projector_dev";
  let q =
    "UPDATE " +
    dbName +
    ".user_extra SET alias = " +
    dbc.escape(newAlias) +
    "WHERE okta_id = " +
    dbc.escape(okta_id) +
    ";";
  return new Promise((resolve, reject) => {
    getUserAliasIsUnique(newAlias).then((isUnique) => {
      if (!isUnique) {
        resolve({
          success: false,
          reason: "Alias already in use by other user.",
        });
      } else {
        dbc.query(q, function (err, _) {
          if (err) {
            console.log(err);
            reject({
              success: false,
              reason: "Mysql error while saving alias.",
            });
          }
          resolve({
            success: true,
            reason: "New alias saved succesfully.",
          });
        });
      }
    });
  });
};

const updateUserSimpleField = (okta_id, field, value) => {
  let dbName = process.env.DBNAME || "projector_dev";
  let fieldWords = field.split("_");
  fieldWords[0] = fieldWords[0][0].toUpperCase() + fieldWords[0].slice(1);
  let fieldPrettyName = "";
  for (let i in fieldWords) {
    if (i < fieldWords.length - 1) {
      fieldPrettyName += fieldWords[i] + " ";
    } else {
      fieldPrettyName += fieldWords[i];
    }
  }
  return new Promise((resolve, reject) => {
    let q =
      "UPDATE " +
      dbName +
      ".user_extra SET " +
      field +
      " = " +
      dbc.escape(value) +
      " WHERE okta_id = " +
      dbc.escape(okta_id) +
      ";";
    dbc.query(q, function (err, _) {
      if (err) {
        console.log(err);
        reject("Mysql error on saving " + fieldPrettyName + ": " + value);
      }
      resolve({ success: true, reason: fieldPrettyName + " updated." });
    });
  });
};

const setupUserExtraData = (dbName, okta_id, user_role) => {
  return new Promise((resolve) => {
    oktaClient.getUser(okta_id).then((user) => {
      let userAlias = new UserAlias().alias;
      getUserAliasIsUnique(userAlias).then((isUnique) => {
        if (isUnique) {
          imageToBase64(process.env.GENAVATAR)
            .then((response) => {
              var insertUser =
                "insert into " +
                dbName +
                ".user_extra(okta_id, profile_picture, user_role, first_name, last_name, alias) values (" +
                dbc.escape(okta_id) +
                ", " +
                dbc.escape("data:image/png;base64," + response) +
                ", " +
                dbc.escape(user_role) +
                ", " +
                dbc.escape(user.profile.firstName) +
                ", " +
                dbc.escape(user.profile.lastName) +
                ", " +
                dbc.escape(userAlias) +
                ");";
              dbc.query(insertUser, function (err) {
                if (err) console.log(err);
                resolve(true);
              });
            })
            .catch((err) => {
              console.error(err);
              var insertUser =
                "insert into " +
                dbName +
                ".user_extra(okta_id, user_role, first_name, last_name, alias) values (" +
                dbc.escape(okta_id) +
                ", " +
                dbc.escape(user_role) +
                ", " +
                dbc.escape(user.profile.firstName) +
                ", " +
                dbc.escape(user.profile.lastName) +
                ", " +
                dbc.escape(userAlias) +
                ");";
              dbc.query(insertUser, function (err) {
                if (err) console.log(err);
                resolve(true);
              });
            });
        } else {
          setupUserExtraData(dbName, okta_id, user_role).then(() => {
            resolve(true);
          });
        }
      });
    });
  });
};

const setAppRole = (oktaUser, appRole) => {
  let dbName = process.env.DBNAME || "projector_dev";
  let query =
    "UPDATE " +
    dbName +
    ".user_extra " +
    "SET user_role = " +
    dbc.escape(appRole) +
    "WHERE okta_id = " +
    dbc.escape(oktaUser) +
    ";";
  return new Promise((resolve, reject) => {
    dbc.query(query, function (err, _) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve("OK");
    });
  });
};

module.exports = {
  getUserCountryFromIp,
  getAllAppRoles,
  getAllOktaUsers,
  getUserIsSuper,
  getUserProfile,
  getUserAliasIsUnique,
  setAppRole,
  updateUserAlias,
  updateUserSimpleField,
};
