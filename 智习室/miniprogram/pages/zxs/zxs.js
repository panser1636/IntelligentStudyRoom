// index.js
// 获取应用实例
import * as echarts from '../../ec-canvas/echarts';//需要注意这个地方的路径不用引用错误了
const app = getApp();


var option = {
  //折线图标题
  title: {
    text: '今日智习室人数分布',
    left: 'center'
  },
  // 折线图线条的颜色
  color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
  // 折线图的线条代表意义
  legend: {
    itemWidth: 5,//小圆点的宽度
    itemGap: 25,
    selectedModel: 'single',//折线可多选
    inactiveColor: '#87CEEB',
    data: [
      {
        name: '人数',
        icon: 'circle',
        textStyle: {
          color: '#000000',
        }
      }
    ],
    bottom: 0,
    left: 30,
    z: 100
  },
  // 刻度
  grid: {
    containLabel: true
  },
  // 悬浮图标
  tooltip: {
    show: true,
    trigger: 'axis',
    //这一步的效果是当你的光标在左边的时候，悬浮标题在右边，在右边的时候，悬浮标题在左边
    position: function (pos, params, dom, rect, size) {
      var obj = { top: 60 };
      obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
      return obj;
    }
  },
  //x坐标轴
  xAxis: {
    type: 'category',
    
    axisLabel: {
    interval:0,//代表显示所有x轴标签显示
    rotate:0, //代表逆时针旋转45度
  },
      //x坐标轴
    data: ["8-9:30", "9:30-11", "11-12:30", "12:30-14", "14-16:30"],
  },
     //y坐标轴
  yAxis: [
    {
      type: 'value',
    }
  ],
  dataZoom: [
    {
      type: 'slider',
      show: false,//show属性为false不展示缩放手柄，为true展示缩放手柄
      start: 0,
      end: 45,
      // handleSize: 88  该属性是缩放手柄的宽度
    },
    {
      type: 'inside',
      start: 0,
      end: 45
    }
  ],
  series: [{
    name: '人数',
    type: 'line',
    // 设置折线是否平滑
    smooth: false,
    showAllSymbol: true,
    // symbol: 'image://./static/images/guang-circle.png',
    symbolSize: 8,
    lineStyle: {
      normal: {
        color: "#2B68D4", // 线条颜色
      },
    },
    //如果不需要阴影部分，直接删除areaStyle就可以了
    areaStyle: { //区域填充样式
      normal: {
        //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: '#97CDFF'
        },
        {
          offset: 1,
          color: '#ffffff'
        }
        ], false),
      }
    },
     //对应x轴的y轴数据
    data: [0,0,0,0,0]
  }]
};


function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
  });
  canvas.setChart(chart);
  var pdata=[0,0,0,0,0]
  var people_cnt = 0 //今日人数
  wx.cloud.callFunction({
  name: "getzw",
  complete: res => {
    console.log("res.result.data",res.result.data)
    for (let i = 0; i < res.result.data.length; i++) {
        
        console.log("pdata",pdata)
        for (let t = 0; t < 5; t++)
        {
          if(res.result.data[i].sj[t][0] == 2){
            pdata[t] = pdata[t] + 1
            people_cnt = people_cnt + 1
        }
      }
  }
  option.series[0].data = pdata
  console.log("option.series[0].data",option.series[0].data)
  console.log("people_cnt:",people_cnt)
  // this.initChart()
  }
  })
  setTimeout(()=>
    {
      chart.setOption(option);
    }, 1000) //延时1ms 便于成功赋值
  
  return chart;
}

Page({
  data: {
   temp:0,
   light:0,
   people_count:0,
   cnt:0,
   countnew:0,
   open:false,
   open2:false,
   open3:false,
   imgsrc:["../../images/arrow-right.png","../../images/arrow-down.png"],
   index:0,
   index2:0,
   index3:0,
   ec:{onInit: initChart},
   
  //  switch1Checked:false,
  //  switch2Checked:false,
  //  switch3Checked:false,
  //  switch4Checked:false,
  //  switch5Checked:false,
  //  switch6Checked:false,
  },
  // 事件处理函数
  // onLoad: function (options) {
  //   var that = this
  //   that.getOption();
  //   that.setData({
  //     timer: setInterval(()=> {
  //       that.getOption();
  //     }, 1000)//1min更新一次
  // })
  //     console.log("hhhh")
  // },


  getOption:function(){
  console.log("hello")
  
},


getinfo(){
  var that = this
    wx.request({
    url: "https://api.heclouds.com/devices/1071444095/datapoints",   
    //将请求行中的数字换成自己的设备ID
    header: {
      "api-key": "s4gELAtbFIAtjkm53YJSEnRnY=U=" //自己的api-key
    },
    method: "GET",
    success: function (e) {
    console.log("获取成功",e)
    that.setData({
      temp:e.data.data.datastreams[1].datapoints[0].value,
      light:e.data.data.datastreams[2].datapoints[0].value,
      // people_count:e.data.data.datastreams[8].datapoints[0].value
    })
    console.log("temp==",that.data.temp)
    console.log("light==",that.data.light)
    // console.log("people_count==",that.data.people_count)
    }
   });
},

  settingled:function(){
    this.setData({
        open:!this.data.open
    })
    var indexx = this.data.index
    console.log("indexx",this.data.index)
    if(indexx==0)
    {
      this.setData({
        index: 1
      })
    }
    else{
      this.setData({
        index: 0
      })
    }
    
  },
  windowctl:function(){
    this.setData({
        open2:!this.data.open2
    })
    var indexx = this.data.index2
    console.log("indexx",this.data.index2)
    if(indexx==0)
    {
      this.setData({
        index2: 1
      })
    }
    else{
      this.setData({
        index2: 0
      })
    }
    
  },
  doorctl:function(){
    this.setData({
        open3:!this.data.open3
    })
    var indexx = this.data.index3
    console.log("indexx",this.data.index3)
    if(indexx==0)
    {
      this.setData({
        index3: 1
      })
    }
    else{
      this.setData({
        index3: 0
      })
    }
    
  },

  switch1Change:function (e) {
    var status = e.detail.value
    if(status==true) { 
      console.log(status)
      this.open_light1()
    }
    else {
      this.close_light1()
    }
  },
  switch2Change:function (e) {
    var status = e.detail.value
    if(status==true) { this.open_light2()}
    else {
      this.close_light2()
    }
  },
  switch3Change:function (e) {
    var status = e.detail.value
    if(status==true) { this.open_light3()}
    else {
      this.close_light3()
    }
  },
  switch4Change:function (e) {
    var status = e.detail.value
    if(status==true) { this.open_light4()}
    else {
      this.close_light4()
    }
  },
  switch5Change:function (e) {
    var status = e.detail.value
    if(status==true) { this.open_light5()}
    else {
      this.close_light5()
    }
  },
  switch6Change:function (e) {
    var status = e.detail.value
    if(status==true) { this.open_light6()}
    else {
      this.close_light6()
    }
  },
  switch7Change:function (e) {
    var status = e.detail.value
    if(status==true) { this.open_motor()}
    else {
      this.close_motor()
    }
  },
  switch10Change:function (e) {
    var status = e.detail.value
    if(status==true) { this.open_light6()}
    else {

    }
  },

  open_window1:function(){

  },

  open_light1:function(){
    console.log("kaidengla!!")
    let data={
    "datastreams": [  
	{"id": "ledbtn1","datapoints":[{"value": 1}]},
	//led是数据流的名称，value是要传上去的数值
    	]	
  }
   //按钮发送命令控制硬件
    wx.request({
      url:'https://api.heclouds.com/devices/1071444095/datapoints',
      header: {
        'content-type': 'application/json',  //json格式
        'api-key':'s4gELAtbFIAtjkm53YJSEnRnY=U='
      },
      method: 'POST',
      data: JSON.stringify(data),//data数据转换成JSON格式
      success(res){
        console.log("成功",res.data)  //打印
      },
      fail(res){
        console.log("失败",res)
      }
    })
 },

 close_light1:function(){
  let data={
  "datastreams": [  
{"id": "ledbtn1","datapoints":[{"value": 0}]},
//led是数据流的名称，value是要传上去的数值
    ]	
}
 //按钮发送命令控制硬件
  wx.request({
    url:'https://api.heclouds.com/devices/1071444095/datapoints',
    header: {
      'content-type': 'application/json',  //json格式
      'api-key':'s4gELAtbFIAtjkm53YJSEnRnY=U='
    },
    method: 'POST',
    data: JSON.stringify(data),//data数据转换成JSON格式
    success(res){
      console.log("成功",res.data)  //打印
    },
    fail(res){
      console.log("失败",res)
    }
  })
},

//将信息上传到云平台
open_light2:function(){
  let data={
  "datastreams": [  
{"id": "ledbtn2","datapoints":[{"value": 1}]},
//led是数据流的名称，value是要传上去的数值
    ]	
}
 //按钮发送命令控制硬件
  wx.request({
    url:'https://api.heclouds.com/devices/1071444095/datapoints',
    header: {
      'content-type': 'application/json',  //json格式
      'api-key':'s4gELAtbFIAtjkm53YJSEnRnY=U='
    },
    method: 'POST',
    data: JSON.stringify(data),//data数据转换成JSON格式
    success(res){
      console.log("成功",res.data)  //打印
    },
    fail(res){
      console.log("失败",res)
    }
  })
},

 close_light2:function(){
let data={
"datastreams": [  
{"id": "ledbtn2","datapoints":[{"value": 0}]},
//led是数据流的名称，value是要传上去的数值
  ]	
}
//按钮发送命令控制硬件
wx.request({
  url:'https://api.heclouds.com/devices/1071444095/datapoints',
  header: {
    'content-type': 'application/json',  //json格式
    'api-key':'s4gELAtbFIAtjkm53YJSEnRnY=U='
  },
  method: 'POST',
  data: JSON.stringify(data),//data数据转换成JSON格式
  success(res){
    console.log("成功",res.data)  //打印
  },
  fail(res){
    console.log("失败",res)
  }
})
},

open_light3:function(){
  let data={
  "datastreams": [  
{"id": "ledbtn3","datapoints":[{"value": 1}]},
//led是数据流的名称，value是要传上去的数值
    ]	
}
 //按钮发送命令控制硬件
  wx.request({
    url:'https://api.heclouds.com/devices/1071444095/datapoints',
    header: {
      'content-type': 'application/json',  //json格式
      'api-key':'s4gELAtbFIAtjkm53YJSEnRnY=U='
    },
    method: 'POST',
    data: JSON.stringify(data),//data数据转换成JSON格式
    success(res){
      console.log("成功",res.data)  //打印
    },
    fail(res){
      console.log("失败",res)
    }
  })
},

close_light3:function(){
let data={
"datastreams": [  
{"id": "ledbtn3","datapoints":[{"value": 0}]},
//led是数据流的名称，value是要传上去的数值
  ]	
}
//按钮发送命令控制硬件
wx.request({
  url:'https://api.heclouds.com/devices/1071444095/datapoints',
  header: {
    'content-type': 'application/json',  //json格式
    'api-key':'s4gELAtbFIAtjkm53YJSEnRnY=U='
  },
  method: 'POST',
  data: JSON.stringify(data),//data数据转换成JSON格式
  success(res){
    console.log("成功",res.data)  //打印
  },
  fail(res){
    console.log("失败",res)
  }
})
},


open_light4:function(){
  let data={
  "datastreams": [  
{"id": "ledbtn4","datapoints":[{"value": 1}]},
//led是数据流的名称，value是要传上去的数值
    ]	
}
 //按钮发送命令控制硬件
  wx.request({
    url:'https://api.heclouds.com/devices/1071444095/datapoints',
    header: {
      'content-type': 'application/json',  //json格式
      'api-key':'s4gELAtbFIAtjkm53YJSEnRnY=U='
    },
    method: 'POST',
    data: JSON.stringify(data),//data数据转换成JSON格式
    success(res){
      console.log("成功",res.data)  //打印
    },
    fail(res){
      console.log("失败",res)
    }
  })
},

close_light4:function(){
let data={
"datastreams": [  
{"id": "ledbtn4","datapoints":[{"value": 0}]},
//led是数据流的名称，value是要传上去的数值
  ]	
}
//按钮发送命令控制硬件
wx.request({
  url:'https://api.heclouds.com/devices/1071444095/datapoints',
  header: {
    'content-type': 'application/json',  //json格式
    'api-key':'s4gELAtbFIAtjkm53YJSEnRnY=U='
  },
  method: 'POST',
  data: JSON.stringify(data),//data数据转换成JSON格式
  success(res){
    console.log("成功",res.data)  //打印
  },
  fail(res){
    console.log("失败",res)
  }
})
},

open_light5:function(){
  let data={
  "datastreams": [  
{"id": "ledbtn5","datapoints":[{"value": 1}]},
//led是数据流的名称，value是要传上去的数值
    ]	
}
 //按钮发送命令控制硬件
  wx.request({
    url:'https://api.heclouds.com/devices/1071444095/datapoints',
    header: {
      'content-type': 'application/json',  //json格式
      'api-key':'s4gELAtbFIAtjkm53YJSEnRnY=U='
    },
    method: 'POST',
    data: JSON.stringify(data),//data数据转换成JSON格式
    success(res){
      console.log("成功",res.data)  //打印
    },
    fail(res){
      console.log("失败",res)
    }
  })
},

close_light5:function(){
let data={
"datastreams": [  
{"id": "ledbtn5","datapoints":[{"value": 0}]},
//led是数据流的名称，value是要传上去的数值
  ]	
}
//按钮发送命令控制硬件
wx.request({
  url:'https://api.heclouds.com/devices/1071444095/datapoints',
  header: {
    'content-type': 'application/json',  //json格式
    'api-key':'s4gELAtbFIAtjkm53YJSEnRnY=U='
  },
  method: 'POST',
  data: JSON.stringify(data),//data数据转换成JSON格式
  success(res){
    console.log("成功",res.data)  //打印
  },
  fail(res){
    console.log("失败",res)
  }
})
},

open_light6:function(){
  let data={
  "datastreams": [  
{"id": "ledbtn6","datapoints":[{"value": 1}]},
//led是数据流的名称，value是要传上去的数值
    ]	
}
 //按钮发送命令控制硬件
  wx.request({
    url:'https://api.heclouds.com/devices/1071444095/datapoints',
    header: {
      'content-type': 'application/json',  //json格式
      'api-key':'s4gELAtbFIAtjkm53YJSEnRnY=U='
    },
    method: 'POST',
    data: JSON.stringify(data),//data数据转换成JSON格式
    success(res){
      console.log("成功",res.data)  //打印
    },
    fail(res){
      console.log("失败",res)
    }
  })
},

close_light6:function(){
let data={
"datastreams": [  
{"id": "ledbtn6","datapoints":[{"value": 0}]},
//led是数据流的名称，value是要传上去的数值
  ]	
}
//按钮发送命令控制硬件
wx.request({
  url:'https://api.heclouds.com/devices/1071444095/datapoints',
  header: {
    'content-type': 'application/json',  //json格式
    'api-key':'s4gELAtbFIAtjkm53YJSEnRnY=U='
  },
  method: 'POST',
  data: JSON.stringify(data),//data数据转换成JSON格式
  success(res){
    console.log("成功",res.data)  //打印
  },
  fail(res){
    console.log("失败",res)
  }
})
},

open_motor:function(){
  let data={
  "datastreams": [  
{"id": "button","datapoints":[{"value": 1}]},
//led是数据流的名称，value是要传上去的数值
    ]	
}
 //按钮发送命令控制硬件
  wx.request({
    url:'https://api.heclouds.com/devices/1071444095/datapoints',
    header: {
      'content-type': 'application/json',  //json格式
      'api-key':'s4gELAtbFIAtjkm53YJSEnRnY=U='
    },
    method: 'POST',
    data: JSON.stringify(data),//data数据转换成JSON格式
    success(res){
      console.log("成功",res.data)  //打印
    },
    fail(res){
      console.log("失败",res)
    }
  })
},

close_motor:function(){
let data={
"datastreams": [  
{"id": "button","datapoints":[{"value": 0}]},
//led是数据流的名称，value是要传上去的数值
  ]	
}
//按钮发送命令控制硬件
wx.request({
  url:'https://api.heclouds.com/devices/1071444095/datapoints',
  header: {
    'content-type': 'application/json',  //json格式
    'api-key':'s4gELAtbFIAtjkm53YJSEnRnY=U='
  },
  method: 'POST',
  data: JSON.stringify(data),//data数据转换成JSON格式
  success(res){
    console.log("成功",res.data)  //打印
  },
  fail(res){
    console.log("失败",res)
  }
})
},

  onLoad() {
    var that = this
    this.getinfo()
    setInterval(function(){
    that.getinfo()
    },60000) //单位ms
   
    setInterval(()=>
    {
      var people_cnt = 0 //今日人数
      wx.cloud.callFunction({
      name: "getzw",
      complete: res => {
        console.log("res.result.data",res.result.data)
        for (let i = 0; i < res.result.data.length; i++) {
            
            for (let t = 0; t < 5; t++)
            {
              if(res.result.data[i].sj[t][0] == 2){
                people_cnt = people_cnt + 1
            }
          }
      }
      console.log("people_cnt:",people_cnt)
      that.setData({
        people_count:people_cnt,
      })
      }
      })
    }, 1000) //延时1ms 便于成功赋值
  
    // setInterval(function(){
    //   that.getOption()
    //   },10000) //单位ms
    }
    
  }
)