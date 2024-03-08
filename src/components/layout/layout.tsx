import {
   UserOutlined,
} from '@ant-design/icons';
import {Avatar, Layout} from 'antd';
import React, {useContext, useState} from "react";
import {Context} from "../../context";
import {MenuLayout} from "./menu_items";
import {RouteLayout} from "./route";

const {Content, Footer, Sider} = Layout;




const LayoutForm: React.FC = () => {
    const context = useContext(Context)
    const [siderW , setSiderW] = useState<number>()
    const [breakP , setBreakP] = useState<boolean>()

    return (
        <Layout>
              <Sider breakpoint="xl" width={siderW} className={breakP ? '!fixed  !z-[99] !h-[100vh] top-0 right-0  bottom-0' : ''} collapsedWidth={0} onBreakpoint={broken => {
                  if (broken) {
                      setSiderW(300)
                      setBreakP(true)
                  }else {
                      setSiderW(200)
                      setBreakP(false)
                  }
              }}>
                <div className='flex flex-col items-center m-5'>
                    <Avatar className='bg-sky-500' size={100} icon={<UserOutlined />} />
                    <p className='text-gray-50'>{context.fullName}</p>
                    <p className='text-gray-50'>{context.office}</p>
                </div>
                <MenuLayout/>
            </Sider>
            <Layout>
                <Content className='p-2 h-[100%]' style={{overflow: 'initial'}}>
                    <div className='bg-white rounded min-h-[100vh]' style={{padding: 24}}>
                        <RouteLayout/>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default LayoutForm;