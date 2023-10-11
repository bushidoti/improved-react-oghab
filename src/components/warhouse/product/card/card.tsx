import { SearchOutlined } from '@ant-design/icons';
import React, {useContext, useEffect, useRef, useState} from 'react';
import Highlighter from "react-highlight-words";
import type {InputRef, TableProps} from 'antd';
import {Button, Form, Input, Space, Table} from 'antd';
import axios from "axios";
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type {FilterConfirmProps, FilterValue} from 'antd/es/table/interface';
import Url from "../../../api-configue";
import 'dayjs/locale/fa';
import {Context} from "../../../../context";
import {useNavigate} from "react-router-dom";
import {useReactToPrint} from "react-to-print";
import TablePrint from "./table";
import qs from "qs";
import {DatePicker as DatePickerJalali, JalaliLocaleListener} from "antd-jalali";
import dayjs from "dayjs";
import Edit from "./edit";

interface DataType {
  key: React.Key;
  index: number;
  product: number;
  output: number;
  input: number;
  count: number;
  document_type: string;
  document_code: string;
  date: string;
  scale: string;
  operator: string;
  afterOperator: number;
  consumable: string;
  buyer: string;
  seller: string;
  receiver: string;
  amendment: string;
}



type DataIndex = keyof DataType;



const Card: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [product, setProduct] = useState<any[]>([])
  const context = useContext(Context)
  const [loading, setLoading] = useState(true);
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const navigate = useNavigate();
  const componentPDF= useRef(null);
  const [optionConsumable, setOptionConsumable] = useState<any[]>([]);
  const [productSub, setProductSub] = useState<any[]>([])
  const [form] = Form.useForm();

  const generatePDF= useReactToPrint({
        content: ()=>componentPDF.current,
        documentTitle:"کالا ها",
     });

  const fetchData = async () => {
        await axios.get(
            `${Url}/api/product/${context.currentProduct}` , {
             headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
        }).then(response => {
          return response
              }).then(async data => {
                   setProduct(data.data)
                }).then(async () => {
            return await axios.get(`${Url}/api/allproducts/?fields=product,seller,input,output,document_code,document_type,date,operator,afterOperator,obsolete,consumable,buyer,receiver,amendment,id,scale,&product=${context.currentProduct}&${qs.stringify(filteredInfo , {encode: false , arrayFormat: 'comma' })}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            })
        }).then(response => {
          return response
              }).then(async data => {
                   setProductSub(data.data)
                }).then(async () => {
            return await axios.get(`${Url}/api/consumable-list`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            })
        }).then(response => {
          return response
              }).then(async data => {
                   setOptionConsumable(data.data)
                }).then(async () => {
            return await axios.get(`${Url}/api/product/${context.currentProduct}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            })
        }).then(response => {
          return response
              }).then(async data => {
                     form.setFieldsValue({
               product: {
                  name: data.data.name,
                  scale: data.data.scale,
                  category: data.data.category,
                },
        });
                }).finally(() => {
            setLoading(false)
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
          [JSON.stringify(filteredInfo)])

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const handleSearchPlaceHolder = (dataIndex: DataIndex) => {

    if (dataIndex === "product") {
      return 'کد کالا'
    }else if (dataIndex === "document_type") {
      return 'نوع سند'
    }else if (dataIndex === "document_code") {
      return 'شناسه سند'
    }else if (dataIndex === "buyer") {
      return 'خریدار'
    }else if (dataIndex === "seller") {
      return 'فروشنده'
    }else if (dataIndex === "receiver") {
      return 'گیرنده'
    }else if (dataIndex === "amendment") {
      return 'اصلاحیه'
    }else if (dataIndex === "scale") {
      return 'مقیاس'
    }else if (dataIndex === "consumable") {
      return 'مورد مصرف'
    }
  }




  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (

      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>


            {dataIndex === "date" ?
              <>
                 <JalaliLocaleListener/>
                   <DatePickerJalali
                       onChange={function(dateString : string){
                         setSelectedKeys(dayjs(dateString).locale('fa').format('YYYY-MM-DD') ? [dayjs(dateString).locale('fa').format('YYYY-MM-DD')] : [])
                       }}
                        onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                   />
              </>

            :
              <Input
              ref={searchInput}
              placeholder={`جستجو ${handleSearchPlaceHolder(dataIndex)}`}
              value={selectedKeys[0]}
              onChange={(e) => {
                  setSelectedKeys(e.target.value ? [e.target.value] : [])
              } }
              onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
              style={{ marginBottom: 8, display: 'block' }}
            />
        }




        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            جستجو
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            تنظیم مجدد
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            فیلتر
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            بستن
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });


  const columns: ColumnsType<DataType> = [
    {
      align:"center",
      title: 'ردیف',
      dataIndex: 'index',
      fixed:"left",
      width: '4.88%',
      key: 'index',
      render : (_value, _record, index) => index + 1,
    },{
      align:"center",
      title: 'کد کالا',
      dataIndex: 'product',
      width: '5%',
      key: 'product',
    },{
      align:"center",
      title: 'نوع سند',
      dataIndex: 'document_type',
      width: '5%',
      key: 'document_type',
      ...getColumnSearchProps('document_type'),
      filteredValue: filteredInfo.document_type || null,
    },{
      align:"center",
      title: 'شناسه سند',
      dataIndex: 'document_code',
      width: '7%',
      key: 'document_code',
      ...getColumnSearchProps('document_code'),
      filteredValue: filteredInfo.document_code || null,
    },{
      align:"center",
      title: 'تاریخ',
      dataIndex: 'date',
      width: '5%',
      key: 'date',
      ...getColumnSearchProps('date'),
      filteredValue: filteredInfo.date || null,
    },{
      align:"center",
      title: 'عملیات',
      dataIndex: 'operator',
      width: '6%',
      key: 'operator',
      filters: [
          {
            text: 'ورود',
            value: 'ورود',
          },{
            text: 'خروج',
            value: 'خروج',
          },{
            text: 'ثبت اولیه',
            value: 'ثبت اولیه',
          }
      ],
      onFilter: (value, record) => record.operator === value,
      filteredValue: filteredInfo.operator || null,
    },{
      align:"center",
      title: 'مقیاس',
      dataIndex: 'scale',
      width: '7%',
      key: 'scale',
      ...getColumnSearchProps('scale'),
      filteredValue: filteredInfo.scale || null,
    },{
      align:"center",
      title: 'تعداد',
      dataIndex: 'count',
      width: '5%',
      key: 'count',
        render:(_value, record) => record.operator === 'خروج' ? record.output : record.input
    },{
      align:"center",
      title: 'موجودی',
      dataIndex: 'afterOperator',
      width: '5%',
      key: 'afterOperator',
    },{
      align:"center",
      title: 'مورد مصرف',
      dataIndex: 'consumable',
      width: '7%',
      key: 'consumable',
      filters: optionConsumable.map((item) => ({ text: item.value, value: item.value })),
      filteredValue: filteredInfo.category || null,
      onFilter: (value, record) => record.consumable === value,
    },{
      align:"center",
      title: 'خریدار',
      dataIndex: 'buyer',
      width: '7%',
      key: 'buyer',
      ...getColumnSearchProps('buyer'),
      filteredValue: filteredInfo.buyer || null,
    },{
      align:"center",
      title: 'فروشنده',
      dataIndex: 'seller',
      width: '7%',
      key: 'seller',
      ...getColumnSearchProps('seller'),
      filteredValue: filteredInfo.seller || null,
    },{
      align:"center",
      title: 'گیرنده',
      dataIndex: 'receiver',
      width: '7%',
      key: 'receiver',
      ...getColumnSearchProps('receiver'),
      filteredValue: filteredInfo.receiver || null,
    },{
      align:"center",
      title: 'اصلاحیه',
      dataIndex: 'amendment',
      width: '7%',
      key: 'amendment',
      ...getColumnSearchProps('amendment'),
      filteredValue: filteredInfo.amendment || null,
    }
  ];

   const clearFilters = () => {
    setFilteredInfo({});
  };

  const clearAll = () => {
    setFilteredInfo({});
  };

  const handleChange: TableProps<DataType>['onChange'] = (_pagination, filters) => {
    setFilteredInfo(filters);
  };

  return (
      <>
         <Edit form={form}/>
         <Space style={{ marginBottom: 16 }}>
            <Button onClick={clearFilters}>پاک کردن فیتلر ها</Button>
            <Button onClick={clearAll}>پاک کردن فیلتر و مرتب کننده ها</Button>
            <Button onClick={generatePDF}>چاپ</Button>

          </Space>
          <Table
              bordered columns={columns}
              dataSource={productSub}
              title={() => form.getFieldValue(['product' , 'name'])}
              tableLayout={"fixed"}
              scroll={{ x: 3010 , y:'60vh'}}
              rowKey="id"
              onChange={handleChange}
              loading={loading}
              pagination={{position:["bottomCenter"]}}
          />
          <TablePrint componentPDF={componentPDF} contract={product} productSub={productSub} form={form}/>

      </>
  )
};

export default Card;