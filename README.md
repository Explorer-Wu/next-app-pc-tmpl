# Next App PC Template
> 一个关于服务端渲染的前端构建模版，本范例使用了next.js+antd+koa来搭建

### 环境搭建配置
* 安装设置
```sh
npx create-next-app / yarn create next-app
``` 

* 开发模式下启动
```sh
npm run dev / next
```

### 生产坏境生成打包
```sh
npm run build / next build
```

### 生产环境服务启动
```sh
npm run start / next start
```

Next.js 是围绕 page（页面）的概念构建的。page 是从 pages 目录中的.js、.jsx、.ts或.tsx文件导出的React 组件。

### 自定义Document(_document.js)
1. 它只有在服务端渲染的时候才会被调用，客户端渲染，它是不会起任何作用的
2. 它主要用来修改服务端渲染的文档内容，初始化服务端时添加文档标记元素
3. 通常实现服务端渲染会使用一些css-in-js库(styled-jsx是 Next.js自带默认使用的css-in-js库)， 它在_document.js中定义
注意：
    1）Document只在服务器中渲染，事件处理如onClcikwon‘t work
    2）<Main />之外的React组件不会被浏览器初始化，不要在其中添加应用的逻辑。如果在页面中有共用的组件（如菜单或者工具栏），使用App组件代替。
    3）客户端转换时不会调用Document的getInitialProps方法，页面静态优化时也不会调用。

### 自定义App(_app.js)
Next.js使用App组件来初始化页面。可以重写App来覆盖Next.js自带的App，控制页面初始化。
这里的App其实就是react的根组件，为什么要自定义App？
1.在页面改变时保持布局（对App组件进行重构，在App组件中加入一些项目中不变的内容，比如页面的布局）
2.导航页面时保持状态（在App中保持公用的状态，也可以是一些全局的css，比如搭建环境加入的antd.css）
3.给页面传递自定义的数据
4.使用componentDidCatch来自定义错误处理
4.将额外数据注入页面(如 GraphQL 查询)

### 获取数据以及组件生命周期
* getStaticProps（静态生成）
getStaticProps是用于在构建时预先执行getInitialProps进行的处理并预先生成静态文件的API。 不会在客户端上运行。 始终在服务器端运行。

* getStaticPaths （静态生成）
用于在使用动态路由时生成静态文件（指定动态路由以根据数据进行预渲染）。
getStaticProps的必需参数为paths和fallback。 它决定访问预构建路径以外的路径时的行为。
1. false  其他路由为404
2. true   如果fallback设置为true，则即使未预构建的路径也不会为404

context参数是一个对象, 入参对象的属性如下：
params: 动态路由参数。例如，页面[id].js，则params为{ id: ... }. 
preview: 如果页面处于预览模式，则为true，否则为false。
previewData: 通过setPreviewData设置预览数据。请参阅预览模式文档。

* getInitialProps
getInitialProps是在渲染页面之前就会运行的API，在每个请求上获取数据的异步方法，只能在pages文件夹内的文件中使用。
如果该路径下包含该请求，则执行该请求，并将所需的数据作为props传递给页面。(实际上有时会有发送日志等不影响HTML的副作用。 ）
getInitialProps是SSR专用的API，这是误解。
直接访问后，getInitialProps将在服务器端运行。
另一方面，使用next/link进行客户端路由时，在客户端执行。因此，建议使用isomorphic-unfetch等fetch库。

当服务渲染时，getInitialProps将会把数据序列化，就像JSON.stringify。所以确保getInitialProps返回的是一个普通 JS 对象，而不是Date, Map 或 Set类型。
当页面初始化加载时，getInitialProps只会加载在服务端。只有当路由跳转（Link组件跳转或 API 方法跳转）时，客户端才会执行getInitialProps。
注意：getInitialProps将不能使用在子组件中。只能使用在pages页面中。
Next.js 9.3 或更高版本，我们建议你使用 getStaticProps 或 getServerSideProps 来替代 getInitialProps。
这些新的获取数据的方法使你可以在静态生成（static generation）和服务器端渲染（server-side rendering）之间进行精细控制。

getInitialProps入参对象的属性如下：
  - pathname - URL 的 path 部分
  - query - URL 的 query 部分，并被解析成对象
  - asPath - 显示在浏览器中的实际路径（包含查询部分），为String类型
  - req - HTTP 请求对象 (只有服务器端有)
  - res - HTTP 返回对象 (只有服务器端有)
  - err - 渲染过程中的任何错误

* getServerSideProps （服务器端渲染）
在每个请求上获取数据。SSR的API与上一个getInitialProps类似。使用性不会有太大变化, 区别getServerSideProps总是在服务器端。
getInitialProps在next link执行路由的情况下，已在客户端执行。
另一方面，当路由时，getServerSideProps对next link也是来自客户端的一条指令，要在服务器端运行，包含执行结果的JSON文件从服务器返回。Next.js使用此JSON文件在客户端渲染。

```
export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  }
}
```

context参数是一个对象, 入参对象的属性如下：
  - params: 动态路由参数， 例如： { id: ... }. 
  - req: HTTP 请求对象 
  - res: HTTP 返回对象 (只有服务器端有)
  - query: URL 的 query 部分，并被解析成对象
  - preview: 如果页面处于预览模式，则为true，否则为false。
  - previewData: 通过setPreviewData设置预览数据。请参阅预览模式文档。

getInitialProps由于执行环境根据情况而变化，因此具有一些不利影响。因此getInitialProps，将来似乎不推荐使用。

* 区别
getStaticProps，getStaticPaths是在构建时生效的。
getServerSideProps,getInitialProps是在请求时候生效的。
有一些页面用了getServerSideProps,getInitialProps这两个方法，这两个方法是在请求页面的时候才会执行的，所以只要有这两个方法的页面就不会打包成静态页面。

* next 完成一个请求的流程
1. handle接受到请求，进行异常判断，异常则404，无异常则将请求相应code置为200
2. 调用内部的run()
3. 调用 router.execute 方法
    router.execute的逻辑是怎么样的呢？
    1） 首先取查询预留的public和static是否存在要请求的文件，有的话直接返回静态文件
    2） 其次是查询打包编译后的静态文件中是否存在要请求的文件，有的话直接返回
    3） 最后，就是如果请求的是包含getServerSideProps, getInitialProps的页面，则需要node服务先去执行这两个方法，然后再构建 render to html string 文件返回，这就是ssr，同时也增加了服务端压力，renderToString的过程中做不了其他的事情。所以需要权衡好再使用这两个静态方法

node做为服务端，相对其他来说，并不适合做特别复杂的事情，所以建议：
1. 涉及到公司产品和其他信息需要被更多人知道的页面的接口和数据尽可能放到服务端渲染（getServerSideProps, getInitialProps）
2. 不涉及以上信息的尽可能放到浏览器端做，减少node的压力，提高交互体验


### 路由
* <Link>用法
用 <Link> 组件实现客户端的路由切换

客户端路由行为与浏览器很相似：
1. 组件获取
2. 如果组件定义了getInitialProps，数据获取了。如果有错误情况将会渲染 _error.js。
3. 1和2都完成了，pushState执行，新组件被渲染。

注意：可以使用<Link prefetch>使链接和预加载在后台同时进行，来达到页面的最佳性能。 如果需要注入pathname, query 或 asPath到你组件中，你可以使用withRouter。

* useRouter
useRouter可以访问应用中任何函数组件中的路由器对象。
```
import { useRouter } from 'next/router'
```
useRouter是一个React Hook，这意味着它不能用于类。你可以使用withRouter，或者将类包装在函数组件中。

* withRouter
如果useRouter不是最适合你，withRouter也可以添加相同的路由器对象到任何组件
```
import { withRouter } from 'next/router'
```
* Router对象
以下是通过useRouter和withRouter返回的router对象属性：
  - route —— 当前路由的String类型
  - pathname —— 为String类型，当前路由，目录‘/pages’内部的路径
  - query —— 查询内容，被解析成Object类型. 默认为{}
  - asPath —— 展现在浏览器上的实际路径，包含查询内容，为String类型

* Router API
  Router API包含在Router对象中：
  - push(url, as=url, options) —— 页面渲染参数：1. 目录page内部的url的页面导航; 2.浏览器中显示的可选URL的装饰，默认为url; 3.配置选项的可选对象

  - replace(url, as=url, options) —— Router.replace将阻止向history堆栈中添加新的URL条目，同push的api用法

  - prefetch(url, as=url) —— 预取页面以更快地实现客户端变更。这个方法只适用于没有next/link的导航，因为next/link会自动预抓取页面。（仅用于生产环境的功能，开发环境不可用）

  - beforePopState(cb: () => boolean) —— 在路由器处理事件之前拦截. cb —— 在传入popstate事件上运行的函数。该函数将事件的状态作为对象接收，该对象包含以下属性：{ url, as, options } 三参数和push的参数等同

  - back() —— 返回导航历史。等同于单击浏览器的后退按钮，执行window.history.back()
  - reload() —— 重新加载当前URL。相当于单击浏览器的刷新按钮，执行window.location.reload()

  注：push 和 replace 函数的第二个参数as，是为了装饰 URL 作用。如果你在服务器端设置了自定义路由将会起作用。

* 拦截器 popstate
有些情况（比如使用custom router），你可能想监听popstate，在路由跳转前做一些动作。 比如，你可以操作request或强制SSR刷新
```
import Router from 'next/router'

Router.beforePopState(({ url, as, options }) => {
  // I only want to allow these two routes!
  if (as !== "/" || as !== "/other") {
    // Have SSR render bad routes as a 404.
    window.location.href = as
    return false
  }

  return true
});
```
如果你在beforePopState中返回 false，Router将不会执行popstate事件。

* 路由事件
监听路由相关事件：
  - routeChangeStart(url) —— 路由开始切换时触发
  - routeChangeComplete(url) —— 完成路由切换时触发
  - routeChangeError(err, url) —— 路由切换报错或加载取消时触发， err.cancelled - 表示导航是否被取消
  - beforeHistoryChange(url) —— 浏览器 history 模式开始切换时触发
  - hashChangeStart(url) —— 开始切换 hash 值但是没有切换页面路由时触发
  - hashChangeComplete(url) —— 完成切换 hash 值但是没有切换页面路由时触发

这里的url是指显示在浏览器中的 url。如果你用了Router.push(url, as)（或类似的方法），那浏览器中的 url 将会显示 as 的值。
```
const handleRouteChange = url => {
  console.log('App is changing to: ', url)
}
Router.events.on('routeChangeStart', handleRouteChange)
```
如果你不想长期监听该事件，你可以用off事件去取消监听：
```
Router.events.off('routeChangeStart', handleRouteChange)
```
