import React, {useContext, useEffect, useState} from 'react';
import {Button, ConfigProvider, Divider, Form, Input, InputNumber, message, Select} from 'antd';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Context} from "../../../../../context";
import Url from "../../../../api-configue";
import {SendProperty} from "../send";
import PropertyRepair from "../../main/repair_detail";


/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    required: '${label} مورد نیاز است !',
};


const EditDigitalFurniture = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const context = useContext(Context)
    const [currentDigitalForm, setCurrentDigitalForm] = useState<string>('')
    const [currentConnectionDevice, setCurrentConnectionDevice] = useState<string>('')


    const subObjAdd = async () => {
           await axios.put(`${Url}/api/property/${context.path}/`, form.getFieldValue(['property']) , {
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
        await axios.get(`${Url}/api/property/${context.path}`, {
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
                    case: data.data.case,
                    hdd: data.data.hdd,
                    gpu: data.data.gpu,
                    power: data.data.power,
                    phone_feature: data.data.phone_feature,
                    ram: data.data.ram,
                    motherboard: data.data.motherboard,
                    cpu: data.data.cpu,
                    sub_item_type: data.data.sub_item_type,
                    install_location: data.data.install_location,
                    model: data.data.model,
                },
            });
            setCurrentDigitalForm(data.data.name)
            setCurrentConnectionDevice(data.data.sub_item_type)

        })
    }





    useEffect(() => {
            void fetchData()
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [])


    const name_digital=[
            {value: 'کامپیوتر', label: 'کامپیوتر'},
            {value: 'پرینتر', label: 'پرینتر'},
            {value: 'مانیتور', label: 'مانیتور'},
            {value: 'اسکنر', label: 'اسکنر'},
            {value: 'لپ تاپ', label: 'لپ تاپ'},
            {value: 'دوربین', label: 'دوربین'},
            {value: 'تلفن , سانترال و مودم', label: 'تلفن , سانترال و مودم'},
    ]

    const printer_type=[
            {value: 'پرینتر لیزری', label: 'پرینتر لیزری'},
            {value: 'پرینتر جامد جوهر', label: 'پرینتر جامد جوهر'},
            {value: 'پرینتر LED', label: 'پرینتر LED'},
            {value: 'پرینتر جوهر افشان', label: 'پرینتر جوهر افشان'},
            {value: 'پرینتر چند کاره', label: 'پرینتر چند کاره'},
            {value: 'پرینتر ضربه‌ای ماتریس نقطه‌ای', label: 'پرینتر ضربه‌ای ماتریس نقطه‌ای'},
            {value: 'پرینتر سه‌بعدی', label: 'پرینتر سه‌بعدی'},
            {value: 'پرینتر A3', label: 'پرینتر A3'},
    ]




    return (
        <>
            <Form form={form}
              autoComplete="off"
              name="property"
              layout="vertical"
              onFinish={subObjAdd}
              onValuesChange={(changedValues, values) => {
                  setCurrentDigitalForm(values.property.name)
                  setCurrentConnectionDevice(values.property.sub_item_type)
              }}
              validateMessages={validateMessages}
        >
            <Form.Item>
                 <Form.Item name={['property', 'code']} className='w-[233px] m-2 inline-block' label="شماره ثبت">
                    <InputNumber className='w-[233px]' disabled/>
                 </Form.Item>
                 <Form.Item name={['property', 'factorCode']} className='w-[233px] m-2 inline-block' label="شماره ثبت سیستم فاکتور">
                        <InputNumber className='w-[233px]' disabled/>
                 </Form.Item>
                 <Form.Item name={['property', 'name']} className='w-[233px] inline-block m-2' label="نوع اثاث"
                           rules={[{required: true}]}>
                    <Select
                    placeholder="انتخاب کنید"
                    options={name_digital}/>
                 </Form.Item>
                <Form.Item name={['property', 'property_number']} className='w-[233px] inline-block m-2' label="شماره اموال"
                                  rules={[{required: true}]}>
                                  <Input/>
                </Form.Item>
                <Form.Item name={['property', 'document_code']} className='w-[233px] inline-block m-2' label="شناسه فاکتور">
                                  <Input/>
                </Form.Item>
            </Form.Item>
            <Form.Item>
                {(() => {
                    if (currentDigitalForm === 'کامپیوتر'){
                        return (
                            <>
                              <Form.Item name={['property', 'cpu']} className='w-[233px] inline-block m-2' label="مدل سی پی یو"
                                  rules={[{required: true}]}>
                                  <Input/>
                              </Form.Item>
                                <Form.Item name={['property', 'motherboard']} className='w-[233px] inline-block m-2' label="مدل مادربرد"
                                  rules={[{required: true}]}>
                                  <Input/>
                              </Form.Item>
                                <Form.Item name={['property', 'ram']} className='w-[233px] inline-block m-2' label="مقدار رم"
                                  rules={[{required: true}]}>
                                  <Input/>
                              </Form.Item>
                                <Form.Item name={['property', 'power']} className='w-[233px] inline-block m-2' label="مدل پاور"
                                  rules={[{required: true}]}>
                                  <Input/>
                              </Form.Item>
                                <Form.Item name={['property', 'hdd']} className='w-[233px] inline-block m-2' label="فضای هارد"
                                  rules={[{required: true}]}>
                                  <Input/>
                              </Form.Item>
                                 <Form.Item name={['property', 'gpu']} className='w-[233px] inline-block m-2' label="مدل گرافیک"
                                  rules={[{required: true}]}>
                                  <Input/>
                              </Form.Item>
                                <Form.Item name={['property', 'case']} className='w-[233px] inline-block m-2' label="مدل کیس"
                                  rules={[{required: true}]}>
                                  <Input/>
                              </Form.Item>
                            </>
                        )
                    }else  if (currentDigitalForm === 'پرینتر'){
                        return (
                            <>
                              <Form.Item name={['property', 'sub_item_type']} className='w-[233px] inline-block m-2' label="نوع پرینتر"
                                  rules={[{required: true}]}>
                                  <Select
                                        placeholder="انتخاب کنید"
                                        options={printer_type}/>
                              </Form.Item>
                              <Form.Item name={['property', 'model']} className='w-[233px] inline-block m-2' label="مدل پرینتر"
                                  rules={[{required: true}]}>
                                    <Input/>
                              </Form.Item>
                            </>
                        )
                    }else  if (currentDigitalForm === 'مانیتور'){
                        return (
                            <>
                              <Form.Item name={['property', 'model']} className='w-[233px] inline-block m-2' label="مدل مانیتور"
                                  rules={[{required: true}]}>
                                    <Input/>
                              </Form.Item>
                            </>
                        )
                    }else  if (currentDigitalForm === 'اسکنر'){
                        return (
                            <>
                              <Form.Item name={['property', 'model']} className='w-[233px] inline-block m-2' label="مدل اسکنر"
                                  rules={[{required: true}]}>
                                    <Input/>
                              </Form.Item>
                            </>
                        )
                    }else  if (currentDigitalForm === 'لپ تاپ'){
                        return (
                            <>
                              <Form.Item name={['property', 'model']} className='w-[233px] inline-block m-2' label="مدل لپ تاپ"
                                  rules={[{required: true}]}>
                                    <Input/>
                              </Form.Item>
                            </>
                        )
                    }else  if (currentDigitalForm === 'دوربین'){
                        return (
                            <>
                              <Form.Item name={['property', 'sub_item_type']} className='w-[233px] inline-block m-2' label="نوع دوربین"
                                  rules={[{required: true}]}>
                                  <Select
                                        placeholder="انتخاب کنید"
                                        options={[
                                            {value: 'آنالوگ', label: 'آنالوگ'},
                                            {value: 'تحت شبکه', label: 'تحت شبکه'},
                                        ]}/>
                              </Form.Item>
                              <Form.Item name={['property', 'model']} className='w-[233px] inline-block m-2' label="مدل دوربین"
                                  rules={[{required: true}]}>
                                    <Input/>
                              </Form.Item>
                            </>
                        )
                    }else  if (currentDigitalForm === 'تلفن , سانترال و مودم'){
                        return (
                            <>
                              <Form.Item name={['property', 'sub_item_type']} className='w-[233px] inline-block m-2' label="نوع ابزار"
                                  rules={[{required: true}]}>
                                  <Select
                                        placeholder="انتخاب کنید"
                                        options={[
                                            {value: 'تلفن', label: 'تلفن'},
                                            {value: 'سانترال', label: 'سانترال'},
                                            {value: 'مودم', label: 'مودم'},
                                        ]}/>
                              </Form.Item>
                                {currentConnectionDevice === 'تلفن' ?
                                      <Form.Item name={['property', 'phone_feature']} className='w-[233px] inline-block m-2' label="ویژگی تلفن"
                                          rules={[{required: true}]}>
                                             <Select
                                                placeholder="انتخاب کنید"
                                                options={[
                                                    {value: 'با سانترال', label: 'با سانترال'},
                                                    {value: 'بدون سانترال', label: 'بدون سانترال'},
                                                ]}/>
                                      </Form.Item>
                                    : null}
                              <Form.Item name={['property', 'model']} className='w-[233px] inline-block m-2' label="مدل"
                                  rules={[{required: true}]}>
                                    <Input/>
                              </Form.Item>
                            </>
                        )
                    }
                })()}
                <Form.Item name={['property', 'install_location']} className='w-[233px] inline-block m-2' label="محل نصب"
                          rules={[{required: true}]}>
                          <Input/>
                </Form.Item>
                <Divider>تعمیرات و تغییرات</Divider>
                <PropertyRepair/>
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

export default EditDigitalFurniture  ;