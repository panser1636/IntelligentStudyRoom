// pages/sm/sm.js
var wxbarcode=require('../../utils/index.js')
var times=require('../../utils/times.js')
const db= wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    code_openid:'',
    openid:'',
    userinfo:'',
    sqqk:0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app =getApp()
    var openid =app.globalData.openid
    var userinfo =wx.getStorageSync('userinfo')
    console.log("openid:",openid)
    this.setData({
      openid:openid,
      userinfo:userinfo,
      code_openid:openid.substr(-10).padStart(openid.length, "*")
    })
    wxbarcode.barcode('barcode',openid,600,100)
    wxbarcode.qrcode('qrcode',openid,420,420)
  },
  openqr:function(){
    // wx.requestSubscribeMessage({
    //   tmplIds: ['XFMWOFZYtxAiy21fNG9p7CZJHC_TM514nehqWnpfBR0'],
    //   success:res=> {
    //     console.log('授权成功', res)
    //     this.setData({
    //       sqqk:1 //授权情况
    //     })
        var openid=this.data.openid
        var sqqk=this.data.sqqk
        var xzsjd=''
        var bhxx=''
        var timestamp = Date.parse(new Date());
        var date = new Date(timestamp);
        var Y =date.getFullYear();
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
        var xs = 8// date.getHours()
        var fz = 0//date.getMinutes()
        var llsjd = 0
        if(xs == 8 | (xs == 9 & fz <= 30 )){llsjd = 0}
        else if ((xs == 9 & fz > 30) | xs == 10){llsjd = 1}//确定理论时间段
        var inde = 0
        var wid = ""
        db.collection("xzxx").get().then(res2 => {
          for(let i = 0; i = res2.data.length; i++)
          {
            console.log("res2.data:",res2.data)
            if(res2.data[i].xzsjd == llsjd) {
              console.log("wid:",wid)
              inde = i; wid = res2.data[i]._id;break;}
          }
        })


        console.log(+Y+"/"+M+"/"+D+" "+"8:00~9:30"); 
        var sj=+Y+"/"+M+"/"+D+" "
        wx.scanCode({   //扫码
          onlyFromCamera: true,
          success (res) {
            console.log(res.result) //扫描二维码的文档信息 charset->rawdata
            var resultid=res.result

            db.collection("tsgzw").doc(resultid).get().then(res=>{
              console.log(res.data.bh)
              bhxx=res.data.bh
            })
            db.collection("xzxx").where({zxzw:res.result}).get().then(res=>{
              console.log(res.data[inde].openid)
              if(res.data[inde].xzsj==0){
                xzsjd=sj+"8:00~9:30"
              }else if(res.data[inde].xzsj==1){
                xzsjd=sj+"9:30~11:00"
              }else if(res.data[inde].xzsj==2){
                xzsjd=sj+"11:00~12:30"
              }else if(res.data[inde].xzsj==3){
                xzsjd=sj+"12:30~2:00"
              }else{
                xzsjd=sj+"2:00~4:00"
              }

              if(res.data[inde].openid==openid){
                console.log("res.data[inde].qdzt:",res.data[inde].qdzt)
                var xzsj=""
                if(res.data[inde].qdzt==0){
                  db.collection("xzxx").where({_id:wid}).update({
                  data:{
                      qdzt:1,
                      qdsj:(new Date()).valueOf(),
                    },
                    success:res=>{
                      console.log(bhxx)
                      wx.showToast({
                        title: '签到成功',
                        icon: 'success',
                        duration: 2000,
                        success:res=>{
                          if(sqqk==1){
                            wx.cloud.callFunction({
                              name: "fstz",
                              data: {
                                openid: openid,
                                time:times.toDate(Date.parse(new Date())),
                                xzsjd:xzsjd,
                                bh:bhxx,
                                wz:"签到成功",
                                sj:sj
                              }
                            }).then(res => {
                              console.log(openid)
                              console.log("推送消息成功", res)
                            }).catch(res => {
                              console.log("推送消息失败", res)
                            })
                          }
                        }
                      })
                    }
                  })
                }else{
                  var qdsj=res.data[inde].qdsj
                  console.log("qdsj",qdsj)
                  var dateNow = (new Date()).valueOf(); 
                  var usedTime = dateNow-qdsj
                  console.log(usedTime)
                  var minutes=Math.floor(usedTime/(1000));
                  console.log(minutes)
                  if(minutes*10>10){
                    db.collection("xzxx").where({_id:wid}).update({
                      data:{
                            qt:true,
                            qtsj:(new Date()).valueOf(),
                        },
                        success:res=>{
                          wx.showToast({
                            title: '签退成功',
                            icon: 'success',
                            duration: 2000,
                            success:res=>{
                              if(sqqk==1){
                                wx.cloud.callFunction({
                                  name: "fstz",
                                  data: {
                                    openid: openid,
                                    time:times.toDate(Date.parse(new Date())),
                                    xzsjd:xzsjd,
                                    bh:bhxx,
                                    wz:"签退成功",
                                    sj:sj
                                  }
                                }).then(res => {
                                  console.log(openid)
                                  console.log("推送消息成功", res)
                                }).catch(res => {
                                  console.log("推送消息失败", res)
                                })
                              }
                            }
                          })
                        }
                      })
                  }else{
                    wx.showToast({
                      title: '签退间隔过短',
                      icon: 'error',
                      duration: 2000
                    })
                  }
                 
                }
              }else{
                wx.showToast({
                  title:'请检查座位',
                  icon:'error',
                  duration:2000,
                })
              }
    
            })
            /**/
          }
        })
    // },
    //   fail(res) {
    //     console.log('授权失败', res)
    //     var openid=this.data.openid
    //     var sqqk=this.data.sqqk
    //     wx.scanCode({
    //       onlyFromCamera: true,
    //       success (res) {
    //         console.log(res.result)
    //         var resultid=res.result
    //         db.collection("xzxx").where({zxzw:res.result}).get().then(res=>{
    //           console.log(res.data[0].openid)
    //           if(res.data[0].openid==openid){
    //             console.log(res.data[0].qdzt)
    //             if(res.data[0].qdzt==0){
    //               db.collection("xzxx").where({zxzw:resultid}).update({
    //               data:{
    //                     qdzt:1,
    //                     qdsj:  (new Date()).valueOf(),
    //                 },
    //                 success:res=>{
    //                   wx.showToast({
    //                     title: '签到成功',
    //                     icon: 'success',
    //                     duration: 2000,
                        
    //                   })
    //                 }
    //               })
    //             }else{
    //               var qdsj=res.data[0].qdsj
    //               console.log(qdsj)
    //               var dateNow = (new Date()).valueOf(); 
    //               var usedTime = dateNow-qdsj
    //               console.log(usedTime)
    //               var minutes=Math.floor(usedTime/(60*1000));
    //               console.log(minutes)
    //               if(minutes>10){
    //                 db.collection("xzxx").where({zxzw:resultid}).update({
    //                   data:{
    //                         qt:1,
    //                         qtsj:(new Date()).valueOf(),
    //                     },
    //                     success:res=>{
    //                       wx.showToast({
    //                         title: '签退成功',
    //                         icon: 'success',
    //                         duration: 2000
    //                       })
    //                     }
    //                   })
    //               }else{
    //                 wx.showToast({
    //                   title: '签退间隔过短',
    //                   icon: 'error',
    //                   duration: 2000
    //                 })
    //               }
                 
    //             }
    //           }else{
    //             wx.showToast({
    //               title:'请检查座位',
    //               icon:'error',
    //               duration:2000,
    //             })
    //           }
    
    //         })
    //         /**/
    //       }
    //     })
    //   }
    // })
   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})