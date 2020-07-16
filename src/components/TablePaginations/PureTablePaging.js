import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Table, Pagination } from "antd";

//后端翻页table
export default function PureTablePaging(props) {
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


  console.log("PureTablePaging:", columns);

  const onChangePage = (page) => {
    changePage(page);
  };
  const onChangeSize = (cur, size) => {
    changeSize(cur, size);
  };

  function onDelRow(rowKey) {
    delRow(rowKey);
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSrc}
        rowKey={rowKeyFn}
        bordered={isborder}
        pagination={isPaging}
        scroll={scrollProp? { ...scrollProp } : undefined}
      />
      <Pagination
        className={position}
        size={size}
        current={pageCur}
        pageSize={pageSize}
        onShowSizeChange={onChangeSize}
        showSizeChanger={isSizeChanger}
        pageSizeOptions={pageSizeOptions}
        showQuickJumper={isJumper}
        onChange={onChangePage}
        total={total}
        showTotal={(etotal) => `总共 ${etotal} 条`}
      />
    </>
  );
}

PureTablePaging.propTypes = {
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
  position: PropTypes.string,
};

PureTablePaging.defaultProps = {
  dataSrc: [],
  total: 0,
  pageCur: 1,
  pageSize: 10,
  columns: [],
  rowKeyFn: (record) => record.key,
  isborder: false,
  isPaging: false,
  // scrollProp: PropTypes.object,
  pageSizeOptions: ['10', '20', '30'],
  isJumper: false,
  isSizeChanger: false,
  position: "v-fr mar-10-0"
};
