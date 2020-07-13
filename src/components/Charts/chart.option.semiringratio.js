import _ from 'lodash'

export default function getChartOptions(req, customConfig) {
    let defaultOption = {
        title: {
            show: false,
            text: '占比环形图',
            x: "center",
            y: "center",
            textStyle: {
                fontFamily: 'normal',
                fontSize: 16
            },
            left: 'center',
            top: 0,
            padding: 1,
            itemGap: 2
        },
        tooltip : {
            trigger: 'item',
//            formatter: "{a} <br/>{b} : {c} ({d}%)",
            formatter: function (params, ticket, callback) {
                return "<strong>"+params.marker + params.seriesName +"：</strong><br/>"+ params.value + "%";
            },
            position: function (pos, params, el, elRect, size) {
                var obj = {top: '15%'};
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                return obj;
            },
        },
        backgroundColor: '',
        color: ['#2181ec','#ccc'],
        legend: {
            show: true,
            icon: 'circle',
            // itemWidth: 20,
            // itemHeight: 20,
            textStyle: {
                fontSize: 12,
                color:'#666'
            },
            // top: '35%',
            bottom: 20,
            left: 'center',
            // orient: 'vertical',
            data: [],
        },
        grid: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
//            height: '60%',
        },
        angleAxis: {
            show: false,
            min: 0,
            max: 130,
            boundaryGap: ['0', '100'],
            startAngle: 226.8
        },
        radiusAxis: {
            type: 'category',
            show: true,
            axisLabel: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false
            },
            // data: ['a', 'b', 'c'],
            z: 10
        },
        polar: {
            radius: '150%',
            center: ['50%', '43%'],
        },
        graphic: [{
            type: 'group',
            top: '30%',
            left: 'center',
            id: 'data',
            children: [{
                    type: 'text',
                    id: 'current',
                    top: 20,
                    // origin: ['50%', '50%'] ,
                    scale: [1, 1],
                    style: {
                        text: req.series[0].value,
                        font: 'normal 2.3em "Microsoft YaHei", sans-serif',
                        fill: '#333',
                        textAlign: 'center'
                    }
                },
                {
                    type: 'text',
                    id: 'all',
                    top: 68,
                    scale: [1, 1],
                    style: {
                        text: 'of '+ req.series[1].value,
                        font: 'normal 1.5em "Microsoft YaHei", sans-serif',
                        fill: '#999',
                        textAlign: 'center'
                    }
                }
            ]
        },
        // {
        //     type: 'text',
        //     bottom: 50,
        //     left: '20%',
        //     style: {
        //         text: '0%',
        //         font: 'bolder 1em "Microsoft YaHei", sans-serif',
        //         fill: '#999',
        //     }
        // },
        // {
        //     type: 'text',
        //     bottom: 50,
        //     right: '20%',
        //     style: {
        //         text: '100%',
        //         font: 'bolder 1em "Microsoft YaHei", sans-serif',
        //         fill: '#999',
        //     }
        // }
        ],
        series: []
    }

    let ringItem = {
        type: 'bar',
        coordinateSystem: 'polar',
        barMaxWidth: '12%',
        // barWidth: 30,
        // z: 1,
        // name: '已用',
        roundCap: true,
        // color: '#2181ec',
        barGap: '-100%',
        label: {
            show: true,
        },
        cursor: 'pointer',
        
        // showBackground: true,
        // backgroundStyle: {
        //     color: 'rgba(180, 180, 180, 0.85)',
        //     // opacity: 1
        // },
        // itemStyle: {
        //     normal: {
        //         opacity: 1,
        //         color: '#2181ec',
        //     }
        // },
         
        // data: [, , 50],     
    }
    
    const getSeriesFn = (reqp, mark) => {
        // newChartSeries[0].name = reqp.title;
        return [...reqp.series].map((el, i) => {
            let obj = _.cloneDeep(el)
            Reflect.deleteProperty(obj, 'value');
            return {
                ...obj,
                ...ringItem,
                // color: corArrs[i],
            }
        })
    }

    if (req.title !== undefined && req.title !== '') {
        if (customConfig) {
            defaultOption = _.merge(defaultOption, customConfig)
        }
        defaultOption.legend.data = [];
        defaultOption.series = [];

        try {
            const newSeries = getSeriesFn(req);
            defaultOption.series = newSeries;  // newSeries[0].data.concat(response.data);
            defaultOption.legend.data = [...defaultOption.series.map(item => item.name)]; //[...defaultOption.series[0].name];
        } catch (e) {
            console.log("pie-error:", e)
        }
       
    } else {
        defaultOption.series = [];
        defaultOption.legend.data = [];
    }   
    
    return defaultOption;
}
