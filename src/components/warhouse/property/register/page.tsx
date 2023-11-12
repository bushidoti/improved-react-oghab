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

const items: MenuProps['items'] = [
  {
    label: 'تجهیزات',
    key: 'equipment',
    icon: <HomeRepairServiceIcon />,
    children: [
         {
            label: 'تجهیزات فرودگاهی',
            key: '1',
            icon: <AirplaneTicketIcon />,
          },
          {
            label: 'تجهیزات ایمنی',
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
            label: 'خودرو اداری',
            key: '3',
            icon: <DirectionsCarFilledIcon />,
          },
          {
            label: 'خودرو فرودگاهی',
            key: '4',
            icon: <DirectionsBusFilledIcon />,
          },
          {
            label: 'هواپیما',
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
            label: 'اثاثه الکترونیکی',
            key: '6',
            icon: <ElectricBoltIcon />,
         },
         {
            label: 'اثاثه اداری',
            key: '7',
            icon: <LocalPrintshopIcon />,
         },
         {
            label: 'اثاثه تاسیساتی',
            key: '8',
            icon: <HeatPumpIcon />,
         },
         {
            label: 'اثاثه فرودگاهی',
            key: '9',
            icon: <LivingIcon />,
         },
         {
            label: 'اثاثه دیجیتال',
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
            label: 'ابزار آلات غیر صنعتی',
            key: '11',
            icon: <ConstructionIcon />,
          },
          {
            label: 'ابزار آلات صنعتی',
            key: '12',
            icon: <EngineeringIcon />,
          },
          {
            label: 'امتیازات',
            key: '13',
            icon: <CellWifiIcon />,
          },
          {
            label: 'اقلام پشتیبانی',
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