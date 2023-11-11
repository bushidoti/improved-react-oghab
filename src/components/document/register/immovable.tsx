import React, {useContext, useEffect, useState} from 'react';
import {Button, ConfigProvider, Form, Input, InputNumber, message, Select} from 'antd';
import Url from "../../api-configue";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Context} from "../../../context";
import TextArea from "antd/es/input/TextArea";


/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    required: '${label} مورد نیاز است !',
};


const Immovable = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const context = useContext(Context)

    const onFinish = async (values: any) => {
        setLoading(true)
        await axios.post(
            `${Url}/api/immovable/`, {
                typeEstate: values.document.typeEstate,
                name: values.document.name,
                location: context.office,
                docNumber: values.document.docNumber,
                plate: values.document.plate,
                address: values.document.address,
                landlord: values.document.landlord,
                meter: values.document.meter,
                madeOf: values.document.madeOf,
                description: values.document.description,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            }).then(response => {
            return response
        }).then(async data => {
            if (data.status === 201) {
                message.success('ثبت شد');
                await handleResetSubmit()
                setLoading(false)
            }
        }).catch(async (error) => {
            if (error.request.status === 403) {
                navigate('/no_access')
            } else if (error.request.status === 400) {
                message.error('عدم ثبت');
                setLoading(false)
                await handleResetSubmit()
            }
        })
    };

    const handleResetSubmit = async () => {
        form.resetFields()
        await fetchLastData()
    }

    const fetchLastData = async () => {
        await axios.get(`${Url}/api/immovable/?fields=id`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        }).then(response => {
            return response
        }).then(async data => {
            form.setFieldsValue({
                document: {
                    id: data.data.length === 0 ? 1 :  data.data.slice(-1)[0].id + 1,
                },
            });
        }).catch((error) => {
            if (error.request.status === 403) {
                navigate('/no_access')
            }
        })
    }

    useEffect(() => {
            void fetchLastData()
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [])


    return (
        <Form form={form}
              autoComplete="off"
              name="document"
              layout="vertical"
              onFinish={onFinish}
              validateMessages={validateMessages}
        >
            <Form.Item name={['document', 'id']} style={{margin: 10}} label="شماره ثبت">
                <InputNumber disabled/>
            </Form.Item>
            <Form.Item>
                <Form.Item name={['document', 'typeEstate']} className='w-[233px] inline-block m-2' label="نوع ملک"
                           rules={[{required: true}]}>
                    <Select
                        placeholder="انتخاب کنید"
                        options={[
                            {value: 'ملک تجاری', label: 'ملک تجاری'},
                            {value: 'ملک غیر تجاری', label: 'ملک غیر تجاری'}
                        ]}
                    />
                </Form.Item>
                <Form.Item name={['document', 'name']} className='w-[233px] inline-block m-2' label="شرح"
                           rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name={['document', 'docNumber']} className='w-[233px] inline-block m-2' label="شماره سند"
                           rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                 <Form.Item name={['document', 'plate']} className='w-[233px] inline-block m-2' label="پلاک"
                           rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                 <Form.Item name={['document', 'address']} className='w-[233px] inline-block m-2' label="آدرس"
                           rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                 <Form.Item name={['document', 'landlord']} className='w-[233px] inline-block m-2' label="نام مالک"
                           rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                 <Form.Item name={['document', 'madeOf']} className='w-[233px] inline-block m-2' label="سال ساخت"
                           rules={[{required: true}]}>
                    <Input maxLength={4}/>
                 </Form.Item>
               <Form.Item name={['document', 'meter']} className='w-[233px] inline-block m-2' label="متراژ"
                           rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name={['document', 'description']} className='w-[233px] inline-block m-2' label="توضیحات">
                             <TextArea allowClear />
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
                            <Button  danger={loading} type={"primary"} loading={loading} block htmlType="submit">
                                ثبت
                            </Button>
                        </ConfigProvider>
                    </Form.Item>
                    <Form.Item style={{margin: 8}}>
                        <Button onClick={handleResetSubmit} block loading={loading} htmlType="button">
                            ریست
                        </Button>
                    </Form.Item>
                </Form.Item>
            </Form.Item>
        </Form>
    );
}

export default Immovable;