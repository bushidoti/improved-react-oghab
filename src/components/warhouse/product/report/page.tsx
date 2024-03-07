import {SearchOutlined} from '@ant-design/icons';
import React, {useContext, useEffect, useRef, useState} from 'react';
import Highlighter from "react-highlight-words";
import {Flex, InputRef, TableProps} from 'antd';
import {Button, Input, Select, Space, Table} from 'antd';
import axios from "axios";
import type {ColumnsType, ColumnType} from 'antd/es/table';
import type {FilterConfirmProps, FilterValue} from 'antd/es/table/interface';
import Url from "../../../api-configue";
import 'dayjs/locale/fa';
import {useNavigate} from "react-router-dom";
import {useReactToPrint} from "react-to-print";
import TablePrint from "./table";
import qs from "qs";
import {DatePicker as DatePickerJalali, JalaliLocaleListener} from "antd-jalali";
import dayjs from "dayjs";
import {Context} from "../../../../context";

interface DataType {
    key: React.Key;
    id: number;
    index: number;
    output: number;
    input: number;
    count: number;
    product: number;
    product_contain: number;
    document_type: string;
    name: string;
    document_code: string;
    date: string;
    systemID: number;
    scale: string;
    category: string;
    operator: string;
    afterOperator: number;
    consumable: string;
    buyer: string;
    seller: string;
    inventory: string;
    receiver: string;
    amendment: string;
}


type DataIndex = keyof DataType;

interface TypeProduct {
    count:number
    results:[]
}


const ReportProduct: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedDoc, setSelectedDoc] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [pagination, setPagination] = useState<any>({
        current:1,
        pageSize:10
    })
    const [loading, setLoading] = useState<boolean>();
    const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
    const navigate = useNavigate();
    const componentPDF = useRef(null);
    const [optionConsumable, setOptionConsumable] = useState<any[]>([]);
    const [productSub, setProductSub] = useState<TypeProduct>()
    const [optionCategory, setOptionCategory] = useState<any[]>([]);
    const context = useContext(Context)
    const [filteredColumns, setFilteredColumns] = useState<string[]>([])
    const [listDocs, setListDocs] = useState<any[]>([]);

    const generatePDF = useReactToPrint({
        content: () => componentPDF.current,
        documentTitle: "کالا ها",
    });

    const fetchData = async () => {
       setLoading(true)
        await axios.get(`${Url}/api/allproducts/?size=${pagination.pageSize}&page=${pagination.current}&fields=product,name,inventory,seller,category,systemID,input,output,document_code,document_type,date,operator,afterOperator,obsolete,consumable,buyer,receiver,amendment,id,scale&${qs.stringify(filteredInfo, {
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


    const fetchDataDocList = async () => {
        setLoading(true)
        await axios.get(`${Url}/api/${selectedDoc === 'فاکتور' ? 'factorsproduct' : 'checksproduct' }/?fields=code,inventory,jsonData&inventory=${context.permission === 'مدیر' ? '' : context.office }`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        }).then(response => {
            return response
        }).then(async data => {
            setListDocs(data.data)
        }).catch((error) => {
            if (error.request.status === 403) {
                navigate('/no_access')
            }
        }).finally(() => setLoading(false)
        )
    }

    useEffect(() => {
            void fetchData()

        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(filteredInfo),pagination])

    useEffect(() => {
            if (selectedDoc !== ''){
                 void fetchDataDocList()
            }

        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedDoc])

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

        if (dataIndex === "document_type") {
            return 'نوع سند'
        } else if (dataIndex === "document_code") {
            return 'شناسه سند'
        } else if (dataIndex === "name") {
            return 'نام کالا'
        } else if (dataIndex === "product") {
            return 'کد کالا'
        } else if (dataIndex === "buyer") {
            return 'خریدار'
        } else if (dataIndex === "seller") {
            return 'فروشنده'
        } else if (dataIndex === "receiver") {
            return 'گیرنده'
        } else if (dataIndex === "amendment") {
            return 'اصلاحیه'
        } else if (dataIndex === "scale") {
            return 'مقیاس'
        }
    }


    const onChange = (value: string[]) => {
        setFilteredColumns(value as string[])
    };


    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
            <div style={{padding: 8}} onKeyDown={(e) => e.stopPropagation()}>


                {dataIndex === "date" ?
                    <>
                        <JalaliLocaleListener/>
                        <DatePickerJalali
                            onChange={function (dateString: string) {
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
                        }}
                        onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        style={{marginBottom: 8, display: 'block'}}
                    />
                }


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
            title: 'ردیف',
            dataIndex: 'index',
            fixed: "left",
            width: '3%',
            key: 'index',
            render: (_value, _record, index) => index + 1,
        },{
            align: "center",
            title: 'نام کالا',
            dataIndex: 'name',
            fixed: "left",
            width: '5%',
            key: 'name',
            ...getColumnSearchProps('name'),
            filteredValue: filteredInfo.name || null,
        }, {
            align: "center",
            title: 'کد کالا',
            dataIndex: 'product',
            width: '4.88%',
            key: 'product_contain',
            ...getColumnSearchProps('product'),
            filteredValue: filteredInfo.product_contain || null,
        },{
            align: "center",
            title: 'گروه',
            dataIndex: 'category',
            width: '5%',
            key: 'category',
            filters: optionCategory.map((item) => ({text: item.value, value: item.value})),
            filteredValue: filteredInfo.category || null,
            onFilter: (value, record) => record.category === value,
        }, {
            align: "center",
            title: 'نوع سند',
            dataIndex: 'document_type',
            width: '5%',
            key: 'document_type',
            ...getColumnSearchProps('document_type'),
            filteredValue: filteredInfo.document_type || null,
        }, {
            align: "center",
            title: 'شماره ثبت سیستم',
            dataIndex: 'systemID',
            width: '5%',
            key: 'systemID',
            render: (_value, record) => <Button type={"link"} onClick={() => {
                if (record.document_type === 'فاکتور'){
                    context.setCurrentProductFactor(record.systemID)
                }else if (record.document_type === 'حواله'){
                    context.setCurrentProductCheck(record.systemID)
                }
                context.setCurrentProductDoc(record.document_type)
                navigate(`/warhouse/product/editDoc/${record.document_type}/${record.systemID}`)
            }}>{record.systemID}</Button>,
        }, {
            align: "center",
            title: 'شناسه سند',
            dataIndex: 'document_code',
            width: '7%',
            key: 'document_code',
            ...getColumnSearchProps('document_code'),
            filteredValue: filteredInfo.document_code || null,
        }, {
            align: "center",
            title: 'تاریخ',
            dataIndex: 'date',
            width: '5%',
            key: 'date',
            ...getColumnSearchProps('date'),
            filteredValue: filteredInfo.date || null,
        }, {
            align: "center",
            title: 'عملیات',
            dataIndex: 'operator',
            width: '6%',
            key: 'operator',
            filters: [
                {
                    text: 'ورود',
                    value: 'ورود',
                }, {
                    text: 'خروج',
                    value: 'خروج',
                }, {
                    text: 'ثبت اولیه',
                    value: 'ثبت اولیه',
                }
            ],
            onFilter: (value, record) => record.operator === value,
            filteredValue: filteredInfo.operator || null,
        }, {
            align: "center",
            title: 'مقیاس',
            dataIndex: 'scale',
            width: '7%',
            key: 'scale',
            ...getColumnSearchProps('scale'),
            filteredValue: filteredInfo.scale || null,
        }, {
            align: "center",
            title: 'تعداد',
            dataIndex: 'count',
            width: '5%',
            key: 'count',
            render: (_value, record) => record.operator === 'خروج' ? record.output : record.input
        }, {
            align: "center",
            title: 'موجودی',
            dataIndex: 'afterOperator',
            width: '5%',
            key: 'afterOperator',
        }, {
            align: "center",
            title: 'مورد مصرف',
            dataIndex: 'consumable',
            width: '7%',
            key: 'consumable',
            filters: optionConsumable.map((item) => ({text: item.value, value: item.value})),
            filteredValue: filteredInfo.consumable || null,
            onFilter: (value, record) => record.consumable === value,
        }, {
            align: "center",
            title: 'خریدار',
            dataIndex: 'buyer',
            width: '7%',
            key: 'buyer',
            ...getColumnSearchProps('buyer'),
            filteredValue: filteredInfo.buyer || null,
        }, {
            align: "center",
            title: 'فروشنده',
            dataIndex: 'seller',
            width: '7%',
            key: 'seller',
            ...getColumnSearchProps('seller'),
            filteredValue: filteredInfo.seller || null,
        }, {
            align: "center",
            title: 'گیرنده',
            dataIndex: 'receiver',
            width: '7%',
            key: 'receiver',
            ...getColumnSearchProps('receiver'),
            filteredValue: filteredInfo.receiver || null,
        }, {
            align: "center",
            title: 'اصلاحیه',
            dataIndex: 'amendment',
            width: '7%',
            key: 'amendment',
            ...getColumnSearchProps('amendment'),
            filteredValue: filteredInfo.amendment || null,
        }, {
            align: "center",
            title: 'انبار',
            dataIndex: 'inventory',
            fixed: "right",
            width: '5%',
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
    };

    const handleChange: TableProps<DataType>['onChange'] = (pagination, filters) => {
        setFilteredInfo(filters);
        setPagination(pagination);
    };


    const options = [
        {label: 'گروه', value: 'category'},
        {label: 'نوع سند', value: 'document_type'},
        {label: 'شماره ثبت سیستم', value: 'systemID'},
        {label: 'شناسه سند', value: 'document_code'},
        {label: 'تاریخ', value: 'date'},
        {label: 'عملیات', value: 'operator'},
        {label: 'مورد مصرف', value: 'consumable'},
        {label: 'خریدار', value: 'buyer'},
        {label: 'فروشنده', value: 'seller'},
        {label: 'گیرنده', value: 'receiver'},
        {label: 'اصلاحیه', value: 'amendment'},
    ];


    const optionsDoc = [
        {
            value: 'حواله',
            label: 'حواله',
        },
        {
            value: 'فاکتور',
            label: 'فاکتور',
        }
    ]

    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <>
            <Space style={{marginBottom: 16}}>
                <Button onClick={clearFilters}>پاک کردن فیتلر ها</Button>
                <Button onClick={clearAll}>پاک کردن فیلتر و مرتب کننده ها</Button>
                <Button onClick={generatePDF}>چاپ</Button>
            </Space>
            <Flex wrap="wrap" gap="large" className='mb-4'>
                <Space.Compact>
                    <Select
                        style={{width: 170}}
                        loading={loading}
                        onChange={value => setSelectedDoc(value)}
                        placeholder="مدرک مورد نظر"
                        options={optionsDoc}
                    />
                    <Select placeholder={`${selectedDoc} انتخاب کنید`}
                            optionFilterProp="children"
                            style={{width: 400}}
                            allowClear
                            showSearch
                            disabled={selectedDoc === ''}
                            loading={loading}
                            onChange={(value) => {
                                if (selectedDoc === 'فاکتور') {
                                    context.setCurrentProductFactor(Number(value))
                                } else if (selectedDoc === 'حواله') {
                                    context.setCurrentProductCheck(Number(value))
                                }
                            }}
                            filterOption={filterOption}
                            options={listDocs.map((item) => ({
                                label: ' کد سیستم ' + item.code +   ` شناسه ${selectedDoc} `  + (selectedDoc === 'فاکتور' ? item.jsonData[0].document_code : item.jsonData[0].checkCode) + ' انبار ' + item.inventory,
                                value: item.code
                            }))}
                    />
                    <Button type={"primary"} loading={loading} disabled={selectedDoc === ''} onClick={() => {
                        if (selectedDoc === 'فاکتور') {
                            navigate(`/warhouse/product/factor/${context.currentProductFactor}`)
                        } else if (selectedDoc === 'حواله') {
                            navigate(`/warhouse/product/check/${context.currentProductCheck}`)
                        }
                    }}>مشاهده</Button>
                </Space.Compact>
                <Select
                    mode="multiple"
                    allowClear
                    style={{width: 400}}
                    maxTagCount={2}
                    placeholder="ستون هایی که میخواهید نمایش داده نشود انتخاب کنید."
                    onChange={onChange}
                    options={options}
                />
            </Flex>
            <Table
                bordered
                columns={columns.filter(col => !filteredColumns.includes(col.key as string))}
                dataSource={productSub?.results}
                tableLayout={"fixed"}
                scroll={{x: 3010, y: '60vh'}}
                rowKey="id"
                onChange={handleChange}
                loading={loading}
                pagination={{position: ["bottomCenter"],total:productSub?.count,showSizeChanger:true}}
            />
            <TablePrint componentPDF={componentPDF} productSub={productSub !== undefined ? productSub?.results : []}/>
        </>
    )
};

export default ReportProduct;