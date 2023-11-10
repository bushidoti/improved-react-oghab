import React from "react";
import {DateObject} from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";

interface Person {
  id?: number,
  prePaidPrice?: number,
  contractPrice?: number,
  commitmentPrice?: number,
  durationContract?: number,
  goodPrice?: number,
  name?: string,
  typeBail2?: string,
  typeBail1?: string,
  full_name?: string,
  date?: string,
  type_form?: string,
  expireDate: string,
  contractNumber: string,
  clearedDate?: string,
  national_id?: string,
  typeBail?: string,
  dateContract?: string,
  firstBail2?: string,
  secondBail2?: string,
  topicContract?: string,
  office?: string,
  job?: string,
  typeContract?: string,
  type?: string,
  firstBail?: string,
  secondBail?: string,
  sex?: string,
  clearedStatus?: boolean,
  receivedDocument?: boolean,
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
                    <th className='th' scope="col">شماره قرارداد</th>
                    <th className='th' scope="col">فرم</th>
                    <th className='th' scope="col">نام و نشان</th>
                    <th className='th' scope="col">موضوع قرارداد</th>
                    <th className='th' scope="col">نوع قرارداد</th>
                    <th className='th' scope="col">تایخ قرارداد</th>
                    <th className='th' scope="col">مبلغ قرارداد</th>
                    <th className='th' scope="col">مبلغ پیش پرداخت</th>
                    <th className='th' scope="col">مدت قرارداد</th>
                    <th className='th' scope="col">مبلغ حسن انجام کار</th>
                    <th className='th' scope="col">نوع ضمانت</th>
                    <th className='th' scope="col">مشخصه ضمانت</th>
                    <th className='th' scope="col">مبلغ تعهد انجام کار</th>
                    <th className='th' scope="col">نوع ضمانت</th>
                    <th className='th' scope="col">مشخصه ضمانت</th>
                    <th className='th' scope="col">وضعیت تسویه</th>
                    <th className='th' scope="col">تاریخ تسویه</th>
                    <th className='th' scope="col">وضعیت مدرک</th>

                </tr>
                </thead>

                <tbody>
                {props.contract.map((data, i) => (
                    <tr key={data.id}
                        style={{backgroundColor: `${(data.clearedStatus ? 'hsl(0, 100%, 80%)' : null) || (date.format().replaceAll('/', '-') > data.expireDate ? 'hsla(48,100%,50%,0.6)' : null)}`}}>
                        <th className='th' scope="row">{i + 1}</th>
                        <td className='td'>{data.id}</td>
                        <td className='td'>{data.contractNumber}</td>
                        <td className='td'>{data.type_form}</td>
                        <td className='td'>{data.name}</td>
                        <td className='td'>{data.topicContract}</td>
                        <td className='td'>{data.typeContract}</td>
                        <td className='td'>{data.dateContract}</td>
                        <td className='td'>{data.contractPrice}</td>
                        <td className='td'>{data.prePaidPrice}</td>
                        <td className='td'>{data.durationContract}</td>
                        <td className='td'>{data.goodPrice}</td>
                        <td className='td'>{data.typeBail1}</td>
                        <td className='td'>{data.firstBail} _ {data.secondBail}</td>
                        <td className='td'>{data.commitmentPrice}</td>
                        <td className='td'>{data.typeBail2}</td>
                        <td className='td'>{data.firstBail2} _ {data.secondBail2}</td>
                        <td className='td'>{data.clearedStatus ? 'تسویه شده' : 'تسویه نشده'}</td>
                        <td className='td'>{data.clearedDate}</td>
                        <td className='td'>{data.receivedDocument ? 'تحویل داده شده' : 'تحویل داده نشده'}</td>
                    </tr>
                ))
                }
                </tbody>
            </table>
        </div>
    )
}

export default TablePrint;