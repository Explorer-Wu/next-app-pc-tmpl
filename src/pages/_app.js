import App from 'next/app'
import React, { useEffect } from 'react'
import { withRouter } from 'next/router'
import LayoutTemp from  '../components/LayoutTemp'
// import Header from '../components/Header'

import '@babel/polyfill'  // import 'babel-polyfill'
import '../../public/styles/main/base.scss'
import '../../public/styles/components/general.scss'

function  NextApp({ Component, pageProps, router }) {

  return (
    <>
      {/* <HtmlHead title="KOA+Next.js应用模版"/> */}
      {
        router.pathname !== '/login'
          ?
          <LayoutTemp>
            <Component {...pageProps}/>
          </LayoutTemp>
          : 
          <>
            <Component {...pageProps}/>
          </>
      }
    </>
  )
}

export default withRouter(NextApp)