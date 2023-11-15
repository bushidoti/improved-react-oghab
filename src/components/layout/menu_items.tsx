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
            getItem(<Link to='../warhouse/property/upload'>بارگذاری فاکتور</Link>, '20'),
        ]),
        getItem(<Link to='../warhouse/handling'>انبارگردانی</Link>, '21')
    ] , !(context.permission === 'مدیر' || context.permission === 'انباردار')),
    getItem(<Link to='../logout'>خروج</Link>, '22', <PoweroffOutlined/>,undefined,undefined,true),
];
    return (
         <Menu
                theme="dark"
                defaultSelectedKeys={['1']}
                mode="inline"
                items={items}
                openKeys={openKeys}
                onOpenChange={onOpenChange}
            />
    )
}