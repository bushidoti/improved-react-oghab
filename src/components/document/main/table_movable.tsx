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
                    <th className='th' scope="col">نوع خودرو</th>
                    <th className='th' scope="col">نام دستگاه</th>
                    <th className='th' scope="col">شماره سند</th>
                    <th className='th' scope="col">شماره موتور</th>
                    <th className='th' scope="col">شماره شاسی</th>
                    <th className='th' scope="col">مالک</th>
                    <th className='th' scope="col">مدل</th>
                    <th className='th' scope="col">سال ساخت</th>
                    <th className='th' scope="col">پلاک</th>
                    <th className='th' scope="col">محل استقرار</th>
                    <th className='th' scope="col">برگ سند</th>
                    <th className='th' scope="col">بیمه نامه</th>
                    <th className='th' scope="col">کارت سوخت</th>
                    <th className='th' scope="col">کارت ماشین</th>
                    <th className='th' scope="col">توضیحات</th>
                </tr>
                </thead>

                <tbody>
                {props.document.map((data, i) => (
                    <tr key={data.id}
                        style={{backgroundColor: `${(data.clearedStatus ? 'hsl(0, 100%, 80%)' : null) || (date.format().replaceAll('/', '-') > data.expireDate ? 'hsla(48,100%,50%,0.6)' : null)}`}}>
                        <th className='th' scope="row">{i + 1}</th>
                        <td className='td'>{data.id}</td>
                        <td className='td'>{data.typeVehicle}</td>
                        <td className='td'>{data.name}</td>
                        <td className='td'>{data.docNumber}</td>
                        <td className='td'>{data.motorNumber}</td>
                        <td className='td'>{data.chassisNumber}</td>
                        <td className='td'>{data.owner}</td>
                        <td className='td'>{data.model}</td>
                        <td className='td'>{data.madeOf}</td>
                        <td className='td'>{data.part3plate} / {data.part2plate} - {data.cityPlate} - {data.part1plate}</td>
                        <td className='td'>{data.descriptionLocation}</td>
                        <td className='td'>{data.paperDoc}</td>
                        <td className='td'>{data.insurancePaper}</td>
                        <td className='td'>{data.gasCard}</td>
                        <td className='td'>{data.carCard}</td>
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