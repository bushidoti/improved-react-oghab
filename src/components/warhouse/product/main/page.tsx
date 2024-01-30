import {SearchOutlined} from '@ant-design/icons';
import React, {useContext, useEffect, useRef, useState} from 'react';
import Highlighter from "react-highlight-words";
import type {InputRef, TableProps} from 'antd';
import {Button, Input, Space, Table} from 'antd';
import axios from "axios";
import type {ColumnsType, ColumnType} from 'antd/es/table';
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
    scale: string;
    output: string;
    left_stock: string;
}


type DataIndex = keyof DataType;

interface TypeProduct {
    count:number
    results:[]
}

const MainProduct: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [product, setProduct] = useState<TypeProduct>()
    const [pagination, setPagination] = useState<any>({
        current:1,
        pageSize:10
    })
    const context = useContext(Context)
    const [loading, setLoading] = useState<boolean>();
    const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
    const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});
    const navigate = useNavigate();
    const componentPDF = useRef(null);
    const generatePDF = useReactToPrint({
        content: () => componentPDF.current,
        documentTitle: "کالا ها",
    });
    const [optionCategory, setOptionCategory] = useState<any[]>([]);

    const fetchData = async () => {
        setLoading(true)
        await axios.get(
            `${Url}/api/product/?size=${pagination.pageSize}&page=${pagination.current}&${qs.stringify(filteredInfo, {
                encode: false,
                arrayFormat: 'comma'
            })}&inventory=${context.permission === 'مدیر' || context.permission === 'مشاهده' ? qs.stringify(filteredInfo, {
                encode: false,
                arrayFormat: 'comma'
            }) : context.office}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            }).then(response => {
            return response
        }).then(async data => {
            setProduct(data.data)
        }).then(async () => {
            return await axios.get(`${Url}/api/category-list`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            })
        }).then(response => {
            return response
        }).then(async data => {
            setOptionCategory(data.data)
        }).finally(() => {
            setLoading(false)
        }).catch((error) => {
            if (error.request.status === 403) {
                navigate('/no_access')
            }
        })
    }


    useEffect(() => {
            void fetchData()
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [context.office, JSON.stringify(filteredInfo),pagination])

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
        } else if (dataIndex === "name") {
            return 'نام کالا'
        }
    }


    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (

            <div style={{padding: 8}} onKeyDown={(e) => e.stopPropagation()}>


                <Input
                    ref={searchInput}
                    placeholder={`جستجو ${handleSearchPlaceHolder(dataIndex)}`}
                    value={selectedKeys[0]}
                    onChange={(e) => {
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{marginBottom: 8, display: 'block'}}
                />


                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        جستجو
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{width: 90}}
                    >
                        تنظیم مجدد
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({closeDropdown: false});
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
            <SearchOutlined style={{color: filtered ? '#1677ff' : undefined}}/>
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
                    highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
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
            align: "center",
            title: 'کد کالا',
            dataIndex: 'code',
            width: '4.88%',
            key: 'code',
            ...getColumnSearchProps('code'),
            sorter: (a, b) => a.code - b.code,
            sortOrder: sortedInfo.columnKey === 'code' ? sortedInfo.order : null,
            sortDirections: ['descend', 'ascend'],
            filteredValue: filteredInfo.code || null,
        }, {
            align: "center",
            title: 'نام کالا',
            dataIndex: 'name',
            ellipsis: true,
            width: '7%',
            key: 'name',
            ...getColumnSearchProps('name'),
            filteredValue: filteredInfo.name || null,
            render: (_value, record) => <Button type={"link"} onClick={() => {
                context.setCurrentProduct(record.code)
                navigate(`/warhouse/product/edit/${record.code}`)
            }}>{record.name}</Button>,

        }, {
            align: "center",
            title: 'گروه',
            width: '4.55%',
            dataIndex: 'category',
            key: 'category',
            filters: optionCategory.map((item) => ({text: item.value, value: item.value})),
            filteredValue: filteredInfo.category || null,
            onFilter: (value, record) => record.category === value,
        }, {
            align: "center",
            title: 'ورود',
            width: '4.55%',
            dataIndex: 'input',
            key: 'input',
        }, {
            align: "center",
            title: 'خروج',
            width: '4.55%',
            dataIndex: 'output',
            key: 'output',
        }, {
            align: "center",
            title: 'مانده',
            width: '4.55%',
            dataIndex: 'left_stock',
            key: 'left_stock',
        }, {
            align: "center",
            title: 'مقیاس',
            width: '4.55%',
            dataIndex: 'scale',
            key: 'scale',
        }, {
            align: "center",
            title: 'انبار',
            width: '4.55%',
            dataIndex: 'inventory',
            key: 'inventory',
            filters: [
                {
                    text: 'دفتر مرکزی',
                    value: 'دفتر مرکزی',
                }, {
                    text: 'چابهار',
                    value: 'چابهار',
                }, {
                    text: 'دزفول',
                    value: 'دزفول',
                }, {
                    text: 'جاسک',
                    value: 'جاسک',
                }, {
                    text: 'بیشه کلا',
                    value: 'بیشه کلا',
                }, {
                    text: 'اورهال تهران',
                    value: 'اورهال تهران',
                }, {
                    text: 'اورهال اصفهان',
                    value: 'اورهال اصفهان',
                }
            ],
            filteredValue: context.permission === 'مدیر' || context.permission === 'مشاهده' ? filteredInfo.inventory || null : [context.office] || null,
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

    const handleChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter as SorterResult<DataType>);
        setPagination(pagination);
    };

    return (
        <>
            <Space style={{marginBottom: 16}}>
                <Button onClick={clearFilters}>پاک کردن فیتلر ها</Button>
                <Button onClick={clearAll}>پاک کردن فیلتر و مرتب کننده ها</Button>
                <Button onClick={generatePDF}>چاپ</Button>

            </Space>
            <Table
                bordered
                columns={columns}
                dataSource={product?.results}
                tableLayout={"fixed"}
                scroll={{y: '60vh'}}
                rowKey="code"
                onChange={handleChange}
                loading={loading}
                pagination={{position: ["bottomCenter"],total:product?.count,showSizeChanger:true}}
                // rowClassName={(record, index) =>  date.format('YYYY-MM-DD').replaceAll('/' , '-') > record.expireDate  ? 'table-expired-rows' :  ''}
            />
            <TablePrint componentPDF={componentPDF} contract={product !== undefined ? product?.results : []}/>
        </>
    )
};

export default MainProduct;