import {
    BarChartOutlined,
    CloudSyncOutlined,
    FileOutlined,
    HomeOutlined,
    PieChartOutlined,
    PoweroffOutlined,
    SolutionOutlined, UserOutlined,
} from '@ant-design/icons';
import {Avatar, Layout, Menu, MenuProps} from 'antd';
import {Link, Route, Routes} from "react-router-dom";
import React, {useContext, useState} from "react";
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
import UploadPersonal from "../personal/upload/page";
import Handling from "../warhouse/handling/page";
import {Logout} from "../login/logout";
import {Context} from "../../context";
import MainContract from "../contract/main/page";
import MainDocument from "../document/main/page";
import MainPersonal from "../personal/main/page";
import MainProduct from "../warhouse/product/main/page";
import MainProperty from "../warhouse/property/main/page";
import Edit from "../personal/register/edit";
import Home from "../home/home";
import PageNotFound from "../notfound/not_found";
import NoAccess from "../noaccess/no_access";
import Card from "../warhouse/product/card/card";
import ProductFactor from "../warhouse/product/report/factor";
import ProductCheck from "../warhouse/product/report/check";
import {UploadProductDocs} from "../warhouse/product/upload/upload";
import {EditDoc} from "../warhouse/product/register/edit";

const {Content, Footer, Sider} = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[] ,
    disabled?: boolean,
    danger?: boolean ,
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        disabled,
        danger,
    } as MenuItem;
}

const rootSubmenuKeys = ['sub1', 'sub4', 'sub5'];



const LayoutForm: React.FC = () => {
    const [openKeys, setOpenKeys] = useState(['']);
    const context = useContext(Context)
    const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
          setOpenKeys(keys);
        } else {
          setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
      };
    const items: MenuItem[] = [
    getItem(<Link to='/'>خانه</Link>, '1', <HomeOutlined/>),
    getItem(<Link target={"_blank"} style={context.permission !== 'مدیر' ? {pointerEvents:'none'} : {}} to='https://api.oghab-asaluyeh.ir/admin/'>پنل مدیریت</Link>, '2', <PieChartOutlined/> ,  undefined , context.permission !== 'مدیر'),

    getItem(<Link target={"_blank"} style={context.permission !== 'مدیر' ? {pointerEvents:'none'} : {}} to='http://www.oghab-asaluyeh.ir:2082/cpsess6008508683/frontend/
  jupiter/backup/wizard-backup-type.html?login=1&post_login=3837540636687'>بکاپ</Link>
        , '3', <CloudSyncOutlined/> ,  undefined , context.permission !== 'مدیر'),

    getItem('مدیریت قراردادها', 'sub1', <SolutionOutlined/>, [

        getItem(<Link to='../contract'>قراردادها</Link>, 'sub2', null, [
            getItem(<Link to='../contract/register'>ثبت</Link>, '4'),
            getItem(<Link to='../contract/report'>گزارش</Link>, '5'),
            getItem(<Link to='../contract/upload'>باگذاری</Link>, '6'),
        ]),

        getItem(<Link to='../personal'>مدارک اشخاص</Link>, 'sub3', null, [
            getItem(<Link to='../personal/register'>ثبت</Link>, '7'),
            getItem(<Link to='../personal/report'>گزارش</Link>, '8'),
            getItem(<Link to='../personal/upload'>باگذاری</Link>, '9'),
        ]),
    ], !(context.permission === 'مدیر' || context.permission === 'اداری' || context.permission === 'مدیر اداری' || context.permission === 'مشاهده')),

    getItem('مدیریت اسناد', 'sub4', <FileOutlined/>, [
        getItem(<Link to='../document/register'>ثبت اسناد اموال</Link>, '10'),
        getItem(<Link to='../document/report'>گزارش اسناد</Link>, '11'),
        getItem(<Link to='../document/upload'>باگذاری اسناد</Link>, '12')
    ],!(context.permission === 'مدیر' || context.permission === 'اداری' || context.permission === 'مدیر اداری' || context.permission === 'مشاهده')),

    getItem('انبارداری', 'sub5', <BarChartOutlined/>, [
        getItem(<Link to='../warhouse/product'>انبار</Link>, 'sub6', null, [
            getItem(<Link to='../warhouse/product/register'>ثبت</Link>, '13'),
            getItem(<Link to='../warhouse/product/report'>گزارش</Link>, '14'),
            getItem(<Link to='../warhouse/product/upload'>بارگزاری مدارک</Link>, '15'),
        ]),
        getItem(<Link to='../warhouse/property'>اموال</Link>, 'sub7', null, [
            getItem(<Link to='../warhouse/property/register'>ثبت</Link>, '16'),
            getItem(<Link to='../warhouse/property/report'>گزارش</Link>, '17'),
            getItem(<Link to='../warhouse/property/sent'>ارسالی</Link>, '18'),
            getItem(<Link to='../warhouse/property/recycle'>بایگانی</Link>, '19'),
        ]),
        getItem(<Link to='../warhouse/handling'>انبارگردانی</Link>, '20')
    ] , !(context.permission === 'مدیر' || context.permission === 'انباردار')),
    getItem(<Link to='../logout'>خروج</Link>, '21', <PoweroffOutlined/>,undefined,undefined,true),
];


    return (
        <Layout >
              <Sider breakpoint="xl" collapsedWidth="0">
                <div className='flex flex-col items-center m-5'>
                    <Avatar className='bg-sky-500' size={100} icon={<UserOutlined />} />
                    <p className='text-gray-50'>{context.fullName}</p>
                    <p className='text-gray-50'>{context.office}</p>
                </div>
                <Menu
                    theme="dark"
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    items={items}
                    openKeys={openKeys}
                    onOpenChange={onOpenChange}
                />
            </Sider>
            <Layout>
                <Content className='me-8 p-2 h-[100vh]' style={{overflow: 'initial'}}>
                    <div className='bg-white rounded' style={{padding: 24}}>
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
                            <Route path={`/personal/edit/${context.currentPersonal}`} element={<Edit/>}/>
                            <Route path={'/personal/report'} element={<MainPersonal/>}/>
                            <Route path={'/personal/upload'} element={<UploadPersonal/>}/>
                            <Route path={'/warhouse/product'} element={<MainProduct/>}/>
                            <Route path={`/warhouse/product/edit/${context.currentProduct}`} element={<Card/>}/>
                            <Route path={`/warhouse/product/editDoc/${context.currentProductDoc}/${context.currentProductDoc === 'فاکتور' ? context.currentProductFactor : context.currentProductCheck }`} element={<EditDoc/>}/>
                            <Route path={`/warhouse/product/factor/${context.currentProductFactor}`}
                                   element={<ProductFactor/>}/>
                            <Route path={`/warhouse/product/check/${context.currentProductCheck}`}
                                   element={<ProductCheck/>}/>
                            <Route path={'/warhouse/product/register'} element={<RegisterProduct/>}/>
                            <Route path={'/warhouse/product/upload'} element={<UploadProductDocs/>}/>
                            <Route path={'/warhouse/product/report'} element={<ReportProduct/>}/>
                            <Route path={'/warhouse/property'} element={<MainProperty/>}/>
                            <Route path={'/warhouse/property/register'} element={<RegisterProperty/>}/>
                            <Route path={'/warhouse/property/report'} element={<ReportProperty/>}/>
                            <Route path={'/warhouse/property/sent'} element={<SentProperty/>}/>
                            <Route path={'/warhouse/property/recycle'} element={<RecycleProperty/>}/>
                            <Route path={'/warhouse/handling'} element={<Handling/>}/>
                            <Route path={'/'} element={<Home/>}/>
                            <Route path={'/logout'} element={<Logout/>}/>
                            <Route path={'/no_access'} element={<NoAccess/>}/>
                            <Route path="*" element={<PageNotFound/>}/>
                        </Routes>
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>تمامی حقوق برای شرکت digitkey می باشد.</Footer>
            </Layout>
        </Layout>
    );
};

export default LayoutForm;