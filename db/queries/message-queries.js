const db = require('../../lib/db-connection');


const getAllMessages = (userID) => {
  return db.query(`
  SELECT DISTINCT a.to_id, a.from_id, a.sender, a.receiver, a.date, a.listing_id
  FROM (
    SELECT messages.to_id,
    messages.from_id,
    messages.time_sent,
    messages.message,
    MAX(DATE(messages.time_sent)) AS date,
    MAX(messages.time_sent::time) AS time,
    messages.listing_id, senders.name AS sender, receivers.name AS receiver,
    CONCAT(listing_id, senders.name) as uniqueKey FROM messages
  JOIN users senders ON to_id = senders.id
  JOIN users receivers ON from_id = receivers.id
  JOIN listings ON listing_id = listings.id 
  WHERE to_id = $1
  GROUP BY messages.to_id,
    messages.from_id,
    messages.time_sent,
    messages.listing_id,
    senders.name, receivers.name,
    messages.message
  ORDER BY date DESC, time DESC) a;
`,[userID])
  .then((response) => {
    return response.rows;
  })
  .catch((err) => {
    console.log(err);
  });
};

const getConversation = () => {
  return db.query(`SELECT messages.to_id, messages.from_id, messages.time_sent, messages.message FROM messages
  JOIN users senders ON to_id = senders.id
  JOIN users receivers ON from_id = receivers.id
  JOIN listings ON listing_id = listings.id
  WHERE ((to_id = 2 AND from_id = 6) OR (to_id = 6 AND from_id = 2))
   AND listing_id = 2 ORDER BY messages.time_sent DESC;`)
  .then((response) => {
    return response.rows;
  })
  .catch((err) => {
    console.log(err);
  });
};


module.exports = {
  getAllMessages,
  getConversation
};