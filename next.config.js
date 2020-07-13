const withSass = require('@zeit/next-sass')
const withLess = require('@zeit/next-less')
// const withStylus = require('@zeit/next-stylus')
const withCss = require('@zeit/next-css')
const withSourceMaps = require('@zeit/next-source-maps')

const lessToJS = require('less-vars-to-js')
const fs = require('fs')
const path = require('path')

const TerserPlugin = require('terser-webpack-plugin');
const { DefinePlugin } = require('webpack');
const { ANALYZE } = process.env;
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: ANALYZE === 'true',
})

const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
let isDev = true;



// Where your antd-custom.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './public/styles/antd-custom.less'), 'utf8')
)

const commonsChunkConfig = (config, test = /\.css$/) => {
  // Extend the default CommonsChunkPlugin config
  config.plugins = config.plugins.map(plugin => {
    if (
      plugin.constructor.name === 'CommonsChunkPlugin' &&
      typeof plugin.minChunks !== 'undefined'
    ) {
      const defaultMinChunks = plugin.minChunks
      plugin.minChunks = (module, count) => {
        // Move all styles to commons chunk so they can be extracted to a single file
        if (module.resource && module.resource.match(test)) {
          return true
        }
        // Use default minChunks for non-style modules
        return typeof defaultMinChunks === 'function'
          ? defaultMinChunks(module, count)
          : count >= defaultMinChunks
      }
    }
    return plugin
  })
  return config
}

nextConfig = {
  dir: "./src",
  distDir: "./build",
  pageExtensions: ['jsx', 'js', 'json'],
  //自动静态优化
  // devIndicators: {
  //   autoPrerender: true,
  // },
  // useFileSystemPublicRoutes: false, //禁用文件系统路由
  // cssModules: true,
  // generateEtags: false, //禁止 etag 生成根据你的缓存策略. 如果没有配置，Next 将会生成 etags 到每个页面中
  // onDemandEntries: { //控制服务器部署以及缓存页面
  //   // period (in ms) where the server will keep pages in the buffer
  //   maxInactiveAge: 25 * 1000,
  //   // number of pages that should be kept simultaneously without being disposed
  //   pagesBufferLength: 2,
  // },

  /*压缩仅适用于server目标。通常需要在HTTP代理（如nginx）上启用压缩，以减轻Node.js进程的负载*/
  // compress: false,  //是否禁用Gzip压缩

  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: themeVariables, // make your antd custom effective
    localIdentName: '[local]___[hash:base64:5]',
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.node = {
      fs: 'empty'
    }
    /** 环境变量自定义配置 **/
    // env: {
    //   customKey: 'my-value',
    // },

    /**
     * buildId - 字符串类型，构建的唯一标识符
     * dev - Boolean型，判断你是否在开发环境下
     * isServer - Boolean 型，为true使用在服务端, 为false使用在客户端
     * defaultLoaders - 对象型 ，内部默认加载器, 你可以如下配置：
     *    1. babel - 对象型，默认配置babel-loader.
     *    2. hotSelfAccept - 对象型， hot-self-accept-loader配置选项.这个加载器只能用于高阶案例。如 @zeit/next-typescript添加顶层 typescript 页面。
    */ 
    // console.log("defaultLoaders:", defaultLoaders)

    config.module.rules.push({
      test: /.(js|jsx)$/,
      exclude: /\/node_modules\//,
      // include: [utils.resolve('src'), utils.resolve('test')],
      loader: 'babel-loader?cacheDirectory'
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          publicPath: './',
          outputPath: 'public/images',
          // name: '[name].[ext]'
          name: '[name].[hash:8].[ext]'
        }
      }
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      use: [
        {
            loader: "url-loader",
            options: {
              limit: 10000,
              publicPath: './',
              outputPath: 'public/media',
              name: '[name].[hash:7].[ext]'
            }
        }
      ]
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      // test: /\.(svg|eot|otf|ttf|woff|woff2)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: './',
          outputPath: 'public/fonts',
          name: '[name].[hash:7].[ext]'
        }
      }
    })
  
    config.resolve = {
      ...config.resolve,
      extensions: ['.js', '.jsx', '.json'],
    };

    if (!dev) {
      config.plugins.push(
        ...[
          // 代替uglyJsPlugin
          new TerserPlugin({
            terserOptions: {
              ecma: 6,
              warnings: false,
              extractComments: false, // remove comment
              compress: {
                drop_console: true // remove console
              },
              ie8: false
            }
          }),
          // new DefinePlugin({
          //   'process.env': {
          //     BASE_URL: JSON.stringify(BASE_URL)
          //   }
          // })   
      ])

      config.devtool = 'source-map';
    } else {

      if(ANALYZE === 'ESLINT'){
        config.module.rules.push({
          test: /.(js|jsx)$/,
          enforce: 'pre',
          exclude: ['/node_modules/', '/build/'], // /\/node_modules\//,
          include: [
            path.resolve('src'),
            path.resolve('public'),
            path.resolve('node_server')
          ],
          options: {
            formatter: require('eslint-friendly-formatter'),
            emitError: true
            // configFile: path.resolve('.eslintrc'),
            // eslint: {
            //   configFile: path.resolve(__dirname, '.eslintrc')
            // }
          },
          loader: "eslint-loader"
        })
      }

      config.plugins.push(
        ...[
          new DefinePlugin({
            'process.env': {
              BASE_URL: JSON.stringify('http://localhost:3681')
            }
          })
        ]
      )

      config.devtool = 'cheap-module-eval-source-map'
    }

    if (isServer) {
      console.log("isServer:", isServer)
      const antStyles = /antd\/.*?\/style.*?/
      const origExternals = [...config.externals]
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback()
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback)
          } else {
            callback()
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals),
      ]

      config.module.rules.unshift({
        test: antStyles,
        use: 'null-loader',
      })
    }

    return commonsChunkConfig(config, /\.(less|sass|scss|css)$/)
  },
  // webpackDevMiddleware: config => {
  //   // Perform customizations to webpack dev middleware config
  //   console.log('DevMiddleware-config:', config)
  //   return config;
  // },
  /* 暴露配置到服务端 */
  serverRuntimeConfig: {
    // Will only be available on the server side
    rootDir: path.join(__dirname, './'),
    PORT: isDev ? 3601 : (process.env.PORT || 3601)
  },
  /* 暴露配置到客户端 */
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: '/static',
    isDev, // Pass through env variables
  },
};

module.exports = withCss(
  withSass(
    withLess(
      withSourceMaps(
        withBundleAnalyzer(nextConfig)
      )
    )
  )
)
