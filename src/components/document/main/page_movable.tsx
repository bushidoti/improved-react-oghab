import {SearchOutlined} from '@ant-design/icons';
import React, {useContext, useEffect, useRef, useState} from 'react';
import Highlighter from "react-highlight-words";
import type {InputRef, TableProps} from 'antd';
import {Badge, Button, Input, Select, Space, Table} from 'antd';
import axios from "axios";
import type {ColumnsType, ColumnType} from 'antd/es/table';
import type {FilterConfirmProps, FilterValue, SorterResult} from 'antd/es/table/interface';
import Url from "../../api-configue";
import 'dayjs/locale/fa';
import {Context} from "../../../context";
import {useNavigate} from "react-router-dom";
import qs from 'qs';
import {useReactToPrint} from "react-to-print";
import TablePrint from "./table_movable";

interface DataType {
    key: React.Key;
    id: number;
    typeVehicle: string;
    name: string;
    docNumber: string;
    motorNumber: string;
    chassisNumber: string;
    owner: string;
    model: string;
    madeOf: string;
    part1plate: string;
    part2plate: string;
    part3plate: string;
    location: string;
    cityPlate: string;
    descriptionLocation: string;
    paperDoc: string;
    insurancePaper: string;
    gasCard: string;
    carCard: string;
    description: string;
    soldDate: string;
    buyer: string;
    soldStatus: boolean;
}


type DataIndex = keyof DataType;

interface TypeContract {
    count:number
    results:[]
}

const MainMovable: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [document, setDocument] = useState<TypeContract>()
    const [pagination, setPagination] = useState<any>({
        current:1,
        pageSize:10
    })
    const context = useContext(Context)
    const [loading, setLoading] = useState<boolean>();
    const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
    const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});
    const navigate = useNavigate();
    const [filteredColumns, setFilteredColumns] = useState<string[]>([])
    const componentPDF = useRef(null);
    const generatePDF = useReactToPrint({
        content: () => componentPDF.current,
        documentTitle: "اشخاص",
    });


    const fetchData = async () => {
        setLoading(true)
        await axios.get(`${Url}/api/movable/?size=${pagination.pageSize}&page=${pagination.current}&fields=id,typeVehicle,name,docNumber,motorNumber,chassisNumber,owner,model,madeOf,part1plate,part2plate,part3plate,location,cityPlate,descriptionLocation,paperDoc,insurancePaper,gasCard,carCard,description,soldDate,buyer,soldStatus,&${qs.stringify(filteredInfo, {
            encode: false,
            arrayFormat: 'comma'
        })}&location=${context.permission === 'مدیر اداری' || context.permission === 'مشاهده' ? qs.stringify(filteredInfo, {
            encode: false,
            arrayFormat: 'comma'
        }) : context.office}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        }).then(response => {
            return response
        }).then(async data => {
            setDocument(data.data)
        })
            .finally(() => {
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
        if (dataIndex === "id") {
            return 'کد ثبت'
        } else if (dataIndex === "name") {
            return 'نام دستگاه'
        } else if (dataIndex === "docNumber") {
            return 'شماره سند'
        } else if (dataIndex === "motorNumber") {
            return 'شماره موتور'
        } else if (dataIndex === "chassisNumber") {
            return 'شماره شاسی'
        } else if (dataIndex === "owner") {
            return 'مالک'
        } else if (dataIndex === "model") {
            return 'مدل'
        } else if (dataIndex === "descriptionLocation") {
            return 'محل استقرار'
        } else if (dataIndex === "paperDoc") {
            return 'برگ سند'
        } else if (dataIndex === "insurancePaper") {
            return 'بیمه نامه'
        } else if (dataIndex === "gasCard") {
            return 'کارت سوخت'
        } else if (dataIndex === "carCard") {
            return 'کارت ماشین'
        } else if (dataIndex === "madeOf") {
            return 'سال ساخت'
        } else if (dataIndex === "description") {
            return 'توضیحات'
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
            title: 'شماره ثبت',
            dataIndex: 'id',
            width: '6.30%',
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
                        if (record.soldStatus) {
                            return (
                                <Space>
                                    <Badge color="red" status="processing"/> {record.id}
                                </Space>
                            )
                        } else {
                            return record.id
                        }
                    })()}
                </>
        }, {
            align: "center",
            title: 'نوع خودرو',
            fixed: 'left',
            dataIndex: 'typeVehicle',
            width: '5%',
            key: 'typeVehicle',
            filters: [
                {
                    text: 'خودرو سواری',
                    value: 'خودرو سواری',
                }, {
                    text: 'خودرو فرودگاهی',
                    value: 'خودرو فرودگاهی',
                }
            ],
            filteredValue: filteredInfo.typeVehicle || null,
            onFilter: (value, record) => record.typeVehicle === value,

        }, {
            align: "center",
            title: 'نام دستگاه',
            fixed: 'left',
            dataIndex: 'name',
            width: '7%',
            key: 'name',
            ...getColumnSearchProps('name'),
            filteredValue: filteredInfo.name || null,
            render: (_value, record) => <Button type={"link"} onClick={() => {
                context.setCurrentDocProperty(record.id)
                navigate(`/document/movable/edit/${record.id}`)
            }}>{record.name}</Button>,
        }, {
            align: "center",
            title: 'شماره سند',
            width: '6.30%',
            dataIndex: 'docNumber',
            key: 'docNumber',
            filteredValue: filteredInfo.docNumber || null,
            ...getColumnSearchProps('docNumber'),

        }, {
            align: "center",
            title: 'شماره موتور',
            dataIndex: 'motorNumber',
            width: '6%',
            key: 'date',
            ...getColumnSearchProps('motorNumber'),
            filteredValue: filteredInfo.motorNumber || null,

        }, {
            align: "center",
            title: 'شماره شاسی',
            width: '6%',
            dataIndex: 'chassisNumber',
            key: 'chassisNumber',
            ...getColumnSearchProps('chassisNumber'),
            filteredValue: filteredInfo.chassisNumber || null,

        }, {
            align: "center",
            title: 'مالک',
            width: '7%',
            dataIndex: 'owner',
            key: 'owner',
            ...getColumnSearchProps('owner'),
            filteredValue: filteredInfo.owner || null,

        }, {
            align: "center",
            title: 'مدل',
            dataIndex: 'model',
            width: '6%',
            key: 'model',
            ...getColumnSearchProps('model'),
            filteredValue: filteredInfo.model || null,
        }, {
            align: "center",
            title: 'سال ساخت',
            dataIndex: 'madeOf',
            width: '6%',
            key: 'madeOf',
            ...getColumnSearchProps('madeOf'),
            filteredValue: filteredInfo.madeOf || null,
        }, {
            align: "center",
            title: 'پلاک',
            dataIndex: 'plate',
            width: '6%',
            key: 'plate',
            render: (_value, record) => record.part3plate + ' / ' + record.part2plate + ' - ' + record.cityPlate + ' - ' + record.part1plate,
        }, {
            align: "center",
            title: 'محل استقرار',
            dataIndex: 'descriptionLocation',
            width: '6%',
            key: 'descriptionLocation',
            ...getColumnSearchProps('descriptionLocation'),
            filteredValue: filteredInfo.descriptionLocation || null,
        }, {
            align: "center",
            title: 'برگ سند',
            dataIndex: 'paperDoc',
            width: '6%',
            key: 'paperDoc',
            ...getColumnSearchProps('paperDoc'),
            filteredValue: filteredInfo.paperDoc || null,
        }, {
            align: "center",
            title: 'بیمه نامه',
            dataIndex: 'insurancePaper',
            width: '6%',
            key: 'insurancePaper',
            ...getColumnSearchProps('insurancePaper'),
            filteredValue: filteredInfo.insurancePaper || null,
        }, {
            align: "center",
            title: 'کارت سوخت',
            dataIndex: 'gasCard',
            width: '6%',
            key: 'gasCard',
            ...getColumnSearchProps('gasCard'),
            filteredValue: filteredInfo.gasCard || null,
        }, {
            align: "center",
            title: 'کارت ماشین',
            dataIndex: 'carCard',
            width: '6%',
            key: 'carCard',
            ...getColumnSearchProps('carCard'),
            filteredValue: filteredInfo.carCard || null,
        }, {
            align: "center",
            title: 'توضیحات',
            dataIndex: 'description',
            width: '6%',
            key: 'description',
            ...getColumnSearchProps('description'),
            filteredValue: filteredInfo.description || null,
        }, {
            align: "center",
            title: 'محل',
            width: '6%',
            fixed: 'right',
            dataIndex: 'location',
            key: 'location',
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
                },
            ],
            filteredValue: context.permission === 'مدیر اداری' || context.permission === 'مشاهده' ? filteredInfo.location || null : [context.office] || null,
            onFilter: (value, record) => record.location === value,

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


    const onChange = (value: string[]) => {
        setFilteredColumns(value as string[])
    };


    const options = [
        {label: 'شماره سند', value: 'docNumber'},
        {label: 'شماره موتور', value: 'motorNumber'},
        {label: 'شماره شاسی', value: 'chassisNumber'},
        {label: 'مالک', value: 'owner'},
        {label: 'مدل', value: 'model'},
        {label: 'پلاک', value: 'plate'},
        {label: 'محل استقرار', value: 'descriptionLocation'},
        {label: 'برگ سند', value: 'paperDoc'},
        {label: 'بیمه نامه', value: 'insurancePaper'},
        {label: 'کارت سوخت', value: 'gasCard'},
        {label: 'کارت ماشین', value: 'carCard'},
        {label: 'توضیحات', value: 'description'},
    ];

    return (
        <>
            <Space style={{marginBottom: 16}}>
                <Badge color="red" status="processing" text="به معنی فروخته شده"/>
                <Button onClick={clearFilters}>پاک کردن فیتلر ها</Button>
                <Button onClick={clearAll}>پاک کردن فیلتر و مرتب کننده ها</Button>
                <Button onClick={generatePDF}>چاپ</Button>
            </Space>
            <Space style={{marginBottom: 16, marginRight: 16}}>
                <Select
                    mode="multiple"
                    allowClear
                    style={{width: 400}}
                    maxTagCount={2}
                    placeholder="ستون هایی که میخواهید نمایش داده نشود انتخاب کنید."
                    onChange={onChange}
                    options={options}
                />
            </Space>

            <Table
                bordered
                columns={columns.filter(col => !filteredColumns.includes(col.key as string))}
                dataSource={document?.results}
                tableLayout={"fixed"}
                scroll={{x: 3200, y: '60vh'}}
                rowKey="id"
                onChange={handleChange}
                loading={loading}
                pagination={{position: ["bottomCenter"], total:document?.count,showSizeChanger:true}}
            />
            <TablePrint componentPDF={componentPDF} document={document !== undefined ? document?.results : []}/>
        </>
    )
};

export default MainMovable;