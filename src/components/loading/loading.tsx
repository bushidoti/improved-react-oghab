import {Flex, Image, Spin} from "antd";

export const Loading = () => {
    return (
        <div className='loading'>
            <div>
                  <Flex vertical justify={"center"} align={"center"}>
                     <Image preview={false} src={require('./icon.png')}/>
                     <Spin size="large" />
                  </Flex>
            </div>
        </div>
    )
}