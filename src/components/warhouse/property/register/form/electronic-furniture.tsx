import React, {useContext, useEffect, useState} from 'react';
import {Button, ConfigProvider, Form, Image, Input, InputNumber, message, Select, Space} from 'antd';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Context} from "../../../../../context";
import Url from "../../../../api-configue";
import TextArea from "antd/es/input/TextArea";


/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    required: '${label} مورد نیاز است !',
};


const ElectronicFurniture   = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const context = useContext(Context)
    const [autoIncrement, setAutoIncrement] = useState<number>()
    const [autoIncrementFactor, setAutoIncrementFactor] = useState<number>()
    const [visible, setVisible] = useState(false);
    const [listProperty, setListProperty] = useState<any[]>([]);


    const subObjAdd = async () => {
        if (context.propertyTab === 'ثبت اولیه / خرید'){
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
            }).then(async () => {
                 context.setPropertyCapsule(oldArray => [...oldArray,{
                            code : form.getFieldValue(['property','code']),
                            category : context.currentPropertyForm,
                            factorCode:  form.getFieldValue(['property','factorCode']),
                            inventory: context.office,
                            name: form.getFieldValue(['property','name']),
                            property_number: form.getFieldValue(['property','property_number']),
                            document_code: form.getFieldValue(['property','document_code']),
                            year_buy: form.getFieldValue(['property','year_buy']),
                            model: form.getFieldValue(['property','model']),
                            user: form.getFieldValue(['property','user']),
                            install_location: form.getFieldValue(['property','install_location']),
                   }])
               await handleResetSubmit()

           })
      }else if (context.propertyTab === 'تعمیرات'){
             context.setPropertyCapsule(oldArray => [...oldArray, {
                                property : form.getFieldValue(['property','property']),
                                factorCode:  form.getFieldValue(['property','factorCode']),
                                document_code:  form.getFieldValue(['property','document_code']),
                                description:  form.getFieldValue(['property','description']),
                                inventory: context.office,
             }])
            await handleResetSubmit()
        }
    }


         const onFinish = async () => {
        if (context.propertyTab === 'ثبت اولیه / خرید'){
                context.setLoadingAjax(true)
                await axios.post(
                    `${Url}/api/factor_property/`, {
                                code: form.getFieldValue(['property','factorCode']),
                                inventory: context.office,
                                factor_type: 'ثبت اولیه / خرید',
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
                       context.setPropertyCapsule(() => [])
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
        }else if (context.propertyTab === 'تعمیرات') {
            context.setLoadingAjax(true)
                await axios.post(
                    `${Url}/api/factor_property/`, {
                                code: form.getFieldValue(['property','factorCode']),
                                inventory: context.office,
                                factor_type: 'تعمیرات',
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
                   `${Url}/api/repaired_property/`, context.propertyCapsule,  {
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
                       context.setPropertyCapsule(() => [])
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
        }
    };

    const handleResetSubmit = async () => {
        form.resetFields()
        await fetchData()
    }

    const fetchData = async () => {
        await axios.get(`${Url}/api/autoincrement_property_factor/?inventory=${context.office}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            }).then(response => {
            return response
        }).then(async data => {
            form.setFieldsValue({
                property : {
                    factorCode: data.data[0].increment,
                }
            });
            setAutoIncrementFactor(data.data[0].id)
        })
        if (context.propertyTab === 'ثبت اولیه / خرید'){
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
        }).catch((error) => {
            if (error.request.status === 403) {
                navigate('/no_access')
            }
        })
      }else if (context.propertyTab === 'تعمیرات'){
            await axios.get(`${Url}/api/property/?inventory=${context.office}&category=${context.currentPropertyForm}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            }).then(response => {
            return response
        }).then(async data => {
            setListProperty(data.data)
        })
        }
    }


    useEffect(() => {
            void fetchData()
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [context.propertyTab])

    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

     function scanImage() {
            if (document.readyState === "complete") {
                window.ws.send("1100");
            }
        }

    return (
        <>
            <Form form={form}
              autoComplete="off"
              name="property"
              layout="vertical"
              onFinish={subObjAdd}
              validateMessages={validateMessages}
        >
            {(() => {
                if (context.propertyTab === 'ثبت اولیه / خرید'){
                    return (
                          <>
                            <Form.Item>
                 <Form.Item name={['property', 'code']} className='w-[233px] m-2 inline-block' label="شماره ثبت">
                    <InputNumber className='w-[233px]' disabled/>
                 </Form.Item>
                 <Form.Item name={['property', 'factorCode']} className='w-[233px] m-2 inline-block' label="شماره ثبت سیستم فاکتور">
                        <InputNumber className='w-[233px]' disabled/>
                 </Form.Item>
            </Form.Item>
            <Form.Item>
                  <Form.Item name={['property', 'name']} className='w-[233px] inline-block m-2' label="نام اثاث"
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
                <Form.Item name={['property', 'year_buy']} className='w-[233px] inline-block m-2' label="سال خرید"
                           rules={[{required: true, len: 4}]}>
                    <Input  maxLength={4} type={'number'}/>
                </Form.Item>
               <Form.Item name={['property', 'model']} className='w-[233px] inline-block m-2' label="مدل"
                           rules={[{required: true}]}>
                    <Input/>
               </Form.Item>
               <Form.Item name={['property', 'user']} className='w-[233px] inline-block m-2' label="یوزر"
                           rules={[{required: true}]}>
                    <Input/>
               </Form.Item>
               <Form.Item name={['property', 'install_location']} className='w-[233px] inline-block m-2' label="محل نصب"
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

                </>
                    )
                }else if (context.propertyTab === 'تعمیرات'){
                    return (
                        <>
                             <Form.Item>
                                     <Form.Item name={['property', 'factorCode']} className='w-[233px] m-2 inline-block' label="شماره ثبت سیستم فاکتور">
                                            <InputNumber className='w-[233px]' disabled/>
                                     </Form.Item>
                                     <Form.Item name={['property', 'document_code']} className='w-[233px] inline-block m-2' label="شناسه فاکتور"
                                                   rules={[{required: true}]}>
                                            <Input/>
                                     </Form.Item>
                                     <Form.Item name={['property', 'property']} className='w-[233px] inline-block m-2' label="تجهیزات مورد نظر برای ثبت تعمیر"
                                                   rules={[{required: true}]}>
                                            <Select placeholder="انتخاب کنید"
                                                                optionFilterProp="children"
                                                                showSearch
                                                                filterOption={filterOption}

                                                                options={listProperty.map((item) => ({
                                                                    label: item.name,
                                                                    value: item.code
                                                                }))}
                                                        />
                                     </Form.Item>
                                     <Form.Item name={['property', 'description']} className='w-[233px] inline-block m-2' label="شرح تعمیرات"
                                                   rules={[{required: true}]}>
                                            <TextArea/>
                                     </Form.Item>
                                     <Form.Item style={{margin: 8, display: 'inline-block'}} label="فایل فاکتور">
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
                        </>
                    )
                }
            })()}
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
                        <ConfigProvider theme={{
                                    components: {
                                        Button: {
                                            groupBorderColor: '#ff0000',
                                        }
                                        }, token: {
                                            colorPrimary: 'rgba(255,0,0,0.72)'
                            }
                        }}>
                                  <Button onClick={onFinish}  type={"primary"} block htmlType="button">
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

export default ElectronicFurniture ;