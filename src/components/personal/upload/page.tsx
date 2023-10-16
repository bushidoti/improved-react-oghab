import {Button, ConfigProvider, Form, message, Select, Space} from "antd";
import {useContext, useEffect, useState} from "react";
import Url from "../../api-configue";
import axios from "axios";
import {Context} from "../../../context";
import {useNavigate} from "react-router-dom";

export default function UploadPersonal() {
    const [subDocument, setSubDocument] = useState<object[]>([])
    const [scannedObject, setScannedObject] = useState<object>({})
    const [form] = Form.useForm();
    const [listPersonal, setListPersonal] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const context = useContext(Context)
    const navigate = useNavigate();

    const options = [
        {value: 'شناسنامه', label: 'شناسنامه'},
        {value: 'کارت ملی', label: 'کارت ملی'},
        {value: 'تضمین', label: 'تضمین'},
        {value: 'گواهی', label: 'گواهی'},
        {value: 'بازنشستگی', label: 'بازنشستگی'},
        {value: 'اقرارنامه', label: 'اقرارنامه'},
        {value: 'عکس پرسنلی', label: 'عکس پرسنلی'},
        {value: 'مدرک تحصیلی', label: 'مدرک تحصیلی'},
    ];
    const onValuesChange = (changedValues: any, allValues: any) => {
        if (changedValues.document.type) {
            if (allValues.document.type === 'شناسنامه') {
                setSubDocument([
                    {value: 'صفحه اول', label: 'صفحه اول'},
                    {value: 'صفحه دوم', label: 'صفحه دوم'},
                    {value: 'صفحه سوم', label: 'صفحه سوم'},
                    {value: 'صفحه چهارم', label: 'صفحه چهارم'},
                ])
            } else if (allValues.document.type === 'کارت ملی') {
                setSubDocument([
                    {value: 'پشت', label: 'پشت'},
                    {value: 'رو', label: 'رو'},
                ])
            } else if (allValues.document.type === 'تضمین') {
                setSubDocument([
                    {value: 'ضمانت اول', label: 'ضمانت اول'},
                ])
            } else if (allValues.document.type === 'بازنشستگی') {
                setSubDocument([
                    {value: 'حکم بازنشستگی', label: 'حکم بازنشستگی'},
                    {value: 'کارت بازنشستگی', label: 'کارت بازنشستگی'},
                    {value: 'دفترچه بیمه بازنشستگی', label: 'دفترچه بیمه بازنشستگی'},
                ])
            } else if (allValues.document.type === 'گواهی') {
                setSubDocument([
                    {value: 'گواهینامه', label: 'گواهینامه'},
                    {value: 'گواهی پزشکی', label: 'گواهی پزشکی'},
                    {value: 'گواهی حفاظتی', label: 'گواهی حفاظتی'},
                    {value: 'گواهی پلیس', label: 'گواهی پلیس'},
                    {value: 'گواهی بیمه', label: 'گواهی بیمه'},
                ])
            } else if (allValues.document.type === 'عکس پرسنلی') {
                setSubDocument([
                    {value: 'عکس پرسنلی', label: 'عکس پرسنلی'},
                ])
            } else if (allValues.document.type === 'مدرک تحصیلی') {
                setSubDocument([
                    {value: 'مدرک تحصیلی', label: 'مدرک تحصیلی'},
                ])
            } else if (allValues.document.type === 'اقرارنامه') {
                setSubDocument([
                    {value: 'اقرارنامه', label: 'اقرارنامه'},
                ])
            }
        } else if (changedValues.document.sub) {
            if (allValues.document.sub === 'رو') {
                setScannedObject({
                    front_card: context.compressed
                })
            } else if (allValues.document.sub === 'پشت') {
                setScannedObject({
                    back_card: context.compressed
                })
            } else if (allValues.document.sub === 'ضمانت اول') {
                setScannedObject({
                    bail: context.compressed
                })
            } else if (allValues.document.sub === 'حکم بازنشستگی') {
                setScannedObject({
                    retired: context.compressed
                })
            } else if (allValues.document.sub === 'کارت بازنشستگی') {
                setScannedObject({
                    retired_card: context.compressed
                })
            } else if (allValues.document.sub === 'دفترچه بیمه بازنشستگی') {
                setScannedObject({
                    retired_insurance: context.compressed
                })
            } else if (allValues.document.sub === 'گواهینامه') {
                setScannedObject({
                    driveLicense: context.compressed
                })
            } else if (allValues.document.sub === 'گواهی پزشکی') {
                setScannedObject({
                    certificateMedic: context.compressed
                })
            } else if (allValues.document.sub === 'گواهی حفاظتی') {
                setScannedObject({
                    certificateSecurity: context.compressed
                })
            } else if (allValues.document.sub === 'گواهی پلیس') {
                setScannedObject({
                    police: context.compressed
                })
            } else if (allValues.document.sub === 'گواهی بیمه') {
                setScannedObject({
                    insurance: context.compressed
                })
            } else if (allValues.document.sub === 'عکس پرسنلی') {
                setScannedObject({
                    personalPhoto: context.compressed
                })
            } else if (allValues.document.sub === 'مدرک تحصیلی') {
                setScannedObject({
                    degreeEducation: context.compressed
                })
            } else if (allValues.document.sub === 'اقرارنامه') {
                setScannedObject({
                    affidavitDoc: context.compressed
                })
            } else if (allValues.document.sub === 'صفحه اول') {
                setScannedObject({
                    Birth_certificate1: context.compressed
                })
            } else if (allValues.document.sub === 'صفحه دوم') {
                setScannedObject({
                    Birth_certificate2: context.compressed
                })
            } else if (allValues.document.sub === 'صفحه سوم') {
                setScannedObject({
                    Birth_certificate3: context.compressed
                })
            } else if (allValues.document.sub === 'صفحه چهارم') {
                setScannedObject({
                    Birth_certificate4: context.compressed
                })
            }
        }
    }
    const fetchDataList = async () => {
        await axios.get(`${Url}/api/persons/?fields=id,full_name,&office=${context.permission === 'مدیر اداری' ? '' : context.office}`, {

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
            `${Url}/api/persons/${values.document.personal}/`, scannedObject, {
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
                name={['document', 'personal']}
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
                            label: data.full_name,
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
                    <Select placeholder="نوع مدرک" options={options}/>
                </Form.Item>
                <Form.Item
                    style={{width: 200}}
                    name={['document', 'sub']}
                    rules={[{required: true, message: 'مدرک مورد نظر را انتخاب کنید!'}]}
                >
                    <Select placeholder="مدرک مورد نظر" options={subDocument}/>

                </Form.Item>
            </Space.Compact>
        </Form>
    )
}
