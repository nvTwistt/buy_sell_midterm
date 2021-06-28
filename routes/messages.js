const express = require('express');
const router = express.Router();
const allMessageQuery = require('../db/queries/message-queries');
const allMessageRouter = () => {
  //GET /posts
  router.get('/main', (req, res) => {
    allMessageQuery.getAllMessages()
    .then((messages) => {
      console.log(messages.rows);
      res.render('index');
      //res.json(messages);
    })
  })
  return router;
};

module.exports = allMessageRouter;