// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./db.js');
const db = new Pool(dbParams);
db.connect(() => {
  console.log('connected to database')
});

module.exports = db;