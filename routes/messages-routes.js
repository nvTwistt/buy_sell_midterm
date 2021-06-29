const express = require('express');
const router = express.Router();
const messageQueries = require('../db/queries/message-queries');
const sessionDatabase = {};
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
  });
  router.post('/', (req,res) => {
    let returnData = req.body;
    let requiredData = returnData['requiredData'];
    let splitData = requiredData.split(',');
    let listing_id_number = splitData[0];
    let buyer_id_number = splitData[1];
    const userID = req.session.user_id;
    sessionDatabase[userID] = {'listing':listing_id_number, 'id':buyer_id_number};
    console.log(sessionDatabase[userID]);
    
    res.redirect("/messages/views");
  })
  router.get('/views', (req, res) => {
    //console.log("session: ",res.session);
    console.log("body: ",req.session.user_id);
    console.log(sessionDatabase[6]);
    let userID = req.session.user_id;
    let listing_id_number = sessionDatabase[userID].listing;
    let buyer_id_number = sessionDatabase[userID].id;
    let query_params = [userID, listing_id_number, buyer_id_number];
    console.log("list number ",listing_id_number);
    console.log("buyer number ",buyer_id_number);
    if(userID){
      messageQueries.getConversation(query_params)
      .then((data) => {
        console.log("content",data);
        const templateVars = {
          user_id: userID,
          messages: data
        };
        res.render('messages', templateVars);
      })
      .catch((err) => {
        console.log(err);
      })
    }
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