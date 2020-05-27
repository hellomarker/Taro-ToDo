const regex = /([前昨今明后][天日早中晚])?([凌早中晚][晨午上])?[\d]((?<=0|1)[\d]|(?<=2)[0-4])?[点时:-]([\d]((?<=0|1)[\d]|(?<=2)[0-4])?[分])?/;

export function matchDate(str) {
  let result = regex.exec(str);
  return result ? result[0] : undefined;
}
