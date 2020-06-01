// 为什么不能用(?<=)呀 真***
// const reg = /([前昨今明后][天日早中晚])?([凌早中晚][晨午上])?[\d]((?<=0|1)[\d]|(?<=2)[0-4])?[点时:-]([\d]((?<=0|1)[\d]|(?<=2)[0-4])?[分])?/;
const reg = /([前昨今明后][天日早晚])?([凌早上中下晚][晨午上])?([1一十](\d|[一二三四五六七八九])?|[2二两]([0-4]|十[一二三四]?)?|[3-9三四五六七八九])[点时:-]([二三四五](十[一二三四五六七八九]?)?|[12345一二两三四五十](\d|[一二三四五六七八九])?|[6-9六七八九半])?[分]?/;

export function matchDate(str: string) {
  let result = reg.exec(str);
  if (result) str = result[0];
  else return 0;

  let datetime;
  return parseInt(str.replace(reg, (match, p1, p2, p3, p4, p5, p6) => {
    // 确认哪年哪月
    datetime = new Date(dateConvert(Date.now(), 'yyyy/MM/DD 00:00')).getTime()
    // 确认哪日
    if (p1)
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
      一: '1',
      十: '10',
      二: '2',
      两: '2',
      三: '3',
      四: '4',
      五: '5',
      六: '6',
      七: '7',
      八: '8',
      九: '9',
      半: '30'
    }
    if (p3) {
      if (/\d+/.test(p3)) {
        hours = /\d+/.exec(p3)
        if (hours) hours = hours[0]
      } else if (/[一二两三四五六七八九十]+/.test(p3)) {
        hours = /[一二两三四五六七八九十]+/.exec(p3)
        if (hours) hours = hours[0]

        if (hours.length == 1) {
          zh.十 = '10'
          hours = zh[hours]
        }
        else {
          if (/[一二两三四五](十)$/.test(hours)) zh.十 = '0';
          else if (/[一二两三四五](十)/.test(hours)) zh.十 = '';
          else zh.十 = '1';
          hours = zh[hours[0]] + zh[hours[1]] + (zh[hours[2]] ? zh[hours[2]] : '')
        }
      }

      if (/中午/.test(p1 + p2)) datetime += 1000 * 60 * 60 * (hours < 3 ? parseInt(hours) + 12 : hours)
      else if (/下午/.test(p1 + p2)) datetime += 1000 * 60 * 60 * (hours <= 12 ? parseInt(hours) + 12 : hours)
      else datetime += 1000 * 60 * 60 * hours
    }

    // 确认哪分
    let minute;
    if (p6) {
      if (/\d+/.test(p6)) {
        minute = /\d+/.exec(p6)
        if (minute) minute = minute[0]
      } else if (/([一二两三四五六七八九十]+|半)/.test(p6)) {
        minute = /([一二两三四五六七八九十]+|半)/.exec(p6)
        if (minute) minute = minute[0]

        if (minute.length == 1) {
          zh.十 = '10'
          minute = zh[minute]
        }
        else {
          if (/[一二两三四五](十)$/.test(minute)) zh.十 = '0';
          else if (/[一二两三四五](十)/.test(minute)) zh.十 = '';
          else zh.十 = '1';
          minute = zh[minute[0]] + zh[minute[1]] + (zh[minute[2]] ? zh[minute[2]] : '')
        }
      }
      datetime += 1000 * 60 * minute
    }


    return datetime;
  }));
}


export const dateConvert = (time, format = "YYYY-MM-DD HH:mm:ss") => {
  // 这里是为了解决 IOS/Safari 中new Date()的兼容问题 
  if (typeof time == "string" && /(\d{2,4})-(\d{1,2})-(\d{1,2})/.test(time))
    time = time.replace(/(\d{2,4})-(\d{1,2})-(\d{1,2})/, '$1/$2/$3')
  const date = new Date(time);

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