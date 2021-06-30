const express = require('express');
const router = express.Router();
const messageQueries = require('../db/queries/message-queries');
const db = require('../lib/db-connection');
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
    db.query(`
    SELECT users.name
    FROM users
    WHERE id = $1 
    `, [buyer_id_number])
    .then((data) => {
      console.log("data:", data.rows[0].name);
      sessionDatabase[userID] = {
        'listing':listing_id_number,
        'id':buyer_id_number,
        'buyer':data.rows[0].name
      };
    })
    
    console.log("user_id: ", userID)
    res.redirect("/messages/views");
  })

  router.post('/views', (req,res) => {
    const bodyText = req.body.text;
    console.log("body text: ", bodyText);
    console.log("sender id: ", req.session.user_id);
    let user_id = req.session.user_id;
    let returnData = req.body;
    let requiredData = returnData['requiredData'];
    console.log("some data: ", requiredData);
    let splitData = requiredData.split(',');
    let first_id = splitData[0];
    let second_id = splitData[1];
    let buyer_id;
    if (first_id === user_id && second_id !== user_id) {
      buyer_id = second_id;
    } else {
      buyer_id = first_id;
    }
    console.log("this is the buyer: ", buyer_id);
    //required data returns a string containing two items
    //check to see which one is not the user_id 
    //the one that is not will be the sender IDå
    let current = new Date();
    let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
    let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
    let dateTime = cDate + ' ' + cTime;
    let listing_id_number = sessionDatabase[user_id].listing;
    let queryData = [parseInt(user_id), parseInt(buyer_id), dateTime, bodyText, parseInt(listing_id_number)];
    db.query(`
    INSERT INTO messages (to_id, from_id, time_sent, message, listing_id)
    VALUES ($2,$1, $3, $4, $5) RETURNING *;
    `,queryData)
    .then((data) => {
      //console.log(data);
    })
    .catch((err) => {
      console.log(err);
    })
    res.redirect("/messages/views");
  })
  router.get('/views', (req, res) => {
    let userID = req.session.user_id;
    let listing_id_number = sessionDatabase[userID].listing;
    let buyer_id_number = sessionDatabase[userID].id;
    let buyer_name = sessionDatabase[userID].buyer;
    console.log(buyer_name);
    let query_params = [userID, listing_id_number, buyer_id_number];
    let name = req.session.user_name;
    if(userID){
      messageQueries.getConversation(query_params)
      .then((data) => {
        //console.log(data);
        const templateVars = {
          userName: name,
          user_id: userID,
          messages: data,
          buyerName: buyer_name
        };
        res.render('messages', templateVars);
      })
      .catch((err) => {
        console.log(err);
      })
    }
  })
  return router;
};

module.exports = allMessageRouter;