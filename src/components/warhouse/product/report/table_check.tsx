import React from "react";

interface Check {
  code: number;
  checks: string;
  inventory: string;
  jsonData: any[];
}
const TableCheckPrint = (props: { componentPDF: React.LegacyRef<HTMLTableElement> | undefined, Check: Check}) => {
  return (
        <div className= 'm-4 table-responsive text-nowrap rounded-3'  style={{display:'none'}}>
        <table className="table table-hover table-fixed text-center align-middle table-bordered border-primary bg-light"
                           ref={props.componentPDF} style={{direction:'rtl' , fontSize:'.56vw'}}>
                         <thead>
                             <tr>
                                <td colSpan={8} className= 'td'>
                                    {`حواله با کد سیستم ${props.Check.code} در انبار ${props.Check.inventory} ثبت شده است. `}
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
                            </tr>
                         </thead>

                        <tbody>
                            {props.Check.jsonData.map((data,i) => (
                                <tr key={data.product}>
                                    <th  className= 'th' scope="row">{i + 1}</th>
                                    <td className= 'td'>{data.product}</td>
                                    <td className= 'td'>{data.name}</td>
                                    <td className= 'td'>{data.output}</td>
                                    <td className= 'td'>{data.scale}</td>
                                    <td className= 'td'>{data.category}</td>
                                    <td className= 'td'>{data.date}</td>
                                    <td className= 'td'>{data.receiver}</td>
                                </tr>
                                ))
                            }
                             <tr>
                                   <td  className= 'td' style={{padding:15}} colSpan={4}>مهر و امضای تحویل دهنده</td>
                                   <td  className= 'td' style={{padding:15}} colSpan={4}>مهر و امضای گیرنده</td>
                            </tr>
                        </tbody>
                    </table>
                        </div>
  )
}

export default TableCheckPrint;