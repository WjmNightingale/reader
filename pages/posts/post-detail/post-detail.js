var postsData = require('../../../data/posts-data.js')
//获取app.js中的globalData
var app = getApp()
Page({
    data: {
        isPlayingMusic: false
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        //options会携带页面跳转时路径中所带的参数
        var postId = options.id
        this.data.currentPostId = postId
        var postData = postData.postList[postId]
        this.setData({
            postData: postData
        })
        var postsCollected = wx.getStorageSync('posts_collected')
        if (postsCollected) {
            var postCollected = postsCollected[postId]
            this.setData({
                collected: postCollected
            })
        } else {
            var postsCollected = {}
            postsCollected[postId] = false
            wx.setStorageSync(postsCollected)
        }
        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
            this.setData({
                isPlayingMusic: true
            })
        }
        this.setMusicMonitor()
    },
    setMusicMonitor: function () {
        var that = this
        //背景音乐播放时触发的事件
        wx.onBackgroundAudioPlay(function (e) {
            // callback
            var pages = getCurrentPages()
            var currentPage = pages[pages.length - 1]
            if (currentPage.data.currentPostId === that.data.currentPostId) {
                // 当打开多个post-detail页面后，每个页面不会关闭，只会隐藏
                // 通过页面栈拿到到当前页面的postid，只处理当前页面的音乐播放
                if (app.globalData.g_currentMusicPostId === that.data.currentPostId) {
                    that.setData({
                        isPlayingMusic: true
                    })
                }
            }
            app.globalData.g_isPlayingMusic = true
        })
        //背景音乐暂停时触发的事件
        wx.onBackgroundAudioPause(function (e) {
            // callback
            var pages = getCurrentPages()
            var currentPage = pages[pages.length - 1]
            if (currentPage.data.currentPostId = that.data.currentPostId) {
                if (app.globalData.g_currentMusicPostId = that.data.currentPostId) {
                    that.setData({
                        isPlayingMusic: false
                    })
                }
            }
            app.globalData.g_isPlayingMusic = false
        })
        //背景音乐停止播放时触发的事件
        wx.onBackgroundAudioStop(function () {
            // callback
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false
        })
    },
    onCollectionTap: function () {
        this.getPostsCollectedAsy()
    },
    //异步获取文章收藏状态
    getPostsCollectedAsy: function () {
        var that = this
        wx.getStorage({
            key: "posts_collected",
            success: function (res) {
                var postsCollected = res.data
                var postCollected = postsCollected[that.data.currentPostId]
                //收藏变成未收藏，未收藏变成收藏
                postCollected = !postCollected
                postsCollected[that.data.currentPostId] = postCollected
                that.showToast(postsCollected, postCollected)
            }
        })
    },
    //同步获取文章收藏状态
    getPostsCollectedSyc: function () {
        var postsCollected = wx.getStorageSync('posts_collected')
        var postCollected = postsCollected[this.data.currentPostId]
        //收藏变成未收藏，未收藏变成收藏
        postCollected = !postCollected
        postsCollected[that.data.currentPostId] = postCollected
        this.showToast(postsCollected, postCollected)
    },
    showToast: function (postsCollected, postCollected) {
        //更新文章是否收藏的缓存值
        wx.setStorageSync('posts_collected', postsCollected)
        //更新数据绑定变量，从而实现切换图片
        this.setData({
            collected: postCollected
        })
        wx.showToast({
            title: postCollected ? '收藏成功' : '取消收藏',
            duration: 1000,
            icon: 'success'
        })
    },
    //showModal  api用例
    showModal: function (postsCollected, postCollected) {
        var that = this
        wx.showModal({
            title: "收藏",
            content: postCollected ? "收藏该文章" : "取消收藏该文章",
            showCancel: true,
            cancelText: "取消",
            cancelColor: "#333",
            confirmText: "确认",
            confirmColor: "#405f80",
            success: function (res) {
                if (res.confirm) {
                    //更新文章是否收藏的缓存值
                    wx.setStorageSync('posts_collected', postsCollected)
                    //更新数据绑定变量，从而实现切换图片
                    this.setData({
                        collected: postCollected
                    })
                }
            }
        })
    },
    onShareTap: function(e){
        var itemList = [
            "分享给微信好友",
            "分享到朋友圈",
            "分享到QQ",
            "分享到微博"
        ]
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function(res){
                // res.cancel 用户是不是点击了取消按钮
                // res.tapIndex 数组元素的序号，从0开始
                wx.showModal({
                    title: itemList[res.tapIndex],
                    content: "分享一个小程序",
                    success: function(res){
                        if (res.confirm) {
                            console.log('用户点击了确定')
                        } else if (res.confirm) {
                            console.log('用户点击了取消')
                        }
                    }
                })
            }
        })
    },
    onMusicTap: function(){
        var currentPostId = this.data.currentPostId
        var postData = postsData.postList[currentPostId]
        var isPlayingMusic = this.data.isPlayingMusic
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio()
            this.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false
        } else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImg,
                success: function(res){
                    // success
                },
                fail: function() {
                    // fail
                },
                complete: function() {
                    // complete
                }
            })
            this.setData({
                isPlayingMusic: true
            })
            app.globalData.g_currentMusicPostId = this.data.currentPostId
            app.globalData.g_isPlayingMusic = true
        }
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成
        String3
    },
    onShow: function () {
        // 生命周期函数--监听页面显示
        String4
    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏
        String5
    },
    onUnload: function () {
        // 生命周期函数--监听页面卸载
        String6
    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作
        String7
    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
        String8
    },
    onShareAppMessage: function () {
        // 用户点击右上角分享
        return {
            title: '无题', // 分享标题
            desc: '锦瑟无端五十弦，一弦一柱思华年', // 分享描述
            path: '/pages/posts/post-detail/post-detail?id=0' // 分享路径
        }
    }
})