# Taro-ToDo

    这是我开发给自己用的TODO应用，当然，独乐乐不如众乐乐，所以俺就开源了。

# 工作列表

- [ ] ToDo 列表
- [x] 完成功能
- [x] 清除已完成的 ToDo
- [x] 首页时间显示

---

- [x] 新增 ToDo 页
- [x] 添加功能
- [x] 实时根据输入内容获取提醒时间
- [x] 提醒时间到了发送订阅消息 x

---

- [ ] 设置页
- [ ] 新增/编辑 ToDo 列表和主题色

## 安装

```git
// 使用npm安装
npm install -g @tarojs/cli@2.2.6
// 安装完检查Taro是否安装上
Taro -v
// 使用yarn安装有可能出现该错误，可用npm重新安装，也可自己配环境变量
bash: Taro: command not found

cd client
yarn run dev:weapp
// 执行以上即可运行

Cannot read property 'hooks' of undefined
// 原因是 cli 版本与项目不一致
// 解决方法一
npm uninstall -g @tarojs/cli
npm install -g @tarojs/cli@2.2.6
然后删除依赖重新安装就好了
// 解决方法二
taro update self
npm install -g @tarojs/cli
taro update project
yarn run dev:weapp
```
