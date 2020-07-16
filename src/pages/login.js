import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";
import produce from "immer";
import md5 from "md5";
import { Form, Input, Button, Checkbox, Breadcrumb, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Footer from "../components/Footer";
import { $ApiAuth } from "../api";
import CookieStorage from "../utils/cookiestorage";
import { validPattern } from "../utils/pattern";

import "../../public/styles/components/login.scss";

function Login(props) {
  const Router = useRouter();
  const [formlogin] = Form.useForm();

  // 提交表单且数据验证失败后回调事件
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // 提交表单且数据验证成功后回调事件
  const submFinish = async (values) => {
    const userInfo = produce(values, (draft) => {
      draft.password = values.password; //md5(values.password)
    });
    console.log("Success:", values, userInfo, props);
    const { username, password, remember } = userInfo;
    const loginRes = await $ApiAuth.login(username, password);
    console.log("Success-login:", loginRes);
    if (loginRes.status !== 200) {
      throw new Error(await loginRes.message);
    } else {
      if (remember) {
        CookieStorage.setCookie("username", username);
        // cookies.setCookie('pass_word', pass_word, "d7");
      } else if (CookieStorage.getCookie("username")) {
        CookieStorage.delCookie("username");
      }
      message.success("登录成功，欢迎您！");
      signin(loginRes.data.access_token);
      formlogin.resetFields();
    }
  };

  //登录成功后跳转到原来要进的页面
  function signin(token) {
    // const { from } = { from: Router.asPath || "/home" };
    // console.log('login-router', token, Router);
    CookieStorage.setCookie("user_token", token);
    Router.push("/home");
  }

  return (
    <div className="login-main">
      <div className="login-wrap">
        <h3>登 录</h3>
        <Form
          form={formlogin}
          name="login_form"
          onFinish={submFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{ remember: true }}
          className="login-form"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "请输入用户名!" },
              { pattern: validPattern.checkName, message: "请输入合法名称!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            // label="Password"
            name="password"
            rules={[
              { required: true, message: "请输入密码!" },
              { pattern: validPattern.checkName, message: "请输入有效密码!" },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住密码</Checkbox>
            </Form.Item>
            <Link href="#">
              <a className="login-form-forgot">忘记密码</a>
            </Link>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登 录
            </Button>
          </Form.Item>
          <Form.Item>
            <span>或 &emsp; </span>
            <Link href="/register">
              <a>注册</a>
            </Link>
          </Form.Item>
        </Form>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
