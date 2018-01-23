Page({
    onTap: function (event) {
        wx.navigateTo({
          url: '../posts/posts',
        });
        // wx.switchTab({
        //     url: '../posts/post',
        //     success: function(res){
        //         // success
        //     },
        //     fail: function() {
        //         // fail
        //     },
        //     complete: function() {
        //         // complete
        //     }
        // })
    }
})