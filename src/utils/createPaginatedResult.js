const createPaginatedResult = (page, limit, offset, totalNumber, data) => {
  const result = {
    data,
    totalNumber,
  };
  if (page * limit < totalNumber) {
    result.next = {
      limit,
      page: page + 1,
    };
  }
  if (offset > 0 && data.length > 0) {
    result.previous = {
      limit,
      page: page - 1,
    };
  }
  return result;
};
module.exports = createPaginatedResult;
