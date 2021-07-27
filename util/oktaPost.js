const https = require("https");
const dotenv = require("dotenv");

dotenv.config();

const oktaPost = (data, path) => {
  const options = {
    hostname: process.env.OKTAORGURL.split("//", 2)[1],
    port: 443,
    path: path,
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "SSWS " + process.env.OKTATOKEN,
    },
  };
  return new Promise((resolve, reject) => {
    const postreq = https.request(options, (postres) => {
      postres.on("data", () => {
        resolve("OK");
      });
    });
    postreq.on("error", (e) => {
      reject(e);
    });
    postreq.write(data);
    postreq.end();
  });
};

module.exports = { oktaPost };
