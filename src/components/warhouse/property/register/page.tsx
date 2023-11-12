import React, { useState } from 'react';
import type { MenuProps } from 'antd';
import {ConfigProvider, Menu} from 'antd';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import DirectionsBusFilledIcon from '@mui/icons-material/DirectionsBusFilled';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import HeatPumpIcon from '@mui/icons-material/HeatPump';
import DevicesIcon from '@mui/icons-material/Devices';
import LivingIcon from '@mui/icons-material/Living';
import ConstructionIcon from '@mui/icons-material/Construction';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import EngineeringIcon from '@mui/icons-material/Engineering';
import CellWifiIcon from '@mui/icons-material/CellWifi';
import {Link} from "react-router-dom";

const items: MenuProps['items'] = [
  {
    label: 'تجهیزات',
    key: 'equipment',
    icon: <HomeRepairServiceIcon />,
    children: [
         {
            label: <Link to='../warhouse/property/register/airport_equipment'>تجهیزات فرودگاهی</Link>,
            key: '1',
            icon: <AirplaneTicketIcon />,
          },
          {
            label:  <Link to='../warhouse/property/register/safety_equipment'>تجهیزات ایمنی</Link>,
            key: '2',
            icon: <HealthAndSafetyIcon />,
          }
    ],
  },
  {
    label: 'وسایل نقلیه',
    key: 'vehicle',
    icon: <DirectionsCarIcon />,
    children: [
         {
            label: <Link to='../warhouse/property/register/personal_vehicle'>خودرو اداری</Link>,
            key: '3',
            icon: <DirectionsCarFilledIcon />,
          },
          {
            label: <Link to='../warhouse/property/register/airport_vehicle'>خودرو فرودگاهی</Link>,
            key: '4',
            icon: <DirectionsBusFilledIcon />,
          },
          {
            label: <Link to='../warhouse/property/register/airplane'>هواپیما</Link>,
            key: '5',
            icon: <AirplanemodeActiveIcon />,
          }
    ],
  },
  {
    label: 'اثاث',
    key: 'furniture',
    icon: <EventSeatIcon />,
    children: [
         {
            label: <Link to='../warhouse/property/register/electronic_furniture'>اثاثه الکترونیکی</Link>,
            key: '6',
            icon: <ElectricBoltIcon />,
         },
         {
            label: <Link to='../warhouse/property/register/office_furniture'>اثاثه اداری</Link>,
            key: '7',
            icon: <LocalPrintshopIcon />,
         },
         {
            label: <Link to='../warhouse/property/register/facility_furniture'>اثاثه تاسیساتی</Link>,
            key: '8',
            icon: <HeatPumpIcon />,
         },
         {
            label: <Link to='../warhouse/property/register/airport_furniture'>اثاثه فرودگاهی</Link>,
            key: '9',
            icon: <LivingIcon />,
         },
         {
            label: <Link to='../warhouse/property/register/digital_furniture'>اثاثه دیجیتالی</Link>,
            key: '10',
            icon: <DevicesIcon />,
         }
    ],
  },
  {
    label: 'اموال منقول',
    key: 'movable',
    icon: <DevicesOtherIcon />,
    children: [
         {
            label: <Link to='../warhouse/property/register/none_industrial_equipment'>ابزار آلات غیر صنعتی</Link>,
            key: '11',
            icon: <ConstructionIcon />,
          },
          {
            label: <Link to='../warhouse/property/register/industrial_equipment'>ابزار آلات صنعتی</Link>,
            key: '12',
            icon: <EngineeringIcon />,
          },
          {
            label: <Link to='../warhouse/property/register/benefit'>امتیازات</Link>,
            key: '13',
            icon: <CellWifiIcon />,
          },
          {
            label: <Link to='../warhouse/property/register/support'>اقلام پشتیبانی</Link>,
            key: '14',
            icon: <EmojiFoodBeverageIcon />,
          }
    ],
  },
];

const RegisterProperty: React.FC = () => {
  const [current, setCurrent] = useState('mail');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return (
        <ConfigProvider theme={{
            components: {
                Menu: {
                    colorBgContainer: 'rgba(105,177,255,0.07)',
                    darkItemBg: '#00022b',
                    darkItemColor: '#69b1ff',
                    subMenuItemBg:'#69b1ff',
                    iconSize:20,
                    itemMarginBlock:8,
                    darkItemSelectedBg: '#0855b1',
                    darkSubMenuItemBg: '#010e54',
                    darkItemHoverBg	: '#daeaf7',
                    darkItemHoverColor	: '#00022b',
                }
            }
        }}>
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
        </ConfigProvider>
  );
};

export default RegisterProperty;