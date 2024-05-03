const Pool = require("pg").Pool;
const { DB_USER, DB_HOST, DB_NAME, DB_PASS, DB_PORT } = require("../constants");

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASS,
  port: DB_PORT,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
