import {Tabs} from "antd";
import InputForm from "./input";
import OutputForm from "./output";
import SendForm from "./send";

export default function RegisterProduct() {
  const items = [
      {
          label: `ثبت اولیه / ورود`,
          key: '1',
          children: <InputForm/>,
      },{
          label: `خروج`,
          key: '2',
          children: <OutputForm/>,
      },{
          label: `انتقال`,
          key: '3',
          children: <SendForm/>,
      },{
          label: `دریافت`,
          key: '4',
          children: `Content of Tab Pane 2`,
      }
  ];
  return (
         <Tabs
          defaultActiveKey="1"
          centered
          type="card"
          items={items}
        />
  )
}
