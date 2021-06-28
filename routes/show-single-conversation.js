const express = require('express');
const router = express.Router();
const conversationQuery = require('../db/queries/message-show-queries');
const conversationRouter = () => {
  //GET /posts
  router.get('/', (req, res) => {
    conversationQuery.getConversation()
    .then((conversation) => {
      res.json(conversation);
    })
  })
  return router;
};

module.exports = conversationRouter;