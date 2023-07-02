// pages/glht/glht.js
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  jhht(){
    wx.cloud.callFunction({
      name: "getzw",
      complete: res => {
        console.log(res.result.data)
        for (let i = 0; i < res.result.data.length; i++) {
          if(res.result.data.zwzt!=0)
          {
            res.result.data[i].zwzt = 0
            var zwid = res.result.data[i]._id
            for (let t = 0; t < 5; t++)
            {
              if(res.result.data[i].sj[t][0] == 2){
                db.collection("tsgzw").doc(zwid).update({
                  data:{
                    ['sj.'+t+'.0']:0,
                    _updateTime: Date.parse(new Date()),
                  },
                success:(res)=>{
                  wx.showToast({
                    title: '初始化成功',
                    icon:'success',
                    duration:2000,
                    success:(res)=>{
                      setTimeout(function(){
                        wx.navigateBack({
                          url: '../my/my',
                        })
                      },2000)
                    }
                  })
                }
                
              })
            }
          }

        }
      }
    }
    })
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