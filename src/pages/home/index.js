import Link from 'next/link'
import React, { useState, useEffect, useRef } from "react"
import HtmlHead from '../../components/HtmlHead'
import {Row, Col, Card, message} from 'antd'
import { RocketOutlined, GroupOutlined, GoldOutlined, TrademarkCircleOutlined, StarOutlined } from '@ant-design/icons'
import { $Api } from '../../api'
import { FetchVisitsRule, FetchCapacityRule } from '../../components/Charts/UseFetchsRule'
import DashTypeChart from '../../components/Charts/DashTypeChart'
import ComChart from '../../components/Charts/ComChart'
import WeatherList from '../../components/OlulLists/WeatherLi'
import TeamsMsgList from '../../components/OlulLists/TeamsMsgs'
import ActiveApps from '../../components/OlulLists/ActiveApps'

export default function Home(props) {
  const IconArr = [ 
  //  <GroupOutlined /> , 
    <RocketOutlined />,
    <GoldOutlined /> , 
    <TrademarkCircleOutlined /> , 
    <StarOutlined />
  ]
  const corArrs = [
    ['bg-blue-light', 'bg-blue-dark'],
    ['bg-purple-light', 'bg-purple-dark'],
    ['bg-cyan-light', 'bg-cyan-dark'],
    ['bg-white', 'bg-green-dark']
  ]

  const VisitorsOptions = {
    title: "访问量统计",
    field: "visitors",
    defaultPeriod: 1*24*60*60
  }

  const CapacityOptions = {
    title: "源码容量占比",
    field: "capacity"
  }

  const { visitsData } = FetchVisitsRule(VisitorsOptions)
  const { capacityData } = FetchCapacityRule(CapacityOptions)

 const exOptsLine = {
   type: 'line',
  // periodOpts: [{name:"1天", value:1*24*60*60}, {name:"7天", value:7*24*60*60}, {name:"30天", value:30*24*60*60}],
  //  dateFormatter: function (value) {
  //    return $Moment(value).format('YYYY/MM/DD')
  //  },
  otherChartOpts: {
    isUpdate: true,
    isMerge: false,
    legendEvent: false
  }
 }

 const exOptsRing = {
   type: 'semiring',
  //  periodOpts: [{
  //    name: "1天",
  //    value: 1 * 24 * 60 * 60
  //  }, {
  //    name: "7天",
  //    value: 7 * 24 * 60 * 60
  //  }, {
  //    name: "30天",
  //    value: 30 * 24 * 60 * 60
  //  }],
   otherChartOpts: {
     isUpdate: true,
     isMerge: false,
     legendEvent: false
   }
 }
//  useEffect(() => {
//    console.log("VisitsData:", visitsData)
//    return () => {
//     //  cleanup
//    }
//  }, [visitsData])

 return (
    <>
      <HtmlHead title="首页"/>
      <Row gutter={16}>
        {props.globalData.map((el, index) => <Col key={index} xs={24} sm={12} md={12} lg={6} xl={6}>
          <div className={`box-top ${corArrs[index][0]}`}>
            <figure className={corArrs[index][1]}>{IconArr[index]}</figure>
            <section>
              <h5>{el.value}{index===0?(<span>个</span>):null}</h5>
              <p>{el.cname}</p>
            </section>
          </div>
        </Col>)}
        {/* {JSON.stringify(props)} */}
      </Row>
      
      <Row gutter={16}>
        <Col xs={24} sm={12} md={14} lg={16} xl={18}>
          <DashTypeChart render={chartOpt => (<ComChart propChartOpt={chartOpt} />)} propData={visitsData} exOption={exOptsLine}/>
        </Col>
        <Col xs={24} sm={12} md={10} lg={8} xl={6}>
          <DashTypeChart render={chartOpt => (<ComChart propChartOpt={chartOpt} />)} propData={capacityData} exOption={exOptsRing}/>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12} md={14} lg={16} xl={18}>
          <WeatherList propWeather={props.weatherData}/>
          <TeamsMsgList propTeams={props.teamsData}/>
        </Col>
        <Col xs={24} sm={12} md={10} lg={8} xl={6}>
          <ActiveApps propActives={props.activitiesData}/>
        </Col>
      </Row>

      <style jsx>{`
      `}</style>
    </>
  )
}

export async function getStaticProps(context) {  //getServerSideProps(context)
  // console.log("context.req:", context.req.headers)
  const globalRes= await $Api.getGlobals() 
  // const errorCode = globalRes.statusCode > 200 ? globalRes.statusCode : false
  const weatherRes = await $Api.getWeathers()
  const teamsRes = await $Api.getTeamsMsg()
  const activitiesRes = await $Api.getActivities()

  // console.log("stars:", globalRes)

  return { 
    props: { 
      globalData: globalRes.data, 
      weatherData: weatherRes.data,
      teamsData: {
        title: "社区评论",
        ...teamsRes
      },
      activitiesData: {
        title: "活跃应用",
        ...activitiesRes
      } 
    } 
  }
}
