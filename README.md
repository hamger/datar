# data-driver
a data driver with javascript

## Usage
```js
var demo = new DD({
  data () {
    return {
      text: 'hello world'
    }
  }
})

demo.$watch('text', (val, oldVal) => {
  console.log(`text的值从 ${oldVal} 变更为 ${val}`)
})

demo.text = 'hello data-dirver'
// text的值从 hello world 变更为 hello data-dirver
```

## Changelog
## 2018.7.22
> v0.2.1 修复父类配置项指向的错误和未合并所有配置项的错误

### 2018.7.18
> v0.2.0 改写为 typescript 项目

### 2018.7.4
> v0.1.0 初始化项目
