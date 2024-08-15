import classNames from 'classnames/bind';
import styles from './AdminProduct.module.scss'
import { Button, Drawer, Form, Input, InputNumber, Modal, Select, Space, Table, Upload, message } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ExportOutlined } from '@ant-design/icons'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getBase64 } from '../../utils'
import {useMutation, useQuery} from '@tanstack/react-query'
import * as ProductServices from '../../services/ProductServices'
import { Excel } from 'antd-table-saveas-excel'
import Loading from '../Loading/Loading';

const cx = classNames.bind(styles)

function AdminProduct() {
    const [form] = Form.useForm()

    //render Action in table
    const renderAction = () => {
        return (
            <div className={cx('action_table')}>
                <EditOutlined className={cx('edit_btn')} onClick={handleDetailProduct}/>
                <span>|</span>
                <DeleteOutlined className={cx('delete_btn')} onClick={openConfirm}/>
            </div>
        )
    }

    //filter
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
            <Input
                ref={searchInput}
                placeholder={`Search ${dataIndex}`}
                value={selectedKeys[0]}
                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                style={{
                    marginBottom: 8,
                    display: 'block',
                }}
            />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            text
    });

    const searchInput = useRef(null);
    const handleSearch = (confirm) => {
        confirm();
        
    };
    const handleReset = (clearFilters) => {
        clearFilters();
    };

    //Init columns in table
    const columns = [
        {
            title: 'Tên mặt hàng',
            dataIndex: 'name',
            ellipsis: true,
            width: "300px",
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name')
        },
        {
            title: 'Loại hàng',
            dataIndex: 'type',
            align: 'center',
            sorter: (a, b) => a.type.localeCompare(b.type),
            ...getColumnSearchProps('type')
        },
        {
            title: 'Giá bán',
            dataIndex: 'price',
            align: 'center',
            sorter: (a, b) => a.price - b.price
        },
        {
            title: 'Kho hàng',
            dataIndex: 'countInStock',
            align: 'center'
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            align: 'center',
            render: renderAction
        }
    ];

    //get data into table
    const fetchProductAll = async () => {
        const res = await ProductServices.getAllProduct()
        return res
    }
    
    const queryProducts = useQuery({
        queryKey: ['products'], 
        queryFn: fetchProductAll
    })

    const {data: products, isLoading} = queryProducts

    const products_table =
        products?.data?.map((product) => {
            return {
                ...product,
                key: product._id
            }
        })

    const [selectedRowKeysArr, setSelectedRowKeysArr] = useState([])

    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedRowKeysArr(selectedRowKeys)
        },
        // getCheckboxProps: (record) => ({
        //   disabled: record.name === 'Disabled User',
        //   name: record.name,
        // }),
    };

    const [selectedRow, setSelectedRow] = useState('')
    const [stateProduct, setStateProduct] = useState({
        name: '',
        type: '',
        price: 0,
        description: '',
        discount: 0,
        sold: 0,
        countInStock: '',
        rating: '',
        image: ''
    })

    //Show drawer when edit product
    
    const handleDetailProduct = () => {
        showDrawer()
    }
    
    //Get data into Edit Drawer
    const fetchDetailProduct = async (id) => {
        const res = await ProductServices.getDetailProduct(id)
        if (res?.data){
            const {
                name,
                type,
                price = 0,
                description,
                discount = 0,
                sold = 0,
                countInStock,
                rating = 0,
                image
            } = res.data
            setStateProduct({
                name,
                type,
                price,
                description,
                discount,
                sold,
                countInStock,
                rating,
                image
            })
        }
    }
    
    useEffect(() => {
        form.setFieldsValue(stateProduct)
    }, [form, stateProduct])
    
    useEffect(() => {
        if (selectedRow){
            if (selectedRow.length !== 0){
                fetchDetailProduct(selectedRow)
            }
        }
    }, [selectedRow])


    //Open modal create new product
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const showModal = () => {
        setIsModalOpen(true);
        form.resetFields()
    };

    // Close edit drawer
    const onClose = useCallback(() => {
        setOpen(false);
        if (selectedRow.length !== 0){
            fetchDetailProduct(selectedRow)
        }
        setTempType()
    }, [selectedRow]);
    
    // Close modal create product
    const handleCancel = useCallback(() => {
        setIsModalOpen(false);
        onClose()
        setImage('')
        setTempType('')
    }, [onClose]);


    //Call api create new product
    const mutation = useMutation({
        mutationFn: data => ProductServices.createProduct(data)
    })

    //Finish create product
    const  onFinish = (values) => {
        mutation.mutate({
            name: values.name,
            type: values.type === "add_type" ? values.new_type  : values.type,
            price: Number(values.price),
            description: values.description,
            countInStock: Number(values.countInStock),
            rating: Number(values.rating),
            image: image
        }, {
            onSettled: () =>{
                queryProducts.refetch()
                queryType.refetch()
            }
        })
    }
                
    useEffect(() => {
        if (mutation?.isSuccess && mutation?.data?.status === "OK"){
            message.success('Thêm sản phẩm thành công!')
            handleCancel()
        }else{
            if (mutation?.isError){
                message.error('Lỗi kết nối!')
            } else if (mutation?.data?.status === "ERR"){
                message.error('Sản phẩm đã tồn tại!')
            } 
        }
    }, [mutation?.data?.status, mutation?.isError, mutation?.isSuccess, handleCancel])
      
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    //Handle image when create product
    const [image, setImage] = useState('')

    const handleImage = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setImage(file.preview)
    }

    //Handle image when edit product
    const handleImageDrawer = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview
        })
    }

    //Open drawer
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };


    //Handle change drawer info
    const handleOnChangeDrawer = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })
    }

    //Call api update product
    const mutationUpdate = useMutation({
        mutationFn: data => ProductServices.updateProduct(data.id, data.data)
    })

    //Finish edit product
    const onFinishEdit = (values) => {
        const dataUpdate = {
            name: values.name,
            type: values.type === 'add_type' ? values.new_type : values.type,
            price: Number(values.price),
            description: values.description,
            countInStock: Number(values.countInStock),
            discount: Number(values.discount),
            sold: Number(values.sold),
            rating: values.rating,
            image: stateProduct.image
        }
        mutationUpdate.mutate({id: selectedRow, data: dataUpdate}, {
            onSettled: () => {
                queryProducts.refetch()
                queryType.refetch()
            }
        })
    }

    useEffect(() => {
        if (mutationUpdate?.isSuccess && mutationUpdate?.data?.status){
            message.success('Chỉnh sửa sản phẩm thành công!')
            handleCancel()
        }else{
            if (mutationUpdate?.isError){
                message.error('Lỗi kết nối!')
            } else if (mutationUpdate?.data?.status === "ERR"){
                message.error('Sản phẩm không tồn tại!')
            }
        }
    },[mutationUpdate?.data?.status, mutationUpdate?.isError, mutationUpdate?.isSuccess, handleCancel])

    // Delete Button

    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false)

    const openConfirm = () => {
        setOpenDeleteConfirm(true)
    }

    const mutationDelete = useMutation({
        mutationFn: id => ProductServices.deleteProduct(id)
    })

    const handleDeleteProduct = () => {
        mutationDelete.mutate(selectedRow, {
            onSettled: () => {
                queryProducts.refetch()
                queryType.refetch()
            }
        })
        setOpenDeleteConfirm(false)
    }

    useEffect(() => {
        if (mutationDelete?.isSuccess && mutationDelete?.data?.status === "OK"){
            message.success("Xóa sản phẩm thành công!")
        }else{
            if (mutationDelete?.isError){
                message.error("Lỗi kết nối!")
            } else if (mutationDelete?.data?.status === "ERR"){
                message.error("Xóa sản phẩm thất bại!")
            }
        }
    }, [mutationDelete?.data?.status, mutationDelete?.isError, mutationDelete?.isSuccess])

    const mutationDeleteMany = useMutation({
        mutationFn: data => ProductServices.deleteManyProduct(data)
    })

    const handleDeleteManyProduct = () => {
        mutationDeleteMany.mutate(selectedRowKeysArr, {
            onSettled: () => {
                queryProducts.refetch()
                queryType.refetch()
            }
                
        })
    }

    useEffect(() => {
        if (mutationDeleteMany?.isSuccess && mutationDeleteMany?.data?.status){
            message.success(`Đã xóa ${selectedRowKeysArr.length} sản phẩm!`)
            setSelectedRowKeysArr([])
            setOpenDeleteManyConfirm(false)
        }else{
            if (mutationDeleteMany?.isError){
                message.error('Lỗi kết nối!')
            } else if (mutationDeleteMany?.data?.status === "ERR"){
                message.error('Người dùng không tồn tại!')
            }
        }
    },[mutationDeleteMany?.data?.status, mutationDeleteMany?.isError, mutationDeleteMany?.isSuccess])

    const [openDeleteManyConfirm, setOpenDeleteManyConfirm] = useState(false)

    //Export data to excel file

    const excelColumn = useMemo(() => {
        const arr = columns.filter((col) => col.dataIndex !== 'action')
        return arr
    }, [columns])

    const handleClick = () => {
        const excel = new Excel();
        excel
            .addSheet("test")
            .addColumns(excelColumn)
            .addDataSource(products_table, {
                str2Percent: true
            })
            .saveAs("Products_list.xlsx");
    };

    const [tempType, setTempType] = useState()

    const handleChange = (value) => {
        setTempType(value)
    }

    const fetchAllType = async () => {
        const res = await ProductServices.getAllType()
        return res.data
    }

    const queryType = useQuery({
        queryKey: ['typeProduct'],
        queryFn: fetchAllType
    })

    const {data: dataType} = queryType

    var typeProduct = dataType?.map((type) => {
        return {
            label: type,
            value: type
        }
    })

    typeProduct?.push({
        label: "Thêm loại",
        value: "add_type"
    })

    return (
        <div className={cx('manage_product')}>
            <h1 className={cx('title')}>Quản lý sản phẩm</h1>
            <div className={cx('adding_btn')} onClick={showModal}>
                <PlusOutlined className={cx("plus_icon")}/>
            </div>
            {selectedRowKeysArr.length > 0 && 
                <div className={cx('deleteAll')} onClick={() => setOpenDeleteManyConfirm(true)}>Xóa tất cả</div>
            }
            <div className={cx('export_btn')} onClick={handleClick}>
                <ExportOutlined style={{paddingRight: "4px"}} />
                Export
            </div>
            <Loading isLoading={isLoading}>
                <Table
                    className={cx('table')}
                    rowSelection={{
                        type: "checkbox",
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={products_table}
                    onRow={(record) => {
                        return{
                            onClick: () => {
                                setSelectedRow(record._id)
                            }
                        }
                    }}
                    pagination={{ defaultPageSize: 3,
                        style: {
                            position: "absolute",
                            bottom: -60,
                            right: 0
                        }
                    }}
                />
            </Loading>
            <Modal className={cx('modal')} title="Thêm sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null} forceRender>
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
                        maxWidth: 600
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Mặt hàng"
                        name="name"
                        rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên mặt hàng!',
                        },
                        ]}
                    >
                        <Input placeholder='Nhập tên mặt hàng'/>
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
                        initialValue={typeProduct && typeProduct[0].value}
                    >
                        <Select
                            value={tempType}
                            style={{ width: 120 }}
                            onChange={handleChange}
                            options={typeProduct}
                        />
                    </Form.Item>

                    {tempType === 'add_type' && (
                        <Form.Item
                            label = "Loại mới"
                            name = "new_type"
                            rules={[{
                                required: true,
                                message: 'Vui lòng nhập loại hàng!',   
                            }]}
                        >
                            <Input placeholder='Nhập loại hàng'/>
                        </Form.Item>
                    )}

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
                        <Input placeholder='Nhập giá bán'/>
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
                        <Input placeholder='Nhập mô tả'/>
                    </Form.Item>

                    <Form.Item
                        label="Kho hàng"
                        name="countInStock"
                        rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập kho hàng!',
                        },
                        ]}
                    >
                        <Input placeholder='Nhập kho hàng'/>
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

            <Drawer title="Chi tiết sản phẩm" onClose={onClose} open={open} width={"50%"}>
                <Form
                    className={cx('form_drawer')}
                    name="drawer"
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
                    onFinish={onFinishEdit}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    form={form}
                >
                    <Form.Item
                        label="Mặt hàng"
                        name="name"
                    >
                        <Input value={stateProduct['name']} onChange={handleOnChangeDrawer} name='name'/>
                    </Form.Item>

                    <Form.Item
                        label="Loại"
                        name="type"
                    >
                        <Select
                            value={stateProduct.type}
                            style={{ width: 120 }}
                            onChange={handleChange}
                            options={typeProduct}
                        />
                    </Form.Item>

                    {tempType === 'add_type' && (
                        <Form.Item
                            label = "Loại mới"
                            name = "new_type"
                            rules={[{
                                required: true,
                                message: 'Vui lòng nhập loại hàng!',   
                            }]}
                        >
                            <Input placeholder='Nhập loại hàng'/>
                        </Form.Item>
                    )}

                    <Form.Item
                        label="Giá bán"
                        name="price"
                    >
                        <Input value={stateProduct.price} onChange={handleOnChangeDrawer} name='price'/>
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                    >
                        <Input value={stateProduct.description} onChange={handleOnChangeDrawer} name='description'/>
                    </Form.Item>

                    <Form.Item
                        label="Kho hàng"
                        name="countInStock"
                    >
                        <Input value={stateProduct.countInStock} onChange={handleOnChangeDrawer} name='countInStock'/>
                    </Form.Item>

                    <Form.Item
                        label="Giảm giá"
                        name="discount"
                    >
                        <Input value={stateProduct.discount} onChange={handleOnChangeDrawer} name='discount'/>
                    </Form.Item>

                    <Form.Item
                        label="Đã bán"
                        name="sold"
                    >
                        <Input value={stateProduct.sold} onChange={handleOnChangeDrawer} name='sold'/>
                    </Form.Item>

                    <Form.Item
                        label="Đánh giá"
                        name="rating"
                    >
                        <InputNumber disabled max={5} min={0} />
                    </Form.Item>
                    
                    <Form.Item 
                        label="Ảnh sản phẩm"
                    >
                        {stateProduct.image && 
                            <div className={cx('product_image')}>
                                <img src={stateProduct.image} alt='product'/>
                            </div>
                        }
                        <Form.Item name="image" noStyle>
                            <Upload fileList={[]} className={cx('upload')} showUploadList={false} onChange={handleImageDrawer} maxCount={1}>
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
                            Chỉnh sửa
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
            {openDeleteConfirm && 
                <Modal title="Xóa sản phẩm" open={openDeleteConfirm} onOk={handleDeleteProduct} onCancel={() => setOpenDeleteConfirm(false)}>
                    Xóa sản phẩm sẽ không thể khôi phục, nhấn OK để xóa sản phẩm.
                </Modal>
            }
            {openDeleteManyConfirm && 
                <Modal title="Xóa sản phẩm" open={openDeleteManyConfirm} onOk={handleDeleteManyProduct} onCancel={() => setOpenDeleteManyConfirm(false)}>
                    Xóa các sản phẩm đã chọn sẽ không thể khôi phục, nhấn OK để xóa sản phẩm.
                </Modal>
            }
        </div>
    );
}

export default AdminProduct;