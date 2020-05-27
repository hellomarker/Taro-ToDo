const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database();

exports.main = async (event, context) => {
  console.log(event, context);
  const wxContext = cloud.getWXContext();
  let result = {};
  await db
    .collection(event.dbStr)
    .add({
      // data 字段表示需新增的 JSON 数据
      data: event.params,
    })
    .then((res) => {
      console.log(res);
    });

  return {
    ...result,
  };
};
