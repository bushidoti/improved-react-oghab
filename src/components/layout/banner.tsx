import { Space } from "antd";
import Marquee from "react-fast-marquee";
import React, {useContext, useEffect, useState} from "react";
import Url from "../api-configue";
import {Context} from "../../context";
import axios from "axios";


export const Banner = () => {
    let today = new Date().toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
    let dayEvent = new Date().toLocaleDateString('fa-IR-u-nu-latn', {day: 'numeric' });
    let monthEvent = new Date().toLocaleDateString('fa-IR-u-nu-latn', {month: 'numeric' });
    let yearEvent = new Date().toLocaleDateString('fa-IR-u-nu-latn', {year: 'numeric' });
    const day = new Date().toLocaleString('fa-IR', {  weekday: 'long' })
    const context = useContext(Context)
    const [message , setMessage] = useState<any>('')
    const [event , setEvent] = useState<any>([])

    useEffect(() => {
        if (context.isLogged) {
            (async () => {

                const {data} = (await axios.get(`${Url}/api/banner`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                    }
                }));
                setMessage(data[0].message);
            })().then(
                async () => {
                const {data} = (await axios.get(`https://holidayapi.ir/jalali/${yearEvent}/${monthEvent}/${dayEvent}`));
                     setEvent(data.events)
            }
            )
        }
    }, [context.isLogged, monthEvent, yearEvent]);


    return (
          <Marquee speed={100} className='bg-amber-100' pauseOnHover gradient={false}>
              <Space size={500}>
                  {
                      event.map((data: any , i : number) => (
                          <p key={i}>
                              {`رویداد امروز :  ${data?.description}`}
                          </p>
                      ))
                  }
                    {
                      [`امروز ${day} , ${today}`,message].map((data: string) => (
                          <p className={'me-4'} key={data}>
                               {data}
                          </p>
                      ))
                  }

              </Space>
          </Marquee>
    )
}