import React, { useState, useEffect } from "react";
import produce from "immer";
import PropTypes from 'prop-types';
import { Card, List, Avatar, Button, Skeleton } from 'antd';
import { FacebookOutlined,DropboxOutlined,GooglePlusOutlined,MediumOutlined,LinkedinOutlined,SkypeOutlined,TwitterOutlined,YoutubeOutlined,Html5Outlined,YuqueOutlined,YahooOutlined } from '@ant-design/icons'
import { $Api, $Moment } from '../../api';
import _ from 'lodash';

export default function ActiveApps({ propActives }) {
    console.log("propActives:", propActives)
    const IconArrs = [<FacebookOutlined />, <DropboxOutlined />, <GooglePlusOutlined />, <MediumOutlined />, <LinkedinOutlined />,<SkypeOutlined />,
        <TwitterOutlined />, <YoutubeOutlined />, <Html5Outlined />, <YuqueOutlined />, <YahooOutlined />];
    const bgArr = [ '#368ae5', '#1f50cd', '#6610f2','#765df6', '#d13d98', '#c03e20', '#ff8318', '#fabf30', '#1faf18', '#20c997', '#17a2b8', '#05586d'];

    return (
        <dl className="dl-list">
                <dt>
                    <h3>{propActives.title}</h3>
                </dt>
                
                {propActives.data.map((el, index) => <dd key={el.appid}>
                    <figure style={{ backgroundColor: bgArr[Math.floor(Math.random()*10)+1] }}>{IconArrs[Math.floor(Math.random()*10)+1]}</figure>
                    <section>
                        <h5><em>{el.activities}</em>{el.prod}</h5>
                        <p>{el.info}</p>
                    </section>
                    <div className="agotime">{el.agotime}h</div>
                    
                </dd>)}
            </dl>
        // <Card title="Card title" extra={<a href="#">More</a>} bordered={false}>
            
        // </Card>
    )
}

