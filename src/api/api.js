// import Axios from 'axios'
// import './config'
import Fetch from './fetch';

class Api {
  constructor () {
    this.defaultConfig = {
      baseURL: '',
    }
  }

  login(username, password) {
    // Axios.post('/auth/login', this.defaultConfig)
    return Fetch({
        method: 'post',
        url: '/auth/login',
        data: {
          username: username,
          password: password,
        },
        // ...this.defaultConfig
    })
  }
  // 登出
  logout () {
    return Fetch({
      method: 'post',
      url: '/auth/logout',
      useToken: true,
      // `headers` 是即将被发送的自定义请求头
      // headers: {'X-Requested-With': 'XMLHttpRequest'},
      // `auth` 表示应该使用 HTTP 基础验证，并提供凭据
      // 这将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization`头
      // auth: {
      //     username: user,
      //     password: password,
      // },
      // xsrfHeaderName: 'X-XSRF-TOKEN', // 默认的
      // ...this.defaultConfig
    })
  }

  getGlobals() {
    // return Fetch.get(`/api/global`, this.defaultConfig)
    return Fetch({
      method: 'get',
      url: '/api/global',
    })
  }
  getWeathers() {
    return Fetch({
      method: 'get',
      url: '/api/weathers',
    })
  }
  getTeamsMsg() {
    return Fetch({
      method: 'get',
      url: '/api/teams',
    })
  }
  getActivities() {
    return Fetch({
      method: 'get',
      url: '/api/activities',
    })
  }
  
  
  addAlarmRec(reqData) {
    return Fetch.post(`/api/controller/alarm/`, {...reqData}, this.defaultConfig)
  }
  editAlarmRec(id, reqData) {
    return Fetch.put(`/api/controller/alarm/${id}`, {...reqData}, this.defaultConfig)
  }
  delAlarmRec(id) {
    return Fetch.delete(`/api/controller/alarm/${id}`, this.defaultConfig)
  }
  getAlarmFieldList(page, limit) {
    return Fetch.get(`/api/controller/field`, {
      ...this.defaultConfig,
      params: {
        page: page,
        limit: limit
      }
    })
  }
  
}

class ApiChart {
  constructor() {
    // this.user = user
    this.baseUrl = ''  // `/proxy/test-${user}`
    this.defaultConfig = {
      baseURL: this.baseUrl
    }
  }

  getCapacityData(period, start, end) {
    if ((start === null && end === null) || (start === undefined && end === undefined)) {
      return Fetch({
        method: 'get',
        url: '/api/charts/capacity',
        // params: {
        //   period: period
        // }
      })
    }

    return Fetch({
      method: 'get',
      url: '/api/charts/capacity',
      params: {
        period: period,
        start: start,
        end: end
      }
    })
  }

  getVisitsData(period, start, end) {
    if ((start === null && end === null) || (start === undefined && end === undefined)) {
      return Fetch({
        method: 'get',
        url: '/api/charts/visits',
        // params: {
        //   period: period
        // }
      })
    }

    return Fetch({
      method: 'get',
      url: '/api/charts/visits',
      params: {
        period: period,
        start: start,
        end: end
      }
    })
  }
}

export {Api, ApiChart};
