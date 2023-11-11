import {Tabs} from "antd";
import Immovable from "./immovable";
import Movable from "./movable";


export default function RegisterDocument() {
    const items = [
        {
            label: `منقول`,
            key: '1',
            children: <Movable/>,
        }, {
            label: `غیر منقول`,
            key: '2',
            children: <Immovable/>,
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
