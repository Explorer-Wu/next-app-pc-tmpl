import React, { Component } from "react";
import produce from "immer";
import PropTypes from 'prop-types';
import {  message } from 'antd';
import { $ApiChart, $Moment } from '../../api';
import _ from 'lodash';
import getLineChartOptions from './chart.option.line';

class ComChartLine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartParams: {
                ...this.props.curOption,
            },
            otherOption: this.props.exOption.otherChartOpts,
            chartOption: null,
            toggleloading: false,
        };
    }
    // const clusterRef = useRef();
    static getDerivedStateFromProps(props, state) {
        if (props.curOption.title !== state.chartParams.title && props.curOption.field !== state.chartParams.field) {
            return {
                chartParams: {
                    ...state.chartParams,
                    ...props.curOption
                }
            };
        }
        return null;
    }

    componentDidMount() {
        this.getDataFn(this.state.chartParams)
    }

    shouldComponentUpdate(nextProps, nextState) {

        if (!_.isEqual(this.props.curOption, nextProps.curOption) || !_.isEqual(this.state, nextState)) {
            return true;
        }
        return false;
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("propsTate:", this.props, prevState, this.state);
        if (!_.isEqual(prevState.chartParams, this.state.chartParams)) {
            this.getDataFn(this.state.chartParams)

            this.setState(
                produce(draft => {
                    draft.toggleloading = !draft.toggleloading
                })
            )
        }
    }

    componentWillUnmount() {
        // clearTimeout(this.timeOut);
        // 卸载异步操作设置状态
        this.setState = (state, callback) => {
            return;
        };
    }

    getDataFn = async (req) => {
        try {
            const resData = await this.state.chartParams.fetchDataFn() //(req.period, req.start, req.end)
            console.log("getVisitsRes1:", resData)
            const dealRes = this.splicingData(resData.data.data) 
            console.log("getVisitsRes2:", dealRes)

            this.doneSelOptions(dealRes)
        } catch (error) {
            message.error(error.message + ', 获取趋势相关数据请求失败！', 6);
        }
    }

    splicingData(resObjs) {
        // const sortedObjs = _.sortBy(resObjs, ['weeks'])
        let GroupsMap = resObjs[0].visits.map(el=> {
            let obj = {}
            Reflect.set(obj, 'name', el.name)
            // Reflect.deleteProperty(obj, 'value');
            console.log("GroupsMap:", obj)
            return obj;
        })

        GroupsMap.forEach(gitem => {
            let groupObj = this.convertData(resObjs, gitem.name)
            Reflect.set(gitem, 'data', groupObj)
        })

        console.log("splicingData2:", GroupsMap)
        return GroupsMap
    }

    convertData(sortObjs, selName) {
        let nameArr = []
        if (!sortObjs) {
          return
        }
        console.log("convertData1:", sortObjs, selName)
        // sortObjs.map(el => el.visits).filter(item => item.name !== selName).map(obj => obj.value)
        sortObjs.forEach(item => {
            let arr = [] 
            arr[0] = item.weeks
            arr[1] = item.visits.filter(el => el.name === selName)[0].value
            nameArr.push(arr)
        })

        console.log("convertData2:", nameArr)

        return nameArr
    }

    doneSelOptions(paramsData) {
        let newParamsData = {
            ...this.props.curOption,
            series: paramsData
        };  
        // newParamsData.propFormatter = this.props.exOption.dateFormatter
        this.setState(
            produce(draft => {
                draft.chartOption = getLineChartOptions(newParamsData)
            })
        )
    }

    render() {
        return (
            <dl className="cdl-box">
                <dt className="mar-b10">
                    <h3>{this.props.curOption.title}</h3>
                </dt>
                <dd>
                    {this.props.render(this.state)}
                </dd>
            </dl>
        )
    }
}
    
export default ComChartLine;