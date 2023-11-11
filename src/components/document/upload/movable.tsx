import {Button, ConfigProvider, Form, message, Select, Space} from "antd";
import {useContext, useEffect, useState} from "react";
import Url from "../../api-configue";
import axios from "axios";
import {Context} from "../../../context";
import {useNavigate} from "react-router-dom";

export default function Movable() {
    const [scannedObject, setScannedObject] = useState<object>({})
    const [form] = Form.useForm();
    const [listPersonal, setListPersonal] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const context = useContext(Context)
    const navigate = useNavigate();

    const options = [
        {value: 'فاکتور فروش', label: 'فاکتور فروش'},
        {value: 'بیمه نامه', label: 'بیمه نامه'},
        {value: 'برگ سبز', label: 'برگ سبز'},
        {value: 'کارت سوخت', label: 'کارت سوخت'},
        {value: 'کارت ماشین', label: 'کارت ماشین'},
    ];

    const onValuesChange = (changedValues: any, allValues: any) => {
        if (changedValues.document.type) {
            if (allValues.document.type === 'فاکتور فروش') {
                setScannedObject({
                    saleFactorFile: context.compressed
                })
            } else if (allValues.document.type === 'بیمه نامه') {
                setScannedObject({
                    insurancePaperFile: context.compressed
                })
            } else if (allValues.document.type === 'برگ سبز') {
                setScannedObject({
                    greenCardFile: context.compressed
                })
            } else if (allValues.document.type === 'کارت سوخت') {
                setScannedObject({
                    gasCardFile: context.compressed
                })
            } else if (allValues.document.type === 'کارت ماشین') {
                setScannedObject({
                    carCardFile: context.compressed
                })
            }
        }
    }
    const fetchDataList = async () => {
        await axios.get(`${Url}/api/movable/?fields=id,name,&office=${context.permission === 'مدیر اداری' ? '' : context.office}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        }).then(response => {
            return response
        }).then(async data => {
            setListPersonal(data.data)
        }).catch((error) => {
            if (error.request.status === 403) {
                navigate('/no_access')
            }
        })
    }

    const onFinish = async (values: any) => {
        setLoading(true)
        await axios.put(
            `${Url}/api/movable/${values.document.name}/`, scannedObject, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            }).then(response => {
            return response
        }).then(async data => {
            if (data.status === 200) {
                message.success('ثبت شد');
                setLoading(false)
            }
        }).catch((error) => {
            if (error.request.status === 403) {
                navigate('/no_access')
            } else if (error.request.status === 400) {
                message.error('عدم ثبت');
                setLoading(false)
            }
        })
    };

    useEffect(() => {

            void fetchDataList()
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [])


    function scanImage() {
        if (document.readyState === "complete") {
            window.ws.send("1100");
        }
    }

    return (
        <Form
            style={{margin: 10}}
            form={form}
            autoComplete="off"
            name="document"
            layout="vertical"
            onFinish={onFinish}
            onValuesChange={onValuesChange}
        >

            <Form.Item
                style={{width: 200, marginBottom: 50}}
                name={['document', 'name']}
                rules={[{required: true, message: 'شخص مورد نظر را انتخاب کنید!'}]}
            >
                <Select
                    showSearch
                    style={{width: 300}}
                    placeholder="شخص مورد نظر را انتخاب کنید"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={(listPersonal.map((data) => (
                        {
                            type: 'search',
                            value: data.id,
                            label: data.name,
                        }
                    )))}
                />
            </Form.Item>
            <Space.Compact>
                <ConfigProvider theme={{
                    components: {
                        Button: {
                            groupBorderColor: '#faad14'
                        }
                    }, token: {
                        colorPrimary: '#faad14'
                    }
                }}>
                    <Form.Item>
                        <Button type={"primary"} onClick={scanImage}>اسکن</Button>
                    </Form.Item>
                </ConfigProvider>
                <Form.Item>
                    <Button type={"primary"} htmlType={"submit"} loading={loading} danger={loading}>بارگذاری</Button>
                </Form.Item>
                <Form.Item
                    style={{width: 200}}
                    name={['document', 'type']}
                    rules={[{required: true, message: 'نوع مدرک را انتخاب کنید!'}]}
                >
                    <Select placeholder="مدرک مورد نظر" options={options}/>
                </Form.Item>
            </Space.Compact>
        </Form>
    )
}
