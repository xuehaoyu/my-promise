const pending = 'pending'
const resolve = 'resolve'
const reject = 'reject'
class MyPromise {
    constructor(cb) {
        this._cb = cb
        this._status = pending
        this._succFnArr = []
        this._failFnArr = []
        this._value = null
        this._error = null
        this._id = 1
        this._resolve = (value) => {
            if (this._status === pending) {
                this._status = resolve
                this._value = value
                this._succFnArr.forEach(fn => fn())
            }
        }
        this._reject = (error) => {
            if (this._status === pending) {
                this._status = reject
                this._error = error
                this._failFnArr.forEach(fn => fn())
            }
        }
        this.runCb()
    }
    runCb() {
        this._cb(this._resolve, this._reject)
    }
    then(resolveCb, rejectCb) {
        resolveCb = resolveCb ? resolveCb : value => value
        rejectCb = rejectCb ? rejectCb : value => value
        let self = this
        const promise2 = new MyPromise((resolve2, reject2) => {
            if (self._status === resolve) {
                const x = resolveCb(self._value)
                resolve2(x)
            } else if (self._status === reject) {
                const x = rejectCb(self._error)
                reject2(x)
            } else if (self._status === pending) {
                this._succFnArr.push(() => {
                    const x = resolveCb(self._value)
                    resolve2(x)
                })
                this._failFnArr.push(() => {
                    const x = rejectCb(self._error)
                    reject2(x)
                })
            }
        })
        return promise2
    }
}

new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('成功')
    }, 3000)
}).then((res) => {
    console.log(res)
    return (res)
}).then((res) => {
    console.log(res)
    return res
}).then((res) => {
    console.log(res)
})