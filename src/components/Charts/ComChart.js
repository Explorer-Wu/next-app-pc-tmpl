import React, { useState, useEffect, useRef, useCallback, useMemo, forwardRef } from "react";
import Router from 'next/router';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';

function ComChart(props) {
    const { propChartOpt } = props;
    const [loading, setLoading] = useState(false);
    const [legendsel, setLegendsel] = useState(null);
    const [chartOptionNew, setChartOptionNew] = useState({});
    const onChartLegendselected = {
        'legendselectchanged': (param) => {
            // console.log("legendsel:", param.selected)
            setLegendsel(param.selected);
        }
    }
    let onChartLoading = null;
    let chartRef = useRef();

    useEffect(() => {
        // debugger
        setLoading(true); 
    }, [propChartOpt.toggleloading])

    useEffect(() => {
        if (!_.isEmpty(propChartOpt.chartOption) && !_.isEmpty(propChartOpt.chartOption.series)) {
            let newChartOption = _.cloneDeep(propChartOpt.chartOption)
            if (legendsel!==null) {
                newChartOption = {
                    ...newChartOption, 
                    legend: {
                        selected: legendsel
                    }
                }
            }
            setChartOptionNew(newChartOption);
            setLoading(false);
        }
   
        return () => {
            clearTimeout(onChartLoading)
        }
    }, [propChartOpt, legendsel, onChartLoading])

    const onChartReadyCallback = (chart) => {
        const nchart = chart
        onChartLoading = setTimeout(() => {
            // setLoading(false);
            nchart.hideLoading();
        },3000);
        // chart.hideLoading();
        // return onChartLoading
    }
    
    const getLoadingOption = () => {
        return {
        //   text: '加载中...',
        //   color: '#4413c2',
        //   textColor: '#4413c2',
        //   maskColor: 'rgba(194, 88, 86, 0.3)',
          zlevel: 0
        };
    };

    // function clearLoadTimeout() {
    //     try {
    //         clearTimeout(onChartLoading)
    //     } catch (err) { }

    return <ReactEcharts 
        ref={(e) => { chartRef = e }} 
        option={chartOptionNew} 
        lazyUpdate={propChartOpt.otherOption.isUpdate} 
        notMerge={propChartOpt.otherOption.isMerge} 
        onEvents={propChartOpt.otherOption.legendEvent ? onChartLegendselected : null} 
        showLoading={loading} 
        className={!propChartOpt.otherOption.isFullScr? "react_for_echarts chart-box" : "react_for_echarts"} 
        style={{height: 'calc(80vh - 170px)'}}/>
}

export default ComChart;