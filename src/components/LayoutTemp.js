import React, { useState, useEffect, useRef, useCallback, useMemo, forwardRef } from "react";
import PropTypes from 'prop-types';
import _ from 'lodash';
import Header from './Header';
import MenuNav from './nav';
// import Footer from './Footer';
import { Layout } from 'antd';

const { Sider, Content } = Layout;

function LayoutTemp({ children }) {
  // const { propChild } = props;
  const [collapsed, setCollapsed] = useState(false);
  const toggleMenu = (bool) => {
    setCollapsed(bool);
  };

  return (<Layout>
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <MenuNav/>
    </Sider>
    <Layout>
      <Header propCollapsed={collapsed} onToggleMenu={toggleMenu}/>
      <Content
        style={{
          height: 'calc(100vh - 40px)',
          overflow: 'auto',
          padding: 16
        }}
      >
        <div className="page page-current">
          {/* { propChild } */}
          {children}
        </div>
      </Content>
    </Layout>
  </Layout>)
}

export default LayoutTemp;