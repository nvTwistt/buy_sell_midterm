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
  router.get('/', (req, res) => {
    const userID = req.session.user_id;
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
            buySellQueries.getAllListings(db)
              .then((listings) => {
                const templateVars = { user: null, listings, categories }
                console.log(listings)
                res.render('index', templateVars);
              })
          })
      } else {
        alert("You do not have permission to perform this action!");
      }
    };
    getObject();
  })

  //POST /buy-sell
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
        const sellerId = 3;
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
        console.log("userid",userID)
        const buyerId = parseInt(userID)
        buySellQueries.getFavorites(buyerId, db)
          .then((favorites) => {
            console.log(favorites)
            const templateVars = { user: null, favorites }
            res.render('buy_sell_favorites', templateVars);
          })
      } else {
        alert("You do not have permission to perform this action!");
      }
    };
    getObject();
  })

  //POST /buy-sell/favorites
  router.post('/favorites', (req, res) => {
    const userID = req.session.user_id;
    const userDB = helperQueries.checkUser(userID).then((data) => {
      return data;
    });
    let idObject;
    const getObject = async () => {
      idObject = await userDB;
      let dbID = idObject.id;
      if (userID && parseInt(userID) === parseInt(dbID)) {
        const listingId = Object.keys(req.body)[0];
        const listing = { buyer_id: 5, listing_id: listingId };
        buySellQueries.addFavorite(listing, db)
          .then(() => {
            res.redirect('/buy-sell/favorites');
          })
      } else {
        alert("You do not have permission to perform this action!");
      }
    };
    getObject();

  })

  //DELETE /buy-sell/favorites/delete
  router.post('/favorites/delete', (req, res) => {
    const userID = req.session.user_id;
    const userDB = helperQueries.checkUser(userID).then((data) => {
      return data;
    });
    let idObject;
    const getObject = async () => {
      idObject = await userDB;
      let dbID = idObject.id;
      if (userID && parseInt(userID) === parseInt(dbID)) {
        listingId = Object.keys(req.body)[0];
        buySellQueries.deleteFavoriteListing(listingId, db)
          .then(() => {
            res.redirect('/buy-sell/favorites');
          })
      } else {
        alert("You do not have permission to perform this action!");
      }
    };
    getObject();

  })

  //GET /buy-sell/categories
  router.get('/categories', (req, res) => {
    const userID = req.session.user_id;
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
            const templateVars = { user: null, categories }
            res.render('buy_sell_categories', templateVars);;
          })
      } else {
        alert("You do not have permission to perform this action!");
      }
    };
    getObject();

  })

  //GET /buy-sell/categories/:id
  router.get('/categories/:id', (req, res) => {
    const userID = req.session.user_id;
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
                console.log(category)
                const templateVars = { user: null, category, categories }
                res.render('buy_sell_categories_show', templateVars);
              })
          })
      } else {
        alert("You do not have permission to perform this action!");
      }
    };
    getObject();

  })


  //GET /buy-sell/categories/:id/listings/:id
  router.get('/categories/:id1/listings/:id2', (req, res) => {
    const userID = req.session.user_id;
    const userDB = helperQueries.checkUser(userID).then((data) => {
      return data;
    });
    let idObject;
    const getObject = async () => {
      idObject = await userDB;
      let dbID = idObject.id;
      if (userID && parseInt(userID) === parseInt(dbID)) {
        const categoryId = req.params.id1;
        const listingId = req.params.id2;


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
        alert("You do not have permission to perform this action!");
      }
    };
    getObject();

  })

  //DELETE /buy-sell/categories/:id/listings/:id
  router.post('/categories/:id1/listings/:id2', (req, res) => {
    const userID = req.session.user_id;
    const userDB = helperQueries.checkUser(userID).then((data) => {
      return data;
    });
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
  router.get('/categories/:id1/listings/:id2/edit', (req, res) => {
    const userID = req.session.user_id;
    const userDB = helperQueries.checkUser(userID).then((data) => {
      return data;
    });
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
        alert("You do not have permission to perform this action!");
      }
    };
    getObject();

  })

  return router;
};


module.exports = buySellRouter;
