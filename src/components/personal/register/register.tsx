import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Button, ConfigProvider, Form, Input, InputNumber, message, Select} from 'antd';
import {DatePicker as DatePickerJalali} from "antd-jalali";
import Url from "../../api-configue";
import axios from "axios";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";


/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    required: '${label} مورد نیاز است !',
};
/* eslint-enable no-template-curly-in-string */


let firstBail = ' '
let secondBail = ' '


const Register = (props: { currentStep: number, setCurrentStep: Dispatch<SetStateAction<number>>; }) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [bailLabel, setBailLabel] = useState({
        firstBail,
        secondBail
    })
    const [loading, setLoading] = useState<boolean>(false);


    const handleBailsLabel = (values: any) => {
        if (values === 'چک') {
            setBailLabel({
                secondBail: 'بانک',
                firstBail: 'شماره چک'
            })
        } else if (values === 'نقد') {
            setBailLabel({
                firstBail: 'واریز به حساب',
                secondBail: 'شماره حساب'
            })
        } else if (values === 'سفته') {
            setBailLabel({
                firstBail: 'تعداد سفته',
                secondBail: 'مبلغ سفته'
            })
        } else if (values === 'بانک') {
            setBailLabel({
                firstBail: 'ضمانت',
                secondBail: 'شماره تضمین'
            })
        } else if (values === 'تعهد') {
            setBailLabel({
                firstBail: 'موضوع تعهد',
                secondBail: 'شماره تعهد'
            })
        }

    };
    const onFinish = async (values: any) => {
        setLoading(true)
        await axios.post(
            `${Url}/api/persons/`, {
                type: values.contract.type,
                full_name: values.contract.full_name,
                caseNumber: values.contract.caseNumber,
                date: dayjs(values.contract.date).locale('fa').format('YYYY-MM-DD'),
                national_id: values.contract.national_id,
                sex: values.contract.sex,
                expireDate: dayjs(values.contract.expireDate).locale('fa').format('YYYY-MM-DD'),
                office: values.contract.office,
                job: values.contract.job,
                approvedPrice: `${values.contract.approvedPrice}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                commitmentPrice: `${values.contract.commitmentPrice}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                typeBail: values.contract.typeBail,
                firstBail: values.contract.firstBail,
                secondBail: values.contract.typeBail === 'سفته' ?  `${values.contract.secondBail}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : values.contract.secondBail,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            }).then(response => {
            return response
        }).then(async data => {
            if (data.status === 201) {
                message.success('ثبت شد');
                props.setCurrentStep(props.currentStep + 1)
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
        await axios.get(`${Url}/api/persons/?fields=id`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        }).then(response => {
            return response
        }).then(async data => {
            form.setFieldsValue({
                contract: {
                    id: data.data.slice(-1)[0].id + 1,
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
              name="contract"
              layout="vertical"
              onFinish={onFinish}
              validateMessages={validateMessages}
        >
            <Form.Item name={['contract', 'id']} style={{margin: 10}} label="شماره ثبت">
                <InputNumber disabled/>
            </Form.Item>
            <Form.Item>
                <Form.Item name={['contract', 'type']} className='register-form-personal' label="وضعیت"
                           rules={[{required: true}]}>
                    <Select
                        placeholder="انتخاب کنید"
                        options={[{value: 'قراردادی', label: 'قراردادی'}, {value: 'بیمه ای', label: 'بیمه ای'}]}
                    />
                </Form.Item>
                <Form.Item name={['contract', 'full_name']} className='register-form-personal' label="نام و نشان"
                           rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name={['contract', 'caseNumber']} className='register-form-personal' label="شماره پرونده"
                           rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name={['contract', 'sex']} className='register-form-personal' label="جنسیت"
                           rules={[{required: true}]}>
                    <Select
                        placeholder="انتخاب کنید"
                        options={[{value: 'مذکر', label: 'مذکر'}, {value: 'مونث', label: 'مونث'}]}
                    />
                </Form.Item>

                <Form.Item
                    hasFeedback
                    name={['contract', 'national_id']}
                    className='register-form-personal'
                    label="کد ملی"
                    rules={[{len: 10, required: true}]}>
                    <Input showCount maxLength={10}/>
                </Form.Item>
                <Form.Item name={['contract', 'approvedPrice']} className='register-form-personal' label="تضمین مصوب"
                           rules={[{required: true}]}>
                    <InputNumber
                        addonAfter="ریال"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                </Form.Item>
                <Form.Item name={['contract', 'date']} className='register-form-personal' label="تاریخ استخدام"
                           rules={[{required: true}]}>
                    <DatePickerJalali/>
                </Form.Item>
            </Form.Item>
            <Form.Item>
                <Form.Item name={['contract', 'office']} className='register-form-personal' label="محل کار"
                           rules={[{required: true}]}>
                    <Select placeholder="انتخاب کنید"
                            options={[{value: 'جاسک', label: 'جاسک'}
                                , {value: 'اورهال تهران', label: 'اورهال تهران'}
                                , {value: 'اورهال اصفهان', label: 'اورهال اصفهان'}
                                , {value: 'دفتر مرکزی', label: 'دفتر مرکزی'}
                                , {value: 'دزفول', label: 'دزفول'}
                                , {value: 'بیشه کلا', label: 'بیشه کلا'}
                                , {value: 'چابهار', label: 'چابهار'}]}
                    />
                </Form.Item>
                <Form.Item name={['contract', 'job']} className='register-form-personal' label="شغل"
                           rules={[{required: true}]}>
                    <Input/>
                </Form.Item>

                <Form.Item name={['contract', 'commitmentPrice']} className='register-form-personal' label="مبلغ تضمین"
                           rules={[{required: true}]}>
                    <InputNumber
                        addonAfter="ریال"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                </Form.Item>
                <Form.Item className='register-form-personal' name={['contract', 'typeBail']} label="نوع ضمانت"
                           rules={[{required: true}]}>
                    <Select onChange={handleBailsLabel} placeholder="انتخاب کنید" options={[{value: 'چک', label: 'چک'}
                        , {value: 'نقد', label: 'نقد'}
                        , {value: 'سفته', label: 'سفته'}
                        , {value: 'بانک', label: 'بانک'}
                        , {value: 'تعهد', label: 'تعهد'}]}
                    />
                </Form.Item>
                <Form.Item className='register-form-personal' name={['contract', 'firstBail']}
                           label={bailLabel.firstBail} rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item className='register-form-personal' name={['contract', 'secondBail']}
                           label={bailLabel.secondBail} rules={[{required: true}]}>

                          {bailLabel.secondBail === 'مبلغ سفته' ?
                             <InputNumber
                                    addonAfter="ریال"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                />
                            :
                            <Input/>

                          }

                </Form.Item>
                <Form.Item name={['contract', 'expireDate']} className='register-form-personal'
                           label="تاریخ پایان قرارداد" rules={[{required: true}]}>
                    <DatePickerJalali/>
                </Form.Item>
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

export default Register;