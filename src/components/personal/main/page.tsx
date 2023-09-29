import { SearchOutlined } from '@ant-design/icons';
import React, {useEffect, useRef, useState} from 'react';
import Highlighter from "react-highlight-words";
import type {InputRef, TableProps} from 'antd';
import {Badge, Button, Input, Space, Table} from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type {FilterConfirmProps, FilterValue, SorterResult} from 'antd/es/table/interface';
import Url from "../../api-configue";

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
  firstBail: string;
  secondBail: string;
  expireDate: string;
  clearedDate: string;
  clearedStatus : boolean;
  receivedDocument  : boolean;
  affidavitStatus  : boolean;
}

type DataIndex = keyof DataType;



const MainPersonal: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [contract, setContracts] = useState([])
  const [loading, setLoading] = useState(true);
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});

  const fetchData = async () => {
        await fetch(`${Url}/api/persons/?fields=affidavitStatus,id,type,full_name,expireDate,date,national_id,sex,office,job,approvedPrice,commitmentPrice,typeBail,firstBail,secondBail,clearedStatus,clearedDate,receivedDocument` , {
             headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
        }).then(res => res.json()).then(data => {
            setContracts(data)
        }
        )
        .finally(() => {
            setLoading(false)
        })
      }


  useEffect(() => {
            void fetchData()
          },
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [])

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
        <Input
          ref={searchInput}
          placeholder={`جستجو ${handleSearchPlaceHolder(dataIndex)}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
      width: '5.88%',
      key: 'full_name',
      ...getColumnSearchProps('full_name'),
      filteredValue: filteredInfo.full_name || null,
      
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
      children:[
        {
          dataIndex: 'firstBail',
          key: 'firstBail',
          align:"center",
          width: '10%',
          render: (value, record, index) => handleTypeFirstBail(record.typeBail) + ' : ' + record.firstBail ,

        },{
          dataIndex: 'secondBail',
          key: 'secondBail',
          align:"center",
          width: '10%',
          render: (value, record, index) => handleTypeSecondBail(record.typeBail) + ' : ' + record.secondBail ,
        }
      ],
    },{
      align:"center",
      title: 'تاریخ پایان قرارداد',
      dataIndex: 'expireDate',
      width: '5%',
      key: 'expireDate',
      ...getColumnSearchProps('expireDate'),
      filteredValue: filteredInfo.expireDate || null,

    },{
      align:"center",
      title: 'وضعیت تسویه',
      width: '5%',
      dataIndex: 'clearedStatus',
      key: 'clearedStatus',
      render: (value, record, index) => record.clearedStatus ? <Badge status="success"/> : <Badge status="error"/> ,


    },{
      align:"center",
      title: 'تاریخ تسویه',
      width: '5%',
      dataIndex: 'clearedDate',
      key: 'clearedDate',
      ...getColumnSearchProps('clearedDate'),
      filteredValue: filteredInfo.expireDate || null,

    },{
      align:"center",
      title: 'وضعیت مدرک',
      width: '5%',
      dataIndex: 'receivedDocument',
      key: 'receivedDocument',
      render: (value, record, index) => record.receivedDocument ? <Badge status="success"/> : <Badge status="error"/> ,

    },{
      align:"center",
      title: 'وضعیت اقرارنامه',
      width: '5%',
      dataIndex: 'affidavitStatus',
      key: 'affidavitStatus',
      render: (value, record, index) => record.affidavitStatus ? <Badge status="success"/> : <Badge status="error"/> ,

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
      filteredValue: filteredInfo.office || null,
      onFilter: (value, record) => record.office === value,
    },
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
          </Space>
          <Table bordered columns={columns}  dataSource={contract} scroll={{ x: 3000 }} rowKey="id" onChange={handleChange}  loading={loading} pagination={{position:["bottomCenter"]}}/>;
      </>
  )
};

export default MainPersonal;