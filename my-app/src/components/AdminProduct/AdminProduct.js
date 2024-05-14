import classNames from 'classnames/bind';
import styles from './AdminProduct.module.scss'
import { Button, Form, Input, InputNumber, Modal, Table, Upload, message } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { useState } from 'react';
import { getBase64 } from '../../utils'
import {useMutation} from '@tanstack/react-query'
import * as ProductServices from '../../services/ProductServices'

const cx = classNames.bind(styles)

function AdminProduct() {
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          render: (text) => <a href='/system/admin'>{text}</a>,
        },
        {
          title: 'Age',
          dataIndex: 'age',
        },
        {
          title: 'Address',
          dataIndex: 'address',
        },
    ];

    const table_data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney No. 1 Lake Park',
        }
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
          disabled: record.name === 'Disabled User',
          name: record.name,
        }),
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setImage('')
        form.resetFields()
    };

    const  onFinish = (values) => {
        mutation.mutate({
            name: values.productName,
            type: values.type,
            price: values.price,
            description: values.description,
            countInStock: values.countInStock,
            rating: values.rating,
            image: image
        })
        const {isSuccess, data, isError} = mutation
        if (isSuccess && data?.status === "OK"){
            message.success('Thêm sản phẩm thành công!')
            handleCancel()
        }else{
            if (isError){
                message.error('Lỗi kết nối!')
            } else{
                message.error('Sản phẩm đã tồn tại!')
            }
        }
    };
      
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const [image, setImage] = useState('')

    const handleImage = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setImage(file.preview)
    }

    const mutation = useMutation({
        mutationFn: data => ProductServices.createProduct(data)
    })
    
    const [form] = Form.useForm()

    return (
        <div className={cx('manage_product')}>
            <h1 className={cx('title')}>Quản lý sản phẩm</h1>
            <div className={cx('adding_btn')} onClick={showModal}>
                <PlusOutlined className={cx("plus_icon")}/>
            </div>
            <div className={cx('table')}>
                <Table
                    rowSelection={{
                        type: "checkbox",
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={table_data}
                />
            </div>
            <Modal className={cx('modal')} title="Thêm sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{
                        span: 6,
                    }}
                    labelAlign='left'
                    wrapperCol={{
                        span: 18,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Mặt hàng"
                        name="productName"
                        rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên mặt hàng!',
                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Loại"
                        name="type"
                        rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập loại hàng!',
                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Giá bán"
                        name="price"
                        rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập giá bán!',
                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mô tả!',
                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Kho hàng"
                        name="countInStock"
                        rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập giá bán!',
                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Đánh giá"
                        name="rating"
                        rules={[
                        {
                            required: false,
                            message: 'Vui lòng nhập đánh giá!',
                        },
                        ]}
                    >
                        <InputNumber max={5} min={0} />
                    </Form.Item>
                    
                    
                    <Form.Item 
                        label="Ảnh sản phẩm" 
                        rules={[{
                            required: true,
                            message: 'Vui lòng thêm ảnh sản phẩm!',
                        }]}
                    >
                        {image && 
                            <div className={cx('product_image')}>
                                <img src={image} alt='product'/>
                            </div>
                        }
                        <Form.Item name = "image" noStyle>
                            <Upload fileList={[]} className={cx('upload')} showUploadList={false} onChange={handleImage} maxCount={1}>
                                <Button className={cx('change_info_btn')} icon={<UploadOutlined />}>Chọn ảnh sản phẩm</Button>
                            </Upload>
                       </Form.Item>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button className={cx('submit_btn')} type="primary" htmlType="submit">
                            Thêm sản phẩm
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default AdminProduct;