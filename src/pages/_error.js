// import Error from 'next/error'
import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import {Router} from 'next/router'
import Link from 'next/link'
import Loading from '../components/Loading'
import { Layout } from 'antd'
const {Content} = Layout;

function Error({ statusCode }) {

  useEffect(() => {
    console.log("useEffect:", statusCode);
    let timeLogin = setTimeout(()=>{
      Router.push("/login")
    }, 2000)
    
    return () => {
      timeLogin = null
    }
  }, [statusCode])

  // status = `${status}`
  // if (!['403', '404', '500', 'error', 'info', 'success', 'warning'].includes(status)) {
  //   status = '500'
  // }
  const goBack = () => {
    if (Router.query.from) {
      Router.push(Router.query.from)
    } else {
      Router.back()
    }
  }

  return (
    <>
      <Head>
        <title>Error-KOA+Next.js服务端渲染应用'</title>
      </Head>
      {statusCode === 401 ? 
        (<Loading isLoad="正在跳转登录页" />) : 
        (<Layout>
          <Content style={{padding: '0 50px'}}>
            <div className="_error" style={{background: '#fff', padding: 20, minHeight: 380}}>
              <div className="cont">
                {statusCode ?
                  (<p>
                    An error {statusCode} occurred on server <br/>
                    <Link href="/home">
                      <a>返回首页</a>
                    </Link> |
                    <Link href={goBack}>
                      <a>返回前页</a>
                    </Link>
                  </p>)
                  :  
                  (<p>An error occurred on client</p>)
                }
              </div>
            </div>
          </Content>
        <style jsx>
          {`
            ._error{
              position:relative;
            }
            .cont{
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate3d(-50%,-50%,0);
              text-align: center;
            }
          `}
        </style>
      </Layout>)
      }
    </>
  )
}

Error.getInitialProps = ({ res, err }) => {
  // const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  const statusCode = res ? res.statusCode : err ? err.statusCode : null
  return { statusCode }
}

export default Error