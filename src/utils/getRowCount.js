const db = require("../../config/dbConfig");
const getRowCount = async (tableName) => {
  const q = `select count(*) as totalCount from ${tableName}`;
  const [res] = await db.query(q);
  return res[0].totalCount;
};
module.exports = getRowCount;
