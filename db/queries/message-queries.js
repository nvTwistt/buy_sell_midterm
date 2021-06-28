const db = require('../../lib/db-connection');
const getAllMessages = () => {
  return db.query(`
  SELECT DISTINCT a.to_id, a.from_id, a.name, a.date, a.listing_id 
  FROM (
    SELECT messages.to_id,
    messages.from_id,
    messages.time_sent,
    messages.message,
    MAX(DATE(messages.time_sent)) AS date,
    MAX(messages.time_sent::time) AS time,
    messages.listing_id, senders.name,
    CONCAT(listing_id, senders.name) as uniqueKey FROM messages
  JOIN users senders ON to_id = senders.id
  JOIN users receivers ON from_id = receivers.id
  JOIN listings ON listing_id = listings.id 
  WHERE from_id = 2 AND to_id = 6
  GROUP BY messages.to_id,
    messages.from_id,
    messages.time_sent,
    messages.listing_id,
    senders.name,
    messages.message
  ORDER BY date DESC, time DESC) a;`)
  .then((response) => {
    return response.rows;
  })
  .catch((err) => {
    res.send(err.message);
  });
};
module.exports = {
  getAllMessages
};