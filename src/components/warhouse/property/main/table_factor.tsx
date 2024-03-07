import React from "react";

interface Factor {
    code: number;
    factor: string;
    factor_type: string;
    inventory: string;
    jsonData: any[];
}



const TableFactorPrint = (props: { componentPDF: React.LegacyRef<HTMLTableElement> | undefined, Factor: Factor, property: any }) => {
    return (
        <div className='m-4 table-responsive text-nowrap rounded-3' style={{display: 'none'}}>
            <table
                className="table table-hover table-fixed text-center align-middle table-bordered border-primary bg-light"
                ref={props.componentPDF} style={{direction: 'rtl', fontSize: '.56vw'}}>
                <thead>
                <tr>
                    <td colSpan={4} className='td'>
                        {`فاکتور با کد سیستم ${props.Factor.code} و شماره فاکتور ${props.Factor.jsonData[0]?.document_code} در انبار ${props.Factor.inventory} ثبت شده است. `}
                    </td>
                </tr>
                 {props.Factor.factor_type === 'ثبت اولیه / خرید' ?
                       <tr>
                            <th className='th' scope="col">ردیف</th>
                            <th className='th' scope="col">کد کالا</th>
                            <th className='th' scope="col">نام کالا</th>
                            <th className='th' scope="col">گروه</th>
                       </tr>
                        :
                       <tr>
                            <th className='th' scope="col">ردیف</th>
                            <th className='th' scope="col">کد کالا</th>
                            <th className='th' scope="col">نام کالا</th>
                            <th className='th' scope="col">شرح</th>
                        </tr>

                    }

                </thead>

                <tbody>

                {props.Factor.jsonData.map((data, i) => (
                    <tr key={data.code}>
                        {props.Factor.factor_type === 'ثبت اولیه / خرید' ?
                            <>
                                <th className='th' scope="row">{i + 1}</th>
                                <td className='td'>{data.code}</td>
                                <td className='td'>{data.name}</td>
                                <td className='td'>{data.category}</td>
                            </>
                            :
                            <>
                                <th className='th' scope="row">{i + 1}</th>
                                <td className='td'>{data.property}</td>
                                <td className='td'>{props.property.filter((property: { code: any; }) => property.code === data.property).map((data: { name: any; }) => {
                                    return data.name
                                })}</td>
                                <td className='td'>{data.description}</td>
                            </>
                        }
                    </tr>
                ))
                }
                <tr>
                    <td className='td' style={{padding: 15}} colSpan={2}>مهر و امضای خریدار</td>
                    <td className='td' style={{padding: 15}} colSpan={2}>مهر و امضای گیرنده</td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}

export default TableFactorPrint;