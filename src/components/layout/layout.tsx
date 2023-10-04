import {
  PieChartOutlined,
  FileOutlined,
  BarChartOutlined,
  HomeOutlined,
  SolutionOutlined,
  CloudSyncOutlined,
  PoweroffOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import {MenuProps, Space} from 'antd';
import {Link, Route, Routes, useLocation} from "react-router-dom";
import { Breadcrumb, Layout, Menu, theme , Avatar } from 'antd';
import React, {useContext, useState} from "react";
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
import {Logout} from "../login/logout";
import {Context} from "../../context";
import MainContract from "../contract/main/page";
import MainDocument from "../document/main/page";
import MainPersonal from "../personal/main/page";
import MainWarehouse from "../warhouse/main/page";
import MainProduct from "../warhouse/product/main/page";
import MainProperty from "../warhouse/property/main/page";


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

    getItem(<Link to='../contract'>قراردادها</Link>, 'sub2', null , [
        getItem(<Link to='../contract/register'>ثبت</Link>, '4'),
        getItem(<Link to='../contract/report'>گزارش</Link>, '5'),
        getItem(<Link to='../contract/upload'>باگذاری</Link>, '6'),
    ]),

    getItem(<Link to='../personal'>مدارک اشخاص</Link>, 'sub3', null, [
        getItem(<Link to='../personal/register'>ثبت</Link>, '7'),
        getItem(<Link to='../personal/report'>گزارش</Link>, '8'),
        getItem(<Link to='../personal/upload'>باگذاری</Link>, '9'),
    ]),
  ]),

  getItem(<Link to='../document'>مدیریت اسناد</Link>, 'sub4', <FileOutlined />, [
    getItem(<Link to='../document/register'>ثبت اسناد اموال</Link>, '10'),
    getItem(<Link to='../document/report'>گزارش اسناد</Link>, '11'),
    getItem(<Link to='../document/upload'>باگذاری اسناد</Link>, '12')
  ]),

  getItem(<Link to='../warhouse'>انبارداری</Link>, 'sub5', <BarChartOutlined />, [
    getItem(<Link to='../warhouse/product'>انبار</Link>, 'sub6',null, [
        getItem(<Link to='../warhouse/product/register'>ثبت</Link>, '13'),
        getItem(<Link to='../warhouse/product/report'>گزارش</Link>, '14'),
    ]),

      getItem(<Link to='../warhouse/property'>اموال</Link>, 'sub7', null , [
        getItem(<Link to='../warhouse/property/register'>ثبت</Link>, '15'),
        getItem(<Link to='../warhouse/property/report'>گزارش</Link>, '16'),
        getItem(<Link to='../warhouse/property/sent'>ارسالی</Link>, '17'),
        getItem(<Link to='../warhouse/property/recycle'>بایگانی</Link>, '18'),
    ]),

    getItem(<Link to='../warhouse/handling'>انبارگردانی</Link>, '19')
  ]),
   getItem(<Link to='../contactus'>پشتیبانی</Link>, '20', <PhoneOutlined />),
   getItem(<Link to='../logout'>خروج</Link>, '21', <PoweroffOutlined />),
];

const breadcrumbNameMap: Record<string, string> = {
  '/contract': 'قراردادها',
  '/personal': 'مدارک اشخاص',
  '/document': 'اسناد اموال',
  '/warhouse': 'انبارداری',
  '/contactus': 'تماس با ما',
  '/warhouse/product': 'انبار',
  '/warhouse/property': 'اموال',
  '/contract/register': 'ثبت',
  '/contract/report': 'گزارش',
  '/contract/upload': 'بارگذاری',
  '/personal/register': 'ثبت',
  '/personal/report': 'گزارش',
  '/personal/upload': 'بارگذاری',
  '/document/register': 'ثبت',
  '/document/report': 'گزارش',
  '/document/upload': 'بارگذاری',
  '/warhouse/product/register': 'ثبت',
  '/warhouse/product/report': 'گزارش',
  '/warhouse/property/register': 'ثبت',
  '/warhouse/property/report': 'گزارش',
  '/warhouse/property/sent': 'ارسالی',
  '/warhouse/property/recycle': 'بایگانی',
  '/warhouse/handling': 'انبارگردانی',

};


const LayoutForm: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const context = useContext(Context)
  const pathSnippets = location.pathname.split('/').filter((i) => i);

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return {
      key: url,
      title: <Link to={url}>{breadcrumbNameMap[url]}</Link>,
    };
  });

 const breadcrumbItems = [
    {
      title: <Link to="/">خانه</Link>,
      key: 'home',
    },
  ].concat(extraBreadcrumbItems);

  const {
    token: { colorBgContainer },
  } = theme.useToken();


  return (
        <Layout style={{ minHeight: '100vh', marginRight: !collapsed ? 200 : 80 }}>
          <Sider style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
        }} collapsible reverseArrow collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <Avatar shape="square" size={!collapsed ? { xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 } : 'default' }
                style={{right: !collapsed ?
                40 : 15 , margin:10}} src={require('./icon.png')} />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
          </Sider>
          <Layout>
            <Header style={{ padding: 0 }}>
                <Space>
                    <span className='span-header' style={{marginRight:20}}>{context.fullName + ' ' +  context.office}</span>
                </Space>
            </Header>
            <Content style={{ margin: '0 16px', overflow: 'initial' }}>
              <Breadcrumb separator=">" style={{ margin: '16px 0' }} items={breadcrumbItems}/>
              <div style={{ padding: 24, minHeight: '100vh', background: colorBgContainer }}>
                 <Routes>
                          <Route path={'/contract'} element={<MainContract/>}/>
                          <Route path={'/contract/register'} element={<RegisterContract/>}/>
                          <Route path={'/contract/report'} element={<ReportContract/>}/>
                          <Route path={'/contract/upload'} element={<UploadContract/>}/>
                          <Route path={'/document'} element={<MainDocument/>}/>
                          <Route path={'/document/register'} element={<RegisterDocument/>}/>
                          <Route path={'/document/report'} element={<ReportDocument/>}/>
                          <Route path={'/document/upload'} element={<UploadDocument/>}/>
                          <Route path={'/personal'} element={<MainPersonal/>}/>
                          <Route path={'/personal/register'} element={<RegisterPersonal/>}/>
                          <Route path={'/personal/report'} element={<MainPersonal/>}/>
                          <Route path={'/personal/upload'} element={<UploadPersonal/>}/>
                          <Route path={'/warhouse'} element={<MainWarehouse/>}/>
                          <Route path={'/warhouse/product'} element={<MainProduct/>}/>
                          <Route path={'/warhouse/product/register'} element={<RegisterProduct/>}/>
                          <Route path={'/warhouse/product/report'} element={<ReportProduct/>}/>
                          <Route path={'/warhouse/property'} element={<MainProperty/>}/>
                          <Route path={'/warhouse/property/register'} element={<RegisterProperty/>}/>
                          <Route path={'/warhouse/property/report'} element={<ReportProperty/>}/>
                          <Route path={'/warhouse/property/sent'} element={<SentProperty/>}/>
                          <Route path={'/warhouse/property/recycle'} element={<RecycleProperty/>}/>
                          <Route path={'/warhouse/handling'} element={<Handling/>}/>
                          <Route path={'/contactus'} element={<Contactus/>}/>
                          <Route path={'/logout'} element={<Logout/>}/>
                 </Routes>
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>تمامی حقوق برای شرکت digitkey می باشد.</Footer>
          </Layout>
        </Layout>
  );
};

export default LayoutForm;