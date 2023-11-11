import {Tabs} from "antd";
import MainImmovable from "./page_immovable";
import MainMovable from "./page_movable";

export default function MainDocument() {
    const items = [
        {
            label: `منقول`,
            key: '1',
            children: <MainMovable/>,
        }, {
            label: `غیر منقول`,
            key: '2',
            children: <MainImmovable/>,
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
