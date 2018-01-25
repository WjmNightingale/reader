var app = getApp()
var util = require('../../../utils/util.js')
Page({
    data: {
        movies: [],
        navigateTitle: "",
        requestUrl: "",
        totalCount: 0,
        isEmpty: true,
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        var category = options.category
        this.data.navigateTitle = category
        var dataUrl = ''
        switch (category) {
            case '正在热映':
                dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters"
                break
            case '即将上映':
                dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon"
                break
            case '豆瓣Top250':
                dataUrl = app.globalData.doubanBase + "/v2/movie/top250"
                break
        }
        wx.setNavigationBarTitle({
            title: this.data.navigateTitle
        })
        this.data.requestUrl = dataUrl
        util.http(dataUrl, this.processDoubanData)
    },
    processDoubanData: function (moviesDouban) {
        var movies = [];
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx]
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + "..."
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
        var totalMovies = []
        //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
        if (!this.data.isEmpty) {
            totalMovies = this.data.movies.concat(movies)
        } else {
            totalMovies = movies;
            this.data.isEmpty = false
        }
        //data绑定数据
        this.setData({
            movies: totalMovies
        })
        this.data.totalCount += 20
        //隐藏导航条加载动画
        wx.hideNavigationBarLoading()
        //阻止当前页面下拉刷新
        wx.stopPullDownRefresh()
    },
    onScrollLower: function (e) {
        var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20"
        util.http(nextUrl, this.processDoubanData)
        wx.showNavigationBarLoading()
    },
    onPullDownRefresh: function (e) {
        var refreshUrl = this.data.requestUrl + "?star=0&count=20"
        this.data.movies =  []
        this.data.isEmpty = true
        this.data.totalCount = 0
        util.http(refreshUrl, this.processDoubanData)
        wx.showNavigationBarLoading()
    },
    onMovieTap: function (e) {
        var movieId = event.currentTarget.dataset.movieid
        wx.navigateTo({
            url: '../movie-detail/movie-detail?id=' + movieId
        })
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成
        wx.setNavigationBarTitle({
            title: this.data.navigateTitle
        })
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
            title: '探索', // 分享标题
            desc: '来分享更多的电影吧', // 分享描述
            path: 'pages/more-movie/more-movie' // 分享路径
        }
    }
})