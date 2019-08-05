const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

class Promise {
  constructor(exceutor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      setTimeout(() => {
        if (this.status === PENDING) {
          this.status = FULFILLED;
          this.value = value;
          this.onFulfilledCallbacks.forEach(func => {
            func(this.value);
          })
        }
      }, 0);
    }

    const reject = (reason) => {
      setTimeout(() => {
        if (this.status === PENDING) {
          this.status = REJECTED;
          this.reason = reason;
          this.onRejectedCallbacks.forEach(func => {
            func(this.reason);
          })
        }
      }, 0)
    }

    try {
      exceutor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    return new Promise((resolve, reject) => {
      if (typeof onFulfilled !== 'function') {
        onFulfilled = value => value
      }
      if (typeof onRejected !== 'function') {
        onRejected = error => {
          throw new Error(error);
        }
      }
      this.onFulfilledCallbacks.push(() => {
        try {
          const res = onFulfilled(this.value);
          if (res instanceof Promise) {
            res.then(resolve);
          } else {
            resolve(res);
          }
        } catch (error) {
          reject(error);
        }
      });
      this.onRejectedCallbacks.push(() => {
        try {
          const res = onRejected(this.reason);
          if (res instanceof Promise) {
            res.then(resolve);
          } else {
            resolve(res);
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

module.exports = Promise;