import Watcher from './watcher'
import { noop } from '../util/util'
import { DD } from '../instance'

let uid = 0

interface ComputedOptions {
  get?(): any;
  set?(v: any): void;
}

export default class Computed {
  uid: number
  dd: DD
  key: string
  option: ComputedOptions
  constructor(dd: DD, key: string, option: ComputedOptions) {
    this.uid = uid++
    this.key = key
    this.option = option
    this.dd = dd
    this._init()
  }

  _init() {
    let watcher = new Watcher(
      this.dd,
      this.option.get || noop,
      noop,
      // 告诉 Watcher 这是 lazy Watcher
      {
        lazy: true
      }
    )

    Object.defineProperty(this.dd, this.key, {
      enumerable: true,
      configurable: true,
      set: this.option.set || noop,
      get() {
        // 如果是 dirty watch 那就触发脏检查机制，更新值
        if (watcher.dirty) {
          watcher.evaluate()
        }
        return watcher.value
      }
    })
  }
}