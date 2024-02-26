import React, {useContext, useEffect, useState} from 'react';
import {Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import axios from "axios";
import Url from "../../../api-configue";
import {useNavigate} from "react-router-dom";
import {Context} from "../../../../context";

interface DataType {
    key: string;
    name: string;
    category: string;
    property: number;
    factorCode: number;
    description: string;
    code: number;
}



const PropertyRepair: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [Factor, setFactor] = useState<any>()
    const context = useContext(Context)
    const pathProps = window.location.pathname.split("/").slice(-3)[0]
    const columns: ColumnsType<DataType> =
        [
            {
                align: "center",
                title: 'ردیف',
                dataIndex: 'index',
                fixed: "left",
                width: '4.88%',
                key: 'index',
                render: (_value, _record, index) => index + 1,
            }, {
                title: 'کد سیستم فاکتور',
                align: "center",
                dataIndex: 'factorCode',
                key: 'factorCode',
            }, {
                title: 'شناسه فاکتور',
                align: "center",
                dataIndex: 'document_code',
                key: 'document_code',
            }, {
                title: 'نوع تعمیر',
                align: "center",
                dataIndex: 'type',
                key: 'type',
            }, {
                title: 'کیلومتر',
                align: "center",
                dataIndex: 'kilometer',
                key: 'kilometer',
            }, {
                title: 'سال تعویض',
                align: "center",
                dataIndex: 'year_change',
                key: 'year_change',
            }, {
                title: 'شرح',
                align: "center",
                dataIndex: 'description',
                key: 'description',
            }
        ]

    const fetchData = async () => {
        await axios.get(
            `${Url}/api/repaired_property/?property=${context.path}`, {
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

    const options = () => {
        if (pathProps === 'vehicle') return ['index','factorCode','document_code','description','type','kilometer','year_change'];
        else return ['index','factorCode','document_code','description'];

    }

    return (
        <>
            <Table
                loading={loading}
                columns={columns.filter(col => options().includes(col.key as string))}
                rowKey="id"
                pagination={{position: ["bottomCenter"]}}
                dataSource={Factor}/>
        </>

    )
}


export default PropertyRepair;

