const express = require('express');
const router = express.Router();
const messageQueries = require('../db/queries/message-queries');

const allMessageRouter = () => {
  //GET /posts
  router.get('/', (req, res) => {
    const userID = req.session.user_id;
    console.log("lets go");

    messageQueries.getAllMessages(userID)
    .then((data) => {
      console.log("content",data);
      const templateVars = {
        user_id: userID,
        messages: data
      };
      if (userID) {
        res.render('messages_show', templateVars);
      }
    })
    .catch((err) => {
      console.log(err);
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