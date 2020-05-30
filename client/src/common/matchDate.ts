// 为什么不能用(?<=)呀 真***
// const reg = /([前昨今明后][天日早中晚])?([凌早中晚][晨午上])?[\d]((?<=0|1)[\d]|(?<=2)[0-4])?[点时:-]([\d]((?<=0|1)[\d]|(?<=2)[0-4])?[分])?/;
const reg = /([前昨今明后][天日早中晚])?([凌早上中下晚][晨午上])?([1一十](\d|[一二三四五六七八九])?|[2二两]([0-4]|十[一二三四]?)?|[3-9三四五六七八九])[点时:-]([\d]([\d]|[0-4])?[分])?/;

export function matchDate(str: string) {
  let result = reg.exec(str);
  if (result) str = result[0];
  else return false;

  str.replace(reg, (match, p1, p2, p3) => {
    // 确认哪年哪月
    let datetime = new Date(dateConvert(null, 'yyyy-MM-DD')).getTime()
    // 确认哪日
    switch (p1.substr(0, 1)) {
      case '前':
        datetime -= 1000 * 60 * 60 * 24 * 2
        break;
      case '昨':
        datetime -= 1000 * 60 * 60 * 24 * 1
        break;
      case '明':
        datetime += 1000 * 60 * 60 * 24 * 1
        break;
      case '后':
        datetime += 1000 * 60 * 60 * 24 * 2
        break;
    }
    // 确认哪时
    let hours;
    const zh = {
      一: 1,
      十: 1,
      二: 2,
      两: 2,
      三: 3,
      四: 4,
      五: 5,
      六: 6,
      七: 7,
      八: 8,
      九: 9,
    }
    if (p3)
      if (/\d+/.test(p3)) {
        hours = /\d+/.exec(p3)
        if (hours) datetime += 1000 * 60 * 60 * parseInt(hours[0])
      } else if (/[一二两三四五六七八九十]+/.test(p3)) {

      }



    // 确认哪分
    return str;
  });
}


export const dateConvert = (time, format = "YYYY-MM-DD HH:mm:ss") => {
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