const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function convertToStarsArray (stars) {
  var num = stars.toString().substring(0,1)
  var array = []
  for (var i = 1;i <= 5;i++) {
    if (i <= num) {
      array.push[1]
    } else {
      array.push[0]
    }
  }
  return array
}

function convertToCastString(casts) {
  var castsjoin = ''
  for (const key in casts) {
    castsjoin = castsjoin + casts[key].name + '/'
  }
  return castsjoin.substring(0,castsjoin.length-2)
}

function convertToCastInfos(casts) {
  var castsArray = []
  for (const key in casts) {
    var cast = {
      img: casts[key].avatars?casts[key].avatars.large:'',
      name: casts[key].name
    }
    castsArray.push(cast)
  }
  return castsArray
}

function http(url,callBack) {
  wx.request({
    url: url,
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      "Content-Type":"json"
    }, // 设置请求的 header
    success: function(res){
      callBack(res.data)
    },
    fail: function(error) {
     console.log(error)
    },
    complete: function() {
      // complete
    }
  })
}

module.exports = {
  formatTime: formatTime,
  convertToStarsArray: convertToStarsArray,
  convertToCastString:convertToCastString,
  convertToCastInfos:convertToCastInfos,
  http: http
}
