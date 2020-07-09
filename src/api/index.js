import {Api, ApiChart} from './api'
import moment from 'moment';

// 全局的api
const $Api = new Api()
const $ApiChart = new ApiChart()
// const $ApiChart = () => new ApiChart()
const $Moment = moment

export { $Api, $ApiChart, $Moment }
