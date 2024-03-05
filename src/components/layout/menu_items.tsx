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
    getItem(<Link target={"_blank"} style={context.permission !== 'مدیر' ? {pointerEvents:'none'} : {}} to='https://api.oghab-asaluyeh.ir/admin/'>پنل مدیریت</Link>, '2', <PieChartOutlined/> ,  undefined , context.permission !== 'مدیر'),

    getItem(<Link target={"_blank"} style={context.permission !== 'مدیر' ? {pointerEvents:'none'} : {}} to='http://www.oghab-asaluyeh.ir:2082/cpsess6008508683/frontend/
  jupiter/backup/wizard-backup-type.html?login=1&post_login=3837540636687'>بکاپ</Link>
        , '3', <CloudSyncOutlined/> ,  undefined , context.permission !== 'مدیر'),

    getItem('مدیریت قراردادها', 'sub1', <SolutionOutlined/>, [

        getItem(<Link to='../contract'>قراردادها</Link>, '/contract', null, [
            getItem(<Link to='../contract/register'>ثبت</Link>, '/contract/register'),
            getItem(<Link to='../contract/report'>گزارش</Link>, '/contract/report'),
            getItem(<Link to='../contract/upload'>بارگذاری</Link>, '/contract/upload'),
        ]),

        getItem(<Link to='../personal'>مدارک اشخاص</Link>, '/personal', null, [
            getItem(<Link to='../personal/register'>ثبت</Link>, '/personal/register'),
            getItem(<Link to='../personal/report'>گزارش</Link>, '/personal/report'),
            getItem(<Link to='../personal/upload'>بارگذاری</Link>, '/personal/upload'),
        ]),
    ], !(context.permission === 'مدیر' || context.permission === 'اداری' || context.permission === 'مدیر اداری' || context.permission === 'مشاهده')),

    getItem('مدیریت اسناد', 'sub4', <FileOutlined/>, [
        getItem(<Link to='../document/register'>ثبت اسناد اموال</Link>, '/document/register'),
        getItem(<Link to='../document/report'>گزارش اسناد</Link>, '/document/report'),
        getItem(<Link to='../document/upload'>بارگذاری اسناد</Link>, '/document/upload')
    ],!(context.permission === 'مدیر' || context.permission === 'اداری' || context.permission === 'مدیر اداری' || context.permission === 'مشاهده')),

    getItem('انبارداری', 'sub5', <BarChartOutlined/>, [
        getItem(<Link to='../warhouse/product'>انبار</Link>, '/warhouse/product', null, [
            getItem(<Link to='../warhouse/product/register'>ثبت</Link>, '/warhouse/product/register'),
            getItem(<Link to='../warhouse/product/report'>گزارش</Link>, '/warhouse/product/report'),
            getItem(<Link to='../warhouse/product/upload'>بارگذاری مدارک</Link>, '/warhouse/product/upload'),
        ]),
        getItem(<Link to='../warhouse/property'>اموال</Link>, '/warhouse/property', null, [
            getItem(<Link to='../warhouse/property/register'>ثبت</Link>, '/warhouse/property/register'),
            getItem(<Link to='../warhouse/property/report'>گزارش</Link>, '/warhouse/property/report'),
            getItem(<Link to='../warhouse/property/sent'>ارسالی</Link>, '/warhouse/property/sent'),
            getItem(<Link to='../warhouse/property/upload'>بارگذاری فاکتور</Link>, '/warhouse/property/upload'),
        ]),
        getItem(<Link to='../warhouse/handling'>انبارگردانی</Link>, '/warhouse/handling')
    ] , !(context.permission === 'مدیر' || context.permission === 'انباردار')),
    getItem(<a href='https://www.oghab-asaluyeh.ir/scanner.zip'>دانلود اسکنر</a>, '21', <DownloadOutlined/>,undefined,undefined),
    getItem(<Link to='../logout'>خروج</Link>, '22', <PoweroffOutlined/>,undefined,undefined,true),
];
    return (
         <Menu
            theme="dark"
            defaultSelectedKeys={[window.location.pathname]}
            mode="inline"
            items={items}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
         />
    )
}