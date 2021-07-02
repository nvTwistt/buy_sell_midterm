const express = require("express");
const moment = require("moment");
moment().format();
const router = express.Router();
const messageQueries = require("../db/queries/message-queries");
const userCheck = require("../db/queries/helper-queries-and-functions");
const sessionDatabase = {};
const helperFunctions = require("../public/scripts/helper");
const allMessageRouter = () => {
  //GET /posts
  router.get("/", (req, res) => {
    const userID = req.session.user_id;
    if (!userID) {
      res.send("You do not have permission to perform this action!");
    } else {
      const userDB = userCheck.checkUser(userID).then((data) => {
        return data;
      });
      let idObject;
      const getObject = async()=>{
        idObject = await userDB;
        let dbID = idObject.id;
        messageQueries
          .getAllMessages(userID)
          .then((data) => {
            if (userID && parseInt(userID) === parseInt(dbID)) {
              for (const items of data) {
                if (parseInt(items.to_id) === parseInt(userID)) {
                  let objectIndex = data.indexOf(items);
                  items["with"] = items.receiver;
                  data.splice(objectIndex, 1);
                } else {
                  items["with"] = items.sender;
                }
              }
              for (const obj of data) {
                let keys = Object.keys(obj);
                if (!keys.includes("with")) {
                  if (parseInt(userID) === parseInt(obj.from_id)) {
                    obj["with"] = obj.sender;
                  }
                }
              }
              const templateVars = {
                user_id: userID,
                messages: data,
                idObject,
              };
              res.render("messages_show", templateVars);
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
    const userID = req.session.user_id;
    if (!userID) {
      res.send("You do not have permission to perform this action!");
    } else {
      const returnData = req.body;
      const requiredData = returnData["requiredData"];
      const splitData = requiredData.split(",");
      const listing_id_number = splitData[0];
      const buyer_id_number = splitData[1];
      const sellerIdNumber = splitData[2];
      delete req.session.seller_id;
      req.session.seller_id = sellerIdNumber;
      let redirectKey;
      const userDB = userCheck.checkUser(userID).then((data) => {
        return data;
      });
      const getObject = async()=>{
        const idObject = await userDB;
        const dbID = idObject.id;
        if (userID && parseInt(userID) === parseInt(dbID)) {
          if (userID === buyer_id_number) {
            redirectKey = userID + sellerIdNumber + listing_id_number;
            messageQueries.getUserName(sellerIdNumber).then((data) => {
              sessionDatabase[sellerIdNumber] = {
                listing: listing_id_number,
                id: buyer_id_number,
                buyer: data[0].name,
              };
            });
            res.redirect(`/messages/${redirectKey}`);
          } else {
            redirectKey = buyer_id_number + userID + listing_id_number;
            messageQueries.getUserName(buyer_id_number).then((data) => {
              const buyer_name = data[0].name;
              sessionDatabase[userID] = {
                listing: listing_id_number,
                id: buyer_id_number,
                buyer: buyer_name,
              };
            });
            res.redirect(`/messages/${redirectKey}`);
          }
        }
      };
      getObject();
    }
  });

  router.post("/:id", (req, res) => {
    let user_id = req.session.user_id;
    if (!user_id) {
      res.send("You don't have permission to perform this action!");
    } else {
      const userDB = userCheck.checkUser(user_id).then((data) => {
        return data;
      });
      const getObject = async () => {
        const idObject = await userDB;
        const dbID = idObject.id;
        if (user_id && parseInt(user_id) === parseInt(dbID)) {
          const bodyText = req.body.text;
          const returnData = req.body;
          const requiredData = returnData["requiredData"];
          const messageIdentifier = helperFunctions.splitData(requiredData);
          const buyer_id = helperFunctions.getBuyer(messageIdentifier, user_id);
          const dateTime = helperFunctions.getDate();
          const listing_id_number = parseInt(messageIdentifier.list_id);
          const queryData = [
            parseInt(user_id),
            parseInt(buyer_id),
            dateTime,
            bodyText,
            parseInt(listing_id_number),
          ];
          messageQueries.insertNewMessage(queryData).catch((err) => {
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
    const sellerID = req.session.seller_id;
    if (!userID) {
      res.send("You don't have permission to perform this action!");
    } else {
      const userDB = userCheck.checkUser(userID).then((data) => {
        return data;
      });
      const getObject = async () => {
        const idObject = await userDB;
        const dbID = idObject.id;
        if (userID && parseInt(userID) === parseInt(dbID)) {
          const listing_id_number = sessionDatabase[sellerID].listing;
          const buyer_id_number = sessionDatabase[sellerID].id;
          const buyer_name = sessionDatabase[sellerID].buyer;
          const query_params = [
            req.session.seller_id,
            listing_id_number,
            buyer_id_number,
          ];
          const name = req.session.user_name;
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
                idObject,
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
