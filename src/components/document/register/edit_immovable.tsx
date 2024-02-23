import React, {useContext, useEffect, useState} from 'react';
import {Button, ConfigProvider, Divider, Form, Input, InputNumber, message, Select} from 'antd';
import {DatePicker as DatePickerJalali} from "antd-jalali";
import Url from "../../api-configue";
import axios from "axios";
import dayjs from "dayjs";
import {Context} from "../../../context";
import {useNavigate} from "react-router-dom";
import ReceiveDocImmovable from "../upload/receive_doc_immovable";
import TextArea from "antd/es/input/TextArea";
/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    required: '${label} مورد نیاز است !',
};
/* eslint-enable no-template-curly-in-string */

const EditImmovable: React.FC = () => {
    const [form] = Form.useForm();
    const context = useContext(Context)
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const onFinish = async (values: any) => {
        setLoading(true)
        await axios.put(
            `${Url}/api/immovable/${context.path}/`, {
                typeEstate: values.document.typeEstate,
                name: values.document.name,
                docNumber: values.document.docNumber,
                plate: values.document.plate,
                address: values.document.address,
                madeOf: values.document.madeOf,
                landlord: values.document.landlord,
                meter: values.document.meter,
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
        await axios.get(`${Url}/api/immovable/${context.path}/?fields=id,typeEstate,name,docNumber,plate,address,landlord,meter,location,madeOf,description,soldDate,buyer,soldStatus`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        }).then(response => {
            return response
        }).then(async data => {
            form.setFieldsValue({
                document: {
                    id: data.data.id,
                    typeEstate: data.data.typeEstate,
                    name: data.data.name,
                    docNumber: data.data.docNumber,
                    address: data.data.address,
                    plate: data.data.plate,
                    landlord: data.data.landlord,
                    madeOf: data.data.madeOf,
                    meter: data.data.meter,
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
                    <InputNumber className='w-[233px]' maxLength={4}/>
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
                    <Divider>فروش</Divider>
                    <Form.Item name={['document', 'soldDate']} className='register-form-personal'
                               label="تاریخ فروش">
                        <DatePickerJalali/>
                    </Form.Item>
                    <Form.Item name={['document', 'buyer']} valuePropName="checked" className='register-form-personal' label="خریدار">
                        <Input/>
                    </Form.Item>
                    <Divider>مشاهده مدارک</Divider>
                    <ReceiveDocImmovable/>
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

export default EditImmovable;