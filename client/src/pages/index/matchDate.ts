// 为什么不能用(?<=)呀 真***
// const reg = /([前昨今明后][天日早中晚])?([凌早中晚][晨午上])?[\d]((?<=0|1)[\d]|(?<=2)[0-4])?[点时:-]([\d]((?<=0|1)[\d]|(?<=2)[0-4])?[分])?/;
const reg = /([前昨今明后][天日早中晚])?([凌早中晚][晨午上])?[\d]([\d]|[0-4])?[点时:-]([\d]([\d]|[0-4])?[分])?/;

export function matchDate(str) {
  let result = reg.exec(str);
  return result ? result[0] : undefined;
}
