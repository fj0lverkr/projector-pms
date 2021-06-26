const dotenv = require("dotenv");
const imageToBase64 = require("image-to-base64");
const dbc = require("../data/db");
const oktaClient = require("../util/oktaClient");

dotenv.config();

const getAllOktaUsers = () => {
  let dbName = process.env.DBNAME || "projector_dev";
  let query =
    "select okta_id, alias, first_name, last_name from " +
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
  isSuperIntQuery += "where UEX.okta_id = '" + okta_id + "';";
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
    "select UEX.profile_picture, ARO.name as role_name from " +
    dbName +
    ".user_extra UEX inner join " +
    dbName +
    ".app_roles ARO on ARO.idapp_roles = UEX.user_role " +
    "where UEX.okta_id = '" +
    okta_id +
    "';";
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
            ".user_extra(okta_id, profile_picture, user_role, first_name, last_name, alias) values ('" +
            okta_id +
            "', '" +
            response +
            "', " +
            user_role +
            ", '" +
            user.profile.firstName +
            "', '" +
            user.profile.lastName +
            "', '" +
            user.profile.lastName + user.profile.firstName +
            "');";
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
            ".user_extra(okta_id, user_role, first_name, last_name, alias) values ('" +
            okta_id +
            "', " +
            user_role +
            ", '" +
            user.profile.firstName +
            "', '" +
            user.profile.lastName +
            "', '" +
            user.profile.lastName + user.profile.firstName +
            "');";
          dbc.query(insertUser, function (err) {
            if (err) console.log(err);
            resolve(true);
          });
        });
    });
  });
};

module.exports = { getAllOktaUsers, getUserIsSuper, getUserProfile };
