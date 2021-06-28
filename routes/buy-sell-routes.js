const express = require('express');
const router = express.Router();
const buySellQueries = require('../db/queries/buy-sell-queries');

const buySellRouter = (db) => {

  router.get('/', (req, res) => {
    const user_id = req.session.user_id;
    console.log(user_id);
    buySellQueries.getAllListings(db)
    .then((listings) => {
      res.json(listings);
    })
  })

  router.get('/categories')
  router.get('/new')

  return router;
};

  router.get('/')

module.exports = buySellRouter;
