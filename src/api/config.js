// import React from 'react';
import Axios from 'axios';
import _ from 'lodash'
import { message } from 'antd';
  
// React.$http = Axios;
// Object.defineProperty(React.prototype, '$http', {
//     get() {
//         return Axios;
//     }
// });
message.config({
    top: 66,
    maxCount: 1,
})

// Add a request interceptor  请求拦截
Axios.interceptors.request.use(config => {
    message.loading('加载中', 3)              // loading组件，显示文字加载中，自动关闭延时3s

    // 判断是否存在token，如果存在的话，则每个http header都加上token
    // if (store.state.token) {
    //     config.headers.Authorization = `Bearer ${store.state.token}`;
    //     config.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('acess_token')}`;
    // }
    // console.log('config:', config)
    // Do something before request is sent 处理请求之前的配置
    return config;
}, err => {
    // Do something with request error 请求失败的处理
    return Promise.reject(err)
})

const downloadPost = (config) => {
    const url = config.url
    const data = JSON.parse(config.data)
    const form = document.createElement('form')
    form.action = url
    form.method = 'post'
    form.style.display = 'none'
    Object.keys(data).forEach(key => {
        const input = document.createElement('input')
        input.name = key
        input.value = data[key]
        form.appendChild(input)
    })
    const button = document.createElement('input')
    button.type = 'submit'
    form.appendChild(button)
    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
}

const downloadGet = (config) => {
    const params = []
    for (const item in config.params) {
        params.push(`${item}=${config.params[item]}`)
    }
    const url = params.length ? `${config.url}?${params.join('&')}` : `${config.url}`
    let iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = url
    iframe.onload = function () {
        document.body.removeChild(iframe)
    }
    document.body.appendChild(iframe)
}

// Add a response interceptor 响应拦截
Axios.interceptors.response.use(response => {
    // 处理流
    if (response.headers && response.headers['content-type'] === 'application/octet-stream') {
        const config = response.config
        if (config.method === 'post') {
            downloadPost(config)
        } else if (config.method === 'get') {
            downloadGet(config)
        }
        return
    } else {
        message.destroy()                             // 销毁message组件
        console.log('response get:', response)
        // Do something with response data 处理响应数据
        return response;
    }
}, error => {
    if (error.response) {
        console.log("err-res-status:", error.response.status)
        switch (error.response.status) {
            case 401:
                // 返回 401 清除token信息并跳转到登录页面
                // store.commit(types.LOGOUT);
                message.error('用户没有登录，请先登录！', 3);
                let loginUrl = _.get(error.response, 'data.loginurl')
                if (loginUrl) {
                    window.location.href = `${login_url}`
                }
                break;
            case 403:
                // cookies.delCookie('login_token')
                message.error(error + ', 系统已锁定或无权限，请联系管理员！', 5);
                break;
            default:
                break;
        }
    }
    // Do something with response error 处理响应失败
    return Promise.reject(error.response || error.message) // 返回接口返回的错误信息
});