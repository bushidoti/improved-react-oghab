import React, {useState} from 'react';
import {message, Steps, Button, theme, Alert, Result} from 'antd';
import UploadPersonal from "../upload/page";
import Register from "./register";
import {useNavigate} from "react-router-dom";




const RegisterPersonal: React.FC = () => {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState<number>(2);
    const { token } = theme.useToken();

        const steps = [
          {
            title: 'ثبت مشخصات',
            content: (<Register/>),
          },
          {
            title: 'بارگذاری مدارک',
            content: (<UploadPersonal/>),
          },
          {
            title: 'اتمام ثبت',
              content: <Result
                status="success"
                title="Successfully Purchased Cloud Server ECS!"
                subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
                extra={[
                  <Button type="primary" onClick={() => navigate('/personal')}>صفحه اصلی</Button>,
                    <Button  onClick={() => done()}>
                    ثبت دوباره
                  </Button>
                ]}
              />,
          },
        ];

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

      const contentStyle: React.CSSProperties = {
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
      };

     const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const done = () => {
    setCurrentStep(0);
    message.success('اتمام ثبت')
  };

    return (
        <>
            <Steps
                current={currentStep}
                status="process"
                style={{margin:10,marginBottom:100}}
                items={items}
          />
          <div style={contentStyle}>{steps[currentStep].content}</div>
          <div style={{ marginTop: 24 }}>
            {currentStep === steps.length - 2 && (
              <Button type="primary" onClick={() => next()}>
                رد کن
              </Button>
            )}
          </div>
        </>
        );
}

export default RegisterPersonal;