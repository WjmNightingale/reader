// 自定义 promise
// promise对象的三种状态
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

// promise 接收一个函数参数，并且该函数会立即执行

function MyPromise(fn) {
  let _this = this
  _this.currentState = PENDING
  _this.value = undefined
  // 用于保存then中的回调
  // 只有当 promise 状态为 pending 时才会缓存，并且每个实例最多缓存一个
  _this.resolvedCallbacks = []
  _this.rejectedCallbacks = []
  _this.resolve = function (value) {
    if (value instanceof MyPromise) {
      // value 是个 promise 实例，递归执行
      return value.then(_this.resolve, _this.rejected)
    }
    setTimeout(() => {
      if (_this.currentState === 'pending') {
        _this.currentState = RESOLVED
        _this.value = value
        _this.resolvedCallbacks.forEach(cb => cb())
      }
    }, 0)
  }
  _this.reject = function (reason) {
    setTimeout(() => {
      if (_this.currentState === PENDING) {
        _this.currentState = REJECTED
        _this.value = reason
        _this.rejectedCallbacks.forEach(cb => cb())
      }
    }, 0)
  }

  // 解决 new Promise() => throw Error('error')的问题
  try {
    fn(_this.resolve, _this.reject)
  } catch (error) {
    _this.reject(error)
  }
}

MyPromise.prototype.then = function (onResolved, onRejected) {
  var self = this
  // 规范 2.2.7 then 必须返回一个新的promise
  var newPromise
  // 规范 2.2 onResolved onRejected 都为可选参数
  // 如果这两个参数类型不为函数，那么久忽略，同时实现了透传
  // Promise.resolve(4).then().then(value => console.log(value))
  onResolved = typeof onResolved === 'function' ? onResolved : v => v
  onRejected = typeof onRejected === 'function' ? onRejected : v => v
  if (self.currentState === RESOLVED) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      // 规范 2.2.4 需要用保证 onFulfilled onReject 异步执行
      // 所以用了 setTimeout 包装下
      setTimeout(() => {
        try {
          var x = onResolved(self.value)
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (error) {
          reject(error)
        }
      }, 0)
    }))
  }
  if (self.currentState === REJECTED) {
    return (promise2 = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        // 异步执行onRejected
        try {
          var x = onRejected(self.value)
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (error) {
          reject(error)
        }
      }, 0)
    }))
  }

  if (self.currentState === PENDING) {
    return (promise2 = new MyPromise((resolve, reject) => {
      self.resolvedCallbacks.push(() => {
        // 考虑到可能会有异常，所以使用 try catch
        try {
          var x = onResolved(self.value)
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (error) {
          reject(error)
        }
      })
      self.rejectedCallbacks.push(() => {
        try {
          var x = onRejected(self.value)
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (error) {
          reject(error)
        }
      })
    }))
  }
}

function resolutionProcedure(promise2, x, resolve, reject) {
  // 规范 2.3.1， x 不能 promise2 相同，避免循环引用
  if (promise2 === x) {
    return reject(new TypeError('Error'))
  }
  // 规范 2.3.2
  // 如果 x 为 promise ，状态为 pending 那就需要继续等待，否则就是执行
  if (x instanceof MyPromise) {
    if (x.currentState === PENDING) {
      x.then(value => {
        // 再次调用x.then 是为了确认 x 的 resolve参数 是什么类型
        // 如果是基本类型，那么就再次resolve，把值传递给下个then
        resolutionProcedure(promise2, value, resolve, reject)
      }, reject)
    } else {
      x.then(resolve, reject)
    }
    return
  }
  // 规范 2.3.3.3.5 
  // resolve 或者 reject 其中一个执行后，就忽略其他的
  let called = false
  // 规范 2.3.3 判断 x 是否为对象或者函数
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    // 规范2.3.3.2 如果不能取出then，那么就reject
    try {
      // 规范2.3.3.1
      let then = x.then
      // 如果then是函数，那么就调用
      if (typeof then === 'function') {
        // 规范2.3.3.3
        then.call(x, e => {
          if (called) {
            return
          }
          called = true
          reject(e)
        })
      } else {
        // 规范 2.3.3.4
        resolve(x)
      }
    } catch (e) {
      if (called) {
        return
      }
      called = true
      reject(e)
    }
  } else {
    // 规范 2.3.4 x 为基本类型
    resolve(x)
  }
}