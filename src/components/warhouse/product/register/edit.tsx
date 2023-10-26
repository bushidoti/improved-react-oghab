import Url from "../../../api-configue";
import React, {useContext, useEffect, useRef, useState} from "react";
import {Context} from "../../../../context";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {
    Button,
    Divider,
    Flex,
    Form,
    Input,
    InputNumber,
    InputRef,
    message,
    Select,
    Space
} from "antd";
import {CloseOutlined, PlusOutlined} from "@ant-design/icons";




export const EditDoc = () => {
    const context = useContext(Context)
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [Check, setCheck] = useState<any>([])
    const [form] = Form.useForm();
    const [listProduct, setListProduct] = useState<any[]>([]);
    const [name, setName] = useState('');
    const inputRef = useRef<InputRef>(null);
    const [option, setOption] = useState<any[]>([]);

    const fetchData = async () => {
        await axios.get(
            `${Url}/api/checksproduct/${context.currentProductCheck}/`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            }).then(response => {
            return response
        }).then(async data => {
              form.setFieldsValue({
                    CheckID: data.data.code,
                    receiver: data.data.jsonData[0].receiver,
                    document_type: 'حواله',
                    products: data.data.jsonData
            });
        }).finally(() => {
            setLoading(false)
        }).then(async () => {
            return await axios.get(`${Url}/api/allproducts/?fields=id,product,input,output&systemID=${context.currentProductCheck}&inventory=${context.office}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            })
        }).then(response => {
            return response
        }).then(async data => {
            setCheck(data.data)
        }).then(async () => {
            return await axios.get(`${Url}/api/consumable-list`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            })
        }).then(response => {
            return response
        }).then(async data => {
            setOption(data.data)
        }).then(async () => {
            return await axios.get(`${Url}/api/product/?inventory=${context.office}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            })
        }).then(response => {
            return response
        }).then(async data => {
            setListProduct(data.data)
        }).catch((error) => {
            if (error.request.status === 403) {
                navigate('/no_access')
            }
        })
    }

    console.log(Check)
    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());


    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

   const addItem = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        await axios.post(
            `${Url}/api/consumable-list/`, {
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


    useEffect(() => {
            void fetchData()
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
    [])

    const onFinish = async () => {
        new Promise(resolve => resolve(
            form.getFieldValue(['products']).map((obj:
                                  {
                                      receiver: string;
                                  }) => {
                obj.receiver = form.getFieldValue(['receiver'])
                return obj;
            })
        )).then(
              form.getFieldValue(['products']).map(async (product: { product: number; }, i: number) => {
                form.setFieldsValue({
                    products: {
                        [i]: {
                            afterOperator: (Check.filter((products: {
                                    product: number;
                                }) => products.product === product.product).reduce((a: any, v: {
                                    input: any;
                                }) => a + v.input, 0))
                                - (Check.filter((products: {
                                    product: number;
                                }) => products.product === product.product).reduce((a: any, v: {
                                    output: any;
                                }) => a + v.output, 0)) - form.getFieldValue(['products'])[i].output,
                        }
                    }
                });
            })
        ).then(() => setLoading(true)).then(
            async () => {
                await axios.put(
                    `${Url}/api/checksproduct/${form.getFieldValue(['CheckID'])}/`, {
                                code: form.getFieldValue(['CheckID']),
                                jsonData: form.getFieldValue(['products']),
                            }, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                        }
                    }).then(response => {
                    return response
                }).then(async data => {
                    if (data.status === 200) {
                        message.success('ویرایش شد!');
                        setLoading(false)
                    }
                }).catch(async (error) => {
                    if (error.request.status === 403) {
                        navigate('/no_access')
                    } else if (error.request.status === 400) {
                        message.error('عدم ثبت');
                        setLoading(false)
                    }
                })
            }
        ).then(
                    async () => {
                        Check.map(async (data: { id: any; } , i: number) => (
                            await axios.put(`${Url}/api/allproducts/${data.id}/`,form.getFieldValue(['products'])[i], {
                                headers: {
                                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                                }
                            }).then(
                                response => {
                                    return response
                                }
                            ).then(
                                async data => {
                                    if (data.status === 200) {
                                        message.success('ویرایش شد.');
                                    }
                                }
                            )
                        ))

                    }
                )
    };

    return (
        <Form
            form={form}
            name="OutputForm"
            layout={"vertical"}
            onFinish={onFinish}
            autoComplete="off"
        >
            <>
                <Form.Item>
                        <Form.Item name={'CheckID'} style={{margin: 8, display: 'inline-block'}}
                                   label="شماره ثبت حواله">
                            <InputNumber disabled/>
                        </Form.Item>
                    <Form.Item name={['document_type']} className='register-form-personal' label="نوع مدرک"
                               rules={[{required: true}]}>
                        <Select
                            placeholder="انتخاب کنید"
                            options={[
                                {value: 'حواله', label: 'حواله'}
                                , {value: 'متفرقه', label: 'متفرقه'}
                                , {value: 'انبارگردانی', label: 'انبارگردانی'}
                                , {value: 'سند', label: 'سند'}
                            ]}
                        />
                    </Form.Item>
                        <Form.Item name={'receiver'} className='register-form-personal' label="نام گیرنده"
                                   rules={[{required: true}]}>
                            <Input placeholder='نام گیرنده'/>
                        </Form.Item>


                </Form.Item>
                <Form.Item>
                    <Form.List name={['products']}>
                        {(subFields, subOpt) => (
                            <>
                                <Flex vertical gap={20}>
                                    {subFields.map((subField) => (
                                        <Space key={subField.key} size={20}>
                                            <Form.Item name={[subField.name, 'product']} style={{width: 300}}
                                                       label='نام کالا' rules={[{required: true}]}>
                                                <Select placeholder="انتخاب کنید"
                                                        optionFilterProp="children"
                                                        showSearch
                                                        filterOption={filterOption}
                                                        onChange={() => {
                                                            form.getFieldValue(['products']).map(async (product: {
                                                                product: number;
                                                            }, i: number) => {
                                                                await axios.get(`${Url}/api/product/?code=${product.product}`, {
                                                                    headers: {
                                                                        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                                                                    }
                                                                }).then(response => {
                                                                    return response
                                                                }).then(async data => {
                                                                    form.setFieldsValue({
                                                                        products: {
                                                                            [i]: {
                                                                                scale: data.data[0].scale,
                                                                                category: data.data[0].category,
                                                                                name: data.data[0].name,
                                                                            }
                                                                        }
                                                                    });
                                                                })
                                                            })
                                                        }}
                                                        options={listProduct.map((item) => ({
                                                            label: item.name,
                                                            value: item.code
                                                        }))}
                                                />
                                            </Form.Item>
                                            <Form.Item name={[subField.name, 'category']} style={{width: 250}}
                                                       label='گروه'>
                                                <Input placeholder="گروه"
                                                       disabled
                                                />
                                            </Form.Item>
                                            <Form.Item name={[subField.name, 'output']} rules={[{required: true}]}
                                                       label='تعداد'>
                                                <InputNumber min={1} placeholder="تعداد"/>
                                            </Form.Item>
                                            <Form.Item name={[subField.name, 'scale']} style={{width: 150}}
                                                       label='مقیاس'>
                                                <Input placeholder="مقیاس" disabled/>
                                            </Form.Item>
                                            <Form.Item name={[subField.name, 'consumable']} style={{width: 250}}
                                                       label='مورد مصرف' rules={[{required: true}]}>
                                                <Select placeholder="انتخاب کنید"
                                                        optionFilterProp="children"
                                                        showSearch
                                                        filterOption={filterOption}
                                                        dropdownRender={(menu) => (
                                                            <>
                                                                {menu}
                                                                <Divider style={{margin: '8px 0'}}/>
                                                                <Space style={{margin: 10}}>
                                                                    <Input
                                                                        placeholder="آیتم مورد نظر را بنویسید"
                                                                        ref={inputRef}
                                                                        value={name}
                                                                        onChange={onNameChange}
                                                                    />
                                                                    <Button type="primary" icon={<PlusOutlined/>}
                                                                            onClick={addItem}/>

                                                                </Space>

                                                            </>
                                                        )}
                                                        options={option.map((item) => ({
                                                            label: item.value,
                                                            value: item.value
                                                        }))}
                                                />
                                            </Form.Item>
                                            <Form.Item label=' '>
                                                <CloseOutlined
                                                    onClick={() => {
                                                        subOpt.remove(subField.name);
                                                    }}
                                                />
                                            </Form.Item>

                                        </Space>
                                    ))}

                                    <Button type="dashed" style={{marginBottom: 10}} loading={loading}
                                            onClick={() => subOpt.add()} block>
                                        اضافه کردن سطر +
                                    </Button>
                                    <Button type={"primary"} block htmlType="submit" danger={loading} loading={loading}>
                                        ثبت
                                    </Button>

                                </Flex>
                            </>
                        )}
                    </Form.List>
                </Form.Item>
            </>
        </Form>
    )
}