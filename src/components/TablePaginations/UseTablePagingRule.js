import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useImmer } from "use-immer";
import { message, Divider, Popconfirm } from "antd";
import PropTypes from "prop-types";
import _ from "lodash";
import { $Api } from "../../api";

function ArticleTablesRule(props) {
  const [delKey, setDelKey] = useState(null);

  const getTableDataFn = async (current, pageSize) => {
    return await $Api.getArticleList(current, pageSize);
  };
  const delArticleFn = async (key) => {
    return await $Api.delArticle(key);
  };
  const delRowFn = (key) => {
    setDelKey(key);
  };

  const columns = [
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      minWidth: 160,
    },
    {
      title: "作者",
      dataIndex: "author",
      key: "author",
      minWidth: 80,
    },
    {
      title: "导语",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "发布时间",
      dataIndex: "publish_date",
      key: "publish_date",
      minWidth: 160,
    },
  ];

  const initPropsData = {
    columns,
    actions: {
      selKey: (record) => record.id,
      delTitle: "确认删除该新闻?",
      linkurl: '/tables/articles/',
      linktxt: '详情'
    },
    rowKeyFn: (record) => record.id,
    isborder: true,
    // isPaging: false,
    // scrollProp: { y: 500 },
    getErrMsg: "获取新闻列表相关数据请求失败！",
    delErrMsg: "删除新闻相关数据请求失败！",
    size: "small",
    isJumper: true,
    isSizeChanger: true,
  };

  const initStatesVal = {
    datas: {
      dataSrc: [],
      total: 0,
    },
    pages: {
      pageCur: 1,
      pageSize: 10,
    },
  };

  return {
    initPropsData,
    initStatesVal,
    getTableDataFn,
    delArticleFn,
  };
}

export { ArticleTablesRule };
