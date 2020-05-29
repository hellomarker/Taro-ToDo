// 为什么不能用(?<=)呀 真***
// const reg = /([前昨今明后][天日早中晚])?([凌早中晚][晨午上])?[\d]((?<=0|1)[\d]|(?<=2)[0-4])?[点时:-]([\d]((?<=0|1)[\d]|(?<=2)[0-4])?[分])?/;
const reg = /([前昨今明后][天日早中晚])?([凌早中晚][晨午上])?[\d]([\d]|[0-4])?[点时:-]([\d]([\d]|[0-4])?[分])?/;

export function matchDate(str: string) {
  let result = reg.exec(str);
  if (result) str = result[0];
  else return false;

  str.replace(reg, (match, p1, p2) => {
    let datetime = new Date().getTime()
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
    return str;
  });
}


export const dateConvert = (time, format = "YYYY-MM-DD HH:mm:ss") => {
  const date = new Date(time);
  // 这里是为了解决 IOS/Safari 中new Date()的兼容问题 
  if (typeof time == "string") {
    const arr = time && time.split(/[\-\+ :T]/);
    if (arr && arr.length > 0) {
      date.setUTCFullYear(arr[0]);
      date.setUTCMonth(arr[1] - 1);
      date.setUTCDate(arr[2]);
      date.setUTCHours(arr[3]);
      date.setUTCMinutes(arr[4]);
      date.setUTCSeconds(arr[5]);
    }
  }
  const o = {
    "M+": date.getMonth() + 1,                 //月份   
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