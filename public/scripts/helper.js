const populateDB = function (db, userID, listing_id_number, buyer_id_number, buyer_name) {
  db[userID] = {
    listing: listing_id_number,
    id: buyer_id_number,
    buyer: buyer_name
  };
};

module.exports = {populateDB}
