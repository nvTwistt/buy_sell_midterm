const db = require('../../lib/db-connection');


const getAllMessages = (userID) => {
  return db.query(`
  SELECT DISTINCT a.to_id, a.from_id, a.sender, a.receiver, a.title, a.listing_id
  FROM (
    SELECT messages.to_id,
    messages.from_id,
    messages.time_sent,
    messages.message,
    listings.title,
    MAX(DATE(messages.time_sent)) AS date,
    MAX(messages.time_sent::time) AS time,
    messages.listing_id, senders.name AS sender, receivers.name AS receiver,
    CONCAT(listing_id, senders.name) as uniqueKey FROM messages
  JOIN users senders ON to_id = senders.id
  JOIN users receivers ON from_id = receivers.id
  JOIN listings ON listing_id = listings.id 
  WHERE to_id = $1 or from_id = $1
  GROUP BY messages.to_id,
    messages.from_id,
    messages.time_sent,
    messages.listing_id,
    senders.name, receivers.name,
    messages.message, listings.title
  ORDER BY date DESC, time DESC) a;
`,[userID])
  .then((response) => {
    return response.rows;
  })
  .catch((err) => {
    console.log(err);
  });
};

const getConversation = (query_params) => {
  return db.query(`
  SELECT messages.to_id,
   receivers.name AS receiver_name,
   messages.from_id,
   senders.name AS sender_name,
   messages.time_sent,
   messages.message,
   messages.listing_id
  FROM messages
  JOIN users senders ON to_id = senders.id
  JOIN users receivers ON from_id = receivers.id
  JOIN listings ON listing_id = listings.id
  WHERE 
  ((to_id = $3 AND from_id = $1)
  OR 
  (to_id = $1 AND from_id = $3))
  AND listing_id = $2 
  ORDER BY messages.time_sent DESC;
  `, query_params)
  .then((response) => {
    return response.rows;
  })
  .catch((err) => {
    console.log(err);
  });
};

const insertNewMessage = (queryData) => {
  return db.query(`
  INSERT INTO messages
  (to_id, from_id, time_sent, message, listing_id) 
  VALUES ($2,$1, $3, $4, $5) RETURNING *;
  `, queryData)
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  })
};

const getUserName = (userID) => {
  return db.query(`
  SELECT users.name
  FROM users
  WHERE id = $1; 
  `, [userID])
  .then((data) => {
    return data.rows;
  })
}

module.exports = {
  getAllMessages,
  getConversation,
  insertNewMessage,
  getUserName
};