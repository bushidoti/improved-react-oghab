import {
   UserOutlined,
} from '@ant-design/icons';
import {Avatar, Layout} from 'antd';
import React, {useContext} from "react";
import {Context} from "../../context";
import {MenuLayout} from "./menu_items";
import {RouteLayout} from "./route";

const {Content, Footer, Sider} = Layout;




const LayoutForm: React.FC = () => {
    const context = useContext(Context)

    return (
        <Layout >
              <Sider breakpoint="xl" collapsedWidth="0">
                <div className='flex flex-col items-center m-5'>
                    <Avatar className='bg-sky-500' size={100} icon={<UserOutlined />} />
                    <p className='text-gray-50'>{context.fullName}</p>
                    <p className='text-gray-50'>{context.office}</p>
                </div>
                <MenuLayout/>
            </Sider>
            <Layout>
                <Content className='me-8 p-2 h-[100vh]' style={{overflow: 'initial'}}>
                    <div className='bg-white rounded' style={{padding: 24}}>
                        <RouteLayout/>
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>تمامی حقوق برای شرکت digitkey می باشد.</Footer>
            </Layout>
        </Layout>
    );
};

export default LayoutForm;