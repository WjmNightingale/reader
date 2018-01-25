//ES6的使用
import {Movie} from 'class/Movie.js'
var app = getApp()
Page({
    data:{
        movie: []
    },
    onLoad:function(options){
        // 生命周期函数--监听页面加载
        var movieId = options.id
        var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId
        var movie = new Movie(url)
        movie.getMovieData((movie) => {
            this.setData({
                movie: movie
            })
        })
    },
    //点击查看大图
    viewMoviePostImg: function(e) {
        var src = e.currentTarget.dataset.src
        wx.previewImage({
            current: src, // 当前显示图片的链接，不填则默认为 urls 的第一张
            urls: [src] //当前需要预览的图片http链接列表
        })
    },
    onReady:function(){
        // 生命周期函数--监听页面初次渲染完成
        
    },
    onShow:function(){
        // 生命周期函数--监听页面显示
        
    },
    onHide:function(){
        // 生命周期函数--监听页面隐藏
        
    },
    onUnload:function(){
        // 生命周期函数--监听页面卸载
        
    },
    onPullDownRefresh: function() {
        // 页面相关事件处理函数--监听用户下拉动作
       
    },
    onReachBottom: function() {
        // 页面上拉触底事件的处理函数
        
    },
    onShareAppMessage: function() {
        // 用户点击右上角分享
        return {
          title: '电影哟', // 分享标题
          desc: '一段电影温暖人心', // 分享描述
          path: 'pages/movie-detail/movie-detail' // 分享路径
        }
    }
})