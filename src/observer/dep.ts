import { remove } from '../util/util'
import Watcher from './watcher'

let uid = 0

export default class Dep {
  static target?: Watcher
  id: number
  subs: Array<Watcher>

  constructor() {
    this.id = uid++
    this.subs = []
  }

  addSub(sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub(sub: Watcher) {
    remove(this.subs, sub)
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}

// targetStack 是为了防止监听嵌套结构时，丢失父辈 watcher
const targetStack: Array<Watcher> = []

export function pushTarget(_target: Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget() {
  Dep.target = targetStack.pop()
}
