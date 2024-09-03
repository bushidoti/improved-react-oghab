import {Button, ConfigProvider, Form, Image, message, Select, Space} from "antd";
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
    const [visible, setVisible] = useState(false);
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
                    {value: 'صفحه 11', label: 'صفحه 11'},
                    {value: 'صفحه 12', label: 'صفحه 12'},
                    {value: 'صفحه 13', label: 'صفحه 13'},
                    {value: 'صفحه 14', label: 'صفحه 14'},
                    {value: 'صفحه 15', label: 'صفحه 15'},
                    {value: 'صفحه 16', label: 'صفحه 16'},
                    {value: 'صفحه 17', label: 'صفحه 17'},
                    {value: 'صفحه 18', label: 'صفحه 18'},
                    {value: 'صفحه 19', label: 'صفحه 19'},
                    {value: 'صفحه 20', label: 'صفحه 20'},
                ])
            } else if (allValues.document.type === 'تضامین') {
                setSubDocument([
                    {value: 'ضمانت اول', label: 'ضمانت اول'},
                    {value: 'ضمانت دوم', label: 'ضمانت دوم'},
                    {value: 'ضمانت سوم', label: 'ضمانت سوم'},
                    {value: 'ضمانت چهارم', label: 'ضمانت چهارم'},
                    {value: 'ضمانت پنجم', label: 'ضمانت پنجم'},
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
            } else if (allValues.document.sub === 'ضمانت سوم') {
                setScannedObject({
                    doc_bail_3: context.compressed
                })
            } else if (allValues.document.sub === 'ضمانت چهارم') {
                setScannedObject({
                    doc_bail_4: context.compressed
                })
            } else if (allValues.document.sub === 'ضمانت پنجم') {
                setScannedObject({
                    doc_bail_5: context.compressed
                })
            }else if (allValues.document.sub === 'صفحه 1') {
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
            }else if (allValues.document.sub === 'صفحه 11') {
                setScannedObject({
                    doc_11: context.compressed
                })
            }else if (allValues.document.sub === 'صفحه 12') {
                setScannedObject({
                    doc_12: context.compressed
                })
            }else if (allValues.document.sub === 'صفحه 13') {
                setScannedObject({
                    doc_13: context.compressed
                })
            }else if (allValues.document.sub === 'صفحه 14') {
                setScannedObject({
                    doc_14: context.compressed
                })
            }else if (allValues.document.sub === 'صفحه 15') {
                setScannedObject({
                    doc_15: context.compressed
                })
            }else if (allValues.document.sub === 'صفحه 16') {
                setScannedObject({
                    doc_16: context.compressed
                })
            }else if (allValues.document.sub === 'صفحه 17') {
                setScannedObject({
                    doc_17: context.compressed
                })
            }else if (allValues.document.sub === 'صفحه 18') {
                setScannedObject({
                    doc_18: context.compressed
                })
            }else if (allValues.document.sub === 'صفحه 19') {
                setScannedObject({
                    doc_19: context.compressed
                })
            }else if (allValues.document.sub === 'صفحه 20') {
                setScannedObject({
                    doc_20: context.compressed
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
                form.setFieldValue(['document', 'sub'], null)
                form.setFieldValue(['document', 'type'], null)
                setScanButton((prevState) => ({
                            ...prevState,
                            upload: true,
                        }))
                setScanButton((prevState) => ({
                    ...prevState,
                    sub: true,
                }))
                context.setCompress('')
            }
        }).catch((error) => {
            if (error.request.status === 403) {
                navigate('/no_access')
            } else if (error.request.status === 400) {
                message.error('عدم ثبت');
                setLoading(false)
                context.setCompressed('')
                form.resetFields();
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
                    <Button type={"dashed"} danger={true} onClick={() => setVisible(true)} disabled={!context.compress}>پیش نمایش</Button>
                    <Button type={"primary"} htmlType={"submit"} loading={loading} danger={loading} disabled={scanButton.upload}>بارگذاری</Button>
                </Form.Item>
                <Form.Item
                    style={{width: 200}}
                    name={['document', 'type']}
                    rules={[{required: true, message: 'نوع مدرک را انتخاب کنید!'}]}
                >
                    <Select placeholder="نوع مدرک" options={options} disabled={!context.compress}/>
                </Form.Item>
                <Form.Item
                    style={{width: 200}}
                    name={['document', 'sub']}
                    rules={[{required: true, message: 'مدرک مورد نظر را انتخاب کنید!'}]}
                >
                    <Select placeholder="مدرک مورد نظر" disabled={scanButton.sub} options={subDocument}/>

                </Form.Item>
            </Space.Compact>
            <Image
                width={200}
                style={{display: 'none'}}
                src="error"
                fallback="data:image/png;base64,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"
                preview={{
                    visible,
                    src: context.compressed,
                    onVisibleChange: (value) => {
                        setVisible(value);
                    },
                }}
            />
        </Form>
    )
}
