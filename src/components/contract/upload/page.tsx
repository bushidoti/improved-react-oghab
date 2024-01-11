import {Button, ConfigProvider, Form, message, Select, Space} from "antd";
import React, {useContext, useEffect, useState} from "react";
import Url from "../../api-configue";
import axios from "axios";
import {Context} from "../../../context";
import {useNavigate} from "react-router-dom";

interface ButtonState {
    upload?: boolean;
    sub?: boolean;
    type?: boolean;
    scan?: boolean;
}

export default function UploadContract() {
    const [subDocument, setSubDocument] = useState<object[]>([])
    const [scannedObject, setScannedObject] = useState<object>({})
    const [form] = Form.useForm();
    const [listPersonal, setListPersonal] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [scanButton, setScanButton] = useState<ButtonState>(
        {
            upload:true,
            sub:true,
            type:true,
            scan:true,
        }
    );
    const context = useContext(Context)
    const navigate = useNavigate();

    const options = [
        {value: 'قرارداد', label: 'قرارداد'},
        {value: 'تضامین', label: 'تضامین'},
    ];
        console.log(scanButton)

    const onValuesChange = (changedValues: any, allValues: any) => {
                if (allValues.document.name) {
                  setScanButton((prevState) => ({
                      ...prevState,
                      scan: false,
                    }))
            }


                if (allValues.document.type) {
                     setScanButton((prevState) => ({
                          ...prevState,
                          sub: false,
                        }))
            }

                if (allValues.document.sub) {
                      setScanButton((prevState) => ({
                          ...prevState,
                          upload: false,
                        }))
            }


        if (changedValues.document.type) {
            if (allValues.document.type === 'قرارداد') {
                setSubDocument([
                    {value: 'صفحه 1', label: 'صفحه 1'},
                    {value: 'صفحه 2', label: 'صفحه 2'},
                    {value: 'صفحه 3', label: 'صفحه 3'},
                    {value: 'صفحه 4', label: 'صفحه 4'},
                    {value: 'صفحه 5', label: 'صفحه 5'},
                    {value: 'صفحه 6', label: 'صفحه 6'},
                    {value: 'صفحه 7', label: 'صفحه 7'},
                    {value: 'صفحه 8', label: 'صفحه 8'},
                    {value: 'صفحه 9', label: 'صفحه 9'},
                    {value: 'صفحه 10', label: 'صفحه 10'},
                ])
            } else if (allValues.document.type === 'تضامین') {
                setSubDocument([
                    {value: 'ضمانت اول', label: 'ضمانت اول'},
                    {value: 'ضمانت دوم', label: 'ضمانت دوم'},
                ])
            }
        } else if (changedValues.document.sub) {

              if (allValues.document.sub === 'ضمانت اول') {
                setScannedObject({
                    doc_bail_1: context.compressed
                })
            } else if (allValues.document.sub === 'ضمانت دوم') {
                setScannedObject({
                    doc_bail_2: context.compressed
                })
            }  else if (allValues.document.sub === 'صفحه 1') {
                setScannedObject({
                    doc_1: context.compressed
                })
            } else if (allValues.document.sub === 'صفحه 2') {
                setScannedObject({
                    doc_2: context.compressed
                })
            } else if (allValues.document.sub === 'صفحه 3') {
                setScannedObject({
                    doc_3: context.compressed
                })
            } else if (allValues.document.sub === 'صفحه 4') {
                setScannedObject({
                    doc_4: context.compressed
                })
            } else if (allValues.document.sub === 'صفحه 5') {
                setScannedObject({
                    doc_5: context.compressed
                })
            } else if (allValues.document.sub === 'صفحه 6') {
                setScannedObject({
                    doc_6: context.compressed
                })
            } else if (allValues.document.sub === 'صفحه 7') {
                setScannedObject({
                    doc_7: context.compressed
                })
            } else if (allValues.document.sub === 'صفحه 8') {
                setScannedObject({
                    doc_8: context.compressed
                })
            } else if (allValues.document.sub === 'صفحه 9') {
                setScannedObject({
                    doc_9: context.compressed
                })
            } else if (allValues.document.sub === 'صفحه 10') {
                setScannedObject({
                    doc_10: context.compressed
                })
            }
        }
    }
    const fetchDataList = async () => {
        await axios.get(`${Url}/api/documents/?fields=id,name,&office=${context.permission === 'مدیر اداری' ? '' : context.office}`, {

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
            `${Url}/api/documents/${values.document.name}/`, scannedObject, {
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
                            label: data.name + ' شماره ثبت ' + data.id,
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
                        <Button type={"primary"} onClick={scanImage} disabled={scanButton.scan}>اسکن</Button>
                    </Form.Item>
                </ConfigProvider>
                <Form.Item>
                    <Button type={"primary"} htmlType={"submit"} loading={loading} danger={loading} disabled={scanButton.upload}>بارگذاری</Button>
                </Form.Item>
                <Form.Item
                    style={{width: 200}}
                    name={['document', 'type']}
                    rules={[{required: true, message: 'نوع مدرک را انتخاب کنید!'}]}
                >
                    <Select placeholder="نوع مدرک" options={options} disabled={!context.compressed}/>
                </Form.Item>
                <Form.Item
                    style={{width: 200}}
                    name={['document', 'sub']}
                    rules={[{required: true, message: 'مدرک مورد نظر را انتخاب کنید!'}]}
                >
                    <Select placeholder="مدرک مورد نظر" disabled={scanButton.sub} options={subDocument}/>

                </Form.Item>
            </Space.Compact>
        </Form>
    )
}
