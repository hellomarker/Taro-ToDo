const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database();

exports.main = async (event, context) => {
  console.log(event,context)
  const wxContext = cloud.getWXContext();
  let result = {};
  await db
    .collection(event.dbStr)
    .get()
    .then((res) => {
      result.data = res.data;
    });

  return {
    ...result,
  };
};
