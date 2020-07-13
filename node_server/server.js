// "use strict";

const Koa = require('koa')
const next = require('next')
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')
// import multer from 'koa-multer';

const nextConf = require('../next.config')
const authVerify = require('./controlrouters/authverify')
const CookieStorage = require('./utils/cookiestorage')

const port = parseInt(process.env.PORT, 10) || 3601
const dev = process.env.NODE_ENV !== 'production' // 判断是否处于开发者状态
// 初始化 nextjs，判断它是否处于 dev：开发者状态，还是production: 正式服务状态
const appNext = next({ 
  dev,          //-是否在开发模式下启动Next.js。默认为false
  nextConf,     //-与next.config.js中使用的对象相同。默认为{}
  // dir: './'  // -Next.js项目的位置。默认为'.'
  // quiet: Boolean-隐藏包含服务器信息的错误消息。默认为false
})
const handle = appNext.getRequestHandler() // 拿到 http 请求的响应

// appNext.prepare：编译 pages 文件夹下面的页面文件，then 是保证 pages 下页面全部编译完了之后，我们才能真正的启动服务来响应请求。
// 如果这些内容我们没有编译完成，那么启动服务响应请求的时候可能会报错。
appNext.prepare().then(() => {
  const server = new Koa()
  const router = new Router()
  /* 代理配置 */
  const proxy = require('koa2-proxy-middleware')
  
  const proxyOptions = {
    targets: {
    //   '/auth': {
    //    // this is option of http-proxy-middleware
    //    target: 'http://localhost:3681/auth', // target host
    //    changeOrigin: true, // needed for virtual hosted sites
    //  },
     // (.*) means anything  /(.*)
     '/api': {
      target: 'http://localhost:3681',
      pathRewrite: { '^/api': '/api' },
      changeOrigin: true,
     },
   }
  }
  // Set up the proxy
  server.use(proxy(proxyOptions));

  /* middleware的顺序很重要，koa-bodyparser必须在router之前被注册到app对象上 */ 
  // server.use(bodyParser({
  //   enableTypes:['json', 'form', 'text']
  // }));
  server.use(bodyParser());

  /** 这是 Koa 的核心用法：中间件。通常给 use 里面写一个函数，这个函数就是中间件。
   * params:
   *  ctx: Koa Context 将 node 的 request 和 response 对象封装到单个对象中，为请求上下文对象
   *  next: 调用后将执行流程转入下一个中间件，如果当前中间件中没有调用 next，整个中间件的执行流程则会在这里终止，后续中间件不会得到执行
   */
  server.use(async (ctx, next) => {

    try {
      ctx.res.statusCode = 200
      console.log('server-ctx:', ctx)
      await next();
    } catch (err) {
      // console.error('server-error0:', err)
      // ctx.redirect('/login');
      ctx.status = err.statusCode || err.status || 500;
      ctx.body = {
        message: err.message
      };
    }
  });

  // server.on('error', (err, ctx) => {
  //   console.error('server-error:', err, ctx)

  //   const status = err.statusCode || err.status || 500;
  //   ctx.status = status;

  //   // if (ctx.headers['x-requested-with'] !== 'XMLHttpRequest') {
  //     if (status === 401) {
  //       // you need to return here or next if statement will be in codepath
  //       ctx.redirect('/login');
  //     } else {
  //       ctx.throw(status, 'error', {
  //         status: status,
  //         error: err
  //       });
  //     }
  //   // }
    
  //   // if (ctx.status === 404) {
  //   //   await ctx.throw(status, 'error', {
  //   //     status: status,
  //   //     error: err
  //   //   });
  //   // }
  // })
  
  router.post('/auth/login', async (ctx, next) => {
    const {username, password} = ctx.request.body;
    console.log("login request body:", username, password);
    // let username = ctx.request.body.username || ''
    // let password = ctx.request.body.password || ''

    console.log(`signin with name: ${username}, password: ${password}`);
  
    let status = 200
    if (authVerify.isAuthorized({username, password}) === false) {
      const message = 'Incorrect username or password'
      status = 401
      ctx.response.body = {
        status,
        message
      }
      return
    }

    const access_token = authVerify.createToken({username, password})
    console.log("Access Token:" + access_token);
    ctx.response.body = {
      status,
      data: { access_token },
      message: "登录成功！"
    }

  })

  // router.post('/upload', uploadMulter.array('files'), async (ctx, next) => {
  //   ctx.status = 200;
  //   ctx.body = { answer: 'ok' };
  //   return next();
  // });

  router.get('/login', async (ctx, next) => {
    await appNext.render(ctx.req, ctx.res, '/login', ctx.query)
    ctx.respond = false
  })

  router.get('/', async (ctx, next) => {
    verifyAuthToken(ctx, next)
    ctx.redirect('/home')
  })

  router.get('/home', async (ctx, next) => {
    console.log('home-get:', ctx, next);
    verifyAuthToken(ctx, next)
    await appNext.render(ctx.req, ctx.res, '/home', ctx.query)
    ctx.respond = false
  })

  // router.get('/test', async (ctx) => {
  //   await appNext.render(ctx.req, ctx.res, '/test', ctx.query)
  //   ctx.respond = false
  // })

  router.all('*', async (ctx, next) => {  // /^(?!\/auth|!\/home).*$/
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })
    
  server.use(router.routes()).use(router.allowedMethods());
//   server.use(koaConnect(compression()))
  
  server.listen(port, () => {
    console.log(`> Server is running at http://localhost:${port}`)
  })
})

function verifyAuthToken(ctx, next) {
  const status = 401
  const loginurl = '/login'
  const reqauth = CookieStorage.getTokenCookie('user_token', ctx.request.header)

  console.log("verify:", reqauth);

  if (reqauth === undefined || reqauth === null) {
      const message = 'Access token not provided'
      // res.status(status).json({status, loginurl, message})
      ctx.response.body = {
        status,
        data: {loginurl}, 
        message
      }
      ctx.redirect(loginurl);
      return
      // next()
  }

  let verifyTokenResult;
    verifyTokenResult = authVerify.verifyToken(reqauth);
    console.log("verify-Token:", verifyTokenResult);

  if (verifyTokenResult instanceof Error) {
    const message = 'Error in authorization format'
    ctx.response.body = {
      status,
      data: {loginurl}, 
      message
    }
    console.log("ver-token-res:", ctx.response.body);
    ctx.redirect(loginurl);
    return
    // next()
  }
}