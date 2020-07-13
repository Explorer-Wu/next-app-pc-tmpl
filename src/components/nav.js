import Link from 'next/link';
import { withRouter } from 'next/router';
import React, {Component} from 'react';
import { Menu } from 'antd';
import {
  AppstoreOutlined,
  LineChartOutlined,
  BarChartOutlined,
  FormOutlined,
  TableOutlined,
  PictureOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
  UploadOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import _ from 'lodash';

const { SubMenu } = Menu;

// href 是真实的页面地址，as 为显示在浏览器地址栏里的地址，如果不指定则跟 href 一致
{/* <Link
  href={{ pathname: '/task/detail', query: { id: task.id } }}
  as={`/tasks/${task.id}`}
>
  <a>{task.title}</a>
</Link> */}
class NavMenu extends Component {
  static async getInitialProps(ctx) {
    // const res = await fetch('https://api.github.com/repos/zeit/next.js')
    // const json = await res.json()
    // return { stars: json.stargazers_count }
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
    };
    this.menuLinks = [{
      type: <AppstoreOutlined/>,
      title: '首页概览',
      path: '/home'
    }, {
      type: <LineChartOutlined />,
      title: 'Echart图表',
      // path: '/app/echarts',
      children: [{
        title: '通用图表',
        path: '/charts/index'
      }, {
        title: 'D3图表',
        path: '/charts/d3charts',
      }]
    }, {
      type: <FormOutlined />,
      title: '表单展示',
      path: '/forms'
    }, {
      type: <TableOutlined />,
      title: '表格展示',
      path: '/tables'
    }, {
      type: <PictureOutlined />,
      title: '图片展示',
      path: '/pictures',
    }]
    
    this.menuPath = this.menuLinks.map(menu => {
      if (menu.path) {
          return menu.path
      } else {
          return menu.children.map(el => el.path)
      }
    })
  }

  componentDidMount() {
    const { router } = this.props
    console.log("next-router:", router ,this.props)
    // router.beforePopState(({ url, as, options }) => {
    //   // I only want to allow these two routes!
    //   if (as === '/') {
    //     // Have SSR render bad routes as a 404.
    //     window.location.href = "/home"
    //     return false
    //   }
    //   return true
    // })

    _.flatten(this.menuPath).forEach(mpath => {
        if (router.pathname.indexOf(mpath) > -1) {
          this.setState({ selectedKeys: [mpath]});
        }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { router } = this.props
    if (prevProps.router.pathname !== router.pathname) {
      _.flatten(this.menuPath).forEach(mpath => {
          if (router.pathname.indexOf(mpath) > -1) {
              this.setState({ selectedKeys: [mpath]});
          }
      })
    }
  }

  linkTo = (link) => {
    console.log("linkTo:", link.key, this.props)
    this.props.router.push(link.key);
  }

  render() {
    let MenusList = this.menuLinks.map((el, index) => el.children ? (
      <SubMenu key={"sub"+ index+1} icon={el.type} title={el.title}>
          {el.children.map((echd) => (<Menu.Item key={echd.path}>
            {/* <Link href={echd.path}>
              <span>{echd.title}</span>
            </Link> */}
            {echd.title}
          </Menu.Item>))}
      </SubMenu>
    ) : (<Menu.Item key={el.path} icon={el.type}>
      {/* <Link href={el.path}>
        <span>{el.title}</span>
      </Link> */}
      {el.title}
    </Menu.Item>))

    return (
      <>
        <div className="headlogo">
            {/* <img src={logo} alt="logo" type="image/png"/> */}
            <svg width="50" height="38" viewBox="0 0 148 90" version="1.1" xmlns="http://www.w3.org/1999/xlink" style={{ transform: "translateX(4%)", shapeRendering:"auto"}}>
              <path 
                d="M34.992 23.495h27.855v2.219H37.546v16.699h23.792v2.219H37.546v18.334h25.591v2.219H34.992v-41.69zm30.35 0h2.96l13.115 18.334 13.405-18.334L113.055.207 83.1 43.756l15.436 21.429H95.46L81.417 45.683 67.316 65.185h-3.018L79.85 43.756 65.343 23.495zm34.297 2.219v-2.219h31.742v2.219h-14.623v39.47h-2.554v-39.47H99.64zM.145 23.495h3.192l44.011 66.003L29.16 65.185 2.814 26.648l-.116 38.537H.145v-41.69zm130.98 38.801c-.523 0-.914-.405-.914-.928 0-.524.391-.929.913-.929.528 0 .913.405.913.929 0 .523-.385.928-.913.928zm2.508-2.443H135c.019.742.56 1.24 1.354 1.24.888 0 1.391-.535 1.391-1.539v-6.356h1.391v6.362c0 1.808-1.043 2.849-2.77 2.849-1.62 0-2.732-1.01-2.732-2.556zm7.322-.08h1.379c.118.853.95 1.395 2.149 1.395 1.117 0 1.937-.58 1.937-1.377 0-.685-.521-1.097-1.708-1.377l-1.155-.28c-1.62-.38-2.36-1.166-2.36-2.487 0-1.602 1.304-2.668 3.26-2.668 1.82 0 3.15 1.066 3.23 2.58h-1.354c-.13-.828-.85-1.346-1.894-1.346-1.1 0-1.832.53-1.832 1.34 0 .642.472 1.01 1.64 1.284l.987.243c1.838.43 2.596 1.178 2.596 2.53 0 1.72-1.33 2.799-3.453 2.799-1.987 0-3.323-1.029-3.422-2.637z" 
                fill="#fff" 
                fillRule="nonzero"></path>
            </svg>
            <div className="title">KOA+Antd</div>
        </div>
    
        <Menu theme="dark" defaultSelectedKeys={['/home']} selectedKeys={this.state.selectedKeys} onClick={this.linkTo} mode="inline">
          { MenusList }
        </Menu>
    
        {/* <ul>
          <li>
            <Link prefetch={false} href="/">
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link prefetch={false} href="/test" a="/test">
              <a>Test</a>
            </Link>
          </li>
          <ul>
            {links.map(
              ({ key, href, label }) => (
                <li key={key}>
                  <Link href={href} key={key} prefetch={false}>
                    <a>{label}</a>
                  </Link>
                </li>
              )
            )}
          </ul>
        </ul> */}
    
        <style jsx>{`
          .headlogo {
            height: 38px;
            overflow: hidden;
            text-align: center;
            padding: 8px 15px;
            margin-bottom: 8px;
          }
          .headlogo > svg {
            // display: inline-block;
            float: left;
            width: auto;
            // height: 40px;
            // margin: -18px 0 0;
            padding: 0;
          }
          .headlogo > .title {
            float: left;
            height: 38px;
            margin-left: 10px;
            color: #fff;
            font: normal 16px/38px "Microsoft YaHei"
          }
        `}</style>
      </>)
  }
}

export default withRouter(NavMenu);
