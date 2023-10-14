import React, {useEffect, useRef, useState} from 'react';
import {message, Button, Form, Input, ConfigProvider, Select, Divider, Space, InputRef} from 'antd';
import Url from "../../../api-configue";
import axios from "axios";
import { PlusOutlined } from '@ant-design/icons';
import {useNavigate} from "react-router-dom";
/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} مورد نیاز است !',
};
/* eslint-enable no-template-curly-in-string */








const Edit = (props: {  form: any;}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const inputRef = useRef<InputRef>(null);
    const [name, setName] = useState('');
    const [option, setOption] = useState<any[]>([]);


    const onFinish = async (values: any) => {
        setLoading(true)
        await axios.put(
            `${Url}/api/product/${props.form.getFieldValue(['product' , 'code'])}/`,{
                  code: props.form.getFieldValue(['product' , 'code']),
                  name: values.product.name,
                  scale: values.product.scale,
                  category: values.product.category,
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
                              navigate('/warhouse/product')
                        }
                }).catch((error) => {
                   if (error.request.status === 403){
                        navigate('/no_access')
                   }else if (error.request.status === 405) {
                            message.error('عدم ویرایش');
                            setLoading(false)
                        }
        })
    };


    const fetchData = async () => {
        await axios.get(`${Url}/api/category-list`, {
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
              }).then(response => {
          return response
              }).then(async data => {
                   setOption(data.data)
                }).catch((error) => {
                   if (error.request.status === 403){
                        navigate('/no_access')
                   }
        })
      }


      useEffect(() => {
            void fetchData()
          },
          // eslint-disable-next-line react-hooks/exhaustive-deps
      [])



    const filterOption = (input: string, option?: { label: string; value: string }) =>
   (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

     const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
      };

      const addItem = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
          await axios.post(
              `${Url}/api/category-list/`, {
                  value: name,
              }, {
                  headers: {
                      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                  }
              }).then(response => {
              return response
          }).then(async data => {
              if (data.status === 201) {
                  message.success('اضافه شد');
                  await fetchData()
              }
          }).catch((error) => {
              if (error.request.status === 403) {
                  navigate('/no_access')
              } else if (error.request.status === 405) {
                  message.error('موجود است!');
              }
          })
          e.preventDefault();
          setName('');
          setTimeout(() => {
              inputRef.current?.focus();
          }, 0);
      };

    return (
        <>
            <Form form={props.form}
                autoComplete="off"
                name="product"
                layout="horizontal"
                onFinish={onFinish}
                validateMessages={validateMessages}
              >
                  <Form.Item>
                      <Form.Item name={['product', 'name']} className='register-form-personal'  style={{ width: 300 }} label="نام کالا" rules={[{ required: true }]}>
                            <Input />
                      </Form.Item>
                      <Form.Item name={['product', 'category']} style={{ width: 300 }} className='register-form-personal' label="گروه کالا" rules={[{ required: true }]}>
                             <Select placeholder="انتخاب کنید"
                                  optionFilterProp="children"
                                  showSearch
                                  filterOption={filterOption}
                                  dropdownRender={(menu) => (
                                        <>
                                          {menu}
                                          <Divider style={{ margin: '8px 0' }} />
                                          <Space style={{ margin: 10 }}>
                                            <Input
                                              placeholder="آیتم مورد نظر را بنویسید"
                                              ref={inputRef}
                                              value={name}
                                              onChange={onNameChange}
                                            />
                                           <Button type="primary" icon={<PlusOutlined />} onClick={addItem}/>

                                          </Space>

                                        </>
                                      )}
                                  options={option.map((item) => ({ label: item.value, value: item.value }))}

                              />
                      </Form.Item>
                      <Form.Item name={['product', 'scale']} className='register-form-personal' label="مقیاس" rules={[{ required: true }]}>
                            <Input/>
                      </Form.Item>
                                    <ConfigProvider theme={{
                                    components: {
                                        Button : {
                                              groupBorderColor:'#092b00'
                                        }
                                        },token: {
                                            colorPrimary:'#52c41a'
                                            }
                                    }}>
                                      <Button style={{margin:8}} danger={loading} type={"primary"} loading={loading} htmlType="submit">
                                        ویرایش
                                      </Button>
                                </ConfigProvider>
                  </Form.Item>
            </Form>

            </>
        );
}

export default Edit;