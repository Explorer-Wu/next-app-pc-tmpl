import React, { useState, useEffect } from "react";
import produce from "immer";
import PropTypes from 'prop-types';
import { Card, List, Avatar, Button, Skeleton } from 'antd';
import { AndroidOutlined,AppleOutlined,WindowsOutlined,GithubOutlined,AliwangwangOutlined,DingdingOutlined,WeiboOutlined,TaobaoOutlined,Html5Outlined,TwitterOutlined,WechatOutlined,AlipayOutlined,ZhihuOutlined } from '@ant-design/icons'
import { $Api, $Moment } from '../../api';
import _ from 'lodash';

export default function TeamsMsgList({ propTeams }) {
    console.log("propTeams:", propTeams)
    const IconArrs = [<AndroidOutlined />, <AppleOutlined />, <WindowsOutlined />, <GithubOutlined />, <AliwangwangOutlined />, <DingdingOutlined />,
        <WeiboOutlined />, <TaobaoOutlined />, <Html5Outlined />, <TwitterOutlined />, <WechatOutlined />, <AlipayOutlined />, <ZhihuOutlined />];
    const bgArr = [ '#368ae5', '#1f50cd', '#6610f2','#765df6', '#d13d98', '#c03e20', '#ff8318', '#fabf30', '#1faf18', '#20c997', '#17a2b8', '#05586d'];

    return (
        <dl className="mdl-box">
                <dt>
                    <h3>{propTeams.title}</h3>
                </dt>
                <dd>
                <List
                    className="list-box-index"
                    // loading={initLoading}
                    // loadMore={loadMore}
                    itemLayout="horizontal"
                    dataSource={propTeams.data}
                    renderItem={item => (
                    <List.Item
                        // actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
                    >
                        <Skeleton avatar title={false} loading={item.loading} active>
                        <List.Item.Meta
                            avatar={<Avatar size="large" icon={IconArrs[Math.floor(Math.random()*12)+1]} style={{ backgroundColor: bgArr[Math.floor(Math.random()*10)+1] }} />}
                            title={<><strong>{item.name}</strong><p>{item.title}</p></>}
                            description={<p>{item.context}</p>}
                        />
                        <div className="time-pad">{item.agotime}h</div>
                        </Skeleton>
                    </List.Item>
                    )}
                />
                </dd>
            </dl>
        // <Card title="Card title" extra={<a href="#">More</a>} bordered={false}>
            
        // </Card>
    )
}

