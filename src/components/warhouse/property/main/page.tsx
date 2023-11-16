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
import SafetyEquipmentTable from "./tables/table_safety_equipment.";
import AirportEquipmentTable from "./tables/table_airport_equipment";
import VehicleTable from "./tables/vehicle_table";
import ElectronicFurnitureTable from "./tables/table_electronic";
import OfficeFurnitureTable from "./tables/table_office";
import FacilityFurnitureTable from "./tables/table_facility";
import AirportFurnitureTable from "./tables/table_airport";
import DigitalFurnitureTable from "./tables/table_digital";
import NoneIndustrialTable from "./tables/table_none_industrial";
import IndustrialTable from "./tables/table_industrial";
import BenefitTable from "./tables/table_benefit";
import SupportItemTable from "./tables/table_support";


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
    context.setCurrentPropertyTable(e.key);
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
            <Menu onClick={onClick} selectedKeys={[context.currentPropertyTable]} mode="horizontal" items={items} />
                <>
                    {(() => {
                        if (context.currentPropertyTable === 'تجهیزات ایمنی'){
                            return <SafetyEquipmentTable/>
                        } else if (context.currentPropertyTable === 'تجهیزات فرودگاهی'){
                            return <AirportEquipmentTable/>
                        } else  if (context.currentPropertyTable === 'خودرو اداری' ||
                            context.currentPropertyTable === 'خودرو فرودگاهی' || context.currentPropertyTable === 'هواپیما' ){
                            return <VehicleTable/>
                        } else if (context.currentPropertyTable === 'اثاثه الکترونیکی'){
                            return <ElectronicFurnitureTable/>
                        } else if (context.currentPropertyTable === 'اثاثه اداری'){
                            return <OfficeFurnitureTable/>
                        } else if (context.currentPropertyTable === 'اثاثه تاسیساتی'){
                            return <FacilityFurnitureTable/>
                        } else if (context.currentPropertyTable === 'اثاثه فرودگاهی'){
                            return <AirportFurnitureTable/>
                        } else if (context.currentPropertyTable === 'اثاثه دیجیتالی'){
                            return <DigitalFurnitureTable/>
                        } else if (context.currentPropertyTable === 'ابزار آلات غیر صنعتی'){
                            return <NoneIndustrialTable/>
                        } else if (context.currentPropertyTable === 'ابزار آلات صنعتی'){
                            return <IndustrialTable/>
                        } else if (context.currentPropertyTable === 'اقلام پشتیبانی'){
                            return <SupportItemTable/>
                        } else if (context.currentPropertyTable === 'امتیازات'){
                            return <BenefitTable/>
                        }
                    })()}
                </>
        </ConfigProvider>
  );
};




export default MainProperty