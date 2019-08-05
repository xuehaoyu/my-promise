const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

class Promise {   
    constructor(executor){
        this._executor = executor;
        this._status = PENDING;
        this._value = null;
        this._reason = null;
        this._onFulfilledCallbacks = [];
        this._onRejectedCallbacks = [];
        this._resolve = (value)=>{
            if(this._status === PENDING){
                this._status = FULFILLED;
                this._value = value;
                this._onFulfilledCallbacks.forEach((func)=>func())
            }
        }
        this._reject = (reason)=>{
            if(this._status === PENDING){
                this._status = REJECTED;
                this._reason = reason;
                this._onRejectedCallbacks.forEach((func)=>func())
            }
        }
        this.runExe();
    };
    runExe(){
        try{
            this._executor(this._resolve,this._reject)
        }catch(error){
            this._reject(error);
        }
    };
    then(onFulfilled, onRejected){
        onFulfilled = typeof onFulfilled == 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected == 'function' ? onRejected : reason => { throw reason };
        let self = this;
        let promise2 = new Promise((resolve, reject) => {
            if (self._status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(self._value);
                        self.resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            } else if (self._status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(self._reason);
                        self.resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                 });
            } else if (self._status === PENDING) {
                console.log(self._status)
                self._onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(self._value);
                            self.resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
                self._onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(self._reason);
                            self.resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            }
        });
        return promise2;
    };
    resolvePromise(promise2, x, resolve, reject) {
        let self = this;
        if (promise2 === x) {
          reject(new TypeError('Chaining cycle'));
        }
        if (x && typeof x === 'object' || typeof x === 'function') {
          let used; //PromiseA+2.3.3.3.3 只能调用一次
          try {
            let then = x.then;
            if (typeof then === 'function') {
              then.call(x,(y) => {
                if (used) return;
                used = true;
                self.resolvePromise(promise2, y, resolve, reject);
              }, (r) => {
                if (used) return;
                used = true;
                reject(r);
              });
            }else{
              if (used) return;
              used = true;
              resolve(x);
            }
          } catch (e) {
            if (used) return;
            used = true;
            reject(e);
          }
        } else {
          resolve(x);
        }
    }
}

Promise.defer = Promise.deferred = function () {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}
module.exports = Promise;