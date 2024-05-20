const setGenre = (book) => {
  if (book.genres) {
    const gens = book.genres.split(",");
    const gen = gens.map((g) => {
      const newG = g.split("|");
      return {
        genre: newG[0],
        genreId: parseInt(newG[1]),
      };
    });
    book.genres = gen;
  }
};
const setGenres = (data) => {
  data.forEach((book) => {
    setGenre(book);
    // if (book.genres) {
    //   const gens = book.genres.split(",");
    //   const gen = gens.map((g) => {
    //     const newG = g.split("|");
    //     return {
    //       genre: newG[0],
    //       genreId: parseInt(newG[1]),
    //     };
    //   });
    //   book.genres = gen;
    // }
  });
  return data;
};
module.exports = { setGenres, setGenre };
