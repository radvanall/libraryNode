const stringToArray = require("./stringToArray");
const containsOnlyNumbers = require("./containsOnlyNumbers");
const getGenres = (genres) => {
  const genresArray = stringToArray(genres);
  if (!genresArray) return false;
  const numberArray = [];
  for (let genre of genresArray) {
    if (!containsOnlyNumbers(genre)) return false;
    numberArray.push(parseInt(genre));
  }
  return numberArray;
};
module.exports = getGenres;
