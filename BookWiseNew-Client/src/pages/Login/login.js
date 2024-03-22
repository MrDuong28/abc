import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Divider, Form, Input, Row, notification } from 'antd';
import React, { useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import userApi from "../../apis/userApi";
import "./login.css";

const Login = () => {

  const [isLogin, setLogin] = useState(true);

  let history = useHistory();

  const onFinish = values => {
    userApi.login(values.email, values.password)
      .then(function (response) {
        console.log(response);
        if (response.user.role === "isClient" && response.user.status !== "noactive") {
          history.push("/home");
        } else {
          setLogin(false);
          notification["error"]({
            message: `Thông báo`,
            description:
              'Bạn không có quyền truy cập vào hệ thống',

          });
        }
      })
      .catch(error => {
        console.log("email or password error" + error)
      });
  }

  return (
    <div className='login-page'>
      <div class="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div class="px-6 py-4">
          <div class="flex justify-center mx-auto">
            <img class="w-auto h-7 sm:h-8" src="https://merakiui.com/images/logo.svg" alt="" />
          </div>

          <h3 class="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">Welcome Back</h3>

          <p class="mt-1 text-center text-gray-500 dark:text-gray-400">Đăng nhập hoặc tạo tài khoản</p>

          <Row style={{ margin: 'auto' }}>
            <Form
              style={{ marginBottom: 8, width: '100%' }}
              name="normal_login"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <>
                {isLogin === false ?
                  <Form.Item style={{ marginBottom: 16 }}>
                    <Alert
                      message="Tài khoản hoặc mật khẩu sai"
                      type="error"
                      showIcon
                    />

                  </Form.Item>
                  : ""}
              </>
              <Form.Item
                style={{ marginBottom: 20 }}
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập email!',
                  },
                  {
                    type: 'email',
                    message: 'Email không hợp lệ!',
                  },
                ]}
              >
                <Input
                  style={{ height: 34, borderRadius: 5 }}
                  prefix={<UserOutlined className="siteformitemicon" />}
                  placeholder="Email" />
              </Form.Item >
              <Form.Item
                style={{ marginBottom: 8 }}
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mật khẩu!',
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="siteformitemicon" />}
                  type="password"
                  placeholder="Password"
                  style={{ height: 34, borderRadius: 5 }}
                />
              </Form.Item>

              <Form.Item style={{ width: '100%', marginTop: 30 }}>
                <Button className="button" type="primary" htmlType="submit"  >
                  Đăng Nhập
                </Button>
              </Form.Item>
            </Form>
          </Row>
        </div>

        <div class="flex items-center justify-center py-4 text-center bg-gray-50 dark:bg-gray-700">
          <span class="text-sm text-gray-600 dark:text-gray-200">Bặn chưa có tài khoản? </span>

          <a href="http://localhost:3500/register" class="mx-2 text-sm font-bold text-blue-500 dark:text-blue-400 hover:underline">Đăng ký</a>
        </div>
      </div>
    </div>

  );
};

export default Login;



