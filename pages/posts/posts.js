//加载posts-data中的本地数据
var postsData = require('../../data/posts-data.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //小程序总是会读取data对象来做数据绑定，这个动作我们称为动作A
    //而这个动作A的执行，是在onLoad函数执行之后发生的
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      postList: postsData.postList
    })
  },
  /**
   * 点击swiper中的图片跳转到文章详情页
   */
  onSwiperTap: function (e) {
    //target 和currentTarget的区别
    //target指的是当前点击的组件,而currentTarget 指的是捕获事件的组件
    //target这里指的是image，而currentTarget指的是swiper
    var postId = e.target.dataset.postid
    console.log(postId)
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  /**
   * 点击文章预览跳转到文章详情页
   */
  onPostTap: function (e) {
    var postId = e.currentTarget.dataset.postid
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
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