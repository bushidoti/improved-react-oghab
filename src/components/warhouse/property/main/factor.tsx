import React, {useContext, useEffect, useRef, useState} from 'react';
import {Button, ConfigProvider, Image, Space, Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import axios from "axios";
import Url from "../../../api-configue";
import {useNavigate} from "react-router-dom";
import {Context} from "../../../../context";
import TableFactorPrint from "./table_factor";
import {useReactToPrint} from "react-to-print";

interface DataType {
    key: string;
    name: string;
    scale: string;
    date: string;
    category: string;
    receiver: string;
    seller: string;
    buyer: string;
    product: number;
    input: number;
}

const columns: ColumnsType<DataType> = [
    {
        align: "center",
        title: 'ردیف',
        dataIndex: 'index',
        fixed: "left",
        width: '4.88%',
        key: 'index',
        render: (_value, _record, index) => index + 1,
    }, {
        title: 'کد کالا',
        align: "center",
        dataIndex: 'product',
        key: 'product',
    }, {
        title: 'نام کالا',
        align: "center",
        dataIndex: 'name',
        key: 'name',
    }, {
        title: 'تعداد',
        align: "center",
        dataIndex: 'input',
        key: 'input',
    }, {
        title: 'مقیاس',
        align: "center",
        dataIndex: 'scale',
        key: 'scale',
    }, {
        title: 'گروه',
        align: "center",
        dataIndex: 'category',
        key: 'category',
    }, {
        title: 'تاریخ',
        align: "center",
        dataIndex: 'date',
        key: 'date',
    }, {
        title: 'گیرنده',
        align: "center",
        dataIndex: 'receiver',
        key: 'receiver',
    }, {
        title: 'خریدار',
        align: "center",
        dataIndex: 'buyer',
        key: 'buyer',
    }, {
        title: 'فروشنده',
        align: "center",
        dataIndex: 'seller',
        key: 'seller',
    }
];


interface Factor {
    code: number;
    factor: string;
    inventory: string;
    jsonData: any[];
}

const PropertyFactor: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [Factor, setFactor] = useState<Factor>()
    const context = useContext(Context)
    const [visible, setVisible] = useState(false);
    const componentPDF = useRef(null);
    const generatePDF = useReactToPrint({
        content: () => componentPDF.current,
        documentTitle: "فاکتور",
    });

    const fetchData = async () => {
        await axios.get(
            `${Url}/api/factor_property/${context.currentPropertyFactor}/`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            }).then(response => {
            return response
        }).then(async data => {
            setFactor(data.data)
        }).finally(() => {
            setLoading(false)
        }).catch((error) => {
            if (error.request.status === 403) {
                navigate('/no_access')
            }
        })
    }

    useEffect(() => {
            void fetchData()
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [])

    return (
        <>
            <Space.Compact style={{marginBottom: 16}}>
                <ConfigProvider theme={{
                    components: {
                        Button: {
                            groupBorderColor: '#faad14',
                        }
                    }, token: {
                        colorPrimary: '#faad14',
                    }
                }}>
                    <Button type={"primary"} loading={loading} onClick={() => setVisible(true)}>مشاهده</Button>
                </ConfigProvider>
                <Button type={"primary"} htmlType={"button"} onClick={() => {

                    fetch(Factor?.factor as string).then(response => {
                        response.blob().then(() => {
                            let alink = document.createElement('a');
                            alink.href = Factor?.factor as string;
                            alink.download = `${Factor?.code}.jpg`
                            alink.click();
                        })
                    })
                }} loading={loading}>دانلود</Button>
                <Button onClick={generatePDF}>چاپ</Button>

            </Space.Compact>

            <Image
                width={200}
                style={{display: 'none'}}
                src="error"
                fallback="data:image/png;base64,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"
                preview={{
                    visible,
                    src: Factor?.factor,
                    onVisibleChange: (value) => {
                        setVisible(value);
                    },
                }}
            />
            <Table
                loading={loading}
                columns={columns}
                rowKey="product"
                pagination={{position: ["bottomCenter"]}}
                dataSource={Factor?.jsonData}/>
            {Factor !== undefined ?
                <TableFactorPrint componentPDF={componentPDF} Factor={Factor}/>
                :
                null
            }
        </>

    )
}


export default PropertyFactor;

