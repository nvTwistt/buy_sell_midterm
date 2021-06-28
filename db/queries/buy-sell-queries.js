//import connection to database
const db = require('../../lib/db-connection');

//create function to query all listings
const getAllListings = (db) => {
  return db.query(`SELECT title, description, cover_photo_url, price, city FROM listings`)
  .then((response) => {
    return response.rows;
  })
  .catch((err) => {
    console.log(err.message);
  });
};

//create function to query all categories in database
const getAllCategories = () => {
  return db.query(`SELECT name FROM category_list`)
  .then((response) => {
    return response.rows;
  })
  .catch((err) => {
    console.log(err.message);
  });
};

//create function to query individual listing
const getListing = () => {
  return db.query(`SELECT title, description, cover_photo_url, thumbnail_photo_url, price, city FROM listings`)
  .then((response) => {
    return response.rows;
  })
  .catch((err) => {
    console.log(err.message);
  });
};

// const addListing = () => {
//   return db.query(`INSERT INTO listings(title, description, thumbnail_photo_url, cover_photo_url, price, country, street, city, province, post_code)`)
//   .then((response) => {
//     return response.rows;
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });
// };


module.exports = {
  getAllListings,
  getAllCategories,
  getListing
};


