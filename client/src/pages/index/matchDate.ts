const reg = /([前昨今明后][天日早中晚])?([凌早中晚][晨午上])?[\d]([\d]|(?<=2)[0-4])?[点时:-]([\d]([\d]|(?<=2)[0-4])?[分])?/;

export function matchDate(str) {
    debugger
  let result = reg.exec(str);
  return result ? result[0] : undefined;
}
