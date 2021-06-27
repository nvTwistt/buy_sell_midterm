const db = require('../../lib/db-connection');
const getUsers = () => {
  return db.query(`SELECT * FROM users`)
  .then((response) => {
    console.log(response)
    return response.rows;
  })
  .catch((err) => {
    res.send(err.message);
  });
};
module.exports = {
  getUsers
};