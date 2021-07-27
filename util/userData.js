const dotenv = require("dotenv");
const imageToBase64 = require("image-to-base64");
const dbc = require("../data/db");
const oktaClient = require("../util/oktaClient");

dotenv.config();

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

const setupUserExtraData = (dbName, okta_id, user_role) => {
  return new Promise((resolve) => {
    oktaClient.getUser(okta_id).then((user) => {
      imageToBase64(process.env.GENAVATAR)
        .then((response) => {
          var insertUser =
            "insert into " +
            dbName +
            ".user_extra(okta_id, profile_picture, user_role, first_name, last_name, alias) values (" +
            dbc.escape(okta_id) +
            ", " +
            dbc.escape(response) +
            ", " +
            dbc.escape(user_role) +
            ", " +
            dbc.escape(user.profile.firstName) +
            ", " +
            dbc.escape(user.profile.lastName) +
            ", " +
            dbc.escape(user.profile.lastName + user.profile.firstName) +
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
            dbc.escape(user.profile.lastName + user.profile.firstName) +
            ");";
          dbc.query(insertUser, function (err) {
            if (err) console.log(err);
            resolve(true);
          });
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
  getAllAppRoles,
  getAllOktaUsers,
  getUserIsSuper,
  getUserProfile,
  setAppRole,
};
