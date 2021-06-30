const express = require('express');
const router = express.Router();
const buySellQueries = require('../db/queries/buy-sell-queries');
const helperQueries = require('../db/queries/helper-queries-and-functions');

const buySellRouter = (db) => {

//GET /buy-sell
  router.get('/', (req, res) => {
    buySellQueries.getAllCategories(db)
    .then((categories) => {
      buySellQueries.getAllListings(db)
      .then((listings) => {
        const templateVars = {user: null, listings, categories}
        res.render('index', templateVars);
      })
    })
  })

//POST /buy-sell
  router.post('/', (req, res) => {
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
  })

//GET /buy-sell/new
router.get('/new', (req, res) => {
  const user_id = req.session.user_id;
  console.log(user_id);
  res.render('buy_sell_new')
})

//GET /buy-sell/favorites
router.get('/favorites', (req, res) => {
  const buyerId = 5
  buySellQueries.getFavorites(buyerId, db)
  .then((favorites) => {
    const templateVars = {user:null, favorites}
    res.render('buy_sell_favorites', templateVars);
  })
})

//POST /buy-sell/favorites
router.post('/favorites', (req, res) => {
  const listingId = Object.keys(req.body)[0];
  const listing = {buyer_id: 5, listing_id: listingId};
  buySellQueries.addFavorite(listing, db)
  .then(() => {
    res.redirect('/buy-sell/favorites');
  })
})

//DELETE /buy-sell/favorites/delete
router.post('/favorites/delete', (req, res) => {
  listingId = Object.keys(req.body)[0];
  buySellQueries.deleteFavoriteListing(listingId, db)
  .then(() => {
    res.redirect('/buy-sell/favorites');
  })
})

//GET /buy-sell/categories
router.get('/categories', (req, res) => {
  buySellQueries.getAllCategories(db)
  .then((categories) => {
    const templateVars = {user:null, categories}
    res.render('buy_sell_categories', templateVars);;
  })
})

//GET /buy-sell/categories/:id
router.get('/categories/:id', (req, res) => {
  const categoryId = req.params.id;

  buySellQueries.getAllCategories(db)
    .then((categories) => {
      buySellQueries.getCategoryListings(categoryId, db)
      .then((category) => {
        console.log(category)
        const templateVars = {user:null, category, categories}
        res.render('buy_sell_categories_show', templateVars);
      })
    })
})


//GET /buy-sell/categories/:id/listings/:id
router.get('/categories/:id1/listings/:id2', (req, res) => {
  const categoryId = req.params.id1;
  const listingId = req.params.id2;

  console.log(categoryId, listingId)

  buySellQueries.getAllCategories(db)
    .then((categories) => {
      buySellQueries.getListing(listingId, categoryId, db)
      .then((categoryListings) => {
        console.log(categoryListings)
        const templateVars = {user:null, categoryListings, categories}
        res.render('buy_sell_listing_show', templateVars);
      })
    })
})

//DELETE /buy-sell/categories/:id/listings/:id
router.post('/categories/:id1/listings/:id2', (req, res) => {
  const listingId = req.params.id2;
  const categoryId = req.params.id1;
  buySellQueries.deleteListing(listingId, categoryId, db)
  .then(() => {
    res.redirect('/buy-sell');
  })
})

  return router;
};


module.exports = buySellRouter;
