import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Button, Form, Input, message} from 'antd';
import React, {useContext} from "react";
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
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
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
        <div className='grid h-screen place-items-center'>
            <div className='w-[30vw] shadow-2xl shadow-indigo-500/50 bg-cyan-50 p-[2vw] rounded-[25px]  border-[25px]'>
                <div className='flex flex-col items-center mb-5'>
                    <Avatar shape="square" src={require('../../assets/icons/icon-512x512.png')} size={100} />
                </div>
                <Form
                    name="normal_login"
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                >
                    <Form.Item
                        className='message-login'
                        name="username"
                        rules={[{required: true, message: 'لطفا نام کاربری را وارد کنید!'}]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="نام کاربری"/>
                    </Form.Item>
                    <Form.Item
                        className='message-login'
                        name="password"
                        rules={[{required: true, message: 'لطفا رمز عبور را وارد کنید!'}]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            type="password"
                            placeholder="رمز عبور"
                        />
                    </Form.Item>
                    <Form.Item>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full">
                            ورود
                        </Button>
                    </Form.Item>
                </Form>
                <div className='text-center text-sm'>v2.0.0</div>
            </div>
        </div>
    );
};

export default Login;