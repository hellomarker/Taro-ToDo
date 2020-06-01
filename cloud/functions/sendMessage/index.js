const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    cloud.database().collection('todos')
      .where({
        done: false,
        nodate: false
      })
      .get().then(res => {
        res.data && res.data.forEach(element => {
          if (dateConvert(element.date, 'YYYY年MM月DD日 HH:mm') == dateConvert(Date.now(), 'YYYY年MM月DD日 HH:mm')) {
            cloud.openapi.subscribeMessage.send({
              touser: element._openid,
              page: 'index',
              data: {
                time2: {
                  value: dateConvert(element.date + 1000 * 60 * 60 * 8, 'YYYY年MM月DD日 HH:mm')
                },
                thing3: {
                  value: element.inputValue
                },
              },
              templateId: 'i0_a7IsXWe6ZRHZR9ro0ach2dQldcMgi-hLFfVmQWu0',
              // miniprogramState: 'developer'
            })
          }
          cloud.database().collection('todos').doc(element._id).update({ data: { nodate: true } })
        });
      })
  } catch (err) {
    return err
  }
}

const dateConvert = (time, format = "YYYY-MM-DD HH:mm:ss") => {
  const date = new Date(time);
  // 这里是为了解决 IOS/Safari 中new Date()的兼容问题 
  if (typeof time == "string" && /(\d{2,4})-(\d{1,2})-(\d{1,2})/.test(time))
    time = time.replace(/(\d{2,4})-(\d{1,2})-(\d{1,2})/, '$1/$2/$3')

  const o = {
    "M+": date.getMonth() + 1,               //月份   
    "d+": date.getDate(),                    //日   
    "D+": date.getDate(),                    //日   
    "h+": date.getHours(),                   //小时   
    "H+": date.getHours(),                   //小时   
    "m+": date.getMinutes(),                 //分   
    "s+": date.getSeconds(),                 //秒   
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
    "S": date.getMilliseconds()             //毫秒   
  };
  if (/(y+)|(Y+)/.test(format))
    format = format.replace(RegExp.$1 || RegExp.$2, (date.getFullYear() + "").substr(4 - (RegExp.$1.length || RegExp.$2.length)));
  for (const k in o)
    if (new RegExp("(" + k + ")").test(format))
      format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return format
}