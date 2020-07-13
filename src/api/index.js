import {ApiAuth, Api, ApiChart} from './api';
import BaseURl from './ipconfig';
import moment from 'moment';

// 全局的api
const $ApiAuth = new ApiAuth(BaseURl.ipAuth)
const $Api = new Api(BaseURl.ipCommon)
const $ApiChart = new ApiChart(BaseURl.ipCommon)
const $Moment = moment

export { $ApiAuth, $Api, $ApiChart, $Moment }
