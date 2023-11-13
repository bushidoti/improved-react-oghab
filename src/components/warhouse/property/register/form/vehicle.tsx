import React, {useContext, useEffect, useState} from 'react';
import {Button, ConfigProvider, Form, Image, Input, InputNumber, message, Select, Space} from 'antd';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Context} from "../../../../../context";
import Url from "../../../../api-configue";


/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    required: '${label} مورد نیاز است !',
};


const Vehicle  = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const context = useContext(Context)
    const [autoIncrement, setAutoIncrement] = useState<number>()
    const [autoIncrementFactor, setAutoIncrementFactor] = useState<number>()
    const [visible, setVisible] = useState(false);

    const subObjAdd = async () => {
        await axios.put(`${Url}/api/autoincrement_property/${autoIncrement}/`, {
            increment: form.getFieldValue(['property', 'code']) + 1
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
        }).then(() => {
              context.setPropertyCapsule(oldArray => [...oldArray, {
                            code : form.getFieldValue(['property','code']),
                            category : context.currentPropertyForm,
                            factorCode:  form.getFieldValue(['property','factorCode']),
                            inventory: context.office,
                            name: form.getFieldValue(['property','name']),
                            model: form.getFieldValue(['property','model']),
                            property_number: form.getFieldValue(['property','property_number']),
                            document_code: form.getFieldValue(['property','document_code']),
                            year_made: form.getFieldValue(['property','year_made']),
                            motor: form.getFieldValue(['property','motor']),
                            chassis: form.getFieldValue(['property','chassis']),
                            user: form.getFieldValue(['property','user']),
                            owner: form.getFieldValue(['property','owner']),
                            part1plate: form.getFieldValue(['property','part1plate']),
                            cityPlate: form.getFieldValue(['property','cityPlate']),
                            part2plate: form.getFieldValue(['property','part2plate']),
                            part3plate: form.getFieldValue(['property','part3plate']),
                   }])
        })
    }
    const onFinish = async () => {
        context.setLoadingAjax(true)
                await axios.post(
                    `${Url}/api/factor_property/`, {
                                code: form.getFieldValue(['property','factorCode']),
                                inventory: context.office,
                                factor: context.compressed,
                                jsonData: context.propertyCapsule,
                            }, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                        }
                    }).then(
                        response => {
                    return response
                }).then(async data => {
                    if (data.status === 201) {
                        message.success('فاکتور ثبت شد.');
                        context.setLoadingAjax(false)
                    }
                }).catch(async (error) => {
                    if (error.request.status === 403) {
                        navigate('/no_access')
                    } else if (error.request.status === 400) {
                        message.error('عدم ثبت');
                        context.setLoadingAjax(false)
                        await handleResetSubmit()
                    }
                }).then(async () => {
               await axios.post(
                   `${Url}/api/property/`, context.propertyCapsule,  {
                       headers: {
                           'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                       }
                   }).then(response => {
                   return response
               }).then(async data => {
                   if (data.status === 201) {
                       message.success('ثبت شد');
                       await handleResetSubmit()
                       context.setLoadingAjax(false)
                   }
               }).then(async () => {
                   return await axios.put(`${Url}/api/autoincrement_property_factor/${autoIncrementFactor}/`, {
                       increment: form.getFieldValue(['property','factorCode']) + 1
                   }, {
                       headers: {
                           'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                       }
                   })
               }).then(response => {
                   return response
               }).then(async data => {
                   if (data.status === 200) {
                       message.success('کد فاکتور بروز شد');
                       await fetchData()
                       context.setPropertyCapsule(oldArray => [])
                   }
               }).catch(async (error) => {
                   if (error.request.status === 403) {
                       navigate('/no_access')
                   } else if (error.request.status === 400) {
                       message.error('عدم ثبت');
                       context.setLoadingAjax(false)
                       await handleResetSubmit()
                   }
               })
           })

    };
    const handleResetSubmit = async () => {
        form.resetFields()
        await fetchData()
    }

    const fetchData = async () => {
        await axios.get(`${Url}/api/autoincrement_property/?inventory=${context.office}&name=${context.currentPropertyForm}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        }).then(response => {
            return response
        }).then(async data => {
            form.setFieldsValue({
                property : {
                    code: data.data[0].increment,
                }
            });
            setAutoIncrement(data.data[0].id)
        }).then(async () => {
            return await axios.get(`${Url}/api/autoincrement_property_factor/?inventory=${context.office}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            })
        }).then(response => {
            return response
        }).then(async data => {
            form.setFieldsValue({
                property : {
                    factorCode: data.data[0].increment,
                }
            });
            setAutoIncrementFactor(data.data[0].id)

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
        [context.currentPropertyForm])

     function scanImage() {
            if (document.readyState === "complete") {
                window.ws.send("1100");
            }
        }

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
              onFinish={onFinish}
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
                {context.currentPropertyForm === 'هواپیما' ? null :
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
                <Form.Item style={{margin: 8, display: 'inline-block'}} label="فایل">
                    <Space.Compact>
                        <ConfigProvider theme={{
                            components: {
                                Button: {
                                    groupBorderColor: '#faad14',
                                }
                            }, token: {
                                colorPrimary: '#faad14',
                            }
                        }}>
                            <Button type={"primary"} onClick={scanImage} loading={context.loadingAjax}>اسکن</Button>
                        </ConfigProvider>
                        <Button type={"primary"} onClick={() => setVisible(true)}>پیش نمایش</Button>
                    </Space.Compact>
                </Form.Item>
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
                            <Button  danger={context.loadingAjax} onClick={subObjAdd} type={"primary"} loading={context.loadingAjax} block htmlType="button">
                                ثبت
                            </Button>
                        </ConfigProvider>
                    </Form.Item>
                      <Form.Item style={{margin: 8}}>
                        <ConfigProvider theme={{
                                    components: {
                                        Button: {
                                            groupBorderColor: '#ff0000',
                                        }
                                        }, token: {
                                            colorPrimary: 'rgba(255,0,0,0.72)'
                            }
                        }}>
                                  <Button  type={"primary"} block htmlType="submit">
                                     پایان
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
        </>
    );
}

export default Vehicle;