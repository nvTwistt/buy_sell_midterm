//import connection to database
const db = require('../../lib/db-connection');

const checkUser = (userId) => {
  return db.query(`SELECT * FROM users
  WHERE users.id = $1`, [userId])
  .then((response) => {
    return response.rows[0];
  })
  .catch((err) => {
    console.log(err.message);
  });
};

module.exports = { checkUser }
