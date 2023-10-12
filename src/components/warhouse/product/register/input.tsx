import React, {useContext, useEffect, useRef, useState} from 'react';
import {CloseOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Divider, Flex, Form, Input, InputNumber, InputRef, message, Select, Space} from 'antd';
import Url from "../../../api-configue";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {Context} from "../../../../context";

const InputForm: React.FC = () => {
  const [form] = Form.useForm();
  const inputRef = useRef<InputRef>(null);
  const [name, setName] = useState('');
  const [productName, setProductName] = useState('');
  const [productScale, setProductScale] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [option, setOption] = useState<any[]>([]);
  const [listProduct, setListProduct] = useState<any[]>([]);
  const navigate = useNavigate();
  const context = useContext(Context)
  const [autoIncrement, setAutoIncrement] = useState<number>()

  const filterOption = (input: string, option?: { label: string; value: string }) =>
   (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

   const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
      };

   const onProductNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProductName(event.target.value);
      };

    const onProductScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProductScale(event.target.value);
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
                }).then(async () => {
            return await axios.get(`${Url}/api/product`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            })
        }).then(response => {
          return response
              }).then(async data => {
                   setListProduct(data.data)
                }).then(async () => {
            return await axios.get(`${Url}/api/autoincrementproduct/?inventory=${context.office}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            })
        }).then(response => {
          return response
              }).then(async data => {
                    form.setFieldsValue({
                              code: data.data[0].increment,
                    });
                    setAutoIncrement(data.data[0].id)

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
                  setName('');
                  e.preventDefault();
                  setTimeout(() => {
                      inputRef.current?.focus();
                  }, 0);

              }
          }).catch((error) => {
              if (error.request.status === 403) {
                  navigate('/no_access')
              } else if (error.request.status === 405) {
                  message.error('موجود است!');
              }
          })
      };

   const addItemProduct = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
          await axios.post(
              `${Url}/api/product/`, {
                  code: form.getFieldValue(['code']),
                  name: productName,
                  category: productCategory,
                  scale: productScale,
                  inventory: context.office,
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
                  setProductCategory('')
                  setProductName('')
                  setProductScale('')
                  e.preventDefault()
                  setTimeout(() => {
                      inputRef.current?.focus();
                  }, 0)
              }
          }).then(async () => {
            return await axios.put(`${Url}/api/autoincrementproduct/${autoIncrement}/`, {
                increment:form.getFieldValue(['code']) + 1
            } ,{
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            })
        }).then(response => {
              return response
          }).then(async data => {
              if (data.status === 200) {
                  message.success('اضافه شد');
                  await fetchData()
                  e.preventDefault()
                  setTimeout(() => {
                      inputRef.current?.focus();
                  }, 0)
              }
          }).catch((error) => {
              if (error.request.status === 403) {
                  navigate('/no_access')
              }
          })
      };

   useEffect(() => {
            void fetchData()
          },
          // eslint-disable-next-line react-hooks/exhaustive-deps
      [])

  return (
    <Form
      form={form}
      onValuesChange={() =>
          console.log(JSON.stringify(form.getFieldValue(['products']), null, 2))
      }
      name="InputForm"
      autoComplete="off"
    >

        <>
              <Form.Item name={'code'} style={{margin:10}} label="کد کالای جدید">
                      <InputNumber disabled/>
              </Form.Item>
                  <Form.Item>
                  <Form.List name={['products']}>

                    {(subFields, subOpt) => (
                      <Flex wrap="wrap" vertical gap={16}>
                        {subFields.map((subField) => (
                          <Space key={subField.key}>
                            <Form.Item name={[subField.name, 'name']} style={{ width: 300 }}>
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
                                                      placeholder="نام کالا"
                                                      ref={inputRef}
                                                      value={productName}
                                                      onChange={onProductNameChange}
                                                    />
                                                        <Input
                                                          placeholder="مقایس"
                                                          ref={inputRef}
                                                          value={productScale}
                                                          onChange={onProductScaleChange}
                                                        />
                                                    </Space>
                                                     <Select placeholder="انتخاب کنید" style={{ marginBottom:10 }}
                                                          optionFilterProp="children"
                                                          showSearch
                                                          onChange={value => setProductCategory(value)}
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
                                                                   <Button type="primary" block icon={<PlusOutlined />} onClick={addItemProduct}/>
                                                                </>
                                                              )}
                                                          options={listProduct.map((item) => ({ label: item.name, value: item.name }))}
                                                      />
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
                              <InputNumber min={1} placeholder="تعداد" />
                            </Form.Item>
                            <Form.Item name={[subField.name, 'scale']} style={{ width: 150 }}>
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