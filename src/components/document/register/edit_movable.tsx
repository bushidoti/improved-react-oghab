import React, {useContext, useEffect, useState} from 'react';
import {Button, ConfigProvider, Divider, Form, Input, InputNumber, message, Select, Space} from 'antd';
import {DatePicker as DatePickerJalali} from "antd-jalali";
import Url from "../../api-configue";
import axios from "axios";
import dayjs from "dayjs";
import {Context} from "../../../context";
import {useNavigate} from "react-router-dom";
import ReceiveDocMovable from "../upload/receive_doc_movable";
import TextArea from "antd/es/input/TextArea";
/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    required: '${label} مورد نیاز است !',
};
/* eslint-enable no-template-curly-in-string */

const EditMovable: React.FC = () => {
    const [form] = Form.useForm();
    const context = useContext(Context)
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);








    const onFinish = async (values: any) => {
        setLoading(true)
        await axios.put(
            `${Url}/api/movable/${context.path}/`, {
                typeVehicle: values.document.typeVehicle,
                name: values.document.name,
                docNumber: values.document.docNumber,
                motorNumber: values.document.motorNumber,
                chassisNumber: values.document.chassisNumber,
                owner: values.document.owner,
                model: values.document.model,
                madeOf: values.document.madeOf,
                part1plate: values.document.part1plate,
                part2plate: values.document.part2plate,
                part3plate: values.document.part3plate,
                cityPlate: values.document.cityPlate,
                descriptionLocation: values.document.descriptionLocation,
                paperDoc: values.document.paperDoc,
                insurancePaper: values.document.insurancePaper,
                gasCard: values.document.gasCard,
                carCard: values.document.carCard,
                description: values.document.description,
                buyer: values.document.buyer,
                soldDate: values.document.soldDate ? dayjs(values.document.soldDate).locale('fa').format('YYYY-MM-DD') : null,
                soldStatus: !!values.document.soldDate,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            }).then(response => {
            return response
        }).then(async data => {
            if (data.status === 200) {
                message.success('ویرایش شد');
                setLoading(false)
                navigate('/document')
            }
        }).catch((error) => {
            if (error.request.status === 403) {
                navigate('/no_access')
            } else if (error.request.status === 405) {
                message.error('عدم ویرایش');
                setLoading(false)
            }
        })
    };


    const fetchData = async () => {
        setLoading(true)
        await axios.get(`${Url}/api/movable/${context.path}/?fields=id,typeVehicle,name,docNumber,motorNumber,chassisNumber,owner,model,madeOf,part1plate,part2plate,part3plate,location,cityPlate,descriptionLocation,paperDoc,insurancePaper,gasCard,carCard,description,soldDate,buyer,soldStatus`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        }).then(response => {
            return response
        }).then(async data => {
            form.setFieldsValue({
                document: {
                    id: data.data.id,
                    typeVehicle: data.data.typeVehicle,
                    name: data.data.name,
                    docNumber: data.data.docNumber,
                    motorNumber: data.data.motorNumber,
                    chassisNumber: data.data.chassisNumber,
                    owner: data.data.owner,
                    model: data.data.model,
                    madeOf: data.data.madeOf,
                    part1plate: data.data.part1plate,
                    part2plate: data.data.part2plate,
                    part3plate: data.data.part3plate,
                    cityPlate: data.data.cityPlate,
                    descriptionLocation: data.data.descriptionLocation,
                    paperDoc: data.data.paperDoc,
                    insurancePaper: data.data.insurancePaper,
                    gasCard: data.data.gasCard,
                    carCard: data.data.carCard,
                    description: data.data.description,
                    buyer: data.data.buyer,
                    // @ts-ignore
                    soldDate: data.data.soldDate ? dayjs(data.data.soldDate, {jalali: true}) : null,
                },
            });
        }).then(() => setLoading(false)).catch((error) => {
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

    const options=[
        {value: 'الف', label: 'الف'},
        {value: 'ب', label: 'ب'},
        {value: 'پ', label: 'پ'},
        {value: 'ت', label: 'ت'},
        {value: 'ث', label: 'ث'},
        {value: 'ج', label: 'ج'},
        {value: 'د', label: 'د'},
        {value: 'ز', label: 'ز'},
        {value: 'س', label: 'س'},
        {value: 'ش', label: 'ش'},
        {value: 'ص', label: 'ص'},
        {value: 'ط', label: 'ط'},
        {value: 'ع', label: 'ع'},
        {value: 'ف', label: 'ف'},
        {value: 'ق', label: 'ق'},
        {value: 'ک', label: 'ک'},
        {value: 'گ', label: 'گ'},
        {value: 'ل', label: 'ل'},
        {value: 'م', label: 'م'},
        {value: 'ن', label: 'ن'},
        {value: 'و', label: 'و'},
        {value: 'ه', label: 'ه'},
        {value: 'ی', label: 'ی'},
        {value: 'معلولین', label: 'معلولین'},
        {value: 'تشریفات', label: 'تشریفات'},
        {value: 'D', label: 'D'},
        {value: 'S', label: 'S'},
    ]

    return (
        <>
            <Form form={form}
                  autoComplete="off"
                  name="document"
                  layout="vertical"
                  onFinish={onFinish}
                  validateMessages={validateMessages}
            >
                <Form.Item>
                <Form.Item name={['document', 'typeVehicle']} className='w-[233px] inline-block m-2' label="نوع خودرو"
                           rules={[{required: true}]}>
                    <Select
                        placeholder="انتخاب کنید"
                        options={[
                            {value: 'خودرو سواری', label: 'خودرو سواری'},
                            {value: 'خودرو فرودگاهی', label: 'خودرو فرودگاهی'}
                        ]}
                    />
                </Form.Item>
                <Form.Item name={['document', 'name']} className='w-[233px] inline-block m-2' label="نام دستگاه"
                           rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name={['document', 'docNumber']} className='w-[233px] inline-block m-2' label="شماره سند"
                           rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                 <Form.Item name={['document', 'motorNumber']} className='w-[233px] inline-block m-2' label="شماره موتور"
                           rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                 <Form.Item name={['document', 'chassisNumber']} className='w-[233px] inline-block m-2' label="شماره شاسی"
                           rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                 <Form.Item name={['document', 'owner']} className='w-[233px] inline-block m-2' label="نام مالک"
                           rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                 <Form.Item name={['document', 'madeOf']} className='w-[233px] inline-block m-2' label="سال ساخت"
                           rules={[{required: true}]}>
                    <InputNumber className='w-[233px]' maxLength={4}/>
                 </Form.Item>
               <Form.Item name={['document', 'model']} className='w-[233px] inline-block m-2' label="مدل"
                           rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                    <Space.Compact>
                       <Form.Item name={['document', 'part3plate']} label="سریال" className='w-[80px] inline-block ms-2 mt-2' rules={[{required: true}]}>
                            <Input maxLength={2} placeholder={'- -'} className='text-center'/>
                       </Form.Item>
                        <Form.Item name={['document', 'part2plate']} label="راست" className='w-[80px] inline-block mt-2' rules={[{required: true}]}>
                              <Input maxLength={3} placeholder={'- - -'} className='text-center'/>
                       </Form.Item>
                        <Form.Item name={['document', 'cityPlate']} label="شهر" className='w-[120px] inline-block mt-2' rules={[{required: true}]}>
                          <Select
                            className='text-center'
                            placeholder="انتخاب کنید"
                            options={options}/>
                       </Form.Item>
                        <Form.Item name={['document', 'part1plate']} label="چپ" className='w-[80px] inline-block mt-2' rules={[{required: true}]}>
                           <Input maxLength={2} placeholder={'- -'} className='text-center'/>
                        </Form.Item>
                    </Space.Compact>
                </Form.Item>
                <Form.Item>
                <Form.Item name={['document', 'descriptionLocation']} className='w-[233px] inline-block m-2' label="محل استقرار"
                           rules={[{required: true}]}>
                      <TextArea allowClear />
                </Form.Item>
                <Form.Item name={['document', 'description']} className='w-[233px] inline-block m-2' label="توضیحات">
                             <TextArea allowClear />
                </Form.Item>
                <Form.Item className='w-[233px] inline-block m-2' name={['document', 'paperDoc']} label="شناسه برگ سند"
                           rules={[{required: true}]}>
                     <Input/>
                </Form.Item>
                <Form.Item className='w-[233px] inline-block m-2' name={['document', 'insurancePaper']}
                           label="شناسه بیمه نامه" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item className='w-[233px] inline-block m-2' name={['document', 'gasCard']}
                           label="شناسه کارت سوخت" rules={[{required: true}]}>
                            <Input/>
                </Form.Item>
                   <Form.Item className='w-[233px] inline-block m-2' name={['document', 'carCard']}
                           label="شناسه کارت ماشین" rules={[{required: true}]}>
                            <Input/>
                   </Form.Item>
               </Form.Item>
                <Form.Item>
                    <Divider>فروش</Divider>
                    <Form.Item name={['document', 'soldDate']} className='register-form-personal'
                               label="تاریخ فروش">
                        <DatePickerJalali/>
                    </Form.Item>
                    <Form.Item name={['document', 'buyer']} valuePropName="checked" className='register-form-personal' label="خریدار">
                        <Input/>
                    </Form.Item>
                    <Divider>مشاهده مدارک</Divider>
                    <ReceiveDocMovable/>
                    <Form.Item>
                        <Form.Item style={{margin: 8}}>
                            <ConfigProvider theme={{
                                components: {
                                    Button: {
                                        groupBorderColor: '#092b00'
                                    }
                                }, token: {
                                    colorPrimary: '#52c41a'
                                }
                            }}>
                                <Button danger={loading} type={"primary"} loading={loading} block htmlType="submit">
                                    ویرایش
                                </Button>
                            </ConfigProvider>
                            <Form.Item style={{marginTop: 8}}>
                                <Button onClick={() => navigate('/personal')} block loading={loading} htmlType="button">
                                    بازگشت
                                </Button>
                            </Form.Item>
                        </Form.Item>
                    </Form.Item>
                </Form.Item>

            </Form>

        </>
    );
}

export default EditMovable;