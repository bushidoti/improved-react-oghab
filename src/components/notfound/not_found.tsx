import React from 'react';
import { Button, Result } from 'antd';
import {useNavigate} from "react-router-dom";

const PageNotFound : React.FC = () => {
    const navigate = useNavigate();

    return (
      <Result
        status="404"
        title="404"
        subTitle="متاسفانه صفحه مورد نظر یافت نشد."
        extra={<Button type="primary" onClick={() => navigate('/')}>برگشت به خانه</Button>}
      />
    )
}

export default PageNotFound;