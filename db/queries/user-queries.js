const db = require('../../lib/db-connection');
const getUsers = () => {
  return db.query(`SELECT * FROM users`)
  .then((response) => {
    return response.rows;
  })
  .catch((err) => {
    return err.message;
  });
};
module.exports = {
  getUsers
};
