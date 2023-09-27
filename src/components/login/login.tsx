import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {Button, Form, Input, message} from 'antd';
import {useContext} from "react";
import Url from '../api-configue'
import axios from "axios";
import {Context} from "../../context";
import {useNavigate} from "react-router-dom";

const Login: React.FC = () => {
  const context = useContext(Context)
  const navigate = useNavigate();

  const success = () => {
    message.success(context.fullName + ' ' + context.office + ' خوش آمدید');
  };

  const error = () => {
    message.error('نام کاربری یا رمز عبور اشتباه است');
  };

  const onFinish = async (values: any) => {

      try {

          const user = {
              username: values.username,
              password: values.password,
          };

          const {data} = await axios.post(`${Url}/token/`, user, {
              headers: {
                  'Content-Type': 'application/json'
              }
          });
          localStorage.clear();
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
          axios.defaults.headers.common['Authorization'] = `Bearer ${data['access']}`;
          navigate('/');
          context.setLogged(true)
          success()
      } catch (e) {
          context.setLogged(false)
          error()
      }
  };


  return (
      <div className='login-form'>
                <Form
                  name="normal_login"
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                >
                  <Form.Item
                    className='message-login'
                    name="username"
                    rules={[{ required: true, message: 'لطفا نام کاربری را وارد کنید!' }]}
                  >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="نام کاربری" />
                  </Form.Item>
                  <Form.Item
                    className='message-login'
                    name="password"
                    rules={[{ required: true, message: 'لطفا رمز عبور را وارد کنید!' }]}
                  >
                    <Input
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="رمز عبور"
                    />
                  </Form.Item>
                  <Form.Item>

                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                      ورود
                    </Button>

                  </Form.Item>
                </Form>
          </div>
  );
};

export default Login;