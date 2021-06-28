const db = require('../../lib/db-connection');
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
    res.send(err.message);
  });
};
module.exports = {
  getConversation
};