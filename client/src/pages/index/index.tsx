import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Input } from "@tarojs/components";
import "./index.scss";

import { matchDate } from "./matchDate";
import Login from '../../components/login/index.weapp'

/**
 * 触摸立刻获取的y轴高度，用于对比
 */
let pointY = 0;

export default class Index extends Component<any, any> {
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      toDoObj: { inputValue: "" },
      touchY: -200,
      isShwoAddBox: false
    };
  }
  componentWillMount() {
    Taro.getStorage({
      key: "todoList",
      success: res => {
        this.setState({
          todoList: res && res.data
        });
      }
    });
    setInterval(() => {
      this.setState({});
    }, 1000);

  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: "TODO便签"
  };

  renderNowDate() {
    const nowDate = new Date();
    const monthZH = [
      "一",
      "二",
      "三",
      "四",
      "五",
      "六",
      "七",
      "八",
      "九",
      "十",
      "十一",
      "十二"
    ];
    const reg = /.*(?=\d\d)/;
    return (
      <View className="nowDate-box">
        <View className="left">
          <Text>{("0" + nowDate.getDate()).replace(reg, "")}</Text>
          <View>
            <Text>{monthZH[nowDate.getMonth()]}月</Text>
            <Text>{("0" + nowDate.getFullYear()).replace(reg, "")}</Text>
          </View>
        </View>
        <Text>
          {("0" + nowDate.getHours()).replace(reg, "")}:{("0" + nowDate.getMinutes()).replace(reg, "")}:{("0" + nowDate.getSeconds()).replace(reg, "")}
        </Text>
      </View>
    );
  }

  onDone(current_yindex) {
    const { todoList } = this.state;
    const newList = todoList.map(e => {
      if (e.yindex == current_yindex) e.done = !e.done;
      return e;
    });
    this.setState({
      todoList: newList
    });
    Taro.setStorage({
      key: "todoList",
      data: newList
    });
  }
  /**
   * 渲染TODO列表
   */
  renderList() {
    const { todoList } = this.state;
    return (
      <View className="list-box">
        <Text className="list-box-title">TO DO</Text>
        {todoList.map(e => {
          return (
            <View
              key={e.yindex}
              className={`list-item ${e.done ? "done" : ""}`}
            >
              {/* ckeckbox */}
              {/* 文本 */}
              <Text onClick={() => this.onDone(e.yindex)}>{e.content}</Text>
              {/* 左右滑动 */}
            </View>
          );
        })}
      </View>
    );
  }

  /**
   * 渲染TODO页
   */
  renderTODO() {
    return (
      <View className="page">
        {/* 时间 */}
        {this.renderNowDate()}
        {this.renderList()}
      </View>
    );
  }

  onInput(e) {
    this.setState({
      toDoObj: {
        inputValue: e.detail.value.trim(),
        date: matchDate(e.detail.value.trim())
      }
    });
  }
  /**
   * 渲染Input
   * */
  renderInput() {
    const { toDoObj, isShwoAddBox } = this.state;
    return (
      <View className="input-box">
        <Input
          className="input"
          onInput={this.onInput}
          value={toDoObj.inputValue}
          focus={isShwoAddBox}
        ></Input>
      </View>
    );
  }

  /**
   * 输入信息提交
   * */
  inputSubmit() {
    const { todoList, toDoObj } = this.state;
    if (toDoObj.inputValue.length == 0) return;

    // 消息订阅申请
    Taro.getSetting({
      withSubscriptions: true,
      success: (set_res) => {
        if (!set_res.subscriptionsSetting.mainSwitch)
          Taro.requestSubscribeMessage({
            tmplIds: ['i0_a7IsXWe6ZRHZR9ro0ach2dQldcMgi-hLFfVmQWu0'],
            success: (mes_res) => { console.log(mes_res) },
            fail: () => { },
            complete: () => { },
          })
      },
    })
    // 发送消息
    !toDoObj.nodate && Taro.cloud
      .callFunction({
        name: "sendMessage",
        data: {
          date: toDoObj.date,
          content: toDoObj.inputValue
        }
      })
      .then(res => {
        console.log(res)
      })

    const newList = [
      ...todoList,
      {
        yindex: todoList.length ? todoList[todoList.length - 1].yindex + 1 : 0,
        content: toDoObj.inputValue,
        date: !toDoObj.nodate && toDoObj.date
      }
    ];
    this.setState({
      todoList: newList,
      toDoObj: {
        inputValue: '',
        date: undefined
      },
      isShwoAddBox: false
    });
    Taro.setStorage({
      key: "todoList",
      data: newList
    });

  }
  checkDate() {
    const { toDoObj } = this.state;
    this.setState(() => (toDoObj.nodate = !toDoObj.nodate), toDoObj);
  }
  /**
   * 渲染添加页
   */
  renderAddTODO() {
    const { touchY, isShwoAddBox, toDoObj } = this.state;
    return (
      <View
        className={`add-box shadow`}
        style={`transform: translateY(${isShwoAddBox ? 0 : touchY}%)`}
      >
        <View className="list-box">
          <Text className="list-box-title">Add To-do</Text>
          {this.renderInput()}
          <View className="list-box-contnet">
            {toDoObj.date ? (
              <Text
                className={`date ${toDoObj.nodate ? "" : "active"}`}
                onClick={this.checkDate}
              >
                {toDoObj.date}
              </Text>
            ) : <Text></Text>}
            {toDoObj.date && !toDoObj.nodate ? <Text className="icon icon-alarm"></Text> : <Text className="icon icon-add-alarm"></Text>}
          </View>
          {/* <View className="list-box-content">
            <Text></Text>F
            <Text className="icon-shizhong"></Text>
          </View> */}
        </View>
        <View className="bottom">
          <Text className="icon-dui" onClick={this.inputSubmit}></Text>
        </View>
      </View>
    );
  }

  /**
   * 渲染设置页
   */
  renderSetting() {
    return <View></View>;
  }

  onTouchStart(e) {
    pointY = e.changedTouches[0].pageY;
  }
  onTouchMove(e) {
    const { touchY, isShwoAddBox } = this.state;
    const currY = e.changedTouches[0].pageY;
    if (!isShwoAddBox) {
      if (currY - pointY > DIST)
        touchY != SHORT && this.setState({ touchY: SHORT });
    }
  }
  onTouchEnd(e) {
    const { touchY, isShwoAddBox } = this.state;
    const currY = e.changedTouches[0].pageY;
    if (isShwoAddBox) {
      if (pointY - currY >= DIST) this.setState({ isShwoAddBox: false });
    } else {
      if (currY >= pointY + DIST && touchY == SHORT)
        this.setState({ isShwoAddBox: true });
      this.setState({ touchY: -200 });
    }
  }
  render() {
    return (
      <View
        className="page"
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
      >
        {this.renderTODO()}
        {this.renderAddTODO()}
        {/* {this.renderSetting()} */}
        <Login></Login>
      </View>
    );
  }
}

const DIST = 30;
const SHORT = -98;
