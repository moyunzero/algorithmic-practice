# SPA首屏加载速度慢的怎么解决？

## 一、什么是首屏加载

首屏时间（First Contentful Paint），指的是浏览器从响应用户输入网址地址，到首屏内容渲染完成的时间，此时整个网页不一定要全部渲染完成，但需要展示当前视窗需要的内容

首屏加载可以说是用户体验中**最重要**的环节

### 关于计算首屏时间

利用`performance.timing`提供的数据：

通过`DOMContentLoad`或者`performance`来计算出首屏时间

```js
// 方案一：
document.addEventListener('DOMContentLoaded', (event) => {
    console.log('first contentful painting');
});
// 方案二：
performance.getEntriesByName("first-contentful-paint")[0].startTime

// performance.getEntriesByName("first-contentful-paint")[0]
// 会返回一个 PerformancePaintTiming的实例，结构如下：
{
  name: "first-contentful-paint",
  entryType: "paint",
  startTime: 507.80000002123415,
  duration: 0,
};
```

## 二、加载慢的原因

在页面渲染的过程，导致加载速度慢的因素可能如下：

- **网络延时问题**：
  - 服务器地理位置遥远，用户访问时物理距离导致延迟。
  - DNS 解析耗时。
  - 网络带宽不足或不稳定。
  - 未有效利用 CDN (Content Delivery Network) 加速静态资源分发。
  - 未使用 HTTP/2 或 HTTP/3 等较新协议，无法充分利用其多路复用、头部压缩等特性。
- **资源文件体积是否过大**：
  - JavaScript、CSS、图片等静态资源未经压缩或压缩不充分。
  - 引入了庞大的第三方库，但只使用了其中一小部分功能。
  - 代码中存在未被使用的冗余代码 (Dead Code)，未进行 Tree Shaking 优化。
  - 字体文件过大，或加载了不需要的字重和字符集。
- **资源是否重复发送请求去加载了**：
  - HTTP 缓存策略配置不当，导致浏览器重复请求已缓存或未过期的资源。
  - 模块重复打包，同一个库或组件在多个 chunk 中重复出现。
- **加载脚本的时候，渲染内容堵塞了**：
  - JavaScript 文件（尤其是同步加载的 `<script>`）会阻塞 HTML 解析和 DOM 构建。
  - CSS 文件加载会阻塞后续 DOM 渲染和 JavaScript 执行（如果 JS 依赖 CSSOM）。
  - 未使用 `<script>` 标签的 `async` 或 `defer` 属性来优化脚本加载。

## 三、解决方案

常见的几种SPA首屏优化方式

- 减小入口文件体积
- 静态资源本地缓存
- UI框架按需加载
- 图片资源的压缩
- 组件重复打包
- 开启GZip压缩
- 使用SSR

### 减小入口文件体积

减小入口文件体积是优化首屏加载的关键步骤之一。主要方法包括：

1. **路由懒加载 (Route-based Code Splitting)**：
    - 核心思想：把不同路由对应的组件分割成不同的代码块 (chunks)，只有当用户访问特定路由时，才会加载对应的组件代码。
    - 实现：在 `vue-router` 配置路由时，使用动态 `import()` 语法。
    - 效果：显著减小初始加载的 JavaScript 包体积，加快首屏渲染速度。

2. **组件动态导入 (Component-level Code Splitting)**：
    - 对于非首屏必须但在特定条件下才会显示的大型组件（如弹窗、复杂的图表等），也可以使用动态 `import()` 来按需加载。

3. **Tree Shaking**：
    - 利用 `webpack` (或其他现代打包工具如 Rollup, Parcel) 的 Tree Shaking 功能，在打包过程中自动移除 JavaScript 上下文中未引用的代码 (dead code)。
    - 确保你的代码是 ES6 模块化的 (使用 `import` 和 `export`)，并且在 `package.json` 中设置 `"sideEffects": false` (或具体列出有副作用的文件) 以获得更好的 Tree Shaking 效果。

4. **作用域提升 (Scope Hoisting)**：
    - `webpack` 在生产模式下会尝试将模块合并到更少的闭包中，以减少运行时开销和代码体积。

5. **预加载/预获取 (Preload/Prefetch)**：
    - 对于懒加载的路由或组件，如果可以预测用户接下来可能会访问，可以使用 `<link rel="preload">` 或 `<link rel="prefetch">` 来提前加载这些资源。
        - `preload`: 提示浏览器提前加载当前导航下需要的资源，优先级较高。
        - `prefetch`: 提示浏览器提前加载未来导航可能需要的资源，优先级较低，在浏览器空闲时进行。

在`vue-router`配置路由的时候，采用动态加载路由的形式

```js
routes:[ 
    path: 'Blogs',
    name: 'ShowBlogs',
    component: () => import('./components/ShowBlogs.vue')
]
```

以函数的形式加载路由，这样就可以把各自的路由文件分别打包，只有在解析给定的路由时，才会加载路由组件

### 静态资源本地缓存

有效利用缓存机制可以显著减少后续访问时的加载时间，甚至实现离线访问。

1. **HTTP 缓存 (浏览器缓存)**：
    - **强缓存**：通过设置响应头 `Cache-Control` (如 `max-age=31536000`) 和 `Expires`，让浏览器在有效期内直接从本地缓存读取资源，无需向服务器发送请求。
    - **协商缓存**：当强缓存失效后，浏览器会向服务器发送请求。服务器根据请求头中的 `Last-Modified` / `If-Modified-Since` 或 `ETag` / `If-None-Match` 来判断资源是否有更新。若无更新，则返回 `304 Not Modified`，浏览器继续使用本地缓存；若有更新，则返回新资源和 `200 OK`。
    - 策略：对不经常变动的静态资源（如第三方库、图片、字体）设置较长的强缓存时间；对经常变动的业务代码（如 HTML、JS、CSS）设置较短的强缓存时间或使用协商缓存，并通过文件名哈希确保更新时能获取最新版本。

2. **Service Worker 离线缓存**：
    - Service Worker 是一个运行在浏览器后台的独立脚本，可以拦截和处理网络请求，实现复杂的缓存策略、离线应用、消息推送等功能。
    - 通过 Service Worker，可以将应用的核心静态资源（HTML, CSS, JS, 图片等）缓存起来。当用户再次访问或离线时，Service Worker 可以从缓存中提供这些资源，实现快速加载和离线可用性。
    - 常见的缓存策略包括：Cache First (优先从缓存读取), Network First (优先从网络读取), Stale-While-Revalidate (优先从缓存读取，同时后台更新缓存) 等。
    - Vue CLI 生成的项目可以通过 `@vue/pwa` 插件轻松集成 Service Worker。

3. **前端合理利用 `localStorage` / `sessionStorage` / `IndexedDB`**：
    - `localStorage` 和 `sessionStorage`：适用于存储少量结构化数据，如用户偏好设置、表单草稿等。不适合存储大量数据或二进制数据。
    - `IndexedDB`：一个功能更强大的客户端数据库，适合存储大量结构化数据，并支持索引和事务，可以用于实现更复杂的离线数据存储需求。

### UI框架按需加载

现代前端开发中，我们经常使用 UI 组件库（如 Element UI, Ant Design Vue, Vuetify, Material-UI 等）来加速开发。然而，如果完整引入整个 UI 库，即使只用到了其中的一小部分组件，也会导致最终打包体积过大，影响首屏加载速度。

**解决方案：按需加载**

按需加载是指只打包项目中实际使用到的组件及其依赖的样式和逻辑。

**实现方式：**

大多数主流 UI 库都提供了按需加载的方案，通常依赖于 Babel 插件或特定的导入路径。

1. **手动按需引入**：
    直接从组件库中导入需要的组件。这种方式最直接，但如果使用的组件较多，手动维护会比较繁琐。

    ```javascript
    // 以 Element UI 为例
    import Vue from 'vue';
    import { Button, Select, Input, Pagination, Table, TableColumn, MessageBox, Message } from 'element-ui';
    
    Vue.component(Button.name, Button);
    Vue.component(Select.name, Select);
    // 或者
    Vue.use(Button);
    Vue.use(Select);
    Vue.use(Input);
    Vue.use(Pagination);
    Vue.use(Table);
    Vue.use(TableColumn);
    
    Vue.prototype.$msgbox = MessageBox;
    Vue.prototype.$alert = MessageBox.alert;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$prompt = MessageBox.prompt;
    Vue.prototype.$message = Message;
    ```

    对于样式，Element UI 也需要单独引入或按需引入。

2. **使用 Babel 插件自动按需加载**：
    许多 UI 库推荐使用 Babel 插件（如 `babel-plugin-component` for Element UI, `babel-plugin-import` for Ant Design Vue）来实现自动按需加载。开发者只需正常导入组件，插件会在编译时自动将导入语句转换为按需加载的形式，并处理对应的 CSS。

    **Element UI 使用 `babel-plugin-component`：**
    安装：

    ```bash
    npm install babel-plugin-component -D
    ```

    配置 `.babelrc` 或 `babel.config.js`：

    ```json
    {
      "presets": [["@babel/preset-env", { "modules": false }]],
      "plugins": [
        [
          "component",
          {
            "libraryName": "element-ui",
            "styleLibraryName": "theme-chalk"
          }
        ]
      ]
    }
    ```

    然后就可以像完整引入一样使用：

    ```javascript
    import Vue from 'vue';
    import { Button, Select } from 'element-ui';
    Vue.use(Button);
    Vue.use(Select);
    ```

    **Ant Design Vue 使用 `babel-plugin-import`：**
    安装：

    ```bash
    npm install babel-plugin-import -D
    ```

    配置 `.babelrc` 或 `babel.config.js`：

    ```json
    {
      "plugins": [
        ["import", { "libraryName": "ant-design-vue", "libraryDirectory": "es", "style": true }] // `style: true` 会加载 less 文件
      ]
    }
    ```

    使用：

    ```javascript
    import Vue from 'vue';
    import { Button, Input } from 'ant-design-vue';
    Vue.use(Button);
    Vue.use(Input);
    ```

3. **Vite 项目的按需加载**:
    对于使用 Vite 构建工具的项目，通常会使用如 `unplugin-vue-components` 和 `unplugin-auto-import` 配合 UI 库提供的解析器 (resolver) 来实现组件和样式的自动按需导入。

    例如，Element Plus (Vue 3 的 Element UI) 在 Vite 中的配置：
    安装：

    ```bash
    npm install -D unplugin-vue-components unplugin-auto-import
    npm install element-plus
    ```

    配置 `vite.config.js`：

    ```javascript
    import { defineConfig } from 'vite'
    import vue from '@vitejs/plugin-vue'
    import AutoImport from 'unplugin-auto-import/vite'
    import Components from 'unplugin-vue-components/vite'
    import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

    export default defineConfig({
      plugins: [
        vue(),
        AutoImport({
          resolvers: [ElementPlusResolver()],
        }),
        Components({
          resolvers: [ElementPlusResolver()],
        }),
      ],
    })
    ```

    这样配置后，可以直接在模板中使用 Element Plus 组件，无需手动导入。

**效果**：
按需加载可以显著减小打包后的 vendor chunk（包含第三方库代码的块）或 UI 库自身的 chunk 体积，从而加快首屏渲染。

### 代码分割与公共块提取 (Code Splitting & Common Chunks)

代码分割是构建优化中的一项重要技术，它允许你将代码库分割成多个按需加载的 “块” (chunks)。这对于大型应用尤其重要，因为它可以显著改善首屏加载时间。

**为什么需要代码分割？**

- **减小初始加载体积**：用户首次访问时，只需下载渲染首屏所必需的代码，而不是整个应用的全部代码。
- **利用浏览器缓存**：将不常变动的代码（如第三方库）和经常变动的业务代码分离开，可以更有效地利用浏览器缓存。当业务代码更新时，用户只需重新下载变动的部分，而第三方库的 chunk 仍然可以使用缓存。
- **并行加载**：浏览器可以并行下载多个小的 chunk 文件，可能比下载一个巨大的文件更快（尤其是在 HTTP/1.1 环境下，HTTP/2 的多路复用特性对此有所改善）。

**Webpack 中的代码分割 (`optimization.splitChunks`)**

Webpack 4+ 提供了强大的 `optimization.splitChunks` 配置项，用于自动或手动地将模块从主 bundle 中分离出来，形成独立的 chunk。

**核心配置选项解读：**

```javascript
// vue.config.js (Vue CLI) 或 webpack.config.js
module.exports = {
  // ...其他配置
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all', // 'async', 'initial', 'all'
        // 'async': 只对异步加载的模块进行分割 (通过 import() 动态导入的模块)。
        // 'initial': 只对初始加载的模块进行分割 (入口文件直接或间接依赖的模块)。
        // 'all': 同时对异步和初始加载的模块进行分割。通常推荐使用 'all' 以获得最大程度的优化。

        minSize: 20000, // (单位: bytes) 模块或 chunk 超过这个大小才会被分割。默认是 20KB (webpack 5)。
        // 对于 webpack 4，默认值可能是 30000 (30KB)。

        minChunks: 1, // 模块至少被多少个 chunk 引用才会被提取成公共 chunk。默认是 1。

        maxAsyncRequests: 30, // 按需加载时，并行请求的最大数量。默认是 30 (webpack 5)。
        // 对于 webpack 4，默认值可能是 5。

        maxInitialRequests: 30, // 入口点处的最大并行请求数量。默认是 30 (webpack 5)。
        // 对于 webpack 4，默认值可能是 3。

        automaticNameDelimiter: '~', // 生成 chunk 名称时的分隔符。

        cacheGroups: { // 缓存组，用于定义自定义的分割规则。匹配到的模块会被分配到相应的缓存组中。
          vendors: { // 将 node_modules 中的模块提取到名为 'vendors' 的 chunk 中
            test: /[\/]node_modules[\/]/, // 正则表达式，匹配模块的路径
            priority: -10, // 优先级，数值越大，优先级越高。当一个模块同时匹配多个缓存组时，会分配到优先级更高的组。
            name: 'vendors', // 可以指定 chunk 的名称，或者设置为 true 让 webpack 自动生成名称。
            reuseExistingChunk: true, // 如果当前 chunk 包含的模块已经被其他 chunk 提取了，则复用该模块，而不是重新生成。
          },
          commons: { // 提取被多次引用的自定义公共模块
            name: 'commons',
            minChunks: 2, // 至少被2个 chunk 引用
            priority: -20,
            reuseExistingChunk: true,
          },
          // 可以定义更多的缓存组，例如针对特定的库或业务模块
          // elementUI: {
          //   name: 'chunk-elementUI', // 单独将 Element UI 拆包
          //   priority: 20, // 权重要大于 vendors 和 app 不然会被打包进 vendors 或者 app
          //   test: /[\/]node_modules[\/]_?element-ui(.*)/ 
          // },
        }
      },
      // runtimeChunk: 'single' // (可选) 将 webpack 运行时代码提取到一个单独的 chunk (runtime.js)，
      // 这对于长期缓存策略很重要，因为 runtime 代码会随着模块 ID 的变化而变化。
      // 'single' 或 true: 创建一个共享的 runtime chunk。
      // object: { name: 'my-runtime' } 可以自定义 runtime chunk 的名称。
    }
  }
};
```

**关键概念：**

- **`chunks: 'all'`**：这是最常用的设置，它会考虑所有类型的模块（同步和异步）进行分割，能最大化地提取公共代码和第三方库。
- **`cacheGroups`**：这是 `splitChunks` 的核心。你可以定义多个缓存组，每个组有自己的匹配规则 (`test`)、优先级 (`priority`) 和命名规则 (`name`)。
  - **`vendors` 组**：一个常见的实践是创建一个 `vendors` 组，用于将所有从 `node_modules` 目录引入的第三方库打包到一个或多个单独的 chunk 中。这样做的好处是第三方库通常不经常变动，可以被浏览器长期缓存。
  - **自定义公共模块组**：如果你的应用中有一些自定义的模块被多个页面或组件共享，可以创建缓存组来提取它们。
- **`minSize` 和 `minChunks`**：这两个参数共同决定了一个模块是否值得被提取。模块需要达到一定的大小，并且被足够多的其他 chunk 引用，才会被认为是一个“公共”模块。
- **`priority`**：当一个模块满足多个缓存组的条件时，它会被分配到 `priority` 值最高的那个组。
- **`runtimeChunk`**：将 Webpack 的运行时代码和模块清单提取到一个单独的文件中。这有助于确保即使应用代码没有改变，只要依赖关系不变，vendor hash 就不会改变，从而实现更有效的长期缓存。

**效果：**

通过合理的 `splitChunks` 配置，可以将应用代码更细粒度地拆分，使得：

- 初始加载的 JS 体积减小。
- 第三方库和公共业务逻辑被提取到共享 chunk，利用浏览器缓存，减少重复下载。
- 更新应用时，用户可能只需要下载变动的小 chunk，而不是整个大文件。

**Vite 中的代码分割：**

Vite 底层使用 Rollup 进行打包，Rollup 本身也支持代码分割。Vite 对此进行了封装和优化。

- **自动代码分割**：Vite 会自动对动态导入 (`import()`) 的模块进行代码分割。
- **手动分块 (Manual Chunks)**：可以通过 `build.rollupOptions.output.manualChunks` 配置来更细致地控制模块如何被打包到不同的 chunk 中。这类似于 Webpack 的 `cacheGroups`。

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 将所有 node_modules 的模块打包到 vendor.js
            return 'vendor';
          }
          // 也可以根据具体库来拆分
          // if (id.includes('node_modules/element-plus')) {
          //   return 'element-plus';
          // }
        }
      }
    }
  }
}
```

代码分割是一个需要根据项目具体情况进行调整和优化的过程。使用构建分析工具（如 `webpack-bundle-analyzer` 或 `rollup-plugin-visualizer`）可以帮助你理解打包结果，并据此优化分割策略。

### 图片资源的优化

图片资源往往是页面体积的大头，对其进行优化对首屏加载速度至关重要。

0. **使用矢量图 (SVG)**：
    - 对于图标、Logo 等简单图形，优先使用 SVG。SVG 是基于 XML 的矢量图形格式，无限缩放而不失真，文件体积通常较小，并且可以通过 CSS 或 JavaScript 进行控制。

1. **图片压缩**：
    - 对于所有位图资源（JPEG, PNG, GIF），都应进行适当的压缩。可以使用工具如 `image-webpack-loader` (在构建时自动压缩)、在线压缩工具（TinyPNG, Squoosh.app 等）来减小文件体积。
    - 针对不同类型的图片选择合适的压缩级别，在质量和体积之间找到平衡。

2. **选择合适的图片格式**：
    - **WebP**：WebP 格式通常能比 JPEG 和 PNG 提供更好的压缩效果和图片质量（支持有损和无损压缩、透明度、动画）。可以考虑为支持 WebP 的浏览器提供 WebP 格式的图片，并为不支持的浏览器提供降级方案（如使用 `<picture>` 标签）。

    ```html
    <picture>
      <source srcset="image.webp" type="image/webp">
      <source srcset="image.jpg" type="image/jpeg">
      <img src="image.jpg" alt="My image">
    </picture>
    ```

    - **AVIF**：比 WebP 更现代的图片格式，压缩率更高，但浏览器支持度尚不如 WebP。也可以通过 `<picture>` 标签提供。
    - 对于简单图标和矢量图形，优先使用 SVG (见第0点)。
    - JPEG：适用于色彩丰富的照片。
    - PNG：适用于需要透明背景或无损压缩的图像。
    - GIF：适用于简单的动画。

3. **图片懒加载 (Lazy Loading)**：
    - 对于不在首屏可视区域内的图片，可以使用懒加载技术。即当图片滚动到可视区域时才开始加载。这可以显著减少首屏需要加载的图片数量。
    - 可以通过监听滚动事件、使用 `Intersection Observer API` (推荐，性能更好) 或现成的懒加载库（如 `vue-lazyload`）来实现。
    - 现代浏览器也开始原生支持图片懒加载：`<img src="image.jpg" loading="lazy" alt="...">`。

    ```javascript
    // 使用 vue-lazyload 示例
    // main.js
    import VueLazyload from 'vue-lazyload'
    Vue.use(VueLazyload, {
      preLoad: 1.3, // 预加载高度比例
      error: 'error.png', // 图片加载失败时显示的图片
      loading: 'loading.gif', // 图片加载时显示的图片
      attempt: 1 // 加载失败后的尝试次数
    })

    // 在组件中使用
    // <img v-lazy="image.src" />
    ```

4. **响应式图片**：
    - 根据不同的屏幕尺寸和分辨率加载不同大小的图片，避免在小屏幕上加载过大的图片。可以使用 `<img srcset>` 属性或 `<picture>` 标签。

    ```html
    <img srcset="image-small.jpg 480w, 
                 image-medium.jpg 800w, 
                 image-large.jpg 1200w"
         sizes="(max-width: 600px) 480px, 
                (max-width: 900px) 800px, 
                1200px"
         src="image-large.jpg"
         alt="My image">
    ```

5. **精灵图 (CSS Sprites)** / **字体图标 (Icon Fonts)**：
    - **精灵图**：对于页面上使用到的大量小图标，可以将它们合并到一张精灵图上，通过 CSS 的 `background-position` 来显示不同的图标。这可以减少 HTTP 请求次数。
    - **字体图标**：将图标制作成字体文件，通过 CSS 的 `@font-face` 引入，并使用特定字符或类名来显示图标。优点是矢量、可通过 CSS 控制大小颜色、兼容性好。缺点是通常只支持单色，加载字体文件也需要时间。
    - 在线字体图标库（如 Font Awesome, Material Icons）也是一个很好的替代方案。

6. **使用图像 CDN**：
    - 图像 CDN 可以提供地理位置就近访问、自动格式转换 (如自动转 WebP)、动态裁剪和压缩等高级功能，进一步优化图片加载。

7. **占位符 (Placeholders)**：
    - 在图片加载完成前，显示一个低质量的占位符（如 LQIP - Low Quality Image Placeholder、纯色块、模糊效果或骨架屏中的图像占位），可以改善用户感知性能，减少布局偏移。

1. **图片压缩**：
    - 对于所有图片资源，都应进行适当的压缩。可以使用工具如 `image-webpack-loader`、在线压缩工具（TinyPNG等）来减小文件体积。
    - 针对不同类型的图片选择合适的压缩级别。

2. **选择合适的图片格式**：
    - **WebP**：WebP 格式通常能比 JPEG 和 PNG 提供更好的压缩效果和图片质量。可以考虑为支持 WebP 的浏览器提供 WebP 格式的图片，并为不支持的浏览器提供降级方案（如使用 `<picture>` 标签）。

    ```html
    <picture>
      <source srcset="image.webp" type="image/webp">
      <source srcset="image.jpg" type="image/jpeg">
      <img src="image.jpg" alt="My image">
    </picture>
    ```

    - 对于简单图标和矢量图形，优先使用 SVG。

3. **图片懒加载 (Lazy Loading)**：
    - 对于不在首屏可视区域内的图片，可以使用懒加载技术。即当图片滚动到可视区域时才开始加载。这可以显著减少首屏需要加载的图片数量。
    - 可以通过监听滚动事件、使用 `Intersection Observer API` 或现成的懒加载库（如 `vue-lazyload`）来实现。

    ```javascript
    // 使用 vue-lazyload 示例
    // main.js
    import VueLazyload from 'vue-lazyload'
    Vue.use(VueLazyload, {
      preLoad: 1.3, // 预加载高度比例
      error: 'error.png', // 图片加载失败时显示的图片
      loading: 'loading.gif', // 图片加载时显示的图片
      attempt: 1 // 加载失败后的尝试次数
    })

    // 在组件中使用
    // <img v-lazy="image.src" />
    ```

4. **响应式图片**：
    - 根据不同的屏幕尺寸和分辨率加载不同大小的图片，避免在小屏幕上加载过大的图片。可以使用 `<img srcset>` 属性或 `<picture>` 标签。

5. **精灵图 (CSS Sprites)**：
    - 对于页面上使用到的大量小图标，可以将它们合并到一张精灵图上，通过 CSS 的 `background-position` 来显示不同的图标。这可以减少 HTTP 请求次数。在线字体图标也是一个很好的替代方案。

### 开启GZip压缩

拆完包之后，我们再用`gzip`或`Brotli`做一下压缩。`Brotli`通常比`gzip`有更高的压缩率。
安装 `compression-webpack-plugin` (用于 Gzip) 和 `brotli-webpack-plugin` (用于 Brotli)。

```bash
npm install compression-webpack-plugin brotli-webpack-plugin -D
# 或者
yarn add compression-webpack-plugin brotli-webpack-plugin -D
```

在`vue.congig.js`中引入并修改`webpack`配置

```js
const CompressionPlugin = require('compression-webpack-plugin')

configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
            config.mode = 'production'
            return {
                plugins: [new CompressionPlugin({
                    test: /\.js$|\.html$|\.css/, //匹配文件名
                    threshold: 10240, //对超过10k的数据进行压缩
                    deleteOriginalAssets: false //是否删除原文件
                })]
            }
        }
```

在服务器我们也要做相应的配置。如果发送请求的浏览器支持 `gzip` 或 `Brotli` (通过 `Accept-Encoding` 请求头表明)，服务器就应该返回对应压缩格式的文件。

**Nginx 配置示例 (gzip 和 Brotli 同时启用，优先 Brotli)：**

```nginx
# Gzip 配置
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_buffers 16 8k;
gzip_http_version 1.1;
gzip_min_length 256;
gzip_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

# Brotli 配置 (需要安装 ngx_brotli 模块)
brotli on;
brotli_comp_level 6;
brotli_static on; # 优先提供预压缩的 .br 文件
brotli_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
```

**Node.js (Express) 配置示例：**

对于 Express，可以使用 `compression` 中间件来处理 Gzip。对于 Brotli，可以使用类似 `shrink-ray` 或 `express-static-brotli` 等中间件。

```javascript
// 使用 compression (gzip)
const compression = require('compression');
app.use(compression()); // 在其他中间件使用之前调用

// 如果需要支持 Brotli，可以查找并使用相应的中间件
// 例如，使用 express-static-brotli 配合预先生成的 .br 文件
// const expressStaticBrotli = require('express-static-brotli');
// app.use('/', expressStaticBrotli('path/to/static/files', {
//   fallthrough: true, // 如果没有 .br 文件，则尝试其他中间件
//   setHeaders: (res, path) => {
//     res.setHeader('Cache-Control', 'public, max-age=31536000');
//   }
// }));
```

确保在服务器端正确配置 `Content-Encoding` 响应头。

### 使用SSR

SSR（Server-Side Rendering，服务端渲染）是指将 Vue 组件在服务器端渲染成 HTML 字符串，然后直接发送到浏览器，浏览器接收到 HTML 后可以直接显示内容，之后再进行客户端激活 (Hydration)，使页面具有交互性。

**优点：**

- **更快的首屏加载速度 (FCP, LCP)**：用户能更快地看到页面内容，因为浏览器直接接收到渲染好的 HTML。
- **更好的 SEO**：搜索引擎爬虫可以直接抓取到完整的页面内容。

**缺点：**

- **服务器压力增加**：页面渲染逻辑从客户端转移到了服务端。
- **开发复杂度增加**：需要处理服务端和客户端的环境差异，例如 `window`、`document` 等浏览器API在服务端不可用。
- **构建配置更复杂**。

**实现方案：**

- **Nuxt.js (Vue)**：一个基于 Vue.js 的通用应用框架，内置了 SSR 功能，简化了 SSR 应用的开发。
- **Next.js (React)**：React 生态中类似 Nuxt.js 的框架。
- **Vite SSR**：Vite 构建工具也提供了实验性的 SSR 支持，可以更灵活地集成到现有 Vue 项目中。

**SSG (Static Site Generation，静态站点生成)：**

- 与 SSR 类似，SSG 也是在构建时将页面预渲染成 HTML 文件。
- 区别在于 SSR 是在每次请求时动态渲染，而 SSG 是在构建时一次性生成所有页面的静态 HTML 文件。
- **优点**：极快的加载速度（因为是纯静态文件，可以直接部署到 CDN），无需服务器运行时渲染，安全性高。
- **缺点**：不适用于内容频繁变动或高度动态的页面。每次内容更新都需要重新构建和部署。
- **实现方案**：Nuxt.js (通过 `nuxt generate`)、VuePress、VitePress、Gridsome 等。

### 更多优化策略

除了上述方法，还有一些其他的策略可以帮助优化首屏加载：

1. **Critical CSS (关键 CSS)**：
    - 将渲染首屏内容所必需的 CSS（即关键 CSS）提取出来，并内联到 HTML 的 `<head>` 部分。
    - 这样浏览器在接收到 HTML 后就能立即开始渲染首屏内容，无需等待外部 CSS 文件加载完成。
    - 非关键 CSS 则可以通过异步方式加载。
    - 可以使用 `critical`、`penthouse` 等工具自动提取关键 CSS。

2. **预加载 (Preload) 和预获取 (Prefetch)**：
    - **` <link rel="preload" as="style" href="style.css"> `**: 告诉浏览器尽快下载指定资源，因为它对于当前页面很重要，但不会阻塞渲染。
    - **` <link rel="prefetch" href="next-page.html"> `**: 告诉浏览器该资源将来可能会用到，可以在空闲时下载。
    - 适用于字体、关键脚本、关键样式表等。

3. **使用 CDN (Content Delivery Network)**：
    - 将静态资源（JS, CSS, 图片, 字体等）部署到 CDN。CDN 通过在全球分布的边缘节点服务器，让用户从最近的节点获取资源，减少网络延迟，提高加载速度。

4. **优化字体加载**：
    - **字体裁剪/子集化 (Font Subsetting)**：只包含页面实际用到的字符，减小字体文件体积。
    - **使用 WOFF2 格式**：WOFF2 是目前压缩率最高的字体格式，优先使用。
    - **`font-display` CSS 属性**：控制字体加载过程中的显示行为，如 `font-display: swap;` 可以先显示后备字体，待自定义字体加载完成后再替换，避免文本长时间不可见 (FOIT - Flash of Invisible Text)。
    - 异步加载字体或使用 `preload` 预加载关键字体。

5. **骨架屏 (Skeleton Screens)**：
    - 在等待数据加载和内容渲染完成之前，先向用户展示页面的大致轮廓（灰色块、占位符等）。
    - 这不能实际加快加载速度，但能改善用户感知性能，让用户感觉页面加载更快，减少等待焦虑。

6. **避免或延迟加载非关键的第三方脚本**：
    - 许多第三方脚本（如分析工具、广告、社交插件）可能会拖慢页面加载速度。
    - 评估每个第三方脚本的必要性。对于非关键脚本，考虑使用 `async` 或 `defer` 属性加载，或者在核心内容加载完成后再动态插入。

7. **优化服务器响应时间 (TTFB - Time To First Byte)**：
    - TTFB 是浏览器收到服务器第一个字节响应的时间。过高的 TTFB 会延迟后续所有资源的加载。
    - 优化方向：服务器硬件升级、优化后端代码、数据库查询优化、使用高效的服务器软件、启用服务端缓存等。

8. **关注 Web Vitals**：
    - **Core Web Vitals** (LCP, FID, CLS) 是 Google 提出的衡量用户体验的关键指标。
        - **LCP (Largest Contentful Paint)**：最大内容绘制，衡量加载性能。首屏优化直接影响 LCP。
        - **FID (First Input Delay)**：首次输入延迟，衡量交互性。
        - **CLS (Cumulative Layout Shift)**：累积布局偏移，衡量视觉稳定性。
    - 使用 Lighthouse, PageSpeed Insights, Chrome DevTools 等工具监控和改进这些指标。

### 小结

减少首屏渲染时间的方法有很多，总的来讲可以分成两大部分 ：**资源加载优化**（减少请求数量、减小资源体积、利用缓存、优化网络传输）和 **页面渲染优化**（优化代码执行、改进渲染路径、提升用户感知）。选择合适的优化策略需要根据项目的具体情况进行分析和权衡。
