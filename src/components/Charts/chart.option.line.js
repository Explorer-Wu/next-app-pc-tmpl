import _ from 'lodash'
import echarts from 'echarts';

export default function getChartOptions(req, customConfig) {
    let colorArr = ['#0a8099','#0050b4', '#2d880c', '#420075', '#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
    let defaultOption = {
        title: {
            show: false,
            text: '曲线图表'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                // label: {
                //     backgroundColor: '#6a6986'
                // }
            },
            
            formatter: function (params, ticket, callback) {
                // _.sortBy(params, function(o) { return o.data[1]; })
                const content = _.orderBy(params, o => o.value[1], ['desc']);
                // console.log("tooltip-params", params, content)
                return content[0].axisValueLabel +'<br> '+ content.map(item => {
                    return item.marker + item.seriesName + ': ' + item.value[1]
                }).join("<br/>")
            }
        },
        backgroundColor: '',
        color: colorArr,
        // function (params) {
        //     var colorarrays = [ "#2F9323", "#D9B63A", "#2E2AA4", "#9F2E61", "#4D670C", "#BF675F", "#1F814A", "#357F88", "#673509", "#310937", "#1B9637", "#F7393C"];
        //     return colorarrays[params.dataIndex];
        // },
        legend: {
            icon: "circle", 
            // type: 'scroll',
            // pageIconColor: '#0085ff',
            // pageIconInactiveColor: '#2f3553', //翻页按钮不激活时
            // pageTextStyle: {
            //     color: '#c9c9c9',
            // },
            data: [],
            left: 'center',
            top: 0,
            bottom: 10
        },
        // dataZoom: [{
        //     show: false,
        //     realtime: true,
        //     start: 0,
        //     end: 100,
        //     height: 20,
        //     bottom: 6,
        //     handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        //     handleSize: '110%',
        //     textStyle: {
        //         color: '#368'
        //     },
        // }],
        axisPointer: {
            link: {xAxisIndex: 'all'}
        },
        grid: {
            left: 50,
            right: 30,
            top: 68,
            bottom: 50,
        },
        xAxis: {
            // type: 'time',
            type: 'category',
            boundaryGap: false,
            axisLine: {onZero: true},
            splitLine: {show: false},
            // axisLabel: {
            // 使用函数模板，函数参数分别为刻度数值（类目），刻度的索引
            //   formatter: function (value, idx) {
            //     if (idx === 0) {
            //       return moment(value).format('YYYY-MM-DD')
            //     }
            //     return moment(value).format('HH:mm')
            //   }
            // }
        },
        yAxis: {
            name: '访问量',
            type: 'value',
            splitLine: {
                // show: false,
                lineStyle: {
                    // 使用深浅的间隔色
                    color: ['#ccc', '#ddd'],
                    type: 'dotted'
                }
            },
            axisLabel: {
                formatter: function (val) {
                    const Aval = Math.abs(val)
                    // if (Aval >= 1000000000) {
                    //     return val / 1000000000 + 'G';
                    // } else if (Aval >= 1000000 && Aval < 1000000000) {
                    if (Aval >= 1000000) {
                        return val / 1000000 + 'M';
                    } else if (Aval >= 1000 && Aval < 1000000) {
                        return val / 1000 + 'K';
                    } else {
                        return val
                    }
                }
            }
        },
        series: []
    }
    
    let markData = {
        // symbol: 'triangle', //标记的图形
        symbol: 'path://M2,0 L38,0 C39.1045695,-2.02906125e-16 40,0.8954305 40,2 L40,9 C40,10.1045695 39.1045695,11 38,11 L22.5,11 L22.5,11 L20,15 L17.5,11 L2,11 C0.8954305,11 1.3527075e-16,10.1045695 0,9 L0,2 C-1.3527075e-16,0.8954305 0.8954305,2.02906125e-16 2,0 Z',
        // symbolRotate: '180', //标记的旋转角度
        symbolSize:[64, 22],// 容器大小
        symbolOffset:[0, -12],//位置偏移
        label: {
            formatter: params => {
                // console.log("label-params", params)
                const Pval = Math.abs(params.value)
                if ( Pval >= 1000000) {
                    return _.round(params.value / 1000000, 2) + 'M';
                } else if (Pval >= 1000 && Pval < 1000000) {
                    return _.round(params.value / 1000, 2) + 'K';
                } else {
                    return _.round(params.value, 2);
                }
            },
            // rich: {
            //     value: {
            //         // fontFamily: 'PingFang SC Regular',
            //         // fontSize: 30,
            //         padding: [3, 4],
            //         borderWidth: 10,
            //         // distance: 20,
            //         // align: 'center',
            //         borderRadius: 1,
            //         borderColor: '#0CD8A7',
            //         backgroundColor: '#0CD8A7',
            //         verticalAlign: 'middle',
            //     // lineHeight: 36
            //     }
            // },
            // normal: {
            //     show: false, 
            // },
            offset: [0, -3],
        },
        // itemStyle: {
        //     color: '#000f84',
        //     borderWidth: 6,
        //     // color: {
        //     //     type: 'linear',
        //     //     x: 0,
        //     //     y: 0,
        //     //     x2: 1,
        //     //     y2: 0,
        //     //     colorStops: [{
        //     //         offset: 0, color: '#E67C26' // 0% 处的颜色
        //     //     }, {
        //     //         offset: 1, color: '#E67C26' // 100% 处的颜色
        //     //     }],
        //     //     globalCoord: false // 缺省为 false
        //     // }  
        // },
        data: [
            {type: 'max', name: '最大值'},
            { type: 'min', name: '最小值' },
            // {oord: [53.11 + 23/2]}
        ]
    };

    const getSeriesFn = (reqp, mark) => {
        console.log('getParams:', reqp, mark); 
        let newChartitem = {
            type: 'line',
            smooth: true,
            showSymbol: false,
            markPoint: mark,
        }
        // newChartSeries[0].name = reqp.title;
        // newChartSeries[0].data = reqp.series;
        
        return [...reqp.series].map((el, i) => {
            let areaItem = {
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: colorArr[i] //'#d68262'
                    }, {
                        offset: 1,
                        color: '#fff'
                    }])
                }
            }
            return {
                ...el,
                ...newChartitem,
                // ...areaItem
            }
        })
    }

    console.log('this.chart-props-bps:', req, customConfig);

    if (req.title !== undefined && req.title !== '') {
        // let sLen = _.get(req, 'propName.length', 0);
        if (customConfig) {
            defaultOption = _.merge(defaultOption, customConfig)
        }

        // defaultOption.xAxis.axisLabel.formatter = req.propFormatter;
        defaultOption.series = [];
        defaultOption.legend.data = [];
        console.log('chart-line:', req);

        try {
            const newSeries = getSeriesFn(req, markData);
            defaultOption.series = newSeries;   //_.concat(defaultOption.series, newSeries);
            defaultOption.legend.data = [...defaultOption.series.map(item => item.name)];
            console.log('SeriesData:', defaultOption.series, defaultOption.legend.data);
            // if(customConfig.legendsel) {
            //     defaultOption.legend.selected = customConfig.legendsel
            // }
        } catch (e) {
            console.log("trend-error:", e)
        }
       
    } else {
        // defaultOption.xAxis.axisLabel.formatter = req.propFormatter;
        defaultOption.series = [];
        defaultOption.legend.data = [];
    }   
    
    return defaultOption;
    
}
