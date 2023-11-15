import React from "react";

const TablePrint = (props: {
    componentPDF: React.LegacyRef<HTMLTableElement> | undefined,
    property: any[]
}) => {
    return (
        <div className='m-4 table-responsive text-nowrap rounded-3' style={{display: 'none'}}>
            <table
                className="table table-hover table-fixed text-center align-middle table-bordered border-primary bg-light"
                ref={props.componentPDF} style={{direction: 'rtl', fontSize: '.56vw'}}>
                <thead>
                <tr>
                    <th className='th' scope="col">ردیف</th>
                    <th className='th' scope="col">کد اموال</th>
                    <th className='th' scope="col">نام اموال</th>
                    <th className='th' scope="col">دسته</th>
                    <th className='th' scope="col">نوع دستگاه</th>
                    <th className='th' scope="col">شماره اموال</th>
                    <th className='th' scope="col">شماره ثبت سیستم</th>
                    <th className='th' scope="col">شناسه فاکتور</th>
                    <th className='th' scope="col">مدل</th>
                    <th className='th' scope="col">کیس</th>
                    <th className='th' scope="col">هارد</th>
                    <th className='th' scope="col">پاور</th>
                    <th className='th' scope="col">رم</th>
                    <th className='th' scope="col">پردازنده</th>
                    <th className='th' scope="col">مادربرد</th>
                    <th className='th' scope="col">ویژگی تلفن</th>
                    <th className='th' scope="col">محل نصب</th>
                    <th className='th' scope="col">انبار</th>
                </tr>
                </thead>

                <tbody>
                {props.property.map((data, i) => (
                    <tr key={data.code}>
                        <th className='th' scope="row">{i + 1}</th>
                        <td className='td'>{data.code}</td>
                        <td className='td'>{data.name}</td>
                        <td className='td'>{data.category}</td>
                        <td className='td'>{data.sub_item_type}</td>
                        <td className='td'>{data.property_number}</td>
                        <td className='td'>{data.factorCode}</td>
                        <td className='td'>{data.document_code}</td>
                        <td className='td'>{data.model}</td>
                        <td className='td'>{data.case}</td>
                        <td className='td'>{data.hdd}</td>
                        <td className='td'>{data.power}</td>
                        <td className='td'>{data.ram}</td>
                        <td className='td'>{data.motherboard}</td>
                        <td className='td'>{data.cpu}</td>
                        <td className='td'>{data.phone_feature}</td>
                        <td className='td'>{data.install_location}</td>
                        <td className='td'>{data.inventory}</td>
                    </tr>
                ))
                }
                </tbody>
            </table>
        </div>
    )
}

export default TablePrint;