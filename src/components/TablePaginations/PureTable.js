import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { Table, Pagination } from "antd";

//一般用于前端翻页table
export default function PureTable(props) {
  const {
    dataSrc,
    total,
    pageCur,
    pageSize,
    columns,
    rowKeyFn,
    isborder,
    isPaging,
    scrollProp,
    isJumper,
    isSizeChanger,
    changePage,
    changeSize,
    pageSizeOptions,
    size,
    position,
  } = props;

  // const parseCols = JSON.parse(columns, function (key, value) {
  //   if (key === "render") {
  //     return eval("(" + value + ")");
  //   } else {
  //     return value;
  //   }
  // });

  // console.log("PureTablePaging:", parseCols);

  const onChangePage = page => {
    changePage(page);
  }
  const onChangeSize = (cur, size) => {
    changeSize(cur, size)
  }
  
  return (
    <Table
      columns={columns}
      dataSource={dataSrc}
      rowKey={rowKeyFn}
      bordered={isborder}
      pagination={{
        position: position,
        size: size,
        // defaultCurrent: pageCur,
        // defaultPageSize: pageSize,
        current: pageCur,
        pageSize: pageSize,
        pageSizeOptions: pageSizeOptions, //['10', '20', '30'],
        onShowSizeChange: onChangeSize,
        showSizeChanger: isSizeChanger, //true,
        showQuickJumper: isJumper,
        onChange: onChangePage,
        total: total,
        showTotal: (etotal) => `总共 ${etotal} 条`,
      }}
      scroll={{ ...scrollProp }}
    />
  );
}

PureTable.propTypes = {
  // isExPaging: PropTypes.bool.isRequired,
  dataSrc: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  pageCur: PropTypes.number,
  pageSize: PropTypes.number,
  columns: PropTypes.array,
  rowKeyFn: PropTypes.func,
  isborder: PropTypes.bool,
  isPaging: PropTypes.bool,
  scrollProp: PropTypes.object,
  isJumper: PropTypes.bool,
  isSizeChanger: PropTypes.bool,
  changePage: PropTypes.func,
  changeSize: PropTypes.func,
  pageSizeOptions: PropTypes.array,
  size: PropTypes.string,
  position: PropTypes.array,
};

PureTable.defaultProps = {
  // isExPaging: false,
  dataSrc: [],
  total: 0,
  pageCur: 1,
  pageSize: 10,
  columns: [],
  rowKeyFn: (record) => record.key,
  isborder: false,
  isPaging: true,
  size: 'small',
  position: ["bottomRight"],
  scrollProp: undefined,
  pageSizeOptions: ['10', '20', '30'],
  isJumper: false,
  isSizeChanger: false,
};
