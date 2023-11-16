import {Button, Divider, Flex, message, Select} from "antd";
import React, {useContext, useState} from "react";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import Url from "../../../api-configue";
import {Context} from "../../../../context";
import {useNavigate} from "react-router-dom";

export const SendProperty = () => {
    const [destiny,setDestiny] = useState<string>('')
    const [description,setDescription] = useState<string>('')
    const context = useContext(Context)
    const navigate = useNavigate();

    const Send = async () => {
           await axios.put(`${Url}/api/property/${context.currentProperty}/`, {
               code: context.currentProperty,
               movement_status: 'در انتظار تایید',
               dst_inventory: destiny,
               movement_description: description,
           } , {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                }
            }).then(response => {
                return response
            }).then(async data => {
                if (data.status === 200) {
                    message.success('انتقال ثبت شد');
                    navigate('/warhouse/property/report')
                }
            })
    }


    return (
        <>
            <Divider>جا به جایی</Divider>
            <Flex gap="middle" >
                <Select
                    placeholder="مقصد"
                    style={{ width: '150px' }}
                    onChange={value => setDestiny(value)}
                    options={[
                          {value: 'دفتر مرکزی', label: 'دفتر مرکزی'},
                          {value: 'چابهار', label: 'چابهار'},
                          {value: 'دزفول', label: 'دزفول'},
                          {value: 'جاسک', label: 'جاسک'},
                          {value: 'بیشه کلا', label: 'بیشه کلا'},
                          {value: 'اورهال تهران', label: 'اورهال تهران'},
                          {value: 'اورهال  اصفهان', label: 'اورهال اصفهان'},
                    ]}
                />
                <TextArea onChange={(e) => setDescription(e.target.value)} className='w-[200px]' placeholder='توضیحات' autoSize/>
                <Button disabled={destiny === '' || description === ''} onClick={Send} type={"primary"} htmlType="button">
                        ثبت
                </Button>
            </Flex>

        </>
    )
}