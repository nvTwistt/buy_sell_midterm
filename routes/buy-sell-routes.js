const express = require('express');
const router = express.Router();
const buySellQueries = require('../db/queries/buy-sell-queries');

const buySellRouter = (db) => {

//GET /buy-sell
  router.get('/', (req, res) => {
    buySellQueries.getAllListings(db)
    .then((listings) => {
      res.json(listings);
    })
  })

//POST /buy-sell
  router.post('/', (req, res) => {
    buySellQueries.addListing(listingId, db)
    .then((listings) => {
      res.json(listings);
    })
  })

//GET /buy-sell/new
router.get('/new', (req, res) => {
  const user_id = req.session.user_id;
  console.log(user_id);
})

//GET /buy-sell/favorites
router.get('/favorites', (req, res) => {
  buySellQueries.getFavorites(listingId, db)
  .then((listings) => {
    res.json(listings);
  })
})

//POST /buy-sell/favorites
router.post('/favorites', (req, res) => {
  buySellQueries.addFavorite(listingId, db)
  .then((favorite) => {
    res.json(favorite);
  })
})

//DELETE /buy-sell/favorites
router.delete('/favorites', (req, res) => {
  buySellQueries.deleteFavoriteListing(listingId, db)
  .then((listings) => {
    res.json(listings);
  })
})

//GET /buy-sell/categories
router.get('/categories', (req, res) => {
  buySellQueries.getAllCategories(db)
  .then((categories) => {
    res.json(categories);
  })
})

//GET /buy-sell/categories/:id
router.get('/categories/:id', (req, res) => {
  buySellQueries.getCategoryListings(categoryId, db)
  .then((category) => {
    res.json(category);
  })
})


//GET /buy-sell/categories/:id/listings/:id
router.get('/categories/:id/listings/:id', (req, res) => {
  buySellQueries.getListing(listingId, categoryId, db)
  .then((categoryListings) => {
    res.json(categoryListings);
  })
})

//DELETE /buy-sell/categories/:id/listings/:id
router.delete('/categories/:id/listings/:id', (req, res) => {
  buySellQueries.deleteListing(listingId, categoryId, db)
  .then((listing) => {
    res.json(listing);
  })
})

  return router;
};


module.exports = buySellRouter;
