const express = require('express');
const router = express.Router();
const messageQueries = require('../db/queries/message-queries');

const allMessageRouter = () => {
  //GET /posts
  router.get('/', (req, res) => {
    console.log("lets go");
    messageQueries.getAllMessages()
    .then((messages) => {
      res.render('index');
      //res.json(messages);
    })
  })

  // router.get('/:id', (req, res) => {
  //   messageQueries.getConversation()
  //   .then((conversation) => {
  //     //res.json(conversation);
  //   })
  // })

  return router;
};

module.exports = allMessageRouter;