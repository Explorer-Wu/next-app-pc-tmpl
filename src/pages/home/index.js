import Link from 'next/link'
import React, { useState, useEffect, useRef } from "react"
import HtmlHead from '../../components/HtmlHead'
import {Row, Col, Card, message} from 'antd'
import { RocketOutlined, GroupOutlined, GoldOutlined, TrademarkCircleOutlined, StarOutlined } from '@ant-design/icons'
import { $Api, $ApiChart } from '../../api'
import ComChartLine from '../../components/Charts/ComChartLine'
import ComChartRing from '../../components/Charts/ComChartRing'
import ComChart from '../../components/Charts/ComChart'
import WeatherList from '../../components/OlulLists/WeatherLi'
import TeamsMsgList from '../../components/OlulLists/TeamsMsgs'
import ActiveApps from '../../components/OlulLists/ActiveApps'

// import "antd/dist/antd.css";
// import stylesheet from '../../public/styles/main.less';
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
   fetchDataFn: $ApiChart.getVisitsData
 }

 const CapacityOptions = {
  title: "源码容量占比",
  field: "capacity",
  fetchDataFn: $ApiChart.getCapacityData
}

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

 const exOptsPie = {
   type: 'pie',
   periodOpts: [{
     name: "1天",
     value: 1 * 24 * 60 * 60
   }, {
     name: "7天",
     value: 7 * 24 * 60 * 60
   }, {
     name: "30天",
     value: 30 * 24 * 60 * 60
   }],
   otherChartOpts: {
     isUpdate: true,
     isMerge: false,
     legendEvent: false
   }
 }
//  useEffect(() => {
  
//    return () => {
//     //  cleanup
//    }
//  }, [])

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
          <ComChartLine render={chartOpt => (<ComChart propChartOpt={chartOpt} />)} curOption={VisitorsOptions} exOption={exOptsLine}/>
        </Col>
        <Col xs={24} sm={12} md={10} lg={8} xl={6}>
          <ComChartRing render={chartOpt => (<ComChart propChartOpt={chartOpt} />)} curOption={CapacityOptions} exOption={exOptsPie}/>
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
      
      {/* 
      <dl className="dl-top">
        <dt>
          <figure><Icon type="wechat" /></figure>
        </dt>
        <dd>
          <h5>微信记录</h5>
          <strong>{this.state.infoData.events_num}</strong>
        </dd>
      </dl> */}

      <style jsx>{`
      `}</style>
    </>
  )
}

// Home.getInitialProps = async () => {
//   // if (globalRes.status !== 200) {
//   //   throw new Error(await globalRes.message)
//   // } else {
//   //   console.log("globalRes:", globalRes)
//   //   return { globalData: globalRes.data }
//   // }
// }

export async function getStaticProps() {
  const globalRes= await $Api.getGlobals() 
  // const res = await fetch('/api/global')
  // const errorCode = globalRes.statusCode > 200 ? globalRes.statusCode : false
  // const json = await resglobalRes.json()
  const weatherRes = await $Api.getWeathers()
  const teamsRes = await $Api.getTeamsMsg()
  const activitiesRes = await $Api.getActivities()

  console.log("stars:", globalRes, weatherRes, teamsRes, activitiesRes)

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
