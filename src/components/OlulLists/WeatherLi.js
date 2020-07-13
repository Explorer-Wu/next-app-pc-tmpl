import React, { useState, useEffect } from "react";
import produce from "immer";
import PropTypes from 'prop-types';
import { message } from 'antd';
import { $Api, $Moment } from '../../api';
import _ from 'lodash';

function WeatherList({ propWeather }) {
    // console.log("propWeather:", propWeather)
    return (
        <ul className="ul-box">
            {propWeather.map((el, index) => <li key={index}>
                <h5>{el.week[1]}</h5>
                <em>{el.weather[1]}</em>
                <p>{el.temperature}°C</p>
                <p>{el.percent}%</p>
            </li>)}
        </ul>
    )
}
export default WeatherList;

