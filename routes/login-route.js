const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const db = require('../lib/db-connection');
const helperQueries = require('../db/queries/helper-queries-and-functions');

const loginRouter = () => {
  router.get('/login/:id' , (req, res) => {
    delete req.session.user_id;
    const userID = req.params.id;
    req.session.user_id = userID;
    const userData = req.params.id;
    helperQueries.checkUser(userData)
    .then((data) => {
      delete req.session.user_name;
      let name = data['name'];
      req.session.user_name = name;
      res.redirect('/buy-sell');
    })
  })
  return router;
};
module.exports = loginRouter;