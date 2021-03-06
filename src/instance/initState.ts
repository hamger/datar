import observe from '../observer/observer'
import Watcher from '../observer/watcher'
import Computed from '../observer/computed'
import { proxy } from '../util/util'
import DD from '.'
/**
 * 代理配置项
 * @param dd
 */
export default function initState(dd: DD) {
  let opt = dd.$options
  // 观察并代理 data 属性中数据
  if (opt.data) initData(dd)
  // 观察并代理 props 属性中数据
  if (opt.props) initProp(dd)
  // 处理 watch 属性内容
  if (opt.watch) initWatch(dd)
  // 处理 computed 属性内容
  if (opt.computed) initComputed(dd)
  // 代理 methods 属性中方法
  if (opt.methods) initMethod(dd)
}

function initData(dd: DD) {
  // let a = b = {} 的写法使得 a、b 指向同一个地址
  let data = (dd._data = dd.$options.data ? dd.$options.data.call(dd) : {})
  // 将 data 对象变成可监听结构
  observe(data)
  for (let key in dd._data) {
    // 使 dd.key 代理 dd._data.key ，使得原来通过 dd.data().key 访问的数据，可以通过 dd.key 访问
    proxy(dd, '_data', key)
  }
}

function initProp(dd: DD) {
  let props: any = (dd._props = {})
  // 根据 props 中的 key 去 propsData 中取值
  let propsData = dd.$options.propsData || {}
  for (let key in dd.$options.props) {
    let value = propsData[key]
    // console.log(dd.$options.props[key].type)
    if (!value) value = dd.$options.props[key].default
    props[key] = value
  }
  observe(props)
  for (let key in dd._props) {
    // 把 dd.props 挂载在 dd，使得原来通过 dd.props.key 访问的数据，可以通过 dd.key 访问
    proxy(dd, '_props', key)
    // 监听父元素的属性，当父实例的属性变化时，更新子实例的该属性
    // 这也是 prop 属性名需要和父实例 data 中属性名同名的原因
    new Watcher(dd.$parent, key, (newValue: any) => {
      dd[key] = newValue
    })
  }
}

function initWatch(dd: DD) {
  for (let key in dd.$options.watch) {
    let watch = new Watcher(
      dd,
      () => {
        return key.split('.').reduce((obj, name) => obj[name], dd)
      },
      (newValue: any, oldValue: any) => {
        dd.$options.watch[key].forEach((fnc: Function) =>
          fnc(newValue, oldValue)
        )
      }
    )
    dd._watchers.push(watch)
  }
}

function initComputed(dd: DD) {
  let computed: any = (dd._computed = {})
  for (let key in dd.$options.computed) {
    computed[key] = new Computed(dd, key, dd.$options.computed[key]).value
  }
  observe(computed)
  for (let key in dd._computed) {
    // 把 dd.computed 挂载在 dd，使得原来通过 dd.computed.key 访问的数据，可以通过 dd.key 访问
    proxy(dd, '_computed', key)
  }
}

function initMethod(dd: DD) {
  for (let key in dd.$options.methods) {
    dd[key] = dd.$options.methods[key].bind(dd)
    dd.$on(key, dd[key])
  }
}
