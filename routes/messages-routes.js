const express = require("express");
const moment = require("moment");
moment().format();
const router = express.Router();
const messageQueries = require("../db/queries/message-queries");
const userCheck = require("../db/queries/helper-queries-and-functions");
const sessionDatabase = {};
const helperFunctions = require("../public/scripts/helper");
const allMessageRouter = () => {

  /**
   * GET request to handle messages
   * url: /messages
   * Function first checks to see if the user is authenticated, then checks
   * if their user id exists in the data base. Calls the getAllMessages function
   * which pases in userID as an argument. The code will iterate through the returned
   * object from the query and determine who the conversation is with then it will
   * render the template to show the message overviews.
   */
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
              const userId = parseInt(userID);
              const templateVars = {
                userId,
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

  /**
   * POST request to handle if a user wants to view their conversation
   * Function will first check if the userID exists then proceeds to process the data
   * There is two cases that we check for. The first is if the current user is the
   * seller of the item and the second is if the user wants to buy the listed item.
   * This is an important step so that the redirectKey is the same for both users in the conversation
   * Once the results are determined, the information is stored in an object.
   */
  router.post("/", (req, res) => {
    const userID = req.session.user_id;
    if (!userID) {
      res.send("You do not have permission to perform this action!");
    } else {
      const returnData = req.body;
      const requiredData = returnData["requiredData"];
      const identifier = helperFunctions.identifyRoles(requiredData);
      delete req.session.sellerId;
      req.session.sellerId = identifier.sellerIdNumber;
      let redirectKey;
      const userDB = userCheck.checkUser(userID).then((data) => {
        return data;
      });
      const getObject = async()=>{
        const idObject = await userDB;
        const dbID = idObject.id;
        if (userID && parseInt(userID) === parseInt(dbID)) {
          if (parseInt(userID) === parseInt(identifier.buyer_id_number)) {
            redirectKey = userID + identifier.sellerIdNumber + identifier.listing_id_number;
            messageQueries.getUserName(identifier.sellerIdNumber).then((data) => {
              sessionDatabase[identifier.sellerIdNumber] = {
                listing: identifier.listing_id_number,
                id: identifier.buyer_id_number,
                buyer: data[0].name,
              };
            });
            res.redirect(`/messages/${redirectKey}`);
          } else {
            redirectKey = identifier.buyer_id_number + userID + identifier.listing_id_number;
            messageQueries.getUserName(identifier.buyer_id_number).then((data) => {
              const buyerName = data[0].name;
              sessionDatabase[userID] = {
                listing: identifier.listing_id_number,
                id: identifier.buyer_id_number,
                buyer: buyerName,
              };
            });
            res.redirect(`/messages/${redirectKey}`);
          }
        }
      };
      getObject();
    }
  });

  /**
   * POST request for /messages/:id which handles when a user wants to send a message to another user
   * A user can only send a message if they are authenticated
   * The function gets the message content and the required data to correctly
   * add the message to the database. The information is put into an array which is then
   * passed into the function when we insert the data into the table. The page will then
   * render which will instantly update the conversation.
   */
  router.post("/:id", (req, res) => {
    let userIdNumber = req.session.user_id;
    if (!userIdNumber) {
      res.send("You don't have permission to perform this action!");
    } else {
      const userDB = userCheck.checkUser(userIdNumber).then((data) => {
        return data;
      });
      const getObject = async() => {
        const idObject = await userDB;
        const dbID = idObject.id;
        if (userIdNumber && parseInt(userIdNumber) === parseInt(dbID)) {
          const bodyText = req.body.text;
          const returnData = req.body;
          const requiredData = returnData["requiredData"];
          const messageIdentifier = helperFunctions.splitData(requiredData);
          const buyerId = helperFunctions.getBuyer(messageIdentifier, userIdNumber);
          const dateTime = helperFunctions.getDate();
          const listingIdNumber = parseInt(messageIdentifier.list_id);
          const queryData = [
            parseInt(userIdNumber),
            parseInt(buyerId),
            dateTime,
            bodyText,
            parseInt(listingIdNumber),
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

  /**
   * GET request which handles for when the user wants to view their conversation
   * It will first check if the user is authenticated. It will then retrieve the information
   * about the conversation from the sessionDatabase which contains the listing, seller_id, buyer_id
   * and the buyer name. The information is stored in an array which is passed in as a paramater to the query function
   * and then we insert a timestamp using the moment library, then render the rest the messages on the browser.
   */
  router.get("/:id", (req, res) => {
    const userID = req.session.user_id;
    const sellerID = req.session.sellerId;
    if (!userID) {
      res.send("You don't have permission to perform this action!");
    } else {
      const userDB = userCheck.checkUser(userID).then((data) => {
        return data;
      });
      const getObject = async() => {
        const idObject = await userDB;
        const dbID = idObject.id;
        if (userID && parseInt(userID) === parseInt(dbID)) {
          const listingIdNumber = sessionDatabase[sellerID].listing;
          const buyerIdNumber = sessionDatabase[sellerID].id;
          const buyersName = sessionDatabase[sellerID].buyer;
          const queryParams = [
            req.session.sellerId,
            listingIdNumber,
            buyerIdNumber,
          ];
          const name = req.session.user_name;
          messageQueries
            .getConversation(queryParams)
            .then((data) => {
              for (let items of data) {
                let sent = moment(items.time_sent).fromNow();
                items.time_sent = sent;
              }
              const userId = parseInt(userID);
              const templateVars = {
                userId,
                userName: name,
                userIdNum: userID,
                messages: data,
                buyerName: buyersName,
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
