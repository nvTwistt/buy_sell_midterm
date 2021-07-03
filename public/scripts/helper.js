/**
 * Function split data takes in a string, splits it by "," and returns the results
 * in an object.
 * @param {*} string
 * @returns object of strings
 * 
 * Example:
 *  string = "1,2,3"
 * Returns: {
 *  first_id: 1,
 *  second_id: 2,
 *  list_id: 3
 *  }
 */
const splitData = function (string) {
  const split = string.split(",");
  let results = {
    first_id: split[0],
    second_id: split[1],
    list_id: split[2],
  };
  return results;
};

/**
 * Function calls the date function then calculates the current date and time
 * @returns datetime
 */
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
  if (
    messageIdentifier.first_id === user_id &&
    messageIdentifier.second_id !== user_id
  ) {
    return messageIdentifier.second_id;
  } else {
    return messageIdentifier.first_id;
  }
};

/**
 * Function split data takes in a string, splits it by "," and returns the results
 * in an object.
 * @param {*} string
 * @returns object of strings
 * 
 * Example:
 *  string = "1,2,3"
 * Returns: {
 *  first_id: 1,
 *  second_id: 2,
 *  list_id: 3
 *  }
 */
const identifyRoles = function (string) {
  const split = string.split(",");
  let results = {
    listing_id_number: split[0],
    buyer_id_number: split[1],
    sellerIdNumber: split[2],
  };
  return results;
}
module.exports = { splitData, getDate, getBuyer, identifyRoles };
