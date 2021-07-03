//import connection to database
const db = require('../../lib/db-connection');

/**
 *
 * @param userId
 * @returns an object containing information about the user including
 * their id number and name.
 */
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

//return random number given min and max parameters

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

module.exports = { getRandomInt, checkUser }
