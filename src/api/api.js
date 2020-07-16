import Fetch from './fetch';

class ApiAuth {
  constructor (url) {
    this.defaultConfig = {
      baseURL: url,
    }
  }

  login(username, password) {
    // Axios.post('/auth/login', this.defaultConfig)
    return Fetch({
        method: 'post',
        url: '/auth/login',
        // `auth` 表示应该使用 HTTP 基础验证，并提供凭据
        // 这将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization`头
        data: {
          username: username,
          password: password,
        },
        ...this.defaultConfig
    })
  }
  // 登出
  logout () {
    return Fetch({
      method: 'post',
      url: '/auth/logout',
      usetoken: true,
      // `headers` 是即将被发送的自定义请求头
      // headers: {'X-Requested-With': 'XMLHttpRequest'},
      // `auth` 表示应该使用 HTTP 基础验证，并提供凭据
      // 这将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization`头
      // auth: {
      //     username: user,
      //     password: password,
      // },
      // xsrfHeaderName: 'X-XSRF-TOKEN', // 默认的
      ...this.defaultConfig
    })
  }
}

class Api {
  constructor (url) {
    this.defaultConfig = {
      baseURL: url,
    }
  }

  getGlobals() { //ctoken=false
    // return Fetch.get(`/api/global`, this.defaultConfig)
    return Fetch({
      method: 'get',
      url: '/api/global',
      // usetoken: ctoken,
      ...this.defaultConfig
    })
  }
  getWeathers() {
    return Fetch({
      method: 'get',
      url: '/api/weathers',
      // usetoken: ctoken,
      ...this.defaultConfig
    })
  }
  getTeamsMsg() {
    return Fetch({
      method: 'get',
      url: '/api/teams',
      // usetoken: ctoken,
      ...this.defaultConfig
    })
  }
  getActivities() {
    return Fetch({
      method: 'get',
      url: '/api/activities',
      // usetoken: ctoken,
      ...this.defaultConfig
    })
  }

  getArticleList(page, limit) {
    return Fetch({
      method: 'get',
      url: '/api/articles',
      params: {
        page: page,
        limit: limit
      },
      ...this.defaultConfig
    })
  }
  getArticleCon(id) {
    return Fetch({
      method: 'get',
      url: `/api/articles/:${id}`,
      ...this.defaultConfig
    })
  }
  
  addArticle(reqData) {
    return Fetch({
      method: 'post',
      url: '/api/articles',
      data: {...reqData},
      ...this.defaultConfig
    })
  }
  editArticle(id, reqData) {
    return Fetch({
      method: 'put',
      url: `/api/articles/${id}`,
      data: {...reqData},
      ...this.defaultConfig
    })
  }
  delArticle(id) {
    return Fetch({
      method: 'delete',
      url: `/api/articledel/${id}`,
      ...this.defaultConfig
    })
  }
}

class ApiChart {
  constructor(url) {
    // this.baseUrl = ''  // `/proxy/test-${user}`
    this.defaultConfig = {
      baseURL: url,
    }
  }

  getCapacityData(period, start, end) {
    if ((start === null && end === null) || (start === undefined && end === undefined)) {
      return Fetch({
        method: 'get',
        url: '/api/charts/capacity',
        // params: {
        //   period: period
        // },
        ...this.defaultConfig
      })
    }

    return Fetch({
      method: 'get',
      url: '/api/charts/capacity',
      params: {
        period: period,
        start: start,
        end: end
      },
      ...this.defaultConfig
    })
  }

  getVisitsData(period, start, end) {
    if ((start === null && end === null) || (start === undefined && end === undefined)) {
      return Fetch({
        method: 'get',
        url: '/api/charts/visits',
        // params: {
        //   period: period
        // },
        ...this.defaultConfig
      })
    }

    return Fetch({
      method: 'get',
      url: '/api/charts/visits',
      params: {
        period: period,
        start: start,
        end: end
      },
      ...this.defaultConfig
    })
  }
}

export {Api, ApiAuth, ApiChart};
