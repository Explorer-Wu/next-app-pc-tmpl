import React, { useState, useEffect, useRef } from "react";
import { useImmer } from "use-immer";
import { message } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { $ApiChart } from '../../api';

function FetchVisitsRule(chartParams) {
    const [visitsData, setVisitsData] = useImmer({})

     useEffect(() => {
        getDataFn(chartParams);
    }, [])

    const getDataFn = async (chartreq) => {
        try {
            // console.log("getVisitsRes1:", chartreq)
            const resData = await $ApiChart.getVisitsData() //(req.period, req.start, req.end)
            
            const dealRes = splicingData(resData.data.data)
            // console.log("getVisitsRes2:", dealRes)
            setVisitsData(draft => {
                draft.title = chartreq.title
                draft.series = dealRes
            })
            
        } catch (error) {
            message.error(error.message + ', 获取趋势相关数据请求失败！', 6);
        }
    }

    function splicingData(resObjs) {
        // const sortedObjs = _.sortBy(resObjs, ['weeks'])
        let GroupsMap = resObjs[0].visits.map(el=> {
            let obj = {}
            Reflect.set(obj, 'name', el.name)
            // Reflect.deleteProperty(obj, 'value');
            // console.log("GroupsMap:", obj)
            return obj;
        })
    
        GroupsMap.forEach(gitem => {
            let groupObj = convertData(resObjs, gitem.name)
            Reflect.set(gitem, 'data', groupObj)
        })
    
        // console.log("splicingData2:", GroupsMap)
        return GroupsMap
    }

    function convertData(sortObjs, selName) {
        let nameArr = []
        if (!sortObjs) {
          return
        }
        // console.log("convertData1:", sortObjs, selName)
        // sortObjs.map(el => el.visits).filter(item => item.name !== selName).map(obj => obj.value)
        sortObjs.forEach(item => {
            let arr = [] 
            arr[0] = item.weeks
            arr[1] = item.visits.filter(el => el.name === selName)[0].value
            nameArr.push(arr)
        })
    
        // console.log("convertData2:", nameArr)
    
        return nameArr
    }
  
    return { visitsData, setVisitsData };
}

function FetchCapacityRule(chartParams) {
    const [capacityData, setCapacityData] = useImmer({})

     useEffect(() => {
        getDataFn(chartParams);
    }, [])

    const getDataFn = async (chartreq) => {
        try {
            // console.log("getCapacityRes1:", chartreq)
            const resData = await $ApiChart.getCapacityData()

            const dealRes = splicingData(resData.data) 
            // console.log("getCapacityRes2:", dealRes)
    
            setCapacityData(draft => {
                draft.title = chartreq.title
                draft.series = dealRes
            })
        } catch (error) {
            message.error(error.message + ', 获取容量占比相关数据失败！', 6);
        }
    }

    function splicingData(resObjs) {
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

        // console.log("splicingRatio:", resSum, GroupsMap)
        return GroupsMap
    }
  
    return { capacityData, setCapacityData };
}

export { FetchVisitsRule, FetchCapacityRule }