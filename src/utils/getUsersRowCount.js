const db = require("../../config/dbConfig");
const getUsersRowCount = async (role, searchWord) => {
  let q = `select count(*) as totalCount from(select u.id,u.login,u.avatar,r.role,count(c.comment) as nrOfComments from users u left join users_roles ur on u.id=ur.users_id left join 
  roles r on r.id=ur.roles_id left join comments c on c.user_id=u.id  `;
  const searchPattern = `%${searchWord}%`;
  const params = [];
  if (role) {
    q += ` where `;
    q += ` r.role=? `;
    params.push(role);
  }
  if (searchWord) {
    if (role) {
      q += `and `;
    } else q += ` where `;
    q += ` u.login like ? `;
    params.push(searchPattern);
  }
  q += ` group by u.id,u.login,u.avatar,r.role) as t `;
  const [res] = await db.query(q, [...params]);
  console.log(res);
  return res[0].totalCount;
};
module.exports = getUsersRowCount;
