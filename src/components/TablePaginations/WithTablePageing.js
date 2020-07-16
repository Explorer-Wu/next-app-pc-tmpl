import React, { Component, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { produce } from "immer";
import PropTypes from "prop-types";
import { message, Divider, Popconfirm } from "antd";
import _ from "lodash";
import { $Api } from "../../api";

// HOC 工厂实现: 属性代理（PP）和继承反转（II）
function TablePagingHOC(WrappedTablePaging, getData, delData) {
  return class ComTablePaging extends Component {
    constructor(props) {
      super(props);
      this.state = {
        tablesStates: this.props.initStateProps.datas,
        pagesStates: {
            ...this.props.initStateProps.pages,
        }, 
        nextDelKey: null,
      };

      this.handleChangePage = this.handleChangePage.bind(this);
    }

    componentDidMount() {
      const { pageCur, pageSize } = this.state.pagesStates;
      this.loadDataFn(pageCur, pageSize);
    }

    shouldComponentUpdate(nextProps, nextState) {
      //不建议深层次比较
      if (
        !_.isEqual(this.props, nextProps) ||
        !_.isEqual(this.state, nextState)
      ) {
        // if(this.props.initStateProps.delKey !== nextProps.initStateProps.delKey) {
        //     debugger
        //     return false;
        // }
        return true;
      }
      return false;
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.props.initStateProps.delKey !== this.state.nextDelKey) {
        this.setState(
            produce((draft) => {
              draft.nextDelKey = this.props.initStateProps.delKey
            }),
            () => {
                this.handleDelete(this.state.nextDelKey);
            }
        );
      }

      if (!_.isEqual(prevState.pagesStates, this.state.pagesStates)) {   
        const { pageCur, pageSize } = this.state.pagesStates;
        this.loadDataFn(pageCur, pageSize);
      }
    }

    componentWillUnmount() {
      //clearTimeout

      // 卸载异步操作设置状态
      this.setState = (state, callback) => {
        return;
      };
    }

    loadDataFn = async (current, pageSize) => {
      try {
        // debugger
        const resData = await getData(current, pageSize);
        // console.log("table-res:", resData);

        this.setState(
          produce((draft) => {
            draft.tablesStates.dataSrc = resData.data.data;
            draft.tablesStates.total = resData.data.total;
          })
        );
      } catch (error) {
        message.error(
          error.message + `,${this.props.tablePagProps.getErrMsg}`,
          5
        );
      }
    };

    handleChangePage(pageNum) {
      this.setState(
        produce((draft) => {
          draft.pagesStates.pageCur = pageNum;
        })
      );
    }

    handleChangeSize = (current, pageSize) => {
      this.setState(
        produce((draft) => {
          draft.pagesStates.pageCur = current;
          draft.pagesStates.pageSize = pageSize;
        })
      );
    };

    handleDelete = async (key) => {
      const dataSource = [...this.state.tablesStates.dataSrc];
      this.setState(
        produce((draft) => {
          draft.tablesStates.dataSrc = dataSource.filter(
            (item) => item.id !== key //前端删除
          );
          draft.tablesStates.total -= 1;
        })
      );

      //后端删除
      try {
        const { pageCur, pageSize } = this.state.pagesStates;
        const delRes = await delData(key); 
        // console.log("table-delRes:", delRes, pageCur, pageSize);
        this.loadDataFn(pageCur, pageSize);
      } catch (error) {
        message.error(
          error.message + `,${this.props.tablePagProps.delErrMsg}`,
          5
        );
      }
    };

    render() {
      const newProps = {
        ...this.props.tablePagProps,
        ...this.state.tablesStates,
        ...this.state.pagesStates,
      };
      const propsChangeFn = {
        changePage: this.handleChangePage,
        changeSize: this.handleChangeSize,
      };

      // 属性代理: 操纵属性、 通过 refs 访问实例、 抽象 state、 包裹组件
      return <WrappedTablePaging {...newProps} {...propsChangeFn} />;
    }
  };
}

TablePagingHOC.propTypes = {
  tablePagProps: PropTypes.object,
  initStateProps: PropTypes.object,
};

export default TablePagingHOC;
