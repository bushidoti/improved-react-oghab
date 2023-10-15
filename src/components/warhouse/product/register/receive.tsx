import React, {useContext, useEffect, useRef, useState} from 'react';
import {Button, Divider, Input, InputNumber, InputRef, message, Select, Space, Table} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Url from "../../../api-configue";
import {Context} from "../../../../context";
import axios from "axios";
import {PlusOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";

interface DataType {
  key: React.Key;
  id: number;
  name: string;
  sender: string;
  receiver: string;
  input: number;
  scale: string;
  date: string;
  category: string;
  product: number;
}





const Receive: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const context = useContext(Context)
  const [product, setProduct] = useState<any[]>([])
  const inputRef = useRef<InputRef>(null);
  const [productName, setProductName] = useState('');
  const [recieverName, setRecieverName] = useState('');
  const [productScale, setProductScale] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [name, setName] = useState('');
  const [allProduct, setAllProduct] = useState<any[]>([]);
  const [option, setOption] = useState<any[]>([]);
  const [listProduct, setListProduct] = useState<any[]>([]);
  const [selectedJson, setSelectedJson] = useState<any[]>([]);
  const navigate = useNavigate();
  const [autoIncrement, setAutoIncrement] = useState<number>()
  const [increment, setIncrement] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false);
   const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
      };
  const onProductScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProductScale(event.target.value);
      };
  const onProductNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProductName(event.target.value);
      };


  const onRecieverNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRecieverName(event.target.value);
      };


  const filterOption = (input: string, option?: { label: string; value: string }) =>
   (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

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
                  code: increment,
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
                increment: increment + 1
            } ,{
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

  const columns: ColumnsType<DataType> = [
      {
        align:"center",
        title: 'نام کالا',
        dataIndex: 'name',
        key: 'name',
      },
      {
        align:"center",
        title: 'تعداد',
        dataIndex: 'input',
        key: 'input',
      },
      {
        align:"center",
        title: 'مقیاس',
        dataIndex: 'scale',
        key: 'scale',
      },{
        align:"center",
        title: 'گروه کالا',
        dataIndex: 'category',
        key: 'category',
      },{
        align:"center",
        title: 'ارسال کننده',
        dataIndex: 'sender',
        key: 'sender',
      },{
        align:"center",
        title: 'تاریخ',
        dataIndex: 'date',
        key: 'date',
      },{
        align:"center",
        title: 'انتقال به کالای مورد نظر',
        width: '15%',
        dataIndex: 'product',
        key: 'product',
        render:(_value, record) => {
          return (
              <Select placeholder="انتخاب کنید"
                                              optionFilterProp="children"
                                              showSearch
                                              style={{width:300}}
                                              filterOption={filterOption}
                                              onChange={value => record.product = value}
                                              dropdownRender={(menu) => (
                                                    <>
                                                      {menu}
                                                      <Divider style={{ margin: '8px 0' }} />
                                                      <Space style={{ margin: 10 }}>
                                                        <InputNumber disabled value={increment}/>
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
                                                         <Select placeholder="گروه" style={{ marginBottom:10,width:'100%' }}
                                                              optionFilterProp="children"
                                                              showSearch
                                                              getPopupContainer={trigger => trigger.parentElement}
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
                                                              options={listProduct.map((item) => ({ label: item.name, value: item.code }))}
                                                          />
          )
        }
      }
    ];


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
            return await axios.get(`${Url}/api/transmission/?receiver=${context.office}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            })
        }).then(response => {
          return response
              }).then(async data => {
                   setProduct(data.data)
                }).then(async () => {
            return await axios.get(`${Url}/api/autoincrementproduct/?inventory=${context.office}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            })
        }).then(response => {
          return response
              }).then(async data => {
                    setAutoIncrement(data.data[0].id)
                    setIncrement(data.data[0].increment)
                }).catch((error) => {
                   if (error.request.status === 403){
                        navigate('/no_access')
                   }
        }).finally(() => setLoading(false)
        )
      }


   useEffect(() => {
              void fetchData()
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [context.office])

  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedJson(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleResetSubmit = async () => {
        await fetchData()
     }



      const onFinish = async () => {
         new Promise(resolve => resolve (
               selectedJson.map((obj:
                          {
                              document_code: string ,
                              document_type:string ,
                              buyer:string,
                              seller:string;
                              receiver:string;
                              systemID:string;
                              operator:string;
                              sender:string;
                              date:string;
                              afterOperator:number;
                              input:number;
                              product:number;
                          }) => {
                obj.document_code = `فاکتور در ${obj.sender} ثبت شده است ارسال شده با شماره حواله ${obj.systemID}`
                obj.document_type = 'فاکتور'
                obj.buyer = obj.sender
                obj.receiver = recieverName
                obj.systemID = ''
                obj.afterOperator = (allProduct.filter((products: { product: number; }) => products.product ===  obj.product).reduce((a: any, v: { input: any; }) =>   a + v.input , 0 ))
                                    - (allProduct.filter((products: { product: number; }) => products.product ===  obj.product).reduce((a: any, v: { output: any; }) =>   a + v.output , 0 )) + obj.input
                obj.operator = 'ورود'
                obj.date = dayjs().locale('fa').format('YYYY-MM-DD')
                return obj;
            })
         )).then(() => setLoading(true)).then(async () => {
                await axios.post(
                    `${Url}/api/allproducts/`, selectedJson, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                        }
                    }).then(response => {
                    return response
                }).then(async data => {
                    if (data.status === 201) {
                        message.success('ثبت شد');
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
                }).then(
                        async () => {
                             selectedJson.map(async (data) => (
                                await  axios.delete(`${Url}/api/transmission/${data.id}`, {
                                    headers: {
                                        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                                    }
                                }).then(
                                            response => {
                                            return response
                                        }
                                    ).then(
                                        async data => {
                                        if (data.status === 204) {
                                                message.success('انتقال یافت.');
                                            }
                                        }
                                    )
                            ))

                        }
                ).then(async () => {
                        await handleResetSubmit()
                    }
                )
            }
        )
    };

  return (
    <div>
      <Input style={{marginBottom:20}} placeholder='نام گیرنده' onChange={onRecieverNameChange}/>
      <Table
          rowKey="id"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={product}
          loading={loading}
          pagination={{position:["bottomCenter"]}}
      />
      <Button type={"primary"} block htmlType="submit" danger={loading} onClick={onFinish} loading={loading}>
          ثبت
      </Button>
    </div>
  );
};

export default Receive;