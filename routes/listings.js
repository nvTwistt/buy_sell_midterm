const express = require('express');
const app = express();
const ENV = process.env.ENV || "development";
const bodyParser = require('body-parser');
const router = express.Router();
const db = require('../lib/db');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const routing = (db) => {
  console.log("jello");
  router.get("/", (req, res) => {
    console.log(req);
    db.query(`
    SELECT * FROM listings;`)
      .then(data => {
        res.json(data.rows);
        // console.log(data.rows);
        // const templateVars = {
        //   listings: data.rows
        // };
        // res.render('index', templateVars);
      })
      .catch(err => {
        res
          .status(500)
      });
  });
  return router;
}
  module.exports = routing;