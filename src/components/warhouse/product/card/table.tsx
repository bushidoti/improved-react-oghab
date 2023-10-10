import React from "react";

const TablePrint = (props: { componentPDF: React.LegacyRef<HTMLTableElement> | undefined , contract: any[] , productSub: any[];}) => {
  return (
        <div className= 'm-4 table-responsive text-nowrap rounded-3'  style={{display:'none'}}>
        <table className="table table-hover table-fixed text-center align-middle table-bordered border-primary bg-light"
                           ref={props.componentPDF} style={{direction:'rtl' , fontSize:'.56vw'}}>
                         <thead>
                            <tr>
                                <th className= 'th' scope="col">ردیف</th>
                                <th className= 'th' scope="col">سند</th>
                                <th className= 'th' scope="col">شناسه سند</th>
                                <th className= 'th' scope="col">تاریخ</th>
                                <th className= 'th' scope="col">عملیات</th>
                                <th className= 'th' scope="col">مقیاس</th>
                                <th className= 'th' scope="col">تعداد</th>
                                <th className= 'th' scope="col">موجودی</th>
                                <th className= 'th' scope="col">مورد مصرف</th>
                                <th className= 'th' scope="col">خریدار</th>
                                <th className= 'th' scope="col">فروشنده</th>
                                <th className= 'th' scope="col">گیرنده</th>
                                <th className= 'th' scope="col">اصلاحیه</th>
                            </tr>
                         </thead>

                        <tbody>
                            {props.productSub.map((data,i) => (
                                <tr key={data.id}>
                                    <th  className= 'th' scope="row">{i}</th>
                                    <td className= 'td'>{data.document_type}</td>
                                    <td className= 'td'>{data.document_code}</td>
                                    <td className= 'td'>{data.date}</td>
                                    <td className= 'td'>{data.operator}</td>
                                    <td className= 'td'>{data.scale}</td>
                                    <td className= 'td'>{data.operator === 'خروج' ? data.output : data.input }</td>
                                    <td className= 'td'>{data.afterOperator}</td>
                                    <td className= 'td'>{data.consumable}</td>
                                    <td className= 'td'>{data.buyer}</td>
                                    <td className= 'td'>{data.seller}</td>
                                    <td className= 'td'>{data.receiver}</td>
                                    <td className= 'td'>{data.amendment}</td>
                                </tr>
                                ))
                            }
                        </tbody>
                    </table>
                        </div>
  )
}

export default TablePrint;