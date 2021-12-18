const dotenv = require("dotenv");
const dbc = require("../data/db");

dotenv.config();

const getCitiesByCountry = (countryCode) => {
    let dbName = process.env.DBNAME || "projector_dev";
    let query = "SELECT CT.id, CT.city_name, CO.country_name FROM " + dbName + ".meta_cities CT ";
    query += "INNER JOIN " +dbName + ".meta_countries CO on CT.country_code = CO.country_code ";
    query += "WHERE CO.country_code = '"+ countryCode +"';";
    return new Promise((resolve, reject) => {
        dbc.query(query, function (err, result) {
            if (err) {
                console.log(err);
                reject(err);
            }
            if (result.length > 0) {
                resolve(result);
            } else {
                console.log("No cities in database for given country code.");
                reject("No cities in database for given country code.");
            }
        });
    });
};

module.exports = {
    getCitiesByCountry
}