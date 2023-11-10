import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from 'react';
import {Button, ConfigProvider, Form, Input, InputNumber, message, Select} from 'antd';
import {DatePicker as DatePickerJalali} from "antd-jalali";
import Url from "../../api-configue";
import axios from "axios";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";
import {Context} from "../../../context";


/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    required: '${label} مورد نیاز است !',
};


let firstBail = ' '
let secondBail = ' '


const Register = (props: { currentStep: number, setCurrentStep: Dispatch<SetStateAction<number>>; }) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [bailLabelCommitment, setBailLabelCommitment] = useState({
        firstBail,
        secondBail
    })
    const [bailLabelGood, setBailLabelGood] = useState({
        firstBail,
        secondBail
    })
    const [loading, setLoading] = useState<boolean>(false);
    const context = useContext(Context)


    const handleBailsLabelCommitment = (values: any) => {
        if (values === 'چک') {
            setBailLabelCommitment({
                secondBail: 'بانک',
                firstBail: 'شماره چک'
            })
        } else if (values === 'نقد') {
            setBailLabelCommitment({
                firstBail: 'واریز به حساب',
                secondBail: 'شماره حساب'
            })
        } else if (values === 'سفته') {
            setBailLabelCommitment({
                firstBail: 'تعداد سفته',
                secondBail: 'مبلغ سفته'
            })
        } else if (values === 'بانک') {
            setBailLabelCommitment({
                firstBail: 'ضمانت',
                secondBail: 'شماره تضمین'
            })
        } else if (values === 'تعهد') {
            setBailLabelCommitment({
                firstBail: 'موضوع تعهد',
                secondBail: 'شماره تعهد'
            })
        }

    };



    const handleBailsLabelGood = (values: any) => {
        if (values === 'چک') {
            setBailLabelGood({
                secondBail: 'بانک',
                firstBail: 'شماره چک'
            })
        } else if (values === 'نقد') {
            setBailLabelGood({
                firstBail: 'واریز به حساب',
                secondBail: 'شماره حساب'
            })
        } else if (values === 'سفته') {
            setBailLabelGood({
                firstBail: 'تعداد سفته',
                secondBail: 'مبلغ سفته'
            })
        } else if (values === 'بانک') {
            setBailLabelGood({
                firstBail: 'ضمانت',
                secondBail: 'شماره تضمین'
            })
        } else if (values === 'تعهد') {
            setBailLabelGood({
                firstBail: 'موضوع تعهد',
                secondBail: 'شماره تعهد'
            })
        }

    };
    const onFinish = async (values: any) => {
        setLoading(true)
        await axios.post(
            `${Url}/api/documents/`, {
                type_form: values.contract.type_form,
                name: values.contract.name,
                office: context.office,
                contractNumber: values.contract.contractNumber,
                dateContract: dayjs(values.contract.dateContract).locale('fa').format('YYYY-MM-DD'),
                durationContract: values.contract.durationContract,
                topicContract: values.contract.topicContract,
                typeContract: values.contract.typeContract,
                prePaidPrice: `${values.contract.prePaidPrice}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                contractPrice: `${values.contract.contractPrice}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                goodPrice: `${values.contract.goodPrice}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                typeBail1: values.contract.typeBail1,
                firstBail: values.contract.firstBail,
                secondBail: values.contract.typeBail1 === 'سفته' ?  `${values.contract.secondBail}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : values.contract.secondBail,
                commitmentPrice: `${values.contract.commitmentPrice}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                typeBail2: values.contract.typeBail2,
                firstBail2: values.contract.firstBail2,
                secondBail2: values.contract.typeBail2 === 'سفته' ?  `${values.contract.secondBail2}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : values.contract.secondBail2,
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
        await axios.get(`${Url}/api/documents/?fields=id`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        }).then(response => {
            return response
        }).then(async data => {
            form.setFieldsValue({
                contract: {
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
              name="contract"
              layout="vertical"
              onFinish={onFinish}
              validateMessages={validateMessages}
        >
            <Form.Item name={['contract', 'id']} style={{margin: 10}} label="شماره ثبت">
                <InputNumber disabled/>
            </Form.Item>
            <Form.Item>
                <Form.Item name={['contract', 'type_form']} className='register-form-personal' label="فرم"
                           rules={[{required: true}]}>
                    <Select
                        placeholder="انتخاب کنید"
                        options={[
                            {value: 'کارفرما', label: 'کارفرما'},
                            {value: 'پیمانکار', label: 'پیمانکار'}
                        ]}
                    />
                </Form.Item>
                <Form.Item name={['contract', 'name']} className='register-form-personal' label="نام و نشان"
                           rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name={['contract', 'contractNumber']} className='register-form-personal' label="شماره قرارداد"
                           rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name={['contract', 'contractPrice']} className='register-form-personal' label="مبلغ قرارداد"
                           rules={[{required: true}]}>
                    <InputNumber
                        addonAfter="ریال"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                </Form.Item>
                <Form.Item name={['contract', 'prePaidPrice']} className='register-form-personal' label="مبلغ پیش پرداخت"
                           rules={[{required: true}]}>
                    <InputNumber
                        addonAfter="ریال"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                </Form.Item>
                 <Form.Item name={['contract', 'durationContract']} className='register-form-personal' label="مدت قرارداد"
                           rules={[{required: true}]}>
                    <InputNumber
                        addonAfter="ماه"
                    />
                </Form.Item>
               <Form.Item name={['contract', 'topicContract']} className='register-form-personal' label="موضوع قرارداد"
                           rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name={['contract', 'typeContract']} className='register-form-personal' label="نوع قرارداد"
                           rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name={['contract', 'dateContract']} className='register-form-personal' label="تاریخ قرارداد"
                           rules={[{required: true}]}>
                    <DatePickerJalali/>
                </Form.Item>
            </Form.Item>
            <Form.Item>
                <Form.Item name={['contract', 'goodPrice']} className='register-form-personal' label="مبلغ حسن انجام کار"
                           rules={[{required: true}]}>
                    <InputNumber
                        addonAfter="ریال"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                </Form.Item>
                <Form.Item className='register-form-personal' name={['contract', 'typeBail1']} label="نوع ضمانت"
                           rules={[{required: true}]}>
                    <Select onChange={handleBailsLabelGood} placeholder="انتخاب کنید" options={[{value: 'چک', label: 'چک'}
                        , {value: 'نقد', label: 'نقد'}
                        , {value: 'سفته', label: 'سفته'}
                        , {value: 'بانک', label: 'بانک'}
                        , {value: 'تعهد', label: 'تعهد'}]}
                    />
                </Form.Item>
                <Form.Item className='register-form-personal' name={['contract', 'firstBail']}
                           label={bailLabelGood.firstBail} rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item className='register-form-personal' name={['contract', 'secondBail']}
                           label={bailLabelGood.secondBail} rules={[{required: true}]}>

                          {bailLabelGood.secondBail === 'مبلغ سفته' ?
                             <InputNumber
                                    addonAfter="ریال"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                />
                            :
                            <Input/>

                          }
                </Form.Item>
            </Form.Item>
            <Form.Item>
                <Form.Item name={['contract', 'commitmentPrice']} className='register-form-personal' label="مبلغ تعهد انجام کار"
                           rules={[{required: true}]}>
                    <InputNumber
                        addonAfter="ریال"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                </Form.Item>
                <Form.Item className='register-form-personal' name={['contract', 'typeBail2']} label="نوع ضمانت"
                           rules={[{required: true}]}>
                    <Select onChange={handleBailsLabelCommitment} placeholder="انتخاب کنید" options={[{value: 'چک', label: 'چک'}
                        , {value: 'نقد', label: 'نقد'}
                        , {value: 'سفته', label: 'سفته'}
                        , {value: 'بانک', label: 'بانک'}
                        , {value: 'تعهد', label: 'تعهد'}]}
                    />
                </Form.Item>
                <Form.Item className='register-form-personal' name={['contract', 'firstBail2']}
                           label={bailLabelCommitment.firstBail} rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item className='register-form-personal' name={['contract', 'secondBail2']}
                           label={bailLabelCommitment.secondBail} rules={[{required: true}]}>

                          {bailLabelCommitment.secondBail === 'مبلغ سفته' ?
                             <InputNumber
                                    addonAfter="ریال"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                />
                            :
                            <Input/>

                          }

                </Form.Item>
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

export default Register;