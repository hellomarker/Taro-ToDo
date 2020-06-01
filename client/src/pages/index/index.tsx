import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Input, Radio } from "@tarojs/components";
import "./index.scss";

import { matchDate, dateConvert } from "../../common/matchDate";

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
      isShwoAddBox: false,
      openid: '',
    };
  }
  componentWillMount() {
    setInterval(() => {
      this.setState({});
    }, 1000 * 60);
    // 获取openid
    Taro.cloud
      .callFunction({ name: "login" })
      .then(res => {
        this.setState({
          openid: res.result && res.result['OPENID']
        }, () => this.getToDoList())
      })

    // Taro.vibrateShort({
    //   success: () => {
    //     Taro.cloud.database().collection('todos')
    //       .where({
    //         _openid: this.state.openid,
    //         done: true
    //       })
    //       .remove()
    //       .then(() => this.getToDoList())
    //   }
    // })

  }

  getToDoList() {
    Taro.cloud.database().collection('todos')
      .where({
        _openid: this.state.openid,
      })
      .get().then(res => {
        this.setState({
          todoList: res.data
        });
      })
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() {
    Taro.onAccelerometerChange((e) => {
      if (this.state.isShwoAddBox) return
      console.log('x', e.x)
      console.log('y', e.y)
      console.log('z', e.z)
      if (e.x > 1 || e.y > 1 || e.z > 1) {
        Taro.showToast({
          title: '摇一摇成功',
          icon: 'success',
          duration: 2000
        })
        Taro.cloud.database().collection('todos')
          .where({
            _openid: this.state.openid,
            done: true
          })
          .remove()
          .then(() => this.getToDoList())
      }
    })
  }

  componentDidHide() {
    Taro.stopAccelerometer()
  }

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
            <Text>{nowDate.getFullYear()}</Text>
          </View>
        </View>
        <Text>
          {("0" + nowDate.getHours()).replace(reg, "")}:{("0" + nowDate.getMinutes()).replace(reg, "")}
        </Text>
      </View>
    );
  }

  onDone(id) {
    const { todoList } = this.state;
    const newList = todoList.map(e => {
      if (e._id == id) {
        e.done = !e.done;
        Taro.cloud.database().collection('todos').doc(id).update({ data: { done: e.done } })
      }
      return e;
    });
    this.setState({
      todoList: newList
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
              {/* 文本 */}
              <Text className='list-item-text' onClick={() => this.onDone(e._id)}>{e.inputValue}</Text>
              {/* ckeckbox */}
              <View className={`list-item-icon ${!e.nodate && !e.done ? 'check' : ''}`}>
                <Text className='iconalarm'></Text>
              </View>
              {/* 左右滑动 */}
            </View>
          );
        })
        }
      </View >
    );
  }

  /**
   * 渲染TODO页
   */
  renderTODO() {
    return (
      <View className="page" >
        {/* 时间 */}
        {this.renderNowDate()
        }
        {this.renderList()}
      </View>
    );
  }

  onInput(e) {
    this.setState({
      toDoObj: {
        inputValue: e.detail.value.trim(),
        date: matchDate(e.detail.value.trim()),
        nodate: !matchDate(e.detail.value.trim()),
        done: false,
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
    toDoObj.date && !toDoObj.nodate && Taro.requestSubscribeMessage({
      tmplIds: ['i0_a7IsXWe6ZRHZR9ro0ach2dQldcMgi-hLFfVmQWu0'],
      success: (mes_res) => { console.log(mes_res) },
      fail: () => { },
      complete: (res) => { console.log(res) },
    })

    Taro.cloud.database().collection('todos')
      .add({
        data: { lastModified: new Date(), ...toDoObj, yindex: todoList.length ? todoList[todoList.length - 1].yindex + 1 : 0, },
      }).then(res => console.log(res))

    const newList = [
      ...todoList,
      {
        yindex: todoList.length ? todoList[todoList.length - 1].yindex + 1 : 0,
        inputValue: toDoObj.inputValue,
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
                {dateConvert(toDoObj.date, 'YYYY年MM月DD日 HH:mm')}
              </Text>
            ) : <Text></Text>}
            {toDoObj.date && !toDoObj.nodate ? <Text className="icon iconalarm"></Text> : <Text className="icon iconadd-alarm"></Text>}
          </View>
        </View>
        <View className="bottom">
          <Text className="icondui" onClick={this.inputSubmit}></Text>
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
      </View>
    );
  }
}

const DIST = 30;
const SHORT = -98;
