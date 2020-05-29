const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
const db = cloud.database()

exports.main = async (event, context) => {
  console.log(event, context)
  const wxContext = cloud.getWXContext()
  let result = {}
  return await db
    .collection(event.dbStr)
    .add({
      data: { lastModified: new Date(), ...event.params },
    })
}
