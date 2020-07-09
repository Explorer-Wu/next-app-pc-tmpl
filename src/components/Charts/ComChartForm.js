import React, { Component } from "react";
import produce from "immer";
import PropTypes from 'prop-types';
import { Form, Input, Select, Switch, Checkbox, Tooltip, Icon, message, Button, Modal, DatePicker, Radio } from 'antd';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

export default class ComChartForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartParams: {
                period: 1*24*60*60,
                // dateTimeVal: [],
                start: null,
                end: null,
            },
        };
        
    }

    periodSelectChange = (value) => {
        this.setState(
            produce(draft => {
                draft.chartParams.period = value
            })
        )
    }

    changeDateTime = (dates, dateStrings) => {
        if (dates[0] !== undefined && dates[1] !== undefined) {
            console.log("get-dates:", dates[0])
            this.setState(
                produce(draft => {
                    draft.chartParams.start = $Moment(dates[0]).valueOf()
                    draft.chartParams.end = $Moment(dates[1]).valueOf()
                })
            )
        } else {
            this.setState(
                produce(draft => {
                    draft.chartParams.start = null
                    draft.chartParams.end = null
                })
            )
        }
    }

    disabledDate = (current) =>{
        return current && current > $Moment().endOf('day');
    }

    render() {
        const { exOption } = this.props
        return ( 
            <Form layout="inline" className="chart-form fr">
                <FormItem className="fr mar-r0">
                    <Button onClick={() => openHistoryModal()} size={"small"}>历史</Button>
                </FormItem>
                
                <FormItem className="fr">
                    <Select size="small" defaultValue={this.state.chartParams.period} onChange={this.periodSelectChange} style={{ width: 60 }}>
                        {exOption.periodOpts.map(period =>
                            (<Option className="inline-block" key={period.value} value={period.value}>
                                {period.name}
                            </Option>))
                        }
                    </Select>
                </FormItem>

                <FormItem className="fr">
                    <RangePicker size="small" disabledDate={this.disabledDate} showTime defaultValue={[this.state.chartParams.start, this.state.chartParams.end]} format="YYYY-MM-DD HH:mm:ss" onOk={this.changeDateTime} style={{ width: 220 }}/>
                </FormItem>
            </Form>
        )
    }
}