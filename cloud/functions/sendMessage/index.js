const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: wxContext.OPENID,
      page: 'index',
      data: {
        time2: {
          value: event.date
        },
        thing3: {
          value: event.content
        },
      },
      templateId: 'i0_a7IsXWe6ZRHZR9ro0ach2dQldcMgi-hLFfVmQWu0',
      // miniprogramState: 'developer'
    })
    return result
  } catch (err) {
    return err
  }
}
