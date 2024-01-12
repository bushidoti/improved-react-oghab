import {Button, ConfigProvider, Image, Select, Space} from "antd";
import {useContext, useState} from "react";
import Url from "../../api-configue";
import {Context} from "../../../context";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const ReceiveDoc = () => {
    const [subDocument, setSubDocument] = useState<object[]>([])
    const context = useContext(Context)
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false);
    const [file, setFile] = useState('')
    const [selected, setSelected] = useState('')
    const navigate = useNavigate();

    const options = [
        {value: 'قرارداد', label: 'قرارداد'},
        {value: 'تضامین', label: 'تضامین'},
    ];
    const onFinish = async () => {
        setLoading(true)
        await axios.get(`${Url}/api/documents/${context.currentContract}/?fields=${selected}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        }).then(response => {
            return response
        }).then(async data => {
            fetch(Object.values(data.data)[0] as string).then(response => {
                response.blob().then(() => {
                    let alink = document.createElement('a');
                    alink.href = Object.values(data.data)[0] as string;
                    alink.download = `${selected}.jpg`
                    alink.click();
                })
            })
        }).finally(() => {
            setLoading(false)
        }).catch((error) => {
            if (error.request.status === 403) {
                navigate('/no_access')
            }
        })
    };

    const onPreview = async () => {
        setLoading(true)
        await axios.get(`${Url}/api/documents/${context.currentContract}/?fields=${selected}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        }).then(response => {
            return response
        }).then(async data => {
            setFile(Object.values(data.data)[0] as string)
        }).finally(() => {
            setLoading(false)
            setVisible(true)
        }).catch((error) => {
            if (error.request.status === 403) {
                navigate('/no_access')
            }
        })
    };

    const onValuesChange = (value: string) => {
        if (value === 'قرارداد') {
            setSubDocument([
                    {value: 'doc_1', label: 'صفحه 1'},
                    {value: 'doc_2', label: 'صفحه 2'},
                    {value: 'doc_3', label: 'صفحه 3'},
                    {value: 'doc_4', label: 'صفحه 4'},
                    {value: 'doc_5', label: 'صفحه 5'},
                    {value: 'doc_6', label: 'صفحه 6'},
                    {value: 'doc_7', label: 'صفحه 7'},
                    {value: 'doc_8', label: 'صفحه 8'},
                    {value: 'doc_9', label: 'صفحه 9'},
                    {value: 'doc_10', label: 'صفحه 10'},
                    {value: 'doc_11', label: 'صفحه 11'},
                    {value: 'doc_12', label: 'صفحه 12'},
                    {value: 'doc_13', label: 'صفحه 13'},
                    {value: 'doc_14', label: 'صفحه 14'},
                    {value: 'doc_15', label: 'صفحه 15'},
                    {value: 'doc_16', label: 'صفحه 16'},
                    {value: 'doc_17', label: 'صفحه 17'},
                    {value: 'doc_18', label: 'صفحه 18'},
                    {value: 'doc_19', label: 'صفحه 19'},
                    {value: 'doc_20', label: 'صفحه 20'},
            ])
        } else if (value === 'تضامین') {
            setSubDocument([
                {value: 'doc_bail_1', label: 'ضمانت اول'},
                {value: 'doc_bail_2', label: 'ضمانت دوم'},
                {value: 'doc_bail_3', label: 'ضمانت سوم'},
                {value: 'doc_bail_4', label: 'ضمانت چهارم'},
                {value: 'doc_bail_5', label: 'ضمانت پنجم'},
            ])
        }
    }

    return (
        <div style={{marginBottom: 20}}>
            <Space.Compact>
                <ConfigProvider theme={{
                    components: {
                        Button: {
                            groupBorderColor: '#faad14',
                        }
                    }, token: {
                        colorPrimary: '#faad14',
                    }
                }}>
                    <Button type={"primary"} loading={loading} onClick={onPreview}>مشاهده</Button>
                </ConfigProvider>
                <Button type={"primary"} htmlType={"button"} onClick={onFinish} loading={loading}>دانلود</Button>
                <Select style={{width: 200}} placeholder="نوع مدرک" options={options} onChange={onValuesChange}/>
                <Select style={{width: 200}} placeholder="مدرک مورد نظر" options={subDocument} onChange={(value) => {
                    setSelected(value)
                }}/>
            </Space.Compact>
            <Image
                width={200}
                style={{display: 'none'}}
                src="error"
                fallback="data:image/png;base64,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"
                preview={{
                    visible,
                    src: file,
                    onVisibleChange: (value) => {
                        setVisible(value);
                    },
                }}
            />
        </div>
    )
}

export default ReceiveDoc