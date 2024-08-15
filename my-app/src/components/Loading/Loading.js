import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons"
function Loading({children, isLoading}) {
    return (
        <Spin 
            spinning={isLoading}
            indicator={
                <LoadingOutlined
                style={{fontSize: "48px"}}
                spin
                />
            }
        >
            {children}
        </Spin>
    );
}

export default Loading;