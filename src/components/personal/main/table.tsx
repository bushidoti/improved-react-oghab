import React from "react";
import {DateObject} from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";

interface Person {
  id?: number,
  approvedPrice?: number,
  commitmentPrice?: number,
  name?: string,
  full_name?: string,
  date?: string,
  expireDate: string,
  clearedDate?: string,
  national_id?: string,
  typeBail?: string,
  office?: string,
  job?: string,
  type?: string,
  firstBail?: string,
  secondBail?: string,
  sex?: string,
  clearedStatus?: boolean,
  receivedDocument?: boolean,
  affidavitStatus?: boolean,
}

const TablePrint = (props: { componentPDF: React.LegacyRef<HTMLTableElement> | undefined, contract: Person[]; }) => {
    const date = new DateObject({calendar: persian})
    return (
        <div style={{display: 'none'}}>
            <table className="table"
                   ref={props.componentPDF} style={{direction: 'rtl', fontSize: '.56vw'}}>
                <thead>
                <tr>
                    <th className='th' scope="col">ردیف</th>
                    <th className='th' scope="col">شماره ثبت</th>
                    <th className='th' scope="col">وضعیت</th>
                    <th className='th' scope="col">نام و نشان</th>
                    <th className='th' scope="col">جنسیت</th>
                    <th className='th' scope="col">تاریخ استخدام</th>
                    <th className='th' scope="col">کد ملی</th>
                    <th className='th' scope="col">محل کار</th>
                    <th className='th' scope="col">شغل</th>
                    <th className='th' scope="col">تضمین مصوب</th>
                    <th className='th' scope="col">مبلغ تضمین</th>
                    <th className='th' scope="col">وثیقه تضمین</th>
                    <th className='th' scope="col">مشخصه وثیقه</th>
                    <th className='th' scope="col">تاریخ پایان قرارداد</th>
                    <th className='th' scope="col">وضعیت تسویه</th>
                    <th className='th' scope="col">تاریخ تسویه</th>
                    <th className='th' scope="col">وضعیت مدرک</th>
                    <th className='th' scope="col">وضعیت اقرارنامه</th>
                </tr>
                </thead>

                <tbody>
                {props.contract.map((data, i) => (
                    <tr key={data.id}
                        style={{backgroundColor: `${(data.clearedStatus ? 'hsl(0, 100%, 80%)' : null) || (date.format().replaceAll('/', '-') > data.expireDate ? 'hsla(48,100%,50%,0.6)' : null)}`}}>
                        <th className='th' scope="row">{i + 1}</th>
                        <td className='td'>{data.id}</td>
                        <td className='td'>{data.type}</td>
                        <td className='td'>{data.full_name}</td>
                        <td className='td'>{data.sex}</td>
                        <td className='td'>{data.date}</td>
                        <td className='td'>{data.national_id}</td>
                        <td className='td'>{data.office}</td>
                        <td className='td'>{data.job}</td>
                        <td className='td'>{data.approvedPrice}</td>
                        <td className='td'>{data.commitmentPrice}</td>
                        <td className='td'>{data.typeBail}</td>
                        <td className='td'>{data.firstBail} _ {data.secondBail}</td>
                        <td className='td'>{data.expireDate}</td>
                        <td className='td'>{data.clearedStatus ? 'تسویه شده' : 'تسویه نشده'}</td>
                        <td className='td'>{data.clearedDate}</td>
                        <td className='td'>{data.receivedDocument ? 'تحویل داده شده' : 'تحویل داده نشده'}</td>
                        <td className='td'>{data.affidavitStatus ? 'تحویل داده شده' : 'تحویل داده نشده'}</td>
                    </tr>
                ))
                }
                </tbody>
            </table>
        </div>
    )
}

export default TablePrint;