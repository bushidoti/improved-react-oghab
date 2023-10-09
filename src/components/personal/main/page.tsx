import { SearchOutlined } from '@ant-design/icons';
import React, {useContext, useEffect, useRef, useState} from 'react';
import Highlighter from "react-highlight-words";
import type {InputRef, TableProps} from 'antd';
import {Badge, Button, Input, Select, Space, Table} from 'antd';
import axios from "axios";
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type {FilterConfirmProps, FilterValue, SorterResult} from 'antd/es/table/interface';
import Url from "../../api-configue";
import { DatePicker as DatePickerJalali, JalaliLocaleListener } from "antd-jalali";
import dayjs from 'dayjs';
import 'dayjs/locale/fa';
import {DateObject} from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import { CSVLink } from "react-csv";
import {
  FileExcelOutlined,
} from '@ant-design/icons';
import {Context} from "../../../context";
import {useNavigate} from "react-router-dom";
import qs from 'qs';
import {useReactToPrint} from "react-to-print";
import TablePrint from "./table";

interface DataType {
  key: React.Key;
  id: number;
  type: string;
  full_name: string;
  job: string;
  office: string;
  date: string;
  sex: string;
  national_id: string;
  approvedPrice: string;
  commitmentPrice: string;
  typeBail: string;
  caseNumber: string;
  firstBail: string;
  secondBail: string;
  expireDate: string;
  clearedDate: string;
  clearedStatus : boolean;
  receivedDocument  : boolean;
  affidavitStatus  : boolean;
}

const headers = [
  { label: "شماره ثبت", key: "id" },
  { label: "وضعیت", key: "type" },
  { label: "نام و نشانی", key: "full_name" },
  { label: "شماره پرونده", key: "caseNumber" },
  { label: "جنسیت", key: "sex" },
  { label: "تاریخ استخدام", key: "date" },
  { label: "کد ملی", key: "national_id" },
  { label: "شغل", key: "job" },
  { label: "تضمین مصوب", key: "approvedPrice" },
  { label: "مبلغ تضمین", key: "commitmentPrice" },
  { label: "وثیقه تضمین", key: "typeBail" },
  { label: "مشخصه وثیقه", key: "firstBail" },
  { label: "مشخصه وثیقه", key: "secondBail" },
  { label: "تاریخ پایان قرارداد", key: "expireDate" },
  { label: "وضعیت تسویه", key: "clearedStatus" },
  { label: "تاریخ تسویه", key: "clearedDate"},
  { label: "وضعیت مدرک", key: "receivedDocument" },
  { label: "وضعیت اقرارنامه", key: "affidavitStatus" },
  { label: "محل کار", key: "office" },

];

type DataIndex = keyof DataType;



const MainPersonal: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [contract, setContracts] = useState<any[]>([])
  const context = useContext(Context)
  const [loading, setLoading] = useState(true);
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});
  const date = new DateObject({ calendar: persian })
  const navigate = useNavigate();
  const [filteredColumns ,  setFilteredColumns] = useState<string[]>([])
  const componentPDF= useRef(null);
  const generatePDF= useReactToPrint({
        content: ()=>componentPDF.current,
        documentTitle:"اشخاص",
     });

  const fetchData = async () => {
        await axios.get(`${Url}/api/persons/?fields=affidavitStatus,id,type,full_name,expireDate,date,national_id,caseNumber,sex,office,job,approvedPrice,commitmentPrice,typeBail,firstBail,secondBail,clearedStatus,clearedDate,receivedDocument,&office=${context.permission === 'مدیر اداری' || context.permission === 'مشاهده' ? '' : context.office}&${qs.stringify(filteredInfo , {encode: false , arrayFormat: 'comma' })}` , {
             headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
        }).then(response => {
          return response
              }).then(async data => {
                   setContracts(data.data)
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

    if (dataIndex === "id") {
      return 'کد ثبت'
    }else if (dataIndex === "full_name") {
      return 'نام و نشانی'
    }else if (dataIndex === "national_id") {
      return 'کد ملی'
    }else if (dataIndex === "job") {
      return 'شغل'
    }else if (dataIndex === "caseNumber") {
      return 'شماره پرونده'
    }

  }

  const handleTypeFirstBail = (type:string) => {

    if (type === "چک") {
      return 'شماره چک'
    }else if (type === "نقد") {
      return 'واریز به حساب'
    }else if (type === "سفته") {
      return 'تعداد سفته'
    }else if (type === "بانک") {
      return 'ضمانت'
    }else if (type === "تعهد") {
      return 'موضوع تعهد'
    }

  }


  const handleTypeSecondBail = (type:string) => {

    if (type === "چک") {
      return 'بانک'
    }else if (type === "نقد") {
      return 'شماره حساب'
    }else if (type === "سفته") {
      return 'مبلغ سفته'
    }else if (type === "بانک") {
      return 'شماره تضمین'
    }else if (type === "تعهد") {
      return 'شماره تعهد'
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
      title: 'شماره ثبت',
      dataIndex: 'id',
      width: '4.88%',
      fixed: 'left',
      key: 'id',
      ...getColumnSearchProps('id'),
      sorter: (a, b) => a.id - b.id,
      sortOrder: sortedInfo.columnKey === 'id' ? sortedInfo.order : null,
      sortDirections: ['descend', 'ascend'],
      filteredValue: filteredInfo.id || null,
      render: (_value, record) =>
          <>
          {(() => {
            if (record.clearedStatus){
              return (
                  <Space>
                        <Badge color="green" status="processing"/> {record.id}
                  </Space>
              )
            }else if (date.format('YYYY-MM-DD').replaceAll('/' , '-') > record.expireDate){
              return (
                  <Space>
                      <Badge  color="red" status="processing"/> {record.id}
                  </Space>
              )
            }else {
              return record.id
            }
          })()}
          </>
    },{
      align:"center",
      title: 'وضعیت',
      fixed: 'left',
      dataIndex: 'type',
      width: '5%',
      key: 'type',
      filters: [
          {
            text: 'قراردادی',
            value: 'قراردادی',
          },{
            text: 'بیمه ای',
            value: 'بیمه ای',
          }
      ],
      filteredValue: filteredInfo.type || null,
      onFilter: (value, record) => record.type === value,
      
    },{
      align:"center",
      title: 'نام و نشانی',
      fixed: 'left',
      dataIndex: 'full_name',
      width: '7%',
      key: 'full_name',
      ...getColumnSearchProps('full_name'),
      filteredValue: filteredInfo.full_name || null,
       render: (_value, record) => <Button type={"link"} onClick={() => {
        context.setCurrentPersonal(record.id)
        navigate(`/personal/edit/${record.id}`)
      }}>{record.full_name}</Button>,

    },{
      align:"center",
      title: 'شماره پرونده',
      width: '4.55%',
      dataIndex: 'caseNumber',
      key: 'caseNumber',
      filteredValue: filteredInfo.caseNumber || null,
      ...getColumnSearchProps('caseNumber'),

    },{
      align:"center",
      title: 'جنسیت',
      width: '4%',
      dataIndex: 'sex',
      key: 'sex',
      filters: [
          {
            text: 'مذکر',
            value: 'مذکر',
          },{
            text: 'مونث',
            value: 'مونث',
          }
      ],
      filteredValue: filteredInfo.sex || null,
      onFilter: (value, record) => record.sex === value,
      
    },{
      align:"center",
      title: 'تاریخ استخدام',
      dataIndex: 'date',
      width: '5%',
      key: 'date',
      ...getColumnSearchProps('date'),
      filteredValue: filteredInfo.date || null,
      
    },{
      align:"center",
      title: 'کد ملی',
      width: '5.88%',
      dataIndex: 'national_id',
      key: 'national_id',
      ...getColumnSearchProps('national_id'),
      filteredValue: filteredInfo.national_id || null,
      
    },{
      align:"center",
      title: 'شغل',
      width: '5.88%',
      dataIndex: 'job',
      key: 'job',
      ...getColumnSearchProps('job'),
      filteredValue: filteredInfo.job || null,
      
    },{
      align:"center",
      title: 'تضمین مصوب',
      dataIndex: 'approvedPrice',
      width: '5.88%',
      key: 'approvedPrice',
    },{
      align:"center",
      title: 'مبلغ تضمین',
      width: '5.88%',
      dataIndex: 'commitmentPrice',
      key: 'commitmentPrice',

    },{
      align:"center",
      title: 'وثیقه تضمین',
      width: '5%',
      dataIndex: 'typeBail',
      key: 'typeBail',
      filters: [
          {
            text: 'چک',
            value: 'چک',
          },{
            text: 'نقد',
            value: 'نقد',
          },{
            text: 'سفته',
            value: 'سفته',
          },{
            text: 'بانک',
            value: 'بانک',
          },{
            text: 'تعهد',
            value: 'تعهد',
          }
      ],
      filteredValue: filteredInfo.typeBail || null,
      onFilter: (value, record) => record.typeBail === value,
    },{
      align:"center",
      title: 'مشخصه وثیقه',
      dataIndex: 'Bails',
      children:[
        {
          dataIndex: 'firstBail',
          key: 'firstBail',
          align:"center",
          width: '10%',
          render: (_value, record) => handleTypeFirstBail(record.typeBail) + ' : ' + record.firstBail ,

        },{
          dataIndex: 'secondBail',
          key: 'secondBail',
          align:"center",
          width: '10%',
          render: (_value, record) => handleTypeSecondBail(record.typeBail) + ' : ' + record.secondBail ,
        }
      ],
    },{
      align:"center",
      title: 'تاریخ پایان قرارداد',
      dataIndex: 'expireDate',
      width: '6%',
      key: 'expireDate',
      filters: [
          {
            text: 'قراردادهای پایان یافته',
            value: 'قراردادهای پایان یافته',
          }
      ],
      filteredValue: filteredInfo.expireDate || null,
      onFilter: (_value, record) =>
          date.format('YYYY-MM-DD').replaceAll('/' , '-') > record.expireDate,
    },{
      align:"center",
      title: 'وضعیت تسویه',
      width: '5.10%',
      dataIndex: 'clearedStatus',
      key: 'clearedStatus',
      filters: [
          {
            text: 'قراردادهای تسفیه شده',
            value: true,
          }
      ],
      filteredValue: filteredInfo.clearedStatus || null,
      onFilter: (_value, record) =>
          record.clearedStatus,
      render: (_value, record) => record.clearedStatus ?
          <Badge status="success"/> : <Badge status="error"/> ,
    },{
      align:"center",
      title: 'تاریخ تسویه',
      width: '5%',
      dataIndex: 'clearedDate',
      key: 'clearedDate',
    },{
      align:"center",
      title: 'وضعیت مدرک',
      width: '5%',
      dataIndex: 'receivedDocument',
      key: 'receivedDocument',
      render: (_value, record) => record.receivedDocument ? <Badge status="success"/> : <Badge status="error"/> ,

    },{
      align:"center",
      title: 'وضعیت اقرارنامه',
      width: '5%',
      dataIndex: 'affidavitStatus',
      key: 'affidavitStatus',
      render: (_value, record) => record.affidavitStatus ? <Badge status="success"/> : <Badge status="error"/> ,

    },{
      align:"center",
      title: 'محل کار',
      width: '5.88%',
      fixed: 'right',
      dataIndex: 'office',
      key: 'office',
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
      },
    ],
      filteredValue:  context.permission === 'مدیر اداری' || context.permission === 'مشاهده' ? filteredInfo.office  || null : [context.office] || null,
      onFilter: (value, record) => record.office === value,

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


  const onChange = (value: string[]) => {
    setFilteredColumns(value as  string[])
  };


  const options = [
    { label: 'شماره پرونده', value: 'caseNumber' },
    { label: 'جنسیت', value: 'sex' },
    { label: 'تاریخ استخدام', value: 'date' },
    { label: 'کد ملی', value: 'national_id' },
    { label: 'شغل', value: 'job' },
    { label: 'تضمین مصوب', value: 'approvedPrice' },
    { label: 'مبلغ تضمین', value: 'commitmentPrice' },
    { label: 'وثیقه تضمین', value: 'typeBail' },
    { label: 'مشخصه وثیقه', value: 'Bails' },
    { label: 'تاریخ پایان قرارداد', value: 'expireDate' },
    { label: 'وضعیت تسویه', value: 'clearedStatus' },
    { label: 'تاریخ تسویه', value: 'clearedDate' },
    { label: 'وضعیت مدرک', value: 'receivedDocument' },
    { label: 'وضعیت اقرارنامه', value: 'affidavitStatus' },
  ];



  return (
      <>
         <Space style={{ marginBottom: 16 }}>
            <Badge  color="red" status="processing" text="به معنی پایان قرارداد" />
            <Badge  color="green" status="processing" text="به معنی تسویه شده و قفل شده" />
            <Button onClick={clearFilters}>پاک کردن فیتلر ها</Button>
            <Button onClick={clearAll}>پاک کردن فیلتر و مرتب کننده ها</Button>
            <Button ><CSVLink
                filename={"پرسنل.csv"}
                data={contract}
                headers={headers}>اکسل <FileExcelOutlined /></CSVLink></Button>
            <Button onClick={generatePDF}>چاپ</Button>

          </Space>
        <Space style={{ marginBottom: 16, marginRight: 16}}>
           <Select
                mode="multiple"
                allowClear
                style={{ width: 400 }}
                maxTagCount={2}
                placeholder="ستون هایی که میخواهید نمایش داده نشود انتخاب کنید."
                onChange={onChange}
                options={options}
            />
        </Space>

          <Table
                // @ts-ignore
              bordered columns={columns.filter(col => !filteredColumns.includes(col.dataIndex))}
              dataSource={contract}
              tableLayout={"fixed"}
              scroll={{ x: 3010 , y:'60vh'}}
              rowKey="id"
              onChange={handleChange}
              loading={loading}
              pagination={{position:["bottomCenter"]}}
              // rowClassName={(record, index) =>  date.format('YYYY-MM-DD').replaceAll('/' , '-') > record.expireDate  ? 'table-expired-rows' :  ''}
          />
        <TablePrint componentPDF={componentPDF} contract={contract}/>
      </>
  )
};

export default MainPersonal;