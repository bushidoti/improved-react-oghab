import { Space } from "antd";
import Marquee from "react-fast-marquee";
import React from "react";


export const Banner = () => {
    let today = new Date().toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
    const day = new Date().toLocaleString('fa-IR', {  weekday: 'long' })

    return (
          <Marquee speed={50} className='bg-amber-100' pauseOnHover gradient={false}>
              <Space size={500}>
                  <p>
                    {`امروز ${day} , ${today}`}
                  </p>
                  <p>
                        اطلاع رسانی در این بخش نمایش داده خواهد شد !
                  </p>
              </Space>
          </Marquee>
    )
}