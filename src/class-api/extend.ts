import { mergeOptions } from '../util/options'
import { DD as DDClass } from '../instance/index'

let cid = 0

export function initExtend (DD: typeof DDClass) {
  DD.cid = cid++

  /**
   * 返回一个子组件的类
   * @param {子组件配置项} extendOptions
   */
  DD.extend = function (extendOptions: any) {
    const Super = this

    class Sub extends Super {
      constructor (options: any) {
        super(options)
      }
    }

    Sub.options = mergeOptions(Super.options, extendOptions)

    Sub.super = Super
    Sub.extend = Super.extend
    Sub.cid = cid++

    return Sub
  }
}