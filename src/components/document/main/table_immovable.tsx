import React from "react";
import {DateObject} from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";



const TablePrint = (props: { componentPDF: React.LegacyRef<HTMLTableElement> | undefined, document: any[]; }) => {
    const date = new DateObject({calendar: persian})
    return (
        <div style={{display: 'none'}}>
            <table className="table"
                   ref={props.componentPDF} style={{direction: 'rtl', fontSize: '.56vw'}}>
                <thead>
                <tr>
                    <th className='th' scope="col">ردیف</th>
                    <th className='th' scope="col">شماره ثبت</th>
                    <th className='th' scope="col">نوع</th>
                    <th className='th' scope="col">نام</th>
                    <th className='th' scope="col">شماره سند</th>
                    <th className='th' scope="col">پلاک</th>
                    <th className='th' scope="col">آدرس</th>
                    <th className='th' scope="col">مالک</th>
                    <th className='th' scope="col">متراژ</th>
                    <th className='th' scope="col">سال ساخت</th>
                    <th className='th' scope="col">توضیحات</th>
                </tr>
                </thead>

                <tbody>
                {props.document.map((data, i) => (
                    <tr key={data.id}
                        style={{backgroundColor: `${(data.clearedStatus ? 'hsl(0, 100%, 80%)' : null) || (date.format().replaceAll('/', '-') > data.expireDate ? 'hsla(48,100%,50%,0.6)' : null)}`}}>
                        <th className='th' scope="row">{i + 1}</th>
                        <td className='td'>{data.id}</td>
                        <td className='td'>{data.typeEstate}</td>
                        <td className='td'>{data.name}</td>
                        <td className='td'>{data.docNumber}</td>
                        <td className='td'>{data.plate}</td>
                        <td className='td'>{data.address}</td>
                        <td className='td'>{data.landlord}</td>
                        <td className='td'>{data.meter}</td>
                        <td className='td'>{data.madeOf}</td>
                        <td className='td'>{data.description}</td>
                    </tr>
                ))
                }
                </tbody>
            </table>
        </div>
    )
}

export default TablePrint;