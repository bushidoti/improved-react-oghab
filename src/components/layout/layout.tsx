import {
  PieChartOutlined,
  FileOutlined,
  BarChartOutlined,
  HomeOutlined,
  SolutionOutlined,
  CloudSyncOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {Link, Route, Routes} from "react-router-dom";
import { Breadcrumb, Layout, Menu, theme , Avatar } from 'antd';
import React, {useState} from "react";
import Contactus from "../contactus/page";
import RegisterContract from "../contract/register/page";
import ReportContract from "../contract/report/page";
import UploadContract from "../contract/upload/page";
import RegisterDocument from "../document/register/page";
import ReportDocument from "../document/report/page";
import UploadDocument from "../document/upload/page";
import RegisterProduct from "../warhouse/product/register/page";
import ReportProduct from "../warhouse/product/report/page";
import RecycleProperty from "../warhouse/property/recycle/page";
import RegisterProperty from "../warhouse/property/register/page";
import ReportProperty from "../warhouse/property/report/page";
import SentProperty from "../warhouse/property/sent/page";
import RegisterPersonal from "../personal/register/page";
import ReportPersonal from "../personal/report/page";
import UploadPersonal from "../personal/upload/page";
import Handling from "../warhouse/handling/page";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(<Link to='/'>خانه</Link>, '1', <HomeOutlined />),
  getItem(<Link to='https://api.oghab-asaluyeh.ir/admin/'>پنل مدیریت</Link>, '2', <PieChartOutlined />),

  getItem( <Link to='http://www.oghab-asaluyeh.ir:2082/cpsess6008508683/frontend/
  jupiter/backup/wizard-backup-type.html?login=1&post_login=3837540636687'>بکاپ</Link>
      , '3', <CloudSyncOutlined />),

  getItem('مدیریت قراردادها', 'sub1', <SolutionOutlined />, [

    getItem('قراردادها', 'sub2', null , [
        getItem(<Link to='../contract/register'>ثبت</Link>, '4'),
        getItem(<Link to='../contract/report'>گزارش</Link>, '5'),
        getItem(<Link to='../contract/upload'>باگذاری</Link>, '6'),
    ]),

    getItem('مدارک اشخاص', 'sub3', null, [
        getItem(<Link to='../personal/register'>ثبت</Link>, '7'),
        getItem(<Link to='../personal/report'>گزارش</Link>, '8'),
        getItem(<Link to='../personal/upload'>باگذاری</Link>, '9'),
    ]),
  ]),

  getItem('مدیریت اسناد', 'sub4', <FileOutlined />, [
    getItem(<Link to='../document/register'>ثبت اسناد اموال</Link>, '10'),
    getItem(<Link to='../document/report'>گزارش اسناد</Link>, '11'),
    getItem(<Link to='../document/upload'>باگذاری اسناد</Link>, '12')
  ]),

  getItem('انبارداری', 'sub5', <BarChartOutlined />, [

    getItem('انبار', 'sub6',null, [
        getItem(<Link to='../warhouse/product/register'>ثبت</Link>, '13'),
        getItem(<Link to='../warhouse/product/report'>گزارش</Link>, '14'),
    ]),

      getItem('اموال', 'sub7', null , [
        getItem(<Link to='../warhouse/property/register'>ثبت</Link>, '15'),
        getItem(<Link to='../warhouse/property/report'>گزارش</Link>, '16'),
        getItem(<Link to='../warhouse/property/sent'>ارسالی</Link>, '17'),
        getItem(<Link to='../warhouse/property/recycle'>بایگانی</Link>, '18'),
    ]),

    getItem(<Link to='../warhouse/handling'>انبارگردانی</Link>, '19')
  ]),
   getItem(<Link to='../contactus'>پشتیبانی</Link>, '20', <PhoneOutlined />),
];


const LayoutForm: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible reverseArrow collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <Avatar
                        size={!collapsed ? { xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 } : 'default' }
                        style={{ backgroundColor: '#fde3cf', color: '#f56a00', right: !collapsed ?
                        40 : 15 , margin:10}}>U</Avatar>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
          </Sider>
          <Layout>
            <Header style={{ padding: 0, background: colorBgContainer }} />
            <Content style={{ margin: '0 16px' }}>
              <Breadcrumb style={{ margin: '16px 0' }} items={[
                {
                  title: <Link to="/">خانه</Link>,
                },
                {
                  title: <Link to="/">انبار</Link>,
                },
                {
                  title: 'گزارش',
                }
              ]}/>
              <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
                 <Routes>
                          <Route path={'/contract/register'} element={<RegisterContract/>}/>
                          <Route path={'/contract/report'} element={<ReportContract/>}/>
                          <Route path={'/contract/upload'} element={<UploadContract/>}/>
                          <Route path={'/document/register'} element={<RegisterDocument/>}/>
                          <Route path={'/document/report'} element={<ReportDocument/>}/>
                          <Route path={'/document/upload'} element={<UploadDocument/>}/>
                          <Route path={'/personal/register'} element={<RegisterPersonal/>}/>
                          <Route path={'/personal/report'} element={<ReportPersonal/>}/>
                          <Route path={'/personal/upload'} element={<UploadPersonal/>}/>
                          <Route path={'/warhouse/product/register'} element={<RegisterProduct/>}/>
                          <Route path={'/warhouse/product/report'} element={<ReportProduct/>}/>
                          <Route path={'/warhouse/property/register'} element={<RegisterProperty/>}/>
                          <Route path={'/warhouse/property/report'} element={<ReportProperty/>}/>
                          <Route path={'/warhouse/property/sent'} element={<SentProperty/>}/>
                          <Route path={'/warhouse/property/recycle'} element={<RecycleProperty/>}/>
                          <Route path={'/warhouse/handling'} element={<Handling/>}/>
                          <Route path={'/contactus'} element={<Contactus/>}/>
                 </Routes>
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>تمامی حقوق برای شرکت digitkey می باشد.</Footer>
          </Layout>
        </Layout>
  );
};

export default LayoutForm;