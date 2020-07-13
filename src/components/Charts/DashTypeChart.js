import React, { Component } from "react";
import produce from "immer";
import PropTypes from 'prop-types';
import { message } from 'antd';
// import { $ApiChart, $Moment } from '../../api';
import _ from 'lodash';
import getLineChartOptions from './chart.option.line';
import getRingChartOptions from './chart.option.semiringratio';

class DashTypeChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: {
                ...this.props.propData,
            },
            otherOption: this.props.exOption.otherChartOpts,
            chartOption: null,
            toggleloading: false,
        };
    }
    // const clusterRef = useRef();
    static getDerivedStateFromProps(props, state) {
        if (!_.isEqual(props.propData, state.chartData)) {
            return {
                chartData: {
                    ...state.chartData,
                    ...props.propData
                }
            };
        }
        return null;
    }

    componentDidMount() {
        // console.log("chartReq:", this.state.chartData)
        if(!_.isEmpty(this.state.chartData))  this.doneSelOptions(this.state.chartData)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!_.isEqual(this.props.propData, nextProps.propData) || 
            !_.isEqual(this.props.exOption, nextProps.exOption) ||
            !_.isEqual(this.state, nextState)) {
            return true;
        }
        return false;
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log("propsTate:", this.props, prevState, this.state);
        if (!_.isEqual(prevState.chartData, this.state.chartData)) {

            this.doneSelOptions(this.state.chartData)

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

    doneSelOptions(chartData) { 
        // newParamsData.propFormatter = this.props.exOption.dateFormatter
        this.setState(
            produce(draft => {
                // console.log("chart-draft:", chartData, this.props.exOption.type)
                if(this.props.exOption.type === "line") {
                    draft.chartOption = getLineChartOptions(chartData)
                } else if(this.props.exOption.type === "semiring") {
                    draft.chartOption = getRingChartOptions(chartData)
                }
            })
        )
    }

    render() {
        return (
            <dl className="cdl-box">
                <dt className="mar-b10">
                    <h3>{this.props.propData.title}</h3>
                </dt>
                <dd>
                    {this.props.render(this.state)}
                </dd>
            </dl>
        )
    }
}
    
export default DashTypeChart;