const express = require('express');
const router = express.Router();
const buySellQueries = require('../db/queries/buy-sell-queries');

const buySellRouter = (db) => {

  router.get('/', (req, res) => {
    buySellQueries.getAllListings(db)
    .then((listings) => {
      res.json(listings);
    })
  })


  return router;
};

module.exports = buySellRouter;
