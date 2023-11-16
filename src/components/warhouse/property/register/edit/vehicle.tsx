import React, {useContext, useEffect} from 'react';
import {Button, ConfigProvider, Form, Input, InputNumber, message, Select, Space} from 'antd';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Context} from "../../../../../context";
import Url from "../../../../api-configue";
import {SendProperty} from "../send";


/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    required: '${label} مورد نیاز است !',
};


const EditVehicle  = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const context = useContext(Context)


    const subObjAdd = async () => {
           await axios.put(`${Url}/api/property/${context.currentProperty}/`, form.getFieldValue(['property']) , {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            }).then(response => {
                return response
            }).then(async data => {
                if (data.status === 200) {
                    message.success('اموال بروز شد');
                    await fetchData()
                    navigate('/warhouse/property/report')

                }
            })
    }



    const handleResetSubmit = async () => {
        form.resetFields()
        await fetchData()
    }


    const fetchData = async () => {
        await axios.get(`${Url}/api/property/${context.currentProperty}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            }).then(response => {
            return response
        }).then(async data => {
              form.setFieldsValue({
                property: {
                    code: data.data.code,
                    factorCode: data.data.factorCode,
                    inventory: data.data.inventory,
                    name: data.data.name,
                    property_number: data.data.property_number,
                    document_code: data.data.document_code,
                    owner: data.data.owner,
                    year_made: data.data.year_made,
                    model: data.data.model,
                    user: data.data.user,
                    motor: data.data.motor,
                    chassis: data.data.chassis,
                    part1plate: data.data.part1plate,
                    cityPlate: data.data.cityPlate,
                    part2plate: data.data.part2plate,
                    part3plate: data.data.part3plate,
                },
            });
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
              name="property"
              layout="vertical"
              onFinish={subObjAdd}
              validateMessages={validateMessages}
        >
            <Form.Item>
                 <Form.Item name={['property', 'code']} className='w-[233px] m-2 inline-block' label="شماره ثبت">
                    <InputNumber className='w-[233px]' disabled/>
                 </Form.Item>
                 <Form.Item name={['property', 'factorCode']} className='w-[233px] m-2 inline-block' label="شماره ثبت سیستم فاکتور">
                        <InputNumber className='w-[233px]' disabled/>
                 </Form.Item>
            </Form.Item>
            <Form.Item>
                <Form.Item name={['property', 'name']} className='w-[233px] inline-block m-2' label="نام وسیله نقلیه"
                           rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                  <Form.Item name={['property', 'year_made']} className='w-[233px] inline-block m-2' label="سال ساخت"
                           rules={[{required: true, len: 4}]}>
                    <Input  maxLength={4} type={'number'}/>
                </Form.Item>
                  <Form.Item name={['property', 'model']} className='w-[233px] inline-block m-2' label="مدل"
                           rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name={['property', 'property_number']} className='w-[233px] inline-block m-2' label="شماره اموال"
                           rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                 <Form.Item name={['property', 'document_code']} className='w-[233px] inline-block m-2' label="شناسه فاکتور"
                           rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                {context.currentPropertyTable === 'هواپیما' ? null :
                    <Space.Compact>
                       <Form.Item name={['property', 'part3plate']} label="سریال" hasFeedback className='w-[80px] inline-block ms-2 mt-2' rules={[{required: true, len: 2}]}>
                            <Input maxLength={2} type={'number'} placeholder={'- -'} className='text-center'/>
                       </Form.Item>
                        <Form.Item name={['property', 'part2plate']} label="راست" hasFeedback className='w-[80px] inline-block mt-2' rules={[{required: true, len: 3}]}>
                              <Input type={'number'} maxLength={3} placeholder={'- - -'} className='text-center'/>
                       </Form.Item>
                        <Form.Item name={['property', 'cityPlate']} label="شهر" className='w-[120px] inline-block mt-2' rules={[{required: true}]}>
                          <Select
                            placeholder="انتخاب کنید"
                            options={options}/>
                       </Form.Item>
                        <Form.Item name={['property', 'part1plate']} label="چپ" hasFeedback className='w-[80px] inline-block mt-2' rules={[{required: true, len: 2}]}>
                           <Input maxLength={2} type={'number'} placeholder={'- -'} className='text-center'/>
                       </Form.Item>
                    </Space.Compact>
                }
               <Form.Item name={['property', 'user']} className='w-[233px] inline-block m-2' label="یوزر"
                           rules={[{required: true}]}>
                    <Input/>
               </Form.Item>
               <Form.Item name={['property', 'owner']} className='w-[233px] inline-block m-2' label="مالکیت"
                           rules={[{required: true}]}>
                    <Input/>
               </Form.Item>
                <Form.Item name={['property', 'chassis']} className='w-[233px] inline-block m-2' label="شماره شاسی"
                           rules={[{required: true}]}>
                    <Input/>
               </Form.Item>
                <Form.Item name={['property', 'motor']} className='w-[233px] inline-block m-2' label="شماره موتور"
                           rules={[{required: true}]}>
                    <Input/>
               </Form.Item>
                <SendProperty/>
            </Form.Item>
            <Form.Item>
                <Form.Item>
                    <Form.Item style={{margin: 8}}>
                        <ConfigProvider theme={{
                            components: {
                                Button: {
                                    groupBorderColor: '#092b00',
                                }
                            }, token: {
                                colorPrimary: '#52c41a'
                            }
                        }}>
                            <Button  danger={context.loadingAjax} type={"primary"} loading={context.loadingAjax} block htmlType="submit">
                                ثبت
                            </Button>
                        </ConfigProvider>
                    </Form.Item>
                    <Form.Item style={{margin: 8}}>
                        <Button onClick={handleResetSubmit} block loading={context.loadingAjax} htmlType="button">
                            ریست
                        </Button>
                    </Form.Item>
                </Form.Item>
            </Form.Item>
        </Form>
        </>
    );
}

export default EditVehicle;