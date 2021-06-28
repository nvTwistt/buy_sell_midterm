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
const getAllCategories = (db) => {
  return db.query(`SELECT name FROM category_list`)
  .then((response) => {
    return response.rows;
  })
  .catch((err) => {
    console.log(err.message);
  });
};

//create function to query individual listing
const getListing = (listingId, db) => {
  return db.query(`SELECT title, description, cover_photo_url, thumbnail_photo_url, price, city FROM listings
  WHERE listings.id = $1`, [listingId])
  .then((response) => {
    return response.rows;
  })
  .catch((err) => {
    console.log(err.message);
  });
};

//create function to query individual category
const getCategory = (categoryId, db) => {
  return db.query(`SELECT title, description, cover_photo_url, thumbnail_photo_url, price, city FROM listings
  JOIN category_list ON category_list.id = listings.category_id
  WHERE category_list.id = $1`, [categoryId])
  .then((response) => {
    return response.rows;
  })
  .catch((err) => {
    console.log(err.message);
  });
};

const getFavorites = (buyerId, db) => {
  return db.query(`SELECT title, description, cover_photo_url, thumbnail_photo_url, price, city FROM listings
  JOIN favorites ON favorites.listing_id = listings.id
  WHERE favorites.buyer_id = $1`, [buyerId])
  .then((response) => {
    return response.rows;
  })
  .catch((err) => {
    console.log(err.message);
  });
};

const addListing = (listing, db) => {
  const values = [listing.seller_id, listing.title, listing.description, listing.thumbnail_photo_url, listing.cover_photo_url, listing.price, listing.country, listing.street, listing.city, listing.province, listing.post_code, listing.buyer_id, listing.category_id];
  return db.query(`INSERT INTO listings(seller_id, title, description, thumbnail_photo_url, cover_photo_url, price, country, street, city, province, post_code, buyer_id, category_id)
  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`, values)
  .then((response) => {
    return response.rows;
  })
  .catch((err) => {
    console.log(err.message);
  });
};


module.exports = {
  getAllListings,
  getAllCategories,
  getListing,
  getCategory,
  getFavorites,
  addListing
};


