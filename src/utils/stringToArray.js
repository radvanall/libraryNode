const stringToArray = (genres) => {
  if (genres[0] !== "[" || genres[genres.length - 1] !== "]") return false;
  const newString = genres.slice(1, genres.length - 1);
  return newString.split(",");
};
module.exports = stringToArray;
