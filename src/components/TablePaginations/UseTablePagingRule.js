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
    {
      title: "操作",
      key: "action",
      render: (text, record) =>
        record.id ? (
          <span>
            <Link href={`/tables/articles/${record.id}`}>
              <a>详情</a>
            </Link>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除该新闻?"
              onConfirm={() => delRowFn(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        ) : null,
    },
  ]; //JSON.stringify(cols),

  const initPropsData = {
    columns,
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
    delKey,
  };

  //   const getTableDataFn = async (current, pageSize) => {
  //     try {
  //       const resData = await $Api.getArticleList(current, pageSize);
  //       console.log("table-res:", resData);
  //         setArticleData((draft) => {
  //           draft.dataSrc = resData.data.data;
  //           draft.total = resData.data.total;
  //         });
  //     } catch (error) {
  //       message.error(error.message + ", 获取新闻列表相关数据请求失败！", 5);
  //     }
  //   };

  return { initPropsData, initStatesVal, getTableDataFn, delArticleFn };
}

export { ArticleTablesRule };
