import React from "react";

interface Factor {
  code: number;
  factor: string;
  inventory: string;
  jsonData: any[];
}
const TableFactorPrint = (props: { componentPDF: React.LegacyRef<HTMLTableElement> | undefined, Factor: Factor}) => {
  return (
        <div className= 'm-4 table-responsive text-nowrap rounded-3'  style={{display:'none'}}>
        <table className="table table-hover table-fixed text-center align-middle table-bordered border-primary bg-light"
                           ref={props.componentPDF} style={{direction:'rtl' , fontSize:'.56vw'}}>
                         <thead>
                             <tr>
                                <td colSpan={10} className= 'td'>
                                    {`فاکتور با کد سیستم ${props.Factor.code} و شماره فاکتور ${props.Factor.jsonData[0].document_code} در انبار ${props.Factor.inventory} ثبت شده است. `}
                                </td>
                             </tr>
                            <tr>
                                <th className= 'th' scope="col">ردیف</th>
                                <th className= 'th' scope="col">کد کالا</th>
                                <th className= 'th' scope="col">نام کالا</th>
                                <th className= 'th' scope="col">تعداد</th>
                                <th className= 'th' scope="col">مقیاس</th>
                                <th className= 'th' scope="col">گروه</th>
                                <th className= 'th' scope="col">تاریخ</th>
                                <th className= 'th' scope="col">گیرنده</th>
                                <th className= 'th' scope="col">خریدار</th>
                                <th className= 'th' scope="col">فروشنده</th>

                            </tr>
                         </thead>

                        <tbody>
                            {props.Factor.jsonData.map((data,i) => (
                                <tr key={data.product}>
                                    <th  className= 'th' scope="row">{i + 1}</th>
                                    <td className= 'td'>{data.product}</td>
                                    <td className= 'td'>{data.name}</td>
                                    <td className= 'td'>{data.input}</td>
                                    <td className= 'td'>{data.scale}</td>
                                    <td className= 'td'>{data.category}</td>
                                    <td className= 'td'>{data.date}</td>
                                    <td className= 'td'>{data.receiver}</td>
                                    <td className= 'td'>{data.buyer}</td>
                                    <td className= 'td'>{data.seller}</td>
                                </tr>
                                ))
                            }
                            <tr className='bg-light'>
                                  <td className= 'td' style={{padding:15}} colSpan={5} >مهر و امضای خریدار</td>
                                  <td className= 'td' style={{padding:15}} colSpan={5} >مهر و امضای گیرنده</td>
                            </tr>
                        </tbody>
                    </table>
                        </div>
  )
}

export default TableFactorPrint;