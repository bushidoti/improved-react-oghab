import React, {useContext, useEffect, useRef, useState} from 'react';
import {CloseOutlined, PlusOutlined} from '@ant-design/icons';
import {
    Button,
    ConfigProvider,
    Divider,
    Flex,
    Form,
    Image,
    Input,
    InputNumber,
    InputRef,
    message,
    Select,
    Space
} from 'antd';
import Url from "../../../api-configue";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {Context} from "../../../../context";
import dayjs from "dayjs";

const InputForm: React.FC = () => {
    const [form] = Form.useForm();
    const inputRef = useRef<InputRef>(null);
    const [name, setName] = useState('');
    const [productName, setProductName] = useState('');
    const [productScale, setProductScale] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [option, setOption] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [listProduct, setListProduct] = useState<any[]>([]);
    const [allProduct, setAllProduct] = useState<any[]>([]);
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const context = useContext(Context)
    const [autoIncrement, setAutoIncrement] = useState<number>()
    const [autoIncrementFactor, setAutoIncrementFactor] = useState<number>()
    const [isFactor, setIsFactor] = useState(false);

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
        setLoading(true)
        await axios.get(`${Url}/api/category-list`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
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
        }).then(async () => {
            return await axios.get(`${Url}/api/allproducts/?fields=product,input,output`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            })
        }).then(response => {
            return response
        }).then(async data => {
            setAllProduct(data.data)
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

        }).then(async () => {
            return await axios.get(`${Url}/api/autoincrementproductfactor/?inventory=${context.office}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            })
        }).then(response => {
            return response
        }).then(async data => {
            form.setFieldsValue({
                FactorID: data.data[0].increment,
            });
            setAutoIncrementFactor(data.data[0].id)

        }).catch((error) => {
            if (error.request.status === 403) {
                navigate('/no_access')
            }
        }).finally(() => setLoading(false)
        )
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
                increment: form.getFieldValue(['code']) + 1
            }, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            })
        }).then(response => {
            return response
        }).then(async data => {
            if (data.status === 200) {
                message.success('کد کالا بروز شد');
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
        [context.office])


    const handleResetSubmit = async () => {
        form.resetFields()
        await fetchData()
    }


    const onFinish = async () => {
        new Promise(resolve => resolve(
            form.getFieldValue(['products']).map(async (product: { product: number; }, i: number) => {
                form.setFieldsValue({
                    products: {
                        [i]: {
                            afterOperator: (allProduct.filter((products: {
                                    product: number;
                                }) => products.product === product.product).reduce((a: any, v: {
                                    input: any;
                                }) => a + v.input, 0))
                                - (allProduct.filter((products: {
                                    product: number;
                                }) => products.product === product.product).reduce((a: any, v: {
                                    output: any;
                                }) => a + v.output, 0)) + form.getFieldValue(['products'])[i].input,
                        }
                    }
                });
            })
        )).then(
            form.getFieldValue(['products']).map((obj:
                                                      {
                                                          document_code: string,
                                                          document_type: string,
                                                          buyer: string,
                                                          seller: string;
                                                          receiver: string;
                                                          factorCode: number;
                                                          systemID: string;
                                                          operator: string;
                                                          date: string;
                                                      }) => {
                obj.document_code = form.getFieldValue(['document_code'])
                obj.document_type = form.getFieldValue(['document_type'])
                obj.buyer = form.getFieldValue(['buyer'])
                obj.seller = form.getFieldValue(['seller'])
                obj.receiver = form.getFieldValue(['receiver'])
                obj.systemID = isFactor ? form.getFieldValue(['FactorID']) : ''
                obj.factorCode = isFactor ? form.getFieldValue(['FactorID']) : ''
                obj.operator = 'ورود'
                obj.date = dayjs().locale('fa').format('YYYY-MM-DD')
                return obj;
            })
        ).then(() => setLoading(true)).then(
          isFactor ?
            async () => {
                await axios.post(
                    `${Url}/api/factorsproduct/`, {
                                code: form.getFieldValue(['FactorID']),
                                inventory: context.office,
                                factor: context.compressed,
                                jsonData: form.getFieldValue(['products']),
                            }, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                        }
                    }).then(
                        response => {
                    return response
                }).then(async data => {
                    if (data.status === 201) {
                        message.success('فاکتور ثبت شد.');
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
            }
          : null
        ).then(
                 async () => {
                            return await axios.post(`${Url}/api/allproducts/`, form.getFieldValue(['products']), {
                                headers: {
                                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                                }
                            })
                        }
                ).then(
                        response => {
                            return response
                        }
                ).then(
                        async data => {
                            if (data.status === 201) {
                                message.success('ثبت شد.');
                            }
                        }
                ).then(
                    isFactor ?
                        async () => {
                            return await axios.put(`${Url}/api/autoincrementproductfactor/${autoIncrementFactor}/`, {
                                increment: form.getFieldValue(['FactorID']) + 1
                            }, {
                                headers: {
                                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                                }
                            })
                        }
                        : null
                ).then(
                    isFactor ?
                        response => {
                            return response
                        }
                        : null
                ).then(
                    isFactor ?
                        async data => {
                            if (data.status === 200) {
                                message.success('شمارنده فاکتور بروز شد');
                            }

                        }
                        : null
                ).then(async () => {
                        await handleResetSubmit()
                    }
                )


    };

    function scanImage() {
        if (document.readyState === "complete") {
            window.ws.send("1100");
        }
    }

    return (
        <Form
            form={form}
            onFinish={onFinish}
            name="InputForm"
            layout={"vertical"}
            autoComplete="off"
            onValuesChange={(changedValues, values) => {
                if (changedValues) {
                    if (values.document_type === 'فاکتور') {
                        setIsFactor(true)
                    } else setIsFactor(false)
                }
            }}
        >
            <>
                <Form.Item>
                    <Form.Item name={'code'} style={{margin: 8, display: 'inline-block'}} label="کد کالای جدید">
                        <InputNumber disabled/>
                    </Form.Item>

                    {isFactor ?
                        <Form.Item name={'FactorID'} style={{margin: 8, display: 'inline-block'}}
                                   label="شماره ثبت فاکتور">
                            <InputNumber disabled/>
                        </Form.Item>
                        : null}

                    <Form.Item name={['document_type']} className='register-form-personal' label="نوع مدرک"
                               rules={[{required: true}]}>
                        <Select
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
                    {isFactor ?
                        <>
                            <Form.Item name={'buyer'} className='register-form-personal' label="خریدار"
                                       rules={[{required: true}]}>
                                <Input placeholder='نام خریدار'/>
                            </Form.Item>
                            <Form.Item name={'seller'} className='register-form-personal' label="فروشنده"
                                       rules={[{required: true}]}>
                                <Input placeholder='فروشنده'/>
                            </Form.Item>
                        </>
                        : null}
                    {isFactor ?
                        <>
                            <Form.Item style={{margin: 8, display: 'inline-block'}} label="فایل">
                                <Space.Compact>
                                    <ConfigProvider theme={{
                                        components: {
                                            Button: {
                                                groupBorderColor: '#faad14',
                                            }
                                        }, token: {
                                            colorPrimary: '#faad14',
                                        }
                                    }}>
                                        <Button type={"primary"} onClick={scanImage} loading={loading}>اسکن</Button>
                                    </ConfigProvider>
                                    <Button type={"primary"} onClick={() => setVisible(true)}>پیش نمایش</Button>
                                </Space.Compact>
                            </Form.Item>
                            <Image
                                width={200}
                                style={{display: 'none'}}
                                src="error"
                                fallback="data:image/png;base64,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"
                                preview={{
                                    visible,
                                    src: context.compressed,
                                    onVisibleChange: (value) => {
                                        setVisible(value);
                                    },
                                }}
                            />
                        </>
                        : null}

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
                                                        dropdownRender={(menu) => (
                                                            <>
                                                                {menu}
                                                                <Divider style={{margin: '8px 0'}}/>
                                                                <Space style={{margin: 10}}>
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
                                                                <Select placeholder="گروه" style={{marginBottom: 10}}
                                                                        optionFilterProp="children"
                                                                        showSearch
                                                                        getPopupContainer={trigger => trigger.parentElement}
                                                                        onChange={value => setProductCategory(value)}
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
                                                                                    <Button type="primary"
                                                                                            icon={<PlusOutlined/>}
                                                                                            onClick={addItem}/>

                                                                                </Space>

                                                                            </>
                                                                        )}
                                                                        options={option.map((item) => ({
                                                                            label: item.value,
                                                                            value: item.value
                                                                        }))}
                                                                />
                                                                <Button type="primary" block icon={<PlusOutlined/>}
                                                                        onClick={addItemProduct}/>
                                                            </>
                                                        )}
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
                                                <InputNumber min={1} placeholder="تعداد"/>
                                            </Form.Item>
                                            <Form.Item name={[subField.name, 'scale']} style={{width: 150}}
                                                       label='مقیاس'>
                                                <Input placeholder="مقیاس" disabled/>
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
    );
};

export default InputForm;