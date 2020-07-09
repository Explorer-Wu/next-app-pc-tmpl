import React, { Component } from "react";
import produce from "immer";
import PropTypes from 'prop-types';
import {  message } from 'antd';
import { $ApiChart, $Moment } from '../../api';
import _ from 'lodash';
import getRingChartOptions from './chart.option.ringratio';

class ComChartRing extends Component {
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
            console.log("getCapacityRes1:", resData)
            const dealRes = this.splicingData(resData.data) 
            console.log("getCapacityRes2:", dealRes)

            this.doneSelOptions(dealRes)
        } catch (error) {
            message.error(error.message + ', 获取容量占比相关数据失败！', 6);
        }
    }

    splicingData(resObjs) {
        let resSum = resObjs.reduce(function(prev, cur) {
            return cur.value + prev;
        }, 0);

        let GroupsMap = [{
            name: resObjs[0].name,
            z: 3,
            value: resObjs[0].value,
            data: [Math.round(resObjs[0].value * 10000 / resSum) / 100.00]
        }, {
            name: '总容量',
            z: 0,
            value: resSum,
            // silent: true,
            data: [100]
        }]

        console.log("splicingRatio:", resSum, GroupsMap)
        return GroupsMap
    }

    doneSelOptions(paramsData) {
        let newParamsData = {
            ...this.props.curOption,
            series: paramsData
        };  
        // newParamsData.propFormatter = this.props.exOption.dateFormatter
        this.setState(
            produce(draft => {
                draft.chartOption = getRingChartOptions(newParamsData)
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
    
export default ComChartRing;