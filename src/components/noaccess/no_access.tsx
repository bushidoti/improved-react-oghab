import React from 'react';
import {Button, Result} from 'antd';
import {useNavigate} from "react-router-dom";

const NoAccess: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Result
            status="403"
            title="403"
            subTitle="متاسفانه شما دسترسی لازم را به این صفحه ندارید."
            extra={<Button type="primary" onClick={() => navigate('/')}>برگشت به خانه</Button>}
        />
    )
}

export default NoAccess;