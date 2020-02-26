const pgp = require("pg-promise")({
   query: e => {
      console.log("QUERY:", e.query);
   }
});

const options = {
   host: process.env.DB_HOST, // change to your host, ex. localhost
   database: process.env.DB_DATABASE, // change to your postgreSQL database
   user: process.env.DB_USER, // change to database user
   secret: process.env.DB_SECRET // database password
};
const db = pgp(options);

module.exports = db;