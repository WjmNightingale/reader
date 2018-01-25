Page({
    onTap: function (event) {
        // wx.navigateTo({
        //   url: '../posts/posts'
        // })
        wx.switchTab({
            url: '../posts/posts',
            success: function(){
              console.log('1')
            },
            fail: function(error){
              console.log(error)
            }
        })
    }
})