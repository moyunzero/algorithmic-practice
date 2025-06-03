# 为什么 Vue 组件的 data 属性必须是一个函数？

在 Vue.js 中，一个常见且重要的问题是为什么组件的 `data` 选项必须是一个函数，而根 Vue 实例的 `data` 可以是一个对象。本文将深入探讨其背后的原因和实现原理。

## 一、实例和组件定义data的区别

`vue`实例的时候定义`data`属性既可以是一个对象，也可以是一个函数

```js
const app = new Vue({
    el:"#app",
    // 对象格式
    data:{
        foo:"foo"
    },
    // 函数格式
    data(){
        return {
             foo:"foo"
        }
    }
})
```

组件中定义`data`属性，只能是一个函数

如果为组件`data`直接定义为一个对象

```js
Vue.component('component1',{
    template:`<div>组件</div>`,
    data:{
        foo:"foo"
    }
})
```

则会得到警告信息

警告说明：返回的`data`应该是一个函数在每一个组件实例中

## 二、组件data定义函数与对象的区别

上面讲到组件`data`必须是一个函数，不知道大家有没有思考过这是为什么呢？

在我们定义好一个组件的时候，`vue`最终都会通过`Vue.extend()`构成组件实例

这里我们模仿组件构造函数，定义`data`属性，采用对象的形式

```js
function Component(){
 
}
Component.prototype.data = {
 count : 0
}
```

创建两个组件实例

```
const componentA = new Component()
const componentB = new Component()
```

修改`componentA`组件`data`属性的值，`componentB`中的值也发生了改变

```js
console.log(componentB.data.count)  // 0
componentA.data.count = 1
console.log(componentB.data.count)  // 1
```

产生这样的原因这是两者共用了同一个内存地址，`componentA`修改的内容，同样对`componentB`产生了影响

如果我们采用函数的形式，则不会出现这种情况（函数返回的对象内存地址并不相同）

```js
function Component(){
 this.data = this.data()
}
Component.prototype.data = function (){
    return {
     count : 0
    }
}
```

修改`componentA`组件`data`属性的值，`componentB`中的值不受影响

```js
console.log(componentB.data.count)  // 0
componentA.data.count = 1
console.log(componentB.data.count)  // 0
```

`vue`组件可能会有很多个实例，采用函数返回一个全新`data`形式，使每个实例对象的数据不会受到其他实例对象数据的污染

## 三、原理分析

为了更深入地理解这一机制，我们可以探究 Vue 内部是如何处理 `data` 选项的。Vue 在初始化数据时，确实允许 `data` 是函数或对象，如其核心源码所示：

源码位置：`/vue-dev/src/core/instance/state.js`

```js
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
    ...
}
```

`data`既能是`object`也能是`function`，那为什么还会出现上文警告呢？

别急，继续看下文

组件在创建的时候，会进行选项的合并

源码位置：`/vue-dev/src/core/util/options.js`

自定义组件会进入`mergeOptions`进行选项合并

```js
Vue.prototype._init = function (options?: Object) {
    ...
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    ...
  }
```

定义`data`会进行数据校验

源码位置：`/vue-dev/src/core/instance/init.js`

这时候`vm`实例为`undefined`，进入`if`判断，若`data`类型不是`function`，则出现警告提示。

这里的关键在于 `if (!vm)` 这个条件。在组件定义阶段（例如使用 `Vue.component` 或在 `.vue` 文件中定义组件时），Vue 会合并组件的选项，但此时尚未创建组件的实际运行实例，因此 `vm` (ViewModel 实例) 为 `undefined`。正是在这个阶段，Vue 会检查 `childVal` (即组件的 `data` 选项)。如果它不是一个函数，就会触发警告，因为 Vue 需要一个工厂函数来为每个未来的组件实例生成独立的数据副本。

```js
strats.data = function (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {
    if (childVal && typeof childVal !== "function") {
      process.env.NODE_ENV !== "production" &&
        warn(
          'The "data" option should be a function ' +
            "that returns a per-instance value in component " +
            "definitions.",
          vm
        );

      return parentVal;
    }
    return mergeDataOrFn(parentVal, childVal);
  }
  return mergeDataOrFn(parentVal, childVal, vm);
};
```

## 四、结论

总结来说：

- **Vue 根实例** (`new Vue(...)`) 的 `data` 可以是对象也可以是函数。因为根实例通常是唯一的（单例），不存在多个实例共享同一份 `data` 对象引用而导致数据互相污染的问题。
- **Vue 组件**的 `data` **必须**是函数。这是为了确保每个组件实例都维护一份独立的数据副本。如果组件的 `data` 是一个对象，那么所有通过该组件定义创建的实例将共享同一个数据对象的引用。当一个实例修改其 `data` 时，会意外地影响到其他所有实例，导致数据污染。通过使用函数返回新对象的方式，Vue 在创建每个组件实例时都会调用该函数，从而为每个实例生成一个全新的、隔离的数据对象。这保证了组件的可复用性和状态的独立性。
