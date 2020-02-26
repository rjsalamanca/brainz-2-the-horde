const pgp = require("pg-promise")({
   query: e => {
      console.log("QUERY:", e.query);
   }
});

const options = {
   host: process.env.HOST, // change to your host, ex. localhost
   database: process.env.DATABASE, // change to your postgreSQL database
   user: process.env.USER, // change to database user
   secret: process.env.SECRET // database password
};
const db = pgp(options);

module.exports = db;