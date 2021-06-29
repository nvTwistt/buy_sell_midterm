const express = require('express');
const router = express.Router();
const buySellQueries = require('../db/queries/buy-sell-queries');

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
    buySellQueries.addListing(listingId, db)
    .then(() => {
      res.redirect('/buy-sell')
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
  buySellQueries.getFavorites(buyerId, db)
  .then((favorites) => {
    const templateVars = {user:null, favorites}
    res.render('buy_sell_favorites', templateVars);
  })
})

//POST /buy-sell/favorites
router.post('/favorites', (req, res) => {
  buySellQueries.addFavorite(listingId, db)
  .then(() => {
    res.redirect('/buy-sell/favorites');
  })
})

//DELETE /buy-sell/favorites
router.delete('/favorites', (req, res) => {
  buySellQueries.deleteFavoriteListing(listingId, db)
  .then((listings) => {
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
        const templateVars = {user:null, category, categories}
        res.render('buy_sell_categories_show', templateVars);
      })
    })
})


//GET /buy-sell/categories/:id/listings/:id
router.get('/categories/:id1/listings/:id2', (req, res) => {
  const categoryId = req.params.id1;
  const listingId = req.params.id2;

  buySellQueries.getAllCategories(db)
    .then((categories) => {
      buySellQueries.getListing(listingId, categoryId, db)
      .then((categoryListings) => {
        const templateVars = {user:null, categoryListings}
        res.render('buy_sell_listing_show', templateVars);
      })
    })
})

//DELETE /buy-sell/categories/:id/listings/:id
router.delete('/categories/:id1/listings/:id2', (req, res) => {
  buySellQueries.deleteListing(listingId, categoryId, db)
  .then((listing) => {
    res.json(listing);
  })
})

  return router;
};


module.exports = buySellRouter;
