import React from 'react'
import { Layout, Spin, Typography } from 'antd'

export default function Laoding(props){
  const { isLoad } = props

  return (
    <Layout>
      <div className="loader" style={{ width: '100vw', height: '100vh' }}>
        <Spin size="large" />
        {
          isLoad ?
          <Typography.Text style={{ marginTop: 30 }}>
            {isLoad}
          </Typography.Text> :
          null
        }

        <style jsx>{`
          .loader {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </div>
    </Layout>
  )
}