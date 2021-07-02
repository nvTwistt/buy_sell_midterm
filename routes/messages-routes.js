const express = require("express");
const moment = require("moment");
moment().format();
const router = express.Router();
const messageQueries = require("../db/queries/message-queries");
const userCheck = require("../db/queries/helper-queries-and-functions");
const db = require("../lib/db-connection");
const sessionDatabase = {};
const allMessageRouter = () => {
  //GET /posts
  router.get("/", (req, res) => {
    const userID = req.session.user_id;
    if(!userID) {
      res.send("You do not have permission to perform this action!");
    } else {
      console.log("lets go");
    const userDB = userCheck.checkUser(userID).then((data) => {
      return data;
    });
    let idObject;
    const getObject = async () => {
      idObject = await userDB;
      let dbID = idObject.id;
      messageQueries
        .getAllMessages(userID)
        .then((data) => {
          const templateVars = {
            user_id: userID,
            messages: data,
          };
          if (userID && parseInt(userID) === parseInt(dbID)) {
            res.render("messages_show", templateVars);
          } else {
            alert("You do not have permission to perform this action!");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getObject();
    }
    
    
  });

  router.post("/", (req, res) => {
    if(!userID) {
      res.send("You do not have permission to perform this action!");
    } else {
      let returnData = req.body;
    let requiredData = returnData["requiredData"];
    let splitData = requiredData.split(",");
    let listing_id_number = splitData[0];
    let buyer_id_number = splitData[1];
    const userID = req.session.user_id;
    //redirect key is composed of the other persons id, your id and the listing number
    let redirectKey = buyer_id_number + userID + listing_id_number;
    const userDB = userCheck.checkUser(userID).then((data) => {
      return data;
    });
    let idObject;
    const getObject = async () => {
      idObject = await userDB;
      let dbID = idObject.id;
      if (userID && parseInt(userID) === parseInt(dbID)) {
        db.query(
          `
        SELECT users.name
        FROM users
        WHERE id = $1
        `,
          [buyer_id_number]
        ).then((data) => {
          sessionDatabase[userID] = {
            listing: listing_id_number,
            id: buyer_id_number,
            buyer: data.rows[0].name,
          };
        });
      } else {
        res.send("You do not have permission to perform this action!");
      }
    };
    getObject();
    console.log("user_id: ", userID);
    res.redirect(`/messages/${redirectKey}`);
    }
    
  });

  router.post("/:id", (req, res) => {
    let user_id = req.session.user_id;
    if (!user_id) {
      res.send("You don't have permission to perform this action!");
    } else {
      const userDB = userCheck.checkUser(user_id).then((data) => {
        console.log("data: ", data);
        return data;
      });
      let idObject;
      const getObject = async () => {
        idObject = await userDB;
        let dbID = idObject.id;
        if (user_id && parseInt(user_id) === parseInt(dbID)) {
          const bodyText = req.body.text;
          console.log("body: ", bodyText);
          let returnData = req.body;
          let requiredData = returnData["requiredData"];
          let splitData = requiredData.split(",");
          let first_id = splitData[0];
          let second_id = splitData[1];
          let buyer_id;
          if (first_id === user_id && second_id !== user_id) {
            buyer_id = second_id;
          } else {
            buyer_id = first_id;
          }
          //required data returns a string containing two items
          //check to see which one is not the user_id
          //the one that is not will be the sender IDå
          let current = new Date();
          let cDate =
            current.getFullYear() +
            "-" +
            (current.getMonth() + 1) +
            "-" +
            current.getDate();
          let cTime =
            current.getHours() +
            ":" +
            current.getMinutes() +
            ":" +
            current.getSeconds();
          let dateTime = cDate + " " + cTime;
          let listing_id_number = sessionDatabase[user_id].listing;
          let queryData = [
            parseInt(user_id),
            parseInt(buyer_id),
            dateTime,
            bodyText,
            parseInt(listing_id_number),
          ];
          db.query(
            `
      INSERT INTO messages (to_id, from_id, time_sent, message, listing_id)
      VALUES ($2,$1, $3, $4, $5) RETURNING *;
      `,
            queryData
          )
            .then((data) => {
              //console.log(data);
            })
            .catch((err) => {
              console.log(err);
            });
          res.redirect("/messages/:id");
        } else {
          res.send("You do not have permission to perform this action!");
        }
      };
      getObject();
    }
    
  });
  router.get("/:id", (req, res) => {
    const userID = req.session.user_id;
    if (!userID) {
      res.send("You don't have permission to perform this action!");
    } else {
      console.log("lets go");
    const userDB = userCheck.checkUser(userID).then((data) => {
      return data;
    });
    let idObject;
    const getObject = async () => {
      idObject = await userDB;
      console.log("WHAT: ", idObject);
      let dbID = idObject.id;
      if (userID && parseInt(userID) === parseInt(dbID)) {
        let listing_id_number = sessionDatabase[userID].listing;
        let buyer_id_number = sessionDatabase[userID].id;
        let buyer_name = sessionDatabase[userID].buyer;
        let query_params = [userID, listing_id_number, buyer_id_number];
        let name = req.session.user_name;
          messageQueries
            .getConversation(query_params)
            .then((data) => {
              for (let items of data) {
                let sent = moment(items.time_sent).fromNow();
                items.time_sent = sent;
              }
              const templateVars = {
                userName: name,
                user_id: userID,
                messages: data,
                buyerName: buyer_name,
              };
              res.render("messages", templateVars);
            })
            .catch((err) => {
              console.log(err);
            });

      } else {
        res.send("You do not have permission to perform this action!");
      }
    };
    getObject();
    }
    
  });
  return router;
};

module.exports = allMessageRouter;

