# 请描述下你对vue生命周期的理解？在created和mounted这两个生命周期中请求数据有什么区别呢？


## 一、生命周期是什么

生命周期`（Life Cycle）`的概念应用很广泛，特别是在政治、经济、环境、技术、社会等诸多领域经常出现，其基本涵义可以通俗地理解为“从摇篮到坟墓”`（Cradle-to-Grave）`的整个过程在`Vue`中实例从创建到销毁的过程就是生命周期，即指从创建、初始化数据、编译模板、挂载Dom→渲染、更新→渲染、卸载等一系列过程我们可以把组件比喻成工厂里面的一条流水线，每个工人（生命周期）站在各自的岗位，当任务流转到工人身边的时候，工人就开始工作PS：在`Vue`生命周期钩子会自动绑定 `this` 上下文到实例中，因此你可以访问数据，对 `property` 和方法进行运算这意味着**你不能使用箭头函数来定义一个生命周期方法** \(例如 `created: () => this.fetchTodos()`\)

## 二、生命周期有哪些

Vue生命周期总共可以分为8个阶段：创建前后, 载入前后,更新前后,销毁前销毁后，以及一些特殊场景的生命周期

| 生命周期 | 描述 |
| :-- | :-- |
| beforeCreate | 组件实例被创建之初 |
| created | 组件实例已经完全创建 |
| beforeMount | 组件挂载之前 |
| mounted | 组件挂载到实例上去之后 |
| beforeUpdate | 组件数据发生变化，更新之前 |
| updated | 组件数据更新之后 |
| beforeDestroy | 组件实例销毁之前 |
| destroyed | 组件实例销毁之后 |
| activated | keep-alive 缓存的组件激活时 |
| deactivated | keep-alive 缓存的组件停用时调用 |
| errorCaptured | 捕获一个来自子孙组件的错误时被调用 |

## 三、生命周期整体流程

`Vue`生命周期流程图

 ![](https://static.vue-js.com/44114780-3aca-11eb-85f6-6fac77c0c9b3.png)

#### 具体分析

**beforeCreate -> created**

- 初始化`vue`实例，进行数据观测

**created**

- 完成数据观测，属性与方法的运算，`watch`、`event`事件回调的配置
- 可调用`methods`中的方法，访问和修改data数据触发响应式渲染`dom`，可通过`computed`和`watch`完成数据计算
- **然而，DOM 尚未挂载，因此 `this.$el` (或 `vm.$el`) 在这个阶段是 `undefined`。**

**created -> beforeMount**

- 判断是否存在`el`选项，若不存在则停止编译，直到调用`vm.$mount(el)`才会继续编译
- 优先级：`render` > `template` > `outerHTML`
- `vm.el`获取到的是挂载`DOM`的

**beforeMount**

- 在挂载开始之前被调用：相关的 `render` 函数首次被调用。
- **在这个阶段，`vm.$el` 已经创建完成（即 Vue 实例的 `el` 选项所指向的 DOM 元素，或模板编译后的根元素），但它尚未替换页面中实际的 DOM 元素，模板也尚未渲染到其中。**
- 此阶段 `vm.$el` 已完成 DOM 初始化，但其中的内容（来自模板或 `render` 函数）还未渲染进去。


**beforeMount -> mounted**

- 此阶段`vm.el`完成挂载，`vm.$el`生成的`DOM`替换了`el`选项所对应的`DOM`

**mounted**

- `vm.el`已完成`DOM`的挂载与渲染，此刻打印`vm.$el`，发现之前的挂载点及内容已被替换成新的DOM

**beforeUpdate**

- 更新的数据必须是被渲染在模板上的（`el`、`template`、`render`之一）
- 此时`view`层还未更新
- 若在`beforeUpdate`中再次修改数据，不会再次触发更新方法

**updated**

- 完成`view`层的更新
- 若在`updated`中再次修改数据，会再次触发更新方法（`beforeUpdate`、`updated`）

**beforeDestroy**

- 实例被销毁前调用，此时实例属性与方法仍可访问

**destroyed**

- 完全销毁一个实例。可清理它与其它实例的连接，解绑它的全部指令及事件监听器
- 并不能清除DOM，仅仅销毁实例
- **Vue 会清理它与其它实例的连接，解绑它的全部指令及事件监听器，并移除由 Vue 管理的 DOM 元素。注意：这不保证移除所有手动操作或第三方库添加的 DOM 元素，仅移除 Vue 组件自身渲染的 DOM 结构。**

  

**使用场景分析**

| 生命周期 | 描述 |
| :-- | :-- |
| beforeCreate | 执行时组件实例还未创建，通常用于插件开发中执行一些初始化任务 |
| created | 组件初始化完毕，各种数据可以使用，常用于异步数据获取 |
| beforeMount | 未执行渲染、更新，dom未创建 |
| mounted | 实例被挂载后调用，DOM已创建并挂载。常用于执行依赖于 DOM 的操作（如访问 `this.$refs`），或集成需要 DOM 的第三方库（如图表库初始化）。 |
| beforeUpdate | 更新前，可用于获取更新前各种状态 |
| updated | 更新后，所有状态已是最新 |
| beforeDestroy | 销毁前，可用于一些定时器或订阅的取消 |
| destroyed | 组件已销毁，作用同上 |

## 四、题外话：数据请求在created和mouted的区别

在 Vue 开发中，何时发起异步数据请求是一个常见的问题，尤其是在 `created` 和 `mounted` 这两个生命周期钩子之间进行选择。

**`created` 钩子：**
- **时机**：实例创建完成后立即同步调用。此时，实例已完成数据观测 (data observation)、属性和方法的运算、watch/event 事件回调的配置。可以访问 `this.data` 和 `this.methods`。
- **DOM状态**：DOM 尚未生成和挂载，`this.$el` 属性目前尚不可用 (为 `undefined`)。
- **请求优势**：
    - **更早发起**：可以在组件挂载到 DOM 之前就开始获取数据，这可能使得数据在 `mounted` 钩子执行时或之前就已经返回，从而让用户更快地看到渲染后的内容，或减少白屏/加载状态的时间。
    - **服务端渲染 (SSR)**：在 SSR 场景下，`created` (和 `beforeCreate`) 是会在服务器端执行的钩子，适合用于数据预取。`mounted` 则只在客户端执行。

**`mounted` 钩子：**
- **时机**：实例挂载到 DOM 后调用。此时，`this.$el` 已经被新创建的 `vm.$el` 替换，组件相关的 DOM 树已经渲染并插入到文档中。
- **DOM状态**：DOM 完全可用，可以进行各种 DOM 操作。
- **请求优势**：
    - **DOM依赖操作**：如果获取数据后需要立即操作 DOM（例如，基于数据动态计算元素尺寸、初始化需要特定 DOM 元素的第三方库如D3.js、Leaflet等），`mounted` 是更合适的选择，因为它保证了 DOM 的可用性。

**选择建议：**

1.  **首选 `created` 进行数据请求**：
    *   对于大部分场景，如果获取的数据主要用于模板渲染，并且在数据返回后**不需要立即操作 DOM**，建议在 `created` 钩子中发起异步请求。这样可以尽早获取数据，优化用户体验。

2.  **在 `mounted` 中请求数据的场景**：
    *   当获取数据后，需要**立即依赖 DOM 进行某些操作**时（例如，初始化图表、获取元素尺寸、使用 `this.$refs` 访问子组件或元素并对其进行操作）。
    *   虽然可以在 `created` 中请求数据，然后在 `this.$nextTick` 或 `mounted` 中执行 DOM 操作，但如果数据获取和 DOM 操作紧密相关，直接在 `mounted` 中发起请求逻辑可能更清晰。

3.  **避免页面抖动/闪烁**：
    *   无论在哪个钩子中请求数据，如果请求耗时较长，页面可能会先渲染一个初始状态，数据返回后再更新。为提升体验，应使用加载指示器（如 loading 动画、骨架屏）来过渡。

4.  **总结**：
    *   **通用原则**：能早就尽量早。如果不需要 DOM，`created` 更优。
    *   **DOM 依赖**：如果数据获取后的操作强依赖 DOM，则 `mounted` 更合适，或在 `created` 获取数据后，在 `mounted` / `this.$nextTick` 中操作 DOM。
    *   **SSR 考量**：如果项目使用服务端渲染，则必须在 `created` 或 `beforeCreate` 中进行数据预取。

**示例：**

```vue
<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <ul v-else>
      <li v-for="item in items" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      loading: true,
      error: null,
    };
  },
  created() {
    // 示例：在 created 中获取数据
    this.fetchData();
  },
  mounted() {
    // 示例：如果需要在 mounted 后基于 DOM 做些事
    // console.log(this.$el.offsetHeight); 
    // 如果 fetchData 依赖 DOM，则可能移到这里
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.error = null;
      try {
        // 模拟 API 调用
        const response = await new Promise(resolve => 
          setTimeout(() => resolve({ data: [{id: 1, name: 'Item 1'}, {id: 2, name: 'Item 2'}] }), 1000)
        );
        this.items = response.data;
      } catch (err) {
        this.error = 'Failed to load data.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>