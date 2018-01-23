Page({
    onTap: function (event) {
        // wx.navigateTo({
        //   url: '../posts/post',
        // });
        wx.switchTab({
            url: '../posts/post',
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
    }
})