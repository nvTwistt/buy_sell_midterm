const express = require('express');
const router = express.Router();
const buySellQueries = require('../db/queries/buy-sell-queries');
const helperQueries = require('../db/queries/helper-queries-and-functions');
const buySellRouter = (db) => {

  // const userID = req.session.user_id;
  // const userDB = helperQueries.checkUser(userID).then((data) => {
  //   return data;
  // });
  // let idObject;
  // const getObject = async () => {
  //   idObject = await userDB;
  //   let dbID = idObject.id;
  //   if (userID && parseInt(userID) === parseInt(dbID)) {

  //   }
  // };
  // getObject();

  //GET /buy-sell
  //remove user authentication
  router.get('/', (req, res) => {
    const userID = req.session.user_id;
    const userDB = helperQueries.checkUser(userID).then((data) => {
      return data;
    });
    let idObject;
    const getObject = async () => {
      idObject = await userDB;

      buySellQueries.getAllCategories(db)
      .then((categories) => {
        buySellQueries.getAllListings(db)
          .then((listings) => {
            const templateVars = { user: null, listings, categories }
            console.log(listings)
            res.render('index', templateVars);
          })
      })
    };
    getObject();
  })

  //POST /buy-sell
  // remove authentication
  router.post('/', (req, res) => {
    const userID = req.session.user_id;
    const userDB = helperQueries.checkUser(userID).then((data) => {
      return data;
    });
    let idObject;
    const getObject = async () => {
      idObject = await userDB;
      let dbID = idObject.id;
      if (userID && parseInt(userID) === parseInt(dbID)) {
        const sellerId = parseInt(userID);
        const listing = req.body;
        listing['seller_id'] = sellerId;
        console.log(listing.category)
        buySellQueries.getCategoryForAddListing(listing.category, db)
          .then((categoryId) => {
            const id = categoryId['id'];
            listing['category_id'] = id;
            console.log(listing)
            buySellQueries.addListing(listing, db)
              .then(() => {
                res.redirect('/buy-sell')
              })
          })
      } else {
        alert("You do not have permission to perform this action!");
      }
    };
    getObject();

  })

  //GET /buy-sell/new
  //no need to change
  router.get('/new', (req, res) => {
    const userID = req.session.user_id;
    const userDB = helperQueries.checkUser(userID).then((data) => {
      return data;
    });
    let idObject;
    const getObject = async () => {
      idObject = await userDB;
      let dbID = idObject.id;
      if (userID && parseInt(userID) === parseInt(dbID)) {
        const user_id = req.session.user_id;
        console.log(user_id);
        res.render('buy_sell_new')
      } else {
        alert("You do not have permission to perform this action!");
      }
    };
    getObject();

  })

  //GET /buy-sell/favorites
  //leave as is
  router.get('/favorites', (req, res) => {
    const userID = req.session.user_id;
    const userDB = helperQueries.checkUser(userID).then((data) => {
      return data;
    });
    let idObject;
    const getObject = async () => {
      idObject = await userDB;
      let dbID = idObject.id;
      if (userID && parseInt(userID) === parseInt(dbID)) {
        console.log("userid", userID)
        const buyerId = parseInt(userID)
        buySellQueries.getFavorites(buyerId, db)
          .then((favorites) => {
            const user_id = parseInt(userID)
            const templateVars = { user_id, idObject, favorites }
            res.render('buy_sell_favorites', templateVars);
          })
      } else {
        alert("You do not have permission to perform this action!");
      }
    };
    getObject();
  })

  //POST /buy-sell/favorites
  //cross reference the user_id from favorites and the session_id
  router.post('/favorites', (req, res) => {
    const userID = req.session.user_id;
    if (!userID) {
      res.send("You do not have permission to perform this action!");
    } else {
      const userDB = helperQueries.checkUser(userID).then((data) => {
        return data;
      });
      let idObject;
      const getObject = async () => {
        idObject = await userDB;
        let dbID = idObject.id;
        const listingId = Object.keys(req.body)[0];
        console.log(listingId, dbID);
        buySellQueries.getBuyerID(listingId, parseInt(dbID), db)
          .then((data) => {
            if (data.length === 0) {
              //user favorites don't exist in database yet so add them to favorites list if they are authenticated
              //since you can not check with db yet
              if (userID && parseInt(userID) === parseInt(dbID)) {
                const listing = { buyer_id: parseInt(userID), listing_id: listingId };
                buySellQueries.addFavorite(listing, db)
                  .then(() => {
                    res.redirect('/buy-sell/favorites');
                  })
              }
            } else {
              //check db for user favorites then render them.
              let favorite_user_id = data[0].buyer_id;
              if (userID && parseInt(favorite_user_id) === parseInt(dbID)) {
                const listing = { buyer_id: parseInt(userID), listing_id: listingId };
                buySellQueries.addFavorite(listing, db)
                  .then(() => {
                    res.redirect('/buy-sell/favorites');
                  })
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      };
      getObject();
    }

  })

  //DELETE /buy-sell/favorites/delete
  //make sure favorites buyer_id = userID
  router.post('/favorites/delete', (req, res) => {
    const userID = req.session.user_id;
    const userDB = helperQueries.checkUser(userID).then((data) => {
      return data;
    });
    //Check favorites buyer_id = session id
    let idObject;
    const getObject = async () => {
      idObject = await userDB;
      let dbID = idObject.id;
      listingId = Object.keys(req.body)[0];
      console.log("id's: ", listingId, dbID);
      buySellQueries.favoriteCheck(listingId, dbID, db)
        .then((data) => {
          console.log("here: ", data);
          let buyer_id_from_favorites = data[0].buyer_id;
          console.log("userID: ", userID, "dbID: ", dbID, "favorites_ID: ", buyer_id_from_favorites);
          if (userID && parseInt(dbID) === parseInt(buyer_id_from_favorites)) {
            buySellQueries.deleteFavoriteListing(listingId, db)
              .then(() => {
                const user_id = parseInt(userID)
                const templateVars = { user_id, idObject, categories }
                res.redirect('/buy-sell/favorites');
              })
          }
        })
    };
    getObject();
  })

  //GET /buy-sell/categories
  //two cases for authenticated and not authenticated
  router.get('/categories', (req, res) => {
    const userID = req.session.user_id;
    if (!userID) {
      buySellQueries.getAllCategories(db)
        .then((categories) => {
          const templateVars = { user: null, categories }
          res.render('buy_sell_categories', templateVars);;
        })
    } else {
      const userDB = helperQueries.checkUser(userID).then((data) => {
        return data;
      });
      let idObject;
      const getObject = async () => {
        idObject = await userDB;
        let dbID = idObject.id;
        if (userID && parseInt(userID) === parseInt(dbID)) {
          buySellQueries.getAllCategories(db)
            .then((categories) => {
              const user_id = parseInt(userID)
                const templateVars = { user_id, idObject, categories }
              res.render('buy_sell_categories', templateVars);;
            })
        } else {
          res.send("You do not have permission to perform this action!");
        }
      };
      getObject();
    }
  })

  //GET /buy-sell/categories/:id
  //double case check if else
  router.get('/categories/:id', (req, res) => {
    const userID = req.session.user_id;
    const categoryId = req.params.id;
    if (!userID) {
      buySellQueries.getAllCategories(db)
        .then((categories) => {
          buySellQueries.getCategoryListings(categoryId, db)
            .then((category) => {
              console.log(category)
              const templateVars = { user: null, category, categories }
              res.render('buy_sell_categories_show', templateVars);
            })
        })
    } else {
      const userDB = helperQueries.checkUser(userID).then((data) => {
        return data;
      });
      let idObject;
      const getObject = async () => {
        idObject = await userDB;
        let dbID = idObject.id;
        if (userID && parseInt(userID) === parseInt(dbID)) {
          const categoryId = req.params.id;

          buySellQueries.getAllCategories(db)
            .then((categories) => {
              buySellQueries.getCategoryListings(categoryId, db)
                .then((category) => {
                  const user_id = parseInt(userID)
                const templateVars = { user_id, idObject, category, categories }
                  res.render('buy_sell_categories_show', templateVars);
                })
            })
        } else {
          res.send("You do not have permission to perform this action!");
        }
      };
      getObject();
    }
  })


  //GET /buy-sell/categories/:id/listings/:id
  //double check with the if else
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
              const templateVars = { user: null, categoryListings, categories }
              res.render('buy_sell_listing_show', templateVars);
            })
        })
    } else {
      const userDB = helperQueries.checkUser(userID).then((data) => {
        return data;
      });
      let idObject;
      const getObject = async () => {
        idObject = await userDB;
        let dbID = idObject.id;
        if (userID && parseInt(userID) === parseInt(dbID)) {
          buySellQueries.getAllCategories(db)
            .then((categories) => {
              buySellQueries.getListing(listingId, categoryId, db)
                .then((categoryListings) => {
                  categoryListings = categoryListings[0];
                  const user_id = parseInt(userID)
                  console.log(user_id === 6)
                  console.log(categoryListings.seller_id)
                  const templateVars = { user_id, idObject, categoryListings, categories }
                  res.render('buy_sell_listing_show', templateVars);
                })
            })
        } else {
          res.send("You do not have permission to perform this action!");
        }
      };
      getObject();
    }
  })

  //DELETE /buy-sell/categories/:id/listings/:id
  //cross referece with the seller id
  router.post('/categories/:id1/listings/:id2', (req, res) => {
    const userID = req.session.user_id;
    const userDB = helperQueries.checkUser(userID).then((data) => {
      return data;
    });
    //cross reference session id with seller id
    let idObject;
    const getObject = async () => {
      idObject = await userDB;
      let dbID = idObject.id;
      if (userID && parseInt(userID) === parseInt(dbID)) {
        const listingId = req.params.id2;
        const categoryId = req.params.id1;
        buySellQueries.deleteListing(listingId, categoryId, db)
          .then(() => {
            res.redirect('/buy-sell');
          })
      } else {
        alert("You do not have permission to perform this action!");
      }
    };
    getObject();

  })

  //edit /buy-sell/categories/:id/listings/:id/edit
  //cross reference session with seller id
  router.get('/categories/:id1/listings/:id2/edit', (req, res) => {
    const userID = req.session.user_id;
    const userDB = helperQueries.checkUser(userID).then((data) => {
      return data;
    });
    //cross reference session id with seller id
    let idObject;
    const getObject = async () => {
      idObject = await userDB;
      let dbID = idObject.id;
      if (userID && parseInt(userID) === parseInt(dbID)) {
        const listingId = req.params.id2;
        const categoryId = req.params.id1;
        console.log('here')
        buySellQueries.setActive(listingId, db)
          .then(() => {
            res.redirect('/buy-sell');
          })
      } else {
        res.send("You do not have permission to perform this action!");
      }
    };
    getObject();

  })

  return router;
};


module.exports = buySellRouter;

