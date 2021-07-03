const express = require('express');
const router = express.Router();
const buySellQueries = require('../db/queries/buy-sell-queries');
const helperQueries = require('../db/queries/helper-queries-and-functions');
const userCheck = require("../db/queries/helper-queries-and-functions");
const buySellRouter = (db) => {


  //All routes have user authentication success and non success cases


  //GET /buy-sell
  router.get('/', (req, res) => {
    const userID = req.session.user_id;
    // initialize variables for random number storing. Will be used to pass a listing id to features section
    let rand1;
    let rand2;
    let rand3;
    let rand4;

    //User authentication non-user route
    if (!userID) {
      //Query database to find all categories and all listings
      buySellQueries.getAllCategories(db)
        .then((categories) => {
          buySellQueries.getAllListings(db)
            .then((listings) => {

              //initialize variables for min and max in random number generator
              const min = 0;
              const max = listings.length;

              //Ensure no numbers are the same
              while (rand1 === rand2 || rand1 === rand3 || rand1 === rand4 || rand2 === rand3 || rand2 === rand4 || rand3 === rand4) {
                rand1 = helperQueries.getRandomInt(min, max);
                rand2 = helperQueries.getRandomInt(min, max);
                rand3 = helperQueries.getRandomInt(min, max);
                rand4 = helperQueries.getRandomInt(min, max);
              }


              //Pass null if user does not exist
              const userId = null;
              const templateVars = { rand1, rand2, rand3, rand4, userId, listings, categories };
              res.render('index', templateVars);
            });
        });
    } else {
      //Happy path for logged in user
      //Check database for user. Same method applied to all routes that require.
      const userDB = helperQueries.checkUser(userID).then((data) => {
        return data;
      });
      //Create object to store user information. Will be used to render nav on all pages.
      let idObject;
      const getObject = async() => {
        idObject = await userDB;

        buySellQueries.getAllCategories(db)
          .then((categories) => {
            buySellQueries.getAllListings(db)
              .then((listings) => {

                const min = 0;
                const max = listings.length;

                while (rand1 === rand2 || rand1 === rand3 || rand1 === rand4 || rand2 === rand3 || rand2 === rand4 || rand3 === rand4) {
                  rand1 = helperQueries.getRandomInt(min, max);
                  rand2 = helperQueries.getRandomInt(min, max);
                  rand3 = helperQueries.getRandomInt(min, max);
                  rand4 = helperQueries.getRandomInt(min, max);
                }

                const userId = parseInt(userID);

                const templateVars = { rand1, rand2, rand3, rand4, userId, idObject, listings, categories };
                res.render('index', templateVars);
              });
          });
      };
      getObject();
    }
  });

  //POST /buy-sell
  // remove authentication
  router.post('/', (req, res) => {
    const userID = req.session.user_id;
    const userDB = helperQueries.checkUser(userID).then((data) => {
      return data;
    });
    let idObject;
    const getObject = async() => {
      idObject = await userDB;
      let dbID = idObject.id;
      if (userID && parseInt(userID) === parseInt(dbID)) {
        //cross reference listing seller ID with owner id for authentication
        const sellerId = parseInt(userID);
        const listing = req.body;
        listing['seller_id'] = sellerId;
        //function to query category that belongs to listing type before adding to database
        buySellQueries.getCategoryForAddListing(listing.category, db)
          .then((categoryId) => {
            const id = categoryId['id'];
            listing['category_id'] = id;
            buySellQueries.addListing(listing, db)
              .then(() => {
                res.redirect('/buy-sell');
              });
          });
      } else {
        res.send("You do not have permission to perform this action!");
      }
    };
    getObject();

  });

  //GET /buy-sell/new
  router.get('/new', (req, res) => {
    const userID = req.session.user_id;
    const userDB = helperQueries.checkUser(userID).then((data) => {
      return data;
    });
    let idObject;
    const getObject = async() => {
      idObject = await userDB;
      let dbID = idObject.id;
      if (userID && parseInt(userID) === parseInt(dbID)) {
        const userId = parseInt(req.session.user_id);
        const templateVars = { userId, idObject };
        res.render('buy_sell_new', templateVars);
      } else {
        res.send("You do not have permission to perform this action!");
      }
    };
    getObject();

  });

  router.get('/filterbyprice', (req, res) => {
    const userID = req.session.user_id;
    const userDB = helperQueries.checkUser(userID).then((data) => {
      return data;
    });
    let idObject;
    const getObject = async() => {
      idObject = await userDB;
      const userId = parseInt(req.session.user_id);
      const templateVars = { userId, idObject };
      res.render('buy_sell_search_price', templateVars);
    };
    getObject();
  });

  router.post('/filterbyprice', (req, res) => {
    const userID = req.session.user_id;
    const userDB = helperQueries.checkUser(userID).then((data) => {
      return data;
    });
    let idObject;
    const getObject = async() => {
      idObject = await userDB;
      buySellQueries.findByPrice(req.body.minprice, req.body.maxprice, db)
        .then((listings) => {
          const userId = parseInt(req.session.user_id);
          const templateVars = { userId, idObject, listings };
          res.render('buy_sell_price_search_listings', templateVars);

        });
    };
    getObject();
  });

  //GET /buy-sell/favorites
  router.get('/favorites', (req, res) => {
    const userID = req.session.user_id;
    const userDB = helperQueries.checkUser(userID).then((data) => {
      return data;
    });
    let idObject;
    const getObject = async() => {
      idObject = await userDB;
      let dbID = idObject.id;
      if (userID && parseInt(userID) === parseInt(dbID)) {
        const buyerId = parseInt(userID);
        //function to query database for user favorites
        buySellQueries.getFavorites(buyerId, db)
          .then((favorites) => {
            const userId = parseInt(userID);
            const templateVars = { userId, idObject, favorites };
            res.render('buy_sell_favorites', templateVars);
          });
      } else {
        res.send("You do not have permission to perform this action!");
      }
    };
    getObject();
  });

  //POST /buy-sell/favorites
  //cross reference the userId from favorites and the session_id
  router.post('/favorites', (req, res) => {
    const userID = req.session.user_id;
    if (!userID) {
      res.send("You do not have permission to perform this action!");
    } else {
      const userDB = helperQueries.checkUser(userID).then((data) => {
        return data;
      });
      let idObject;
      const getObject = async() => {
        idObject = await userDB;
        let dbID = idObject.id;
        //receive listing id from post request object and extract value
        const listingId = Object.keys(req.body)[0];
        buySellQueries.getBuyerID(listingId, parseInt(dbID), db)
          .then((data) => {
            if (data.length === 0) {
              //user favorites don't exist in database yet so add them to favorites list if they are authenticated
              //since you can not check with db yet
              if (userID && parseInt(userID) === parseInt(dbID)) {
                const listing = { buyer_id: parseInt(userID), listing_id: listingId };
                //function to add favorite to user database
                buySellQueries.addFavorite(listing, db)
                  .then(() => {
                    const userId = null;
                    const templateVars = { userId, idObject };
                    res.redirect('/buy-sell/favorites');
                  });
              }
            } else {
              //check db for user favorites then render them.
              let favorite_user_id = data[0].buyer_id;
              if (userID && parseInt(favorite_user_id) === parseInt(dbID)) {
                const listing = { buyer_id: parseInt(userID), listing_id: listingId };
                buySellQueries.addFavorite(listing, db)
                  .then(() => {
                    const userId = parseInt(userID);
                    res.redirect('/buy-sell/favorites');
                  });
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      };
      getObject();
    }

  });

  //DELETE /buy-sell/favorites/delete
  //make sure favorites buyer_id = userID
  router.post('/favorites/delete', (req, res) => {
    const userID = req.session.user_id;
    const userDB = helperQueries.checkUser(userID).then((data) => {
      return data;
    });

    let idObject;
    const getObject = async() => {
      idObject = await userDB;
      let dbID = idObject.id;
      const listingId = Object.keys(req.body)[0];
      //function to check if favorites buyer_id = session id
      buySellQueries.favoriteCheck(listingId, dbID, db)
        .then((data) => {
          const buyer_id_from_favorites = data[0].buyer_id;
          if (userID && parseInt(dbID) === parseInt(buyer_id_from_favorites)) {
            buySellQueries.deleteFavoriteListing(listingId, db)
              .then(() => {
                res.redirect('/buy-sell/favorites');
              });
          }
        });
    };
    getObject();
  });

  //GET /buy-sell/categories
  router.get('/categories', (req, res) => {
    const userID = req.session.user_id;
    if (!userID) {
      buySellQueries.getAllCategories(db)
        .then((categories) => {
          const userId = null;
          const templateVars = { userId, categories };
          res.render('buy_sell_categories', templateVars);
        });
    } else {
      const userDB = helperQueries.checkUser(userID).then((data) => {
        return data;
      });
      let idObject;
      const getObject = async() => {
        idObject = await userDB;
        let dbID = idObject.id;
        if (userID && parseInt(userID) === parseInt(dbID)) {
          buySellQueries.getAllCategories(db)
            .then((categories) => {
              const userId = parseInt(userID);
              const templateVars = { userId, idObject, categories };
              res.render('buy_sell_categories', templateVars);
            });
        } else {
          res.send("You do not have permission to perform this action!");
        }
      };
      getObject();
    }
  });

  //GET /buy-sell/categories/:id
  router.get('/categories/:id', (req, res) => {
    const userID = req.session.user_id;
    const categoryId = req.params.id;
    if (!userID) {
      buySellQueries.getAllCategories(db)
        .then((categories) => {
          //function to obtain all listings belonging to a particular category
          buySellQueries.getCategoryListings(categoryId, db)
            .then((category) => {
              const userId = null;
              const templateVars = { userId, category, categories };
              res.render('buy_sell_categories_show', templateVars);
            });
        });
    } else {
      const userDB = helperQueries.checkUser(userID).then((data) => {
        return data;
      });
      let idObject;
      const getObject = async() => {
        idObject = await userDB;
        let dbID = idObject.id;
        if (userID && parseInt(userID) === parseInt(dbID)) {
          const categoryId = req.params.id;

          buySellQueries.getAllCategories(db)
            .then((categories) => {
              buySellQueries.getCategoryListings(categoryId, db)
                .then((category) => {
                  const userId = parseInt(userID);
                  const templateVars = { userId, idObject, category, categories };
                  res.render('buy_sell_categories_show', templateVars);
                });
            });
        } else {
          res.send("You do not have permission to perform this action!");
        }
      };
      getObject();
    }
  });


  //GET /buy-sell/categories/:id/listings/:id
  router.get('/categories/:id1/listings/:id2', (req, res) => {
    const userID = req.session.user_id;
    const categoryId = req.params.id1;
    const listingId = req.params.id2;
    if (!userID) {
      buySellQueries.getAllCategories(db)
        .then((categories) => {
          buySellQueries.getListing(listingId, categoryId, db)
            .then((categoryListings) => {
              categoryListings = categoryListings[0];
              const userId = null;
              const templateVars = { userId, categoryListings, categories };
              res.render('buy_sell_listing_show', templateVars);
            });
        });
    } else {
      const userDB = helperQueries.checkUser(userID).then((data) => {
        return data;
      });
      let idObject;
      const getObject = async() => {
        idObject = await userDB;
        let dbID = idObject.id;
        if (userID && parseInt(userID) === parseInt(dbID)) {
          buySellQueries.getAllCategories(db)
            .then((categories) => {
              //function to check individual listing
              buySellQueries.getListing(listingId, categoryId, db)
                .then((categoryListings) => {
                  categoryListings = categoryListings[0];
                  const userId = parseInt(userID);
                  //function to check listing owner id with seller id
                  buySellQueries.checkSeller(listingId, db)
                    .then((data) => {
                      const to_id = parseInt(userID);
                      const seller_id_number = data[0].seller_id;
                      const templateVars = { userId, idObject, categoryListings, categories, seller_id_number, to_id, listingId };
                      res.render('buy_sell_listing_show', templateVars);
                    });
                });
            });
        } else {
          res.send("You do not have permission to perform this action!");
        }
      };
      getObject();
    }
  });

  //DELETE /buy-sell/categories/:id/listings/:id
  //cross referece with the seller id
  router.post('/categories/:id1/listings/:id2', (req, res) => {
    const userID = req.session.user_id;
    if (!userID) {
      res.send("You do not have permission to perform this action");
    } else {
      const userDB = helperQueries.checkUser(userID).then((data) => {
        return data;
      });
      //cross reference session id with seller id
      let idObject;
      const getObject = async() => {
        idObject = await userDB;
        let dbID = idObject.id;
        const listingId = req.params.id2;
        buySellQueries.checkSeller(listingId, db)
          .then((data) => {
            let seller_id_number = data[0].seller_id;
            if (userID && parseInt(seller_id_number) === parseInt(dbID)) {
              const categoryId = req.params.id1;
              buySellQueries.deleteListing(listingId, categoryId, db)
                .then(() => {
                  res.redirect('/buy-sell');
                });
            }
          });
      };
      getObject();
    }
  });

  //edit /buy-sell/categories/:id/listings/:id/edit
  //cross reference session with seller id
  router.get('/categories/:id1/listings/:id2/edit', (req, res) => {
    const userID = req.session.user_id;
    const userDB = helperQueries.checkUser(userID).then((data) => {
      return data;
    });
    //cross reference session id with seller id
    let idObject;
    const getObject = async() => {
      idObject = await userDB;
      let dbID = idObject.id;
      const listingId = req.params.id2;
      buySellQueries.checkSeller(listingId, db)
        .then((data) => {
          let seller_id_number = data[0].seller_id;
          if (userID && parseInt(seller_id_number) === parseInt(dbID)) {
            const listingId = req.params.id2;
            const categoryId = req.params.id1;
            buySellQueries.setActive(listingId, db)
              .then(() => {
                res.redirect('/buy-sell');
              });
          } else {
            res.send("You do not have permission to perform this action!");
          }
        });
    };
    getObject();
  });

  router.post("/views", (req, res) => {
    let user_id = req.session.user_id;
    if (!user_id) {
      res.send("You don't have permission to perform this action!");
    } else {
      const userDB = userCheck.checkUser(user_id).then((data) => {
        return data;
      });
      let idObject;
      const getObject = async() => {
        idObject = await userDB;
        let dbID = idObject.id;
        if (user_id && parseInt(user_id) === parseInt(dbID)) {
          const bodyText = res.req.body.form;
          let returnData = req.body;
          let requiredData = returnData["requiredData"];
          let splitData = requiredData.split(",");
          let first_id = splitData[0];
          let second_id = splitData[1];
          let listing = splitData[2];
          let redirectKey = first_id + second_id + listing;
          let buyer_id;
          if (first_id === user_id && second_id !== user_id) {
            buyer_id = second_id;
          } else {
            buyer_id = first_id;
          }
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
          let listing_id_number = listing;
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
            })
            .catch((err) => {
              console.log(err);
            });
          res.redirect(`/messages`);
        } else {
          res.send("You do not have permission to perform this action!");
        }
      };
      getObject();
    }

  });

  return router;
};


module.exports = buySellRouter;

