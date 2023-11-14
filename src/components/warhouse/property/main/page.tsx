import React, {useContext} from 'react';
import type { MenuProps } from 'antd';
import {ConfigProvider,Menu} from 'antd';
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
import {Context} from "../../../../context";


const items: MenuProps['items'] = [
  {
    label: 'تجهیزات',
    key: 'equipment',
    icon: <HomeRepairServiceIcon />,
    children: [
         {
            label: 'تجهیزات فرودگاهی',
            key: 'تجهیزات فرودگاهی',
            icon: <AirplaneTicketIcon />,
          },
          {
            label:  'تجهیزات ایمنی',
            key: 'تجهیزات ایمنی',
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
            key: 'خودرو اداری',
            icon: <DirectionsCarFilledIcon />,
          },
          {
            label: 'خودرو فرودگاهی',
            key: 'خودرو فرودگاهی',
            icon: <DirectionsBusFilledIcon />,
          },
          {
            label: 'هواپیما',
            key: 'هواپیما',
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
            key: 'اثاثه الکترونیکی',
            icon: <ElectricBoltIcon />,
         },
         {
            label: 'اثاثه اداری',
            key: 'اثاثه اداری',
            icon: <LocalPrintshopIcon />,
         },
         {
            label: 'اثاثه تاسیساتی',
            key: 'اثاثه تاسیساتی',
            icon: <HeatPumpIcon />,
         },
         {
            label: 'اثاثه فرودگاهی',
            key: 'اثاثه فرودگاهی',
            icon: <LivingIcon />,
         },
         {
            label: 'اثاثه دیجیتالی',
            key: 'اثاثه دیجیتالی',
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
            key: 'ابزار آلات غیر صنعتی',
            icon: <ConstructionIcon />,
          },
          {
            label: 'ابزار آلات صنعتی',
            key: 'ابزار آلات صنعتی',
            icon: <EngineeringIcon />,
          },
          {
            label: 'امتیازات',
            key: 'امتیازات',
            icon: <CellWifiIcon />,
          },
          {
            label: 'اقلام پشتیبانی',
            key: 'اقلام پشتیبانی',
            icon: <EmojiFoodBeverageIcon />,
          }
    ],
  },
];

const MainProperty: React.FC = () => {
  const context = useContext(Context)

  const onClick: MenuProps['onClick'] = (e) => {
    context.setCurrentPropertyForm(e.key);
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
            <Menu onClick={onClick} selectedKeys={[context.currentPropertyForm]} mode="horizontal" items={items} />
                <>
                    {(() => {
                        if (context.currentPropertyForm === 'تجهیزات ایمنی'){
                            return ''
                        } else if (context.currentPropertyForm === 'تجهیزات فرودگاهی'){
                            return ''
                        } else  if (context.currentPropertyForm === 'خودرو اداری' ||
                            context.currentPropertyForm === 'خودرو فرودگاهی' || context.currentPropertyForm === 'هواپیما' ){
                            return ''
                        } else if (context.currentPropertyForm === 'اثاثه الکترونیکی'){
                            return ''
                        } else if (context.currentPropertyForm === 'اثاثه اداری'){
                            return ''
                        } else if (context.currentPropertyForm === 'اثاثه تاسیساتی'){
                            return ''
                        } else if (context.currentPropertyForm === 'اثاثه فرودگاهی'){
                            return ''
                        } else if (context.currentPropertyForm === 'اثاثه دیجیتالی'){
                            return ''
                        } else if (context.currentPropertyForm === 'ابزار آلات غیر صنعتی'){
                            return ''
                        } else if (context.currentPropertyForm === 'ابزار آلات صنعتی'){
                            return ''
                        } else if (context.currentPropertyForm === 'اقلام پشتیبانی'){
                            return ''
                        } else if (context.currentPropertyForm === 'امتیازات'){
                            return ''
                        }
                    })()}
                </>
        </ConfigProvider>
  );
};




export default MainProperty