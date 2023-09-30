import React, {useEffect} from 'react';
import {Button, Form, Input, InputNumber,message, Select} from 'antd';
import {DatePicker as DatePickerJalali, JalaliLocaleListener} from "antd-jalali";
import Url from "../../api-configue";
import axios from "axios";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} مورد نیاز است !',
};
/* eslint-enable no-template-curly-in-string */

const onFinish = async (values: any) => {
    await axios.post(
        `${Url}/api/persons/`,
        values.contract, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        }).then(response => {
     return response
          }).then(async data => {
                    try {
                        if (data.status === 400) {
                            message.error(data.status);
                        }
                    } catch (e) {
                        if (data.status === 201) {
                            message.success('ثبت شد');
                        }
                    }

                })
    };

let firstBail:string = ' '
let secondBail:string = ' '

const handleBailsLabel = (values: any) => {
   if (values === 'چک'){
            firstBail = 'شماره چک'
            secondBail = 'بانک'
        } else if (values === 'نقد'){
            firstBail = 'واریز به حساب'
            secondBail = 'شماره حساب'
        }else if (values === 'سفته'){
            firstBail = 'تعداد سفته'
            secondBail = 'مبلغ سفته'
        }else if (values === 'بانک'){
            firstBail = 'ضمانت'
            secondBail = 'شماره تضمین'
        }else if (values === 'تعهد'){
            firstBail = 'موضوع تعهد'
            secondBail = 'شماره تعهد'
        }
};




const RegisterPersonal: React.FC = () => {
    const [form] = Form.useForm();
    const fetchLastData = async () => {
        const response = await fetch(`${Url}/api/persons/?fields=id`, {
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
              })
        const data = await response.json()
        form.setFieldsValue({
               contract: {
                  id: data.length + 1,
                },
        });
      }

      useEffect(() => {
            void fetchLastData()

          },
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [])
    return (
          <Form
            form={form}
            autoComplete="off"
            name="contract"
            layout="vertical"
            onFinish={onFinish}
            validateMessages={validateMessages}

          >
            <JalaliLocaleListener/>
                    <Form.Item name={['contract', 'id']} style={{width:200 ,margin:8}} label="شماره ثبت" rules={[{ required: true }]}>
                      <InputNumber disabled/>
                  </Form.Item>
              <Form.Item>
                  <Form.Item name={['contract', 'type']} style={{ display: 'inline-block', margin:8  }} label="وضعیت" rules={[{ required: true }]}>
                      <Select
                      placeholder="انتخاب کنید"
                      options={[{ value: 'قراردادی', label: 'قراردادی' },{ value: 'بیمه ای', label: 'بیمه ای' }]}
                      />
                  </Form.Item>
                  <Form.Item name={['contract', 'full_name']} style={{ display: 'inline-block', margin:8 }} label="نام و نشان" rules={[{ required: true }]}>
                        <Input />
                  </Form.Item>
                  <Form.Item name={['contract', 'caseNumber']} style={{ display: 'inline-block', margin:8 }} label="شماره پرونده" rules={[{ required: true }]}>
                        <Input />
                  </Form.Item>
                  <Form.Item name={['contract', 'sex']} style={{ display: 'inline-block', margin:8  }} label="جنسیت" rules={[{ required: true }]}>
                      <Select
                      placeholder="انتخاب کنید"
                      options={[{ value: 'مذکر', label: 'مذکر' },{ value: 'مونث', label: 'مونث' }]}
                      />
                  </Form.Item>
                  <Form.Item name={['contract', 'date']} style={{ display: 'inline-block', margin:8}} label="تاریخ استخدام" rules={[{ required: true }]}>
                     <DatePickerJalali/>
                  </Form.Item>
              </Form.Item>
              <Form.Item>
                  <Form.Item
                      hasFeedback
                      name={['contract', 'national_id']}
                      style={{ display: 'inline-block', margin:8}}
                      label="کد ملی"
                      rules={[{len: 10, required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name={['contract', 'expireDate']} style={{ display: 'inline-block', margin:8}} label="تاریخ پایان قرارداد" rules={[{ required: true }]}>
                    <DatePickerJalali/>
                 </Form.Item>
                 <Form.Item name={['contract', 'approvedPrice']} style={{ display: 'inline-block', margin:8}} label="تضمین مصوب" rules={[{ required: true }]}>
                    <InputNumber
                      addonAfter="ریال"
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                 </Form.Item>
                 <Form.Item  name={['contract', 'office']} style={{ display: 'inline-block', margin:8}} label="محل کار" rules={[{ required: true }]}>
                    <Select placeholder="انتخاب کنید"
                      options={[{ value: 'جاسک', label: 'جاسک' }
                        ,{ value: 'اورهال تهران', label: 'اورهال تهران' }
                        ,{ value: 'اورهال اصفهان', label: 'اورهال اصفهان' }
                        ,{ value: 'دفتر مرکزی', label: 'دفتر مرکزی' }
                        ,{ value: 'دزفول', label: 'دزفول' }
                        ,{ value: 'بیشه کلا', label: 'بیشه کلا' }
                        ,{ value: 'چابهار', label: 'چابهار' }]}
                      />
                 </Form.Item>
                 <Form.Item name={['contract', 'job']} style={{ display: 'inline-block', margin:8}} label="شغل" rules={[{ required: true }]}>
                    <Input />
                 </Form.Item>
              </Form.Item>
              <Form.Item>
                 <Form.Item name={['contract', 'commitmentPrice']} className='register-form-personal' label="مبلغ تضمین" rules={[{ required: true }]}>
                    <InputNumber
                      addonAfter="ریال"
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                 </Form.Item>
                 <Form.Item className='register-form-personal' name={['contract', 'typeBail']}  label="نوع ضمانت" rules={[{ required: true }]}>
                    <Select onChange={handleBailsLabel} placeholder="انتخاب کنید" options={[{ value: 'چک', label: 'چک' }
                            ,{ value: 'نقد', label: 'نقد' }
                            ,{ value: 'سفته', label: 'سفته' }
                            ,{ value: 'بانک', label: 'بانک' }
                            ,{ value: 'تعهد', label: 'تعهد' }]}
                    />
              </Form.Item>
              <Form.Item className='register-form-personal' name={['contract', 'firstBail']} label={firstBail} rules={[{ required: true }]}>
                    <Input />
              </Form.Item>
              <Form.Item className='register-form-personal' name={['contract', 'secondBail']} label={secondBail} rules={[{ required: true }]}>
                    <Input />
              </Form.Item>
              <Form.Item wrapperCol={{ ...layout.wrapperCol, }}>
                  <Button type="primary" htmlType="submit">
                    ثبت
                  </Button>
              </Form.Item>
            </Form.Item>
          </Form>
        );
}

export default RegisterPersonal;