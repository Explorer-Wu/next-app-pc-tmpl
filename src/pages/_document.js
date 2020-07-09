import Document, { Html, Head, Main, NextScript } from 'next/document'

class NextDocument extends Document {
  static async getInitialProps(ctx) {
      //原用法
    // const initialProps = await Document.getInitialProps(ctx)
    // return { ...initialProps }

    // 这里采用react里High Order Component的方式，可以重新包装APP和所有渲染的组件
	// 这里还可以扩展一些高级的功能，比如css in js的方案
    const originalRenderPage = ctx.renderPage
    //之所以要定制`renderPage`，是因为在css-in-js库中，需要包裹应用才能正确使用服务端渲染。
    //renderPage：Function 一个回调函数，同步执行React渲染逻辑。
    //为了支持服务器渲染wrappers（如Aphrodite的renderStatic），对这个函数进行decorate是很有用的。
    ctx.renderPage = () =>
      originalRenderPage({
        // useful for wrapping the whole react tree 用于包裹整个react树
        enhanceApp: (App) => App,
        // useful for wrapping in a per-page basis 用于以每页为单位包装
        enhanceComponent: (Component) => Component,
      })
    // 因为覆盖了Document，所以要重新返回页面的props
    // Run the parent `getInitialProps`, it now includes the custom `renderPage` 执行父类的`getInitialProps`方法，现在它包含了定制的`renderPage`
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }

  render() {
    // const { initialProps } = this.props
    // console.log("initialProps", initialProps)
    return (
      <Html>
        <Head/>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default NextDocument