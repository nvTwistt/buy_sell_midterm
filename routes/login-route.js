const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const db = require('../lib/db-connection');

const loginRouter = () => {
  router.get('/login/:id' , (req, res) => {
    delete req.session.user_id;
    const userID = req.params.id;
    req.session.user_id = userID;
    const userData = [req.params.id];
    return db.query(`
    SELECT * 
    FROM users
    WHERE id = $1;
    `, userData
    ) 
    .then(() => {
      res.redirect('/buy-sell');
    })
  })
  return router;
};
module.exports = loginRouter;