import { SearchOutlined } from '@ant-design/icons';
import React, {useEffect, useRef, useState} from 'react';
import Highlighter from "react-highlight-words";
import type {InputRef, TableProps} from 'antd';
import { Button, Input, Space, Table } from 'antd';
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

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`جستجو ${dataIndex}`}
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
      key: 'id',
      width: '15%',
      ...getColumnSearchProps('id'),
      sorter: (a, b) => a.id - b.id,
      sortOrder: sortedInfo.columnKey === 'id' ? sortedInfo.order : null,
      sortDirections: ['descend', 'ascend'],
      filteredValue: filteredInfo.id || null,
      ellipsis: true,
    },{
      align:"center",
      title: 'وضعیت',
      dataIndex: 'type',
      key: 'type',
      width: '20%',
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
      ellipsis: true,
    },{
      align:"center",
      title: 'نام و نشانی',
      dataIndex: 'full_name',
      key: 'full_name',
      width: '30%',
      ...getColumnSearchProps('full_name'),
      filteredValue: filteredInfo.full_name || null,
      ellipsis: true,
    },{
      align:"center",
      title: 'شغل',
      dataIndex: 'job',
      key: 'job',
      width: '20%',
      ...getColumnSearchProps('job'),
      filteredValue: filteredInfo.job || null,
      ellipsis: true,
    },
    {
      align:"center",
      title: 'محل کار',
      dataIndex: 'office',
      ellipsis: true,
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
          <Table bordered columns={columns} dataSource={contract} rowKey="id" onChange={handleChange}  loading={loading} pagination={{position:["bottomCenter"]}}/>;
      </>
  )
};

export default MainPersonal;