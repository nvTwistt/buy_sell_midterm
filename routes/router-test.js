const express = require('express');
const router = express.Router();
const userQueries = require('../db/queries/user-queries');
const postRouter = () => {
  //GET /posts
  router.get('/', (req, res) => {
    userQueries.getUsers()
    .then((users) => {
      res.json(users);
    })
    // db.query(`SELECT * FROM users;`)
    // .then((response) => {
    //   console.log(response)
    //   res.json(response.rows);
    // })
    // .catch((err) => {
    //   res.send(err.message);
    // })
  })
  return router;
};

module.exports = postRouter;
