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
import {PlusOutlined} from "@ant-design/icons";




export const EditDoc = () => {
    const context = useContext(Context)
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [allProducts, setAllProducts] = useState<any>([])
    const [rowDetailed, setRowDetailed] = useState<any>([])

    const [form] = Form.useForm();
    const [listProduct, setListProduct] = useState<any[]>([]);
    const [name, setName] = useState('');
    const inputRef = useRef<InputRef>(null);
    const [option, setOption] = useState<any[]>([]);

    const fetchData = async () => {
        await axios.get(
            `${Url}/api/${context.currentProductDoc === 'فاکتور' ?  'factorsproduct' :  'checksproduct' }/${context.currentProductDoc === 'فاکتور' ?  context.currentProductFactor :  context.currentProductCheck }/`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            }).then(response => {
            return response
        }).then(async data => {
            if (context.currentProductDoc === 'فاکتور'){
                   form.setFieldsValue({
                        FactorID: data.data.code,
                        receiver: data.data.jsonData[0].receiver,
                        seller: data.data.jsonData[0].seller,
                        buyer: data.data.jsonData[0].buyer,
                        document_code: data.data.jsonData[0].document_code,
                        document_type: 'فاکتور',
                        products: data.data.jsonData});
            }else {
                   form.setFieldsValue({
                        CheckID: data.data.code,
                        receiver: data.data.jsonData[0].receiver,
                        document_type: 'حواله',
                        products: data.data.jsonData});
            }
        }).finally(() => {
            setLoading(false)
        }).then(async () => {
            return await axios.get(`${Url}/api/allproducts/?fields=id,systemID,product,input,output&systemID=${context.currentProductDoc === 'فاکتور' ?  context.currentProductFactor :  context.currentProductCheck }&inventory=${context.office}&document_type=${context.currentProductDoc}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            })
        }).then(response => {
            return response
        }).then(async data => {
            setAllProducts(data.data)
        }).then(async () => {
            return await axios.get(`${Url}/api/allproducts/?fields=id,systemID,product,input,output&inventory=${context.office}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            })
        }).then(response => {
            return response
        }).then(async data => {
            setRowDetailed(data.data)
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
        if (context.currentProductDoc === 'حواله'){
                 new Promise(resolve => resolve(
            form.getFieldValue(['products']).map((obj:
                                  {
                                      receiver: string;
                                      amendment: string;
                                  }) => {
                obj.receiver = form.getFieldValue(['receiver'])
                obj.amendment = 'اصلاح شده'
                return obj;
            })
        )).then(
              form.getFieldValue(['products']).map(async (product: { product: number, systemID:number }, i: number) => {
                form.setFieldsValue({
                    products: {
                        [i]: {
                            afterOperator: (rowDetailed.filter((products: {
                                    product: number;
                                }) => products.product === product.product).reduce((a: any, v: {
                                    input: any;
                                }) => a + v.input, 0))
                                - (rowDetailed.filter((products: {
                                    product: number;
                                }) => products.product === product.product).reduce((a: any, v: {
                                    output: any;
                                }) => a + v.output, 0))  - (rowDetailed.filter((products: {
                                    systemID: number;
                                    product: number;
                                }) => products.systemID === product.systemID && products.product === product.product).reduce((a: any, v: {
                                    input: any;
                                }) => a + v.input, 0)) - form.getFieldValue(['products'])[i].output,
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
                        allProducts.map(async (data: { id: any; } , i: number) => (
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
        }else if (context.currentProductDoc === 'فاکتور'){
                   new Promise(resolve => resolve(
            form.getFieldValue(['products']).map((obj:
                                  {
                                      receiver: string;
                                      buyer: string;
                                      seller: string;
                                      document_code: string;
                                      amendment: string;
                                  }) => {
                obj.receiver = form.getFieldValue(['receiver'])
                obj.buyer = form.getFieldValue(['buyer'])
                obj.seller = form.getFieldValue(['seller'])
                obj.document_code = form.getFieldValue(['document_code'])
                obj.amendment = 'اصلاح شده'
                return obj;
            })
        )).then(
              form.getFieldValue(['products']).map(async (product: { product: number , systemID: number; }, i: number) => {
                form.setFieldsValue({
                     products: {
                        [i]: {
                            afterOperator: (rowDetailed.filter((products: {
                                    product: number;
                                }) => products.product === product.product).reduce((a: any, v: {
                                    input: any;
                                }) => a + v.input, 0))
                                - (rowDetailed.filter((products: {
                                    product: number;
                                }) => products.product === product.product).reduce((a: any, v: {
                                    output: any;
                                }) => a + v.output, 0))   - (rowDetailed.filter((products: {
                                    systemID: number;
                                    product: number;
                                }) => products.systemID === product.systemID && products.product === product.product).reduce((a: any, v: {
                                    input: any;
                                }) => a + v.input, 0))  + form.getFieldValue(['products'])[i].input,
                        }
                    }
                });
            })
        ).then(() => setLoading(true)).then(
            async () => {
                await axios.put(
                    `${Url}/api/factorsproduct/${form.getFieldValue(['FactorID'])}/`, {
                                code: form.getFieldValue(['FactorID']),
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
                        allProducts.map(async (data: { id: any; } , i: number) => (
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
        }
    };

    return (
        <Form
            form={form}
            name={context.currentProductDoc === 'فاکتور' ? "InputForm" : "OutputForm"}
            layout={"vertical"}
            onFinish={onFinish}
            autoComplete="off"
        >
            {context.currentProductDoc === 'حواله' ?
                        <>

                <Form.Item>
                        <Form.Item name={'CheckID'} style={{margin: 8, display: 'inline-block'}}
                                   label="شماره ثبت حواله">
                            <InputNumber disabled/>
                        </Form.Item>
                    <Form.Item name={['document_type']} className='register-form-personal' label="نوع مدرک"
                               rules={[{required: true}]}>
                        <Select
                            disabled
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
                        {(subFields) => (
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
                                                <InputNumber min={0} placeholder="تعداد"/>
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
                                        </Space>
                                    ))}

                                
                                    <Button type={"primary"} block htmlType="submit" danger={loading} loading={loading}>
                                        ثبت
                                    </Button>

                                </Flex>
                            </>
                        )}
                    </Form.List>
                </Form.Item>
            </>
                    :
            <>
                <Form.Item>
                        <Form.Item name={'FactorID'} style={{margin: 8, display: 'inline-block'}}
                                   label="شماره ثبت فاکتور">
                            <InputNumber disabled/>
                        </Form.Item>
                    <Form.Item name={['document_type']} className='register-form-personal' label="نوع مدرک"
                               rules={[{required: true}]}>
                        <Select
                            disabled
                            placeholder="انتخاب کنید"
                            options={[
                                {value: 'فاکتور', label: 'فاکتور'}
                                , {value: 'متفرقه', label: 'متفرقه'}
                                , {value: 'انبارگردانی', label: 'انبارگردانی'}
                                , {value: 'سند', label: 'سند'}
                            ]}
                        />
                    </Form.Item>
                     <Form.Item name={'document_code'} className='register-form-personal' label="شناسه مدرک"
                               rules={[{required: true}]}>
                        <Input placeholder='شناسه مدرک'/>
                    </Form.Item>
                        <Form.Item name={'receiver'} className='register-form-personal' label="نام گیرنده"
                                   rules={[{required: true}]}>
                            <Input placeholder='نام گیرنده'/>
                        </Form.Item>
                           <Form.Item name={'buyer'} className='register-form-personal' label="خریدار"
                                       rules={[{required: true}]}>
                                <Input placeholder='نام خریدار'/>
                            </Form.Item>
                            <Form.Item name={'seller'} className='register-form-personal' label="فروشنده"
                                       rules={[{required: true}]}>
                                <Input placeholder='فروشنده'/>
                            </Form.Item>

                </Form.Item>
                <Form.Item>
                    <Form.List name={['products']}>
                        {(subFields) => (
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
                                            <Form.Item name={[subField.name, 'input']} rules={[{required: true}]}
                                                       label='تعداد'>
                                                <InputNumber min={0} placeholder="تعداد"/>
                                            </Form.Item>
                                            <Form.Item name={[subField.name, 'scale']} style={{width: 150}}
                                                       label='مقیاس'>
                                                <Input placeholder="مقیاس" disabled/>
                                            </Form.Item>
                                        </Space>
                                    ))}

                                    <Button type={"primary"} block htmlType="submit" danger={loading} loading={loading}>
                                        ثبت
                                    </Button>

                                </Flex>
                            </>
                        )}
                    </Form.List>
                </Form.Item>
            </>
            }

        </Form>
    )
}