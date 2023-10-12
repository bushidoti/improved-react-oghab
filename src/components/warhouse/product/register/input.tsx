import React, {useEffect, useRef, useState} from 'react';
import {CloseOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Divider, Flex, Form, Input, InputNumber, InputRef, message, Select, Space} from 'antd';
import Url from "../../../api-configue";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const InputForm: React.FC = () => {
  const [form] = Form.useForm();
  const inputRef = useRef<InputRef>(null);
  const [name, setName] = useState('');
  const [option, setOption] = useState<any[]>([]);
  const navigate = useNavigate();

  const filterOption = (input: string, option?: { label: string; value: string }) =>
   (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

   const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
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


   useEffect(() => {
            void fetchData()
          },
          // eslint-disable-next-line react-hooks/exhaustive-deps
      [])
  return (
    <Form
      form={form}
      onValuesChange={(changedValues, values) =>
          console.log(JSON.stringify(form.getFieldValue(['products']), null, 2))
      }
      name="InputForm"
      autoComplete="off"
    >
        <>
                <Form.Item>
                  <Form.List name={['products']}>
                    {(subFields, subOpt) => (
                      <Flex vertical gap={16}>
                        {subFields.map((subField) => (
                          <Space key={subField.key}>
                            <Form.Item name={[subField.name, 'name']} style={{ width: 150 }}>
                              <Input placeholder="نام کالا" />
                            </Form.Item>
                            <Form.Item name={[subField.name, 'category']} style={{ width: 250 }}>
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
                            <Form.Item name={[subField.name, 'amount']}>
                              <InputNumber placeholder="تعداد" />
                            </Form.Item>
                            <Form.Item name={[subField.name, 'scale']} style={{ width: 300 }}>
                              <Input placeholder="مقیاس" />
                            </Form.Item>
                            <Form.Item>
                            <CloseOutlined
                              onClick={() => {
                                subOpt.remove(subField.name);
                              }}
                            />
                            </Form.Item>

                          </Space>
                        ))}
                        <Button type="dashed" onClick={() => subOpt.add()} block>
                          اضافه کردن سطر +
                        </Button>
                      </Flex>
                    )}
                  </Form.List>
                </Form.Item>
            </>
    </Form>
  );
};

export default InputForm;