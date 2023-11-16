import React, {useContext, useEffect, useState} from 'react';
import {Button, message, Popconfirm, Space, Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import axios from "axios";
import Url from "../../../api-configue";
import {useNavigate} from "react-router-dom";
import {Context} from "../../../../context";
import { QuestionCircleOutlined } from '@ant-design/icons';

interface DataType {
    key: string;
    code: number;
    name: string;
    category: string;
    dst_inventory: string;
    inventory: string;
    movement_status: string;
    movement_description: string;
    movement_message: string;
}



const SentProperty: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [property, setProperty] = useState<any>()
    const context = useContext(Context)
    const [autoIncrement, setAutoIncrement] = useState<any[]>([])

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
            title: 'دسته',
            align: "center",
            dataIndex: 'category',
            key: 'category',
        }, {
            title: 'کد اموال',
            align: "center",
            dataIndex: 'code',
            key: 'code',
        }, {
            title: 'نام اموال',
            align: "center",
            dataIndex: 'name',
            key: 'name',
        }, {
            title: 'مبدا',
            align: "center",
            dataIndex: 'inventory',
            key: 'inventory',
        }, {
            title: 'مقصد',
            align: "center",
            dataIndex: 'dst_inventory',
            key: 'dst_inventory',
        }, {
            title: 'شرح',
            align: "center",
            dataIndex: 'movement_description',
            key: 'movement_description',
        }, {
            title: 'عملیات',
            align: "center",
            render: (_value, record) => {
                return (
                    <Space>
                        <Popconfirm
                            title="رد کردن اموال"
                            description="آیا از رد کردن اموال و برگشت مطمئنید ؟"
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            onConfirm={async () => {
                                await axios.put(`${Url}/api/property/${record.code}/`, {
                                    code: record.code,
                                    movement_status: 'رد شد',
                                    dst_inventory: '',
                                    movement_description: '',
                                }, {
                                    headers: {
                                        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                                    }
                                }).then(response => {
                                    return response
                                }).then(async data => {
                                    if (data.status === 200) {
                                        message.error('رد شد');
                                        navigate('/warhouse/property/report')
                                        await fetchData()
                                    }
                                })
                            }}
                            okText="بله"
                            cancelText="خیر"
                         >
                            <Button htmlType={"button"} danger type={"primary"}>رد</Button>
                        </Popconfirm>
                          <Popconfirm
                            title="دریافت اموال"
                            description="آیا از صحت اطلاعات و دریافت اموال مطمئنید ؟"
                            onConfirm={async () => {
                                await axios.put(`${Url}/api/property/${record.code}/`, {
                                    code: record.code,
                                    movement_description: '',
                                    dst_inventory: '',
                                    movement_status: 'ارسال شده',
                                    movement_message: `ارسال شده به ${context.office} `
                                }, {
                                    headers: {
                                        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                                    }
                                }).then(response => {
                                    return response
                                }).then(() => {
                                    record.movement_message = `دریافت شده از انبار ${record.inventory} با کد ${record.code}`
                                }).then(() => {
                                    record.code = autoIncrement.filter(value => value.name === record.category)[0].increment
                                    record.inventory = context.office
                                    record.movement_status = ''
                                    record.dst_inventory = ''
                                    record.movement_description = ''
                                }).then(async () => {
                                        await axios.post(`${Url}/api/property/`, record , {
                                            headers: {
                                                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                                            }
                                        }).then(response => {
                                            return response
                                        }).then(async data => {
                                            if (data.status === 201) {
                                                message.success('دریافت شد');
                                                navigate('/warhouse/property/report')
                                                await fetchData()
                                            }
                                        })
                                    }
                                ).then(async () => {
                                    await axios.put(`${Url}/api/autoincrement_property/${autoIncrement.filter(value => value.name === record.category)[0].id}/`, {
                                        increment: autoIncrement.filter(value => value.name === record.category)[0].increment + 1
                                    }, {
                                        headers: {
                                            'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                                        }
                                    }).then(response => {
                                        return response
                                    }).then(async data => {
                                        if (data.status === 200) {
                                            message.success('کد کالا بروز شد');
                                            await fetchData()
                                        }
                                    })
                                })
                            }}
                          >
                           <Button htmlType={"button"} type={"primary"}>تایید</Button>
                      </Popconfirm>
                    </Space>
                )
            }
        }
    ];

    const fetchData = async () => {
        await axios.get(
            `${Url}/api/property/?movement_status=در انتظار تایید&dst_inventory=${context.office}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            }).then(response => {
            return response
        }).then(async data => {
            setProperty(data.data)
        }).finally(() => {
            setLoading(false)
        }).then(async () => {
            await axios.get(`${Url}/api/autoincrement_property/?inventory=${context.office}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }

            }).then(response => {
                return response
            }).then(async data => {
                setAutoIncrement(data.data)
            })
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
            <Table
                loading={loading}
                columns={columns}
                rowKey="code"
                pagination={{position: ["bottomCenter"]}}
                dataSource={property}/>
        </>

    )
}


export default SentProperty;

