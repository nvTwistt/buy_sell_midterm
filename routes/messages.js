const express = require('express');
const router = express.Router();
const allMessageQuery = require('../db/queries/message-queries');
const allMessageRouter = () => {
  //GET /posts
  router.get('/', (req, res) => {
    allMessageQuery.getAllMessages()
    .then((messages) => {
      res.json(messages);
    })
  })
  return router;
};

module.exports = allMessageRouter;