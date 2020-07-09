import Axios from 'axios';
import _ from 'lodash'
import { message } from 'antd';
import CookieStorage from '../utils/cookiestorage'

const Instance = Axios.create({
    baseURL: process.env.BASE_URL || 'http://localhost:3681',
    withCredentials: true,
    // timeout: 1000
});

export default function Fetch(options) {
    if (options.useToken) {
      options.headers = {
        Authorization: 'Bearer ' + CookieStorage.getSession('acess_token'),
      };
    }
  
    return Instance(options)
      .then(response => {
        const { status, data, error } = response;
        const success = status === 200 ? true : false;
        if (!success && typeof window !== 'undefined') {
          message.error(error +', 请求失败！');
        }
        if (status === 401) { 
            CookieStorage.delSession('acess_token');
            CookieStorage.delSession('username');
            message.error('用户没有权限，请先登录！', 3);
            if (data.loginurl) {
                window.location.href = `${data.loginurl}`
            }
        }

        return Promise.resolve({
          ...data,
        });
      })
      .catch(error => {
        if (typeof window !== 'undefined') {
          message.info(error || 'Network Error');
        }
        return Promise.reject();
      });
  }