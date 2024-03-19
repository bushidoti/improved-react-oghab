import {Link} from "react-router-dom";
import {Menu, MenuProps} from "antd";
import {
    BarChartOutlined,
    CloudSyncOutlined, FileOutlined,
    HomeOutlined,
    PieChartOutlined,
    PoweroffOutlined, SolutionOutlined,
} from '@ant-design/icons';
import React, {useContext, useState} from "react";
import {Context} from "../../context";
import {DownloadOutlined} from "@mui/icons-material";

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


export const MenuLayout = () => {
  const context = useContext(Context)
  const [openKeys, setOpenKeys] = useState(['']);

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
          setOpenKeys(keys);
        } else {
          setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
      };

  const items: MenuItem[] = [
    getItem(<Link to='/'>خانه</Link>, '/', <HomeOutlined/>),
    getItem('مدیریت قراردادها', 'sub1', <SolutionOutlined/>, [

        getItem(<Link to='../contract'>قراردادها</Link>, '/contract', null, [
            getItem(<Link to='../contract/register' style={!['Can add document'].some((element: any) => context.permissionD.includes(element)) ? {pointerEvents:'none'} : {}}>ثبت</Link>, '/contract/register',undefined,undefined,!['Can add document'].some((element: any) => context.permissionD.includes(element))),
            getItem(<Link to='../contract/report'>گزارش</Link>, '/contract/report'),
            getItem(<Link to='../contract/upload' style={!['Can change document'].some((element: any) => context.permissionD.includes(element)) ? {pointerEvents:'none'} : {}}>بارگذاری قرارداد</Link>, '/contract/upload',undefined,undefined,!['Can change document'].some((element: any) => context.permissionD.includes(element))),
        ]),

        getItem(<Link to='../personal'>مدارک اشخاص</Link>, '/personal', null, [
            getItem(<Link to='../personal/register' style={!['Can add person'].some((element: any) => context.permissionD.includes(element)) ? {pointerEvents:'none'} : {}}>ثبت</Link>, '/personal/register',undefined,undefined,!['Can add person'].some((element: any) => context.permissionD.includes(element))),
            getItem(<Link to='../personal/report'>گزارش</Link>, '/personal/report'),
            getItem(<Link to='../personal/upload' style={!['Can change person'].some((element: any) => context.permissionD.includes(element)) ? {pointerEvents:'none'} : {}}>بارگذاری مدارک</Link>, '/personal/upload',undefined,undefined,!['Can change person'].some((element: any) => context.permissionD.includes(element))),
        ]),
    ], !['Can view document', 'Can view person'].some((element: any) => context.permissionD.includes(element))),

    getItem('مدیریت اسناد', 'sub4', <FileOutlined/>, [
        getItem(<Link to='../document/register' style={!['Can add immovable', 'Can add movable'].some((element: any) => context.permissionD.includes(element)) ? {pointerEvents:'none'} : {}}>ثبت اسناد اموال</Link>, '/document/register',undefined
        ,undefined,!['Can add immovable', 'Can add movable'].some((element: any) => context.permissionD.includes(element))),
        getItem(<Link to='../document/report'>گزارش اسناد</Link>, '/document/report'),
        getItem(<Link to='../document/upload' style={!['Can change immovable', 'Can change movable'].some((element: any) => context.permissionD.includes(element)) ? {pointerEvents:'none'} : {}}>بارگذاری اسناد</Link>, '/document/upload',undefined,undefined,!['Can change immovable', 'Can change movable'].some((element: any) => context.permissionD.includes(element)))
    ],!['Can view immovable', 'Can view movable'].some((element: any) => context.permissionD.includes(element))),

    getItem('انبارداری', 'sub5', <BarChartOutlined/>, [
        getItem(<Link to='../warhouse/product'>انبار</Link>, '/warhouse/product', null, [
            getItem(<Link to='../warhouse/product/register' style={!['Can add product'].some((element: any) => context.permissionD.includes(element)) ? {pointerEvents:'none'} : {}}>ثبت</Link>, '/warhouse/product/register' ,undefined,undefined,!['Can add product'].some((element: any) => context.permissionD.includes(element))),
            getItem(<Link to='../warhouse/product/report'>گزارش</Link>, '/warhouse/product/report'),
            getItem(<Link to='../warhouse/product/upload' style={!['Can change product'].some((element: any) => context.permissionD.includes(element)) ? {pointerEvents:'none'} : {}}>بارگذاری مدارک</Link>, '/warhouse/product/upload',undefined,undefined,!['Can change product'].some((element: any) => context.permissionD.includes(element))),
        ]),
        getItem(<Link to='../warhouse/property'>اموال</Link>, '/warhouse/property', null, [
            getItem(<Link to='../warhouse/property/register' style={!['Can add property'].some((element: any) => context.permissionD.includes(element)) ? {pointerEvents:'none'} : {}}>ثبت</Link>, '/warhouse/property/register',undefined,undefined,!['Can add property'].some((element: any) => context.permissionD.includes(element))),
            getItem(<Link to='../warhouse/property/report'>گزارش</Link>, '/warhouse/property/report'),
            getItem(<Link to='../warhouse/property/sent'>ارسالی</Link>, '/warhouse/property/sent'),
            getItem(<Link to='../warhouse/property/upload' style={!['Can change property'].some((element: any) => context.permissionD.includes(element)) ? {pointerEvents:'none'} : {}}>بارگذاری فاکتور</Link>, '/warhouse/property/upload',undefined,undefined,!['Can change property'].some((element: any) => context.permissionD.includes(element))),
        ]),
    ] , !['Can view property', 'Can view product'].some((element: any) => context.permissionD.includes(element))),
     getItem(<Link target={"_blank"} style={context.permission !== 'مدیر' ? {pointerEvents:'none'} : {}} to='https://api.oghab-asaluyeh.ir/admin/'>پنل مدیریت</Link>, '2', <PieChartOutlined/> ,  undefined , context.permission !== 'مدیر'),
    getItem(<Link target={"_blank"} style={context.permission !== 'مدیر' ? {pointerEvents:'none'} : {}} to='http://www.oghab-asaluyeh.ir:2082/cpsess6008508683/frontend/
  jupiter/backup/wizard-backup-type.html?login=1&post_login=3837540636687'>بکاپ</Link>
        , '3', <CloudSyncOutlined/> ,  undefined , context.permission !== 'مدیر'),
    getItem(<a href='https://www.oghab-asaluyeh.ir/scanner.zip'>دانلود اسکنر</a>, '21', <DownloadOutlined/>,undefined,undefined),
    getItem(<Link to='../logout'>خروج</Link>, '22', <PoweroffOutlined/>,undefined,undefined,true),
];
    return (
         <Menu
            theme="dark"
            className='!overflow-auto sm:max-h-[50vh] lg:max-h-[60vh] md:max-h-[55vh] xl:max-h-[100vh] 2xl:max-h-[100vh]'
            defaultSelectedKeys={[window.location.pathname]}
            mode="inline"
            items={items}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
         />
    )
}