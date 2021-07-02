const splitData = function (array) {
  const split = array.split(",");
  let results = {
    first_id: split[0],
    second_id: split[1],
    list_id: split[2],
  };
  return results;
};

const getDate = function () {
  const current = new Date();
  const cDate =
    current.getFullYear() +
    "-" +
    (current.getMonth() + 1) +
    "-" +
    current.getDate();
  let cTime =
    current.getHours() +
    ":" +
    current.getMinutes() +
    ":" +
    current.getSeconds();
  const dateTime = cDate + " " + cTime;
  return dateTime;
};

const getBuyer = function (messageIdentifier, user_id) {
  if (messageIdentifier.first_id === user_id && messageIdentifier.second_id !== user_id) {
    return messageIdentifier.second_id;
  } else {
    return messageIdentifier.first_id;
  }
}
module.exports = { splitData, getDate, getBuyer };
