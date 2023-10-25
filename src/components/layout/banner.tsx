import { Space } from "antd";
import Marquee from "react-fast-marquee";
import React, {useContext, useEffect, useState} from "react";
import Url from "../api-configue";
import {Context} from "../../context";
import axios from "axios";


export const Banner = () => {
    let today = new Date().toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
    const day = new Date().toLocaleString('fa-IR', {  weekday: 'long' })
    const context = useContext(Context)

    const [message , setMessage] = useState<any>('')
    useEffect(() => {
        if (context.isLogged) {
            (async () => {

                const {data} = (await axios.get(`${Url}/api/banner`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                    }
                }));
                setMessage(data[0].message);
            })()
        }
    }, [context.isLogged]);

    return (
          <Marquee speed={50} className='bg-amber-100' pauseOnHover gradient={false}>
              <Space size={500}>
                  <p>
                    {`امروز ${day} , ${today}`}
                  </p>
                  <p>
                      {message}
                  </p>
              </Space>
          </Marquee>
    )
}