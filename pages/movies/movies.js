var util = require('../../utils/util.js')
var app = getApp()
Page({
    data: {
        inTheaters: {},
        comingSoon: {},
        top250: {},
        searchResult: {},
        containerShow: true,
        searchPanelShow: false,
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载

        //获取电影数据
        var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters?start=0&count=3"
        var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon?start=0&count=3"
        var top250Url = app.globalData.doubanBase + "/v2/movie/top250?start=0&count=3"
        this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映")
        this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映")
        this.getMovieListData(top250Url, "top250", "豆瓣Top250")
    },
    getMovieListData: function (url, settedKey, categoryTitle) {
        var that = this
        wx.request({
            url: url,
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'Content_type': 'json'
            }, // 设置请求的 header
            success: function (res) {
                that.processDoubanData(res.data, settedKey, categoryTitle)
            },
            fail: function (error) {
                console.log(error)
            },
            complete: function () {
                // complete
            }
        })
    },
    processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
        var movies = []
        for (const key in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[key]
            var title = subject.title
            if (title.length >= 6) {
                title = title.substring(0, 6) + "...";
            }
            var temp = {
                stars: util.convertToStarsArray(subject.rating.stars),
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id
            }
            movies.push(temp)
        }
        var readyData = {}
        readyData[settedKey] = {
            categoryTitle: categoryTitle,
            movies: movies
        }
        this.setData(readyData)
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成

    },
    onShow: function () {
        // 生命周期函数--监听页面显示

    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏

    },
    onUnload: function () {
        // 生命周期函数--监听页面卸载

    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作

    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数

    },
    onShareAppMessage: function () {
        // 用户点击右上角分享
        return {
            title: '无题', // 分享标题
            desc: '蓝田日暖玉生烟，望帝春心托杜鹃', // 分享描述
            path: 'pages/movies/movies' // 分享路径
        }
    }
})