import { SearchOutlined } from '@ant-design/icons';
import React, {useContext, useEffect, useRef, useState} from 'react';
import Highlighter from "react-highlight-words";
import type {InputRef, TableProps} from 'antd';
import {Button, Input, Space, Table} from 'antd';
import axios from "axios";
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type {FilterConfirmProps, FilterValue, SorterResult} from 'antd/es/table/interface';
import Url from "../../../api-configue";
import 'dayjs/locale/fa';
import {Context} from "../../../../context";
import {useNavigate} from "react-router-dom";
import {useReactToPrint} from "react-to-print";
import TablePrint from "./table";
import qs from "qs";

interface DataType {
  key: React.Key;
  code: number;
  name: string;
  category: string;
  inventory: string;
  input: string;
  output: string;
  left: string;
}



type DataIndex = keyof DataType;



const MainProduct: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [product, setProduct] = useState<any[]>([])
  const context = useContext(Context)
  const [loading, setLoading] = useState(true);
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});
  const navigate = useNavigate();
  const componentPDF= useRef(null);
  const [productSub, setProductSub] = useState<any[]>([])
  const generatePDF= useReactToPrint({
        content: ()=>componentPDF.current,
        documentTitle:"کالا ها",
     });

  const fetchData = async () => {
        await axios.get(`${Url}/api/product/?inventory=${context.permission === 'مدیر' || context.permission === 'مشاهده' ? '' : context.office}&${qs.stringify(filteredInfo , {encode: false , arrayFormat: 'comma' })}` , {
             headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
        }).then(response => {
          return response
              }).then(async data => {
                   setProduct(data.data)
                })
        .finally(() => {
            setLoading(false)
        }).catch((error) => {
                   if (error.request.status === 403){
                        navigate('/no_access')
                   }
        })
      }

   const fetchDataSub= async () => {
        await axios.get(`${Url}/api/allproducts/?fields=product,input,output,document_code,document_type,systemID,date,operator,afterOperator,obsolete,consumable,buyer,inventory,receiver,amendment,id` , {
             headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
        }).then(response => {
          return response
              }).then(async data => {
                   setProductSub(data.data)
                })
        .finally(() => {
            setLoading(false)
        }).catch((error) => {
                   if (error.request.status === 403){
                        navigate('/no_access')
                   }
        })
      }

  useEffect(() => {
            void fetchData()
            void fetchDataSub()
          },
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [context.office , JSON.stringify(filteredInfo)])

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

    if (dataIndex === "code") {
      return 'کد کالا'
    }else if (dataIndex === "name") {
      return 'نام و نشانی'
    }else if (dataIndex === "category") {
      return 'گروه'
    }
  }




  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (

      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>


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
      title: 'کد کالا',
      dataIndex: 'code',
      width: '4.88%',
      key: 'code',
      ...getColumnSearchProps('code'),
      sorter: (a, b) => a.code - b.code,
      sortOrder: sortedInfo.columnKey === 'code' ? sortedInfo.order : null,
      sortDirections: ['descend', 'ascend'],
      filteredValue: filteredInfo.code || null,
    },{
      align:"center",
      title: 'نام کالا',
      dataIndex: 'name',
      width: '7%',
      key: 'name',
      ...getColumnSearchProps('name'),
      filteredValue: filteredInfo.name || null,
       render: (_value, record) => <Button type={"link"} onClick={() => {
        context.setCurrentProduct(record.code)
        navigate(`/warhouse/product/edit/${record.code}`)
      }}>{record.name}</Button>,

    },{
      align:"center",
      title: 'گروه',
      width: '4.55%',
      dataIndex: 'category',
      key: 'category',
      filters: [
          {
            text: 'اداری',
            value: 'اداری',
          },{
            text: 'ترابری',
            value: 'ترابری',
          },{
            text: 'تاسیسات',
            value: 'تاسیسات',
          },{
            text: 'تجهیزات',
            value: 'تجهیزات',
          },{
            text: 'آشپزخانه',
            value: 'آشپزخانه',
          },{
            text: 'آبدارخانه',
            value: 'آبدارخانه',
          },{
            text: 'بهداشتی',
            value: 'بهداشتی',
          },{
            text: 'پشتیبانی',
            value: 'پشتیبانی',
          },
      ],
      filteredValue: filteredInfo.category || null,
      onFilter: (value, record) => record.category === value,
    },{
      align:"center",
      title: 'ورود',
      width: '4.55%',
      dataIndex: 'input',
      key: 'input',
      render: (_value, record) =>
        (productSub.filter(productSub =>
            productSub.product ===  record.code).reduce((a,v) =>   a + v.input , 0 ))
      ,
    },{
      align:"center",
      title: 'خروج',
      width: '4.55%',
      dataIndex: 'output',
      key: 'output',
      render: (_value, record) =>
        (productSub.filter(productSub =>
            productSub.product ===  record.code).reduce((a,v) =>   a + v.output , 0 ))
    ,
    },{
      align:"center",
      title: 'مانده',
      width: '4.55%',
      dataIndex: 'left',
      key: 'left',
      render: (_value, record) =>
        (productSub.filter(productSub =>
           productSub.product ===  record.code).reduce((a,v) =>   a + v.input , 0 ))
        - (productSub.filter(productSub =>
           productSub.product ===  record.code).reduce((a,v) =>   a + v.output , 0 ))
    ,
    },{
      align:"center",
      title: 'انبار',
      width: '4.55%',
      dataIndex: 'inventory',
      key: 'inventory',
      filters: [
          {
            text: 'دفتر مرکزی',
            value: 'دفتر مرکزی',
          },{
            text: 'چابهار',
            value: 'چابهار',
          },{
            text: 'دزفول',
            value: 'دزفول',
          },{
            text: 'جاسک',
            value: 'جاسک',
          },{
            text: 'بیشه کلا',
            value: 'بیشه کلا',
          },{
            text: 'اورهال تهران',
            value: 'اورهال تهران',
          },{
            text: 'اورهال اصفهان',
            value: 'اورهال اصفهان',
          }
      ],
        filteredValue:  context.permission === 'مدیر' || context.permission === 'مشاهده' ? filteredInfo.inventory  || null : [context.office] || null,
        onFilter: (value, record) => record.inventory === value,
    }
  ];

   const clearFilters = () => {
    setFilteredInfo({});
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  const handleChange: TableProps<DataType>['onChange'] = (_pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<DataType>);
  };

  return (
      <>
         <Space style={{ marginBottom: 16 }}>
            <Button onClick={clearFilters}>پاک کردن فیتلر ها</Button>
            <Button onClick={clearAll}>پاک کردن فیلتر و مرتب کننده ها</Button>
            <Button onClick={generatePDF}>چاپ</Button>

          </Space>
          <Table
                // @ts-ignore
              bordered columns={columns}
              dataSource={product}
              tableLayout={"fixed"}
              scroll={{y:'60vh'}}
              rowKey="code"
              onChange={handleChange}
              loading={loading}
              pagination={{position:["bottomCenter"]}}
              // rowClassName={(record, index) =>  date.format('YYYY-MM-DD').replaceAll('/' , '-') > record.expireDate  ? 'table-expired-rows' :  ''}
          />
        <TablePrint componentPDF={componentPDF} contract={product} productSub={productSub}/>
      </>
  )
};

export default MainProduct;