// pages/dk/dk.js
const db=wx.cloud.database()
var times=require('../../utils/times.js')
// var userinfo =wx.getStorageSync('userinfo')
// console.log("userinfo",userinfo)
// var openid = userinfo[0].openid
// console.log("userinfo[0].openid:",userinfo[0].openid)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:'',
    xzxx:'',
    qdcs:'',
    cdcs:0,
    qkcs:0,
    ztcs:0,
    qxcs:0,
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setInterval(()=>
    {
      this.qdtj()
    }, 1000) //延时1ms 便于成功赋值
    
    var userinfo =wx.getStorageSync('userinfo')
    this.setData({
      userinfo:userinfo
    })
    console.log("userinfo[0]:",userinfo[0])
    wx.cloud.callFunction({
      name:'getxz',
      data:{
        openid:userinfo[0].openid
      },
      complete:res=>{
        console.log("res.result:",res.result)
        for(var i=0;i<res.result.list.length;i++){
          res.result.list[i]["_createTime"]=times.toDate(res.result.list[i]["_createTime"])
          if(res.result.list[i]["qdzt"]!=0){
            res.result.list[i]["qdsj"]=times.toDate(res.result.list[i]["qdsj"])
          }else{
            res.result.list[i]["qdsj"]="暂未签到"
          }

          res.result.list[i]["qtsj"]=times.toDate(res.result.list[i]["qtsj"])
        }
        this.setData({
          xzxx:res.result.list
        })
        var qdcs=0
      for(let i=0;i<res.result.list.length;i++){
        if(res.result.list[i].qdzt==1){
          qdcs++
        }
      }
      console.log(qdcs)
      this.setData({
        qdcs:qdcs
      })
      }
    })

    // db.collection("xzxx").where({openid:this.data.userinfo[0].openid}).orderBy('_updateTime','desc').get().then(res=>{
    //   console.log(res)
    //   this.setData({
    //     xzxx:res.data
    //   })
    //   
    // })
  },

  qdtj:function () {
    

    var xs = 9;//myDate.getHours();//获取实时小时
    var fz = 0;//myDate.getMinutes();
    var qk = 0;
    var qx = 0;
    var qd = 0;

    db.collection("xzxx").get().then(res=>{
      console.log("res.data[0].qx:",res.data[0])
      for(let i = 0; i < res.data.length; i++)
      {
        if(res.data[i].qdzt == 1)(qd += 1)
        if(res.data[i].qx == 1){qx += 1}
        switch(res.data[i].xzsjd)
        {
          case "0": 
            if(res.data[i].qdzt == 0 & res.data[i].qx != 1){
              if (xs > 9 | (xs == 9 & fz > 30)){qk += 1}
            }
            ;break;
          case "1":
            if(res.data[i].qdzt == 0 & res.data[i].qx != 1){
              if (xs > 10){qk += 1}
            }
            ;break;
          case "2":
            if(res.data[i].qdzt == 0 & res.data[i].qx != 1){
              if (xs > 12 | (xs == 12 & fz > 30)){qk += 1}
            }
            ;break;
          case "3":
            if(res.data[i].qdzt == 0 & res.data[i].qx != 1){
              if (xs > 14){qk += 1}
            }
           ;break;
          case "4":
            if(res.data[i].qdzt == 0 & res.data[i].qx != 1){
              if (xs >= 16 ){qk += 1}
            }
            ;break;
        }
      }
      
      console.log("qk",qk,"qx",qx)
      this.setData({
        qkcs: qk,
        qxcs: qx,
        qdcs: qd,
      })

    })
    // db.collection("user").where({openid:openid}).update({
    //   data:{
    //     qkcs: this.data.qkcs,
    //     qxcs:this.data.qxcs,
    //   }
    // })
  },

  qdqt:function(){
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
    var xzsjdxs = 0;
    var bhxx=''
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    var Y =date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
    var xs = 8;//myDate.getHours();//获取实时小时
    var fz = 30;//myDate.getMinutes();
    console.log(+Y+"/"+M+"/"+D+" "+"8:00~9:30"); 
    var sj=+Y+"/"+M+"/"+D+" "
    wx.scanCode({   //扫码
      onlyFromCamera: true,
      success (res) {
        console.log("res.result:",res.result) //扫描二维码的文档信息 charset->rawdata
        var resultid = res.result //
        db.collection("tsgzw").doc(resultid).get().then(res=>{
          console.log("res.data.bh",res.data.bh) 
          bhxx=res.data.bh
        })
        let index = 0; //相同座位确定选座
        var theortime = 0;
        if(xs == 8 | (xs == 9 & fz <= 30)) {theortime = 0}
        else if((xs == 9 & fz >= 30 ) | xs == 10 ) {theortime = 1}
        else if(xs == 11 | (xs == 12 & fz <= 30)) {theortime = 2}
        else if((xs == 12 & fz >= 30 ) | xs == 13 ) {theortime = 3}
        else if(xs == 14 | xs == 15) {theortime = 4}
        var wid = ""
        db.collection("xzxx").where({zxzw:res.result}).get().then(res=>{
          
          for(let i=0;i<res.data.length;i++)
          {
            if(res.data[i].xzsjd == theortime){ 
              index = i;
              wid = res.data[i]._id
              break;}
          }
          console.log("theortime:",theortime,"index:",index,"res.data",res.data)
          console.log("res.data[index].xzsjd:",res.data[index].xzsjd)
          if(res.data[index].xzsjd==0){
            xzsjd=sj+"8:00~9:30"
            xzsjdxs=9
          }else if(res.data[index].xzsjd==1){
            xzsjd=sj+"9:30~11:00"
            xzsjdxs=11
          }else if(res.data[index].xzsjd==2){
            xzsjd=sj+"11:00~12:30"
            xzsjdxs=12
          }else if(res.data[index].xzsjd==3){
            xzsjd=sj+"12:30~2:00"
            xzsjdxs=14
          }else{
            xzsjd=sj+"2:00~4:00"
            xzsjdxs=16
          }

          if(res.data[index].openid==openid){
            console.log("res.data[index].qdzt:",res.data[index].qdzt)
            var xzsj=""
            // var wid = ""
            // db.collection("xzxx").where({zxzw:resultid}).get().then(res2=>{
            //   console.log("chaxunjieguo:",res2)
              // for(let i = 0; i< res2.data.length;i++)
              // {
              //   if(res2.data[i].xzsjd == theortime)
              //   {
    
              //       wid = res2.data[i]._id

              //   }
              //   console.log("wid",wid)
              // }
              if(res.data[index].qdzt==0 & xs < xzsjdxs){

                console.log("wid2",wid)
                db.collection("xzxx").where({_id:wid}).update({
                data:{
                    qdzt:true,
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
                      },
                      fail:res=>{
                        wx.showToast({
                          title: '签到失败',
                          icon: 'success',
                          duration: 2000,
                        })
                      }
                    })
                  }
                })
              }
            // })

            
            if (res.data[index].qdzt==1){
              var qdsj=res.data[index].qdsj
              console.log("qdsj:",qdsj)
              var dateNow = (new Date()).valueOf(); 
              var usedTime = dateNow-qdsj
              console.log("usedTime:",usedTime)
              var minutes=Math.floor(usedTime/(1000)); //second
              console.log("minutes:",minutes)
              if(minutes>0){
                db.collection("xzxx").where({_id:wid}).update({
                  data:{
                        qt:1,
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
  dkjl(){
    wx.navigateTo({
      url: '../dkjl/dkjl',
    })
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("xialall")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})