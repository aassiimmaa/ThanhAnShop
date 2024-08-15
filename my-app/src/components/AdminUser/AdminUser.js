import classNames from 'classnames/bind';
import styles from './AdminUser.module.scss'
import { Button, Drawer, Form, Input, Modal, Space, Table, Upload, message } from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ExportOutlined } from '@ant-design/icons'
import * as UserServices from '../../services/UserServices'
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getBase64 } from '../../utils';
import { Excel } from 'antd-table-saveas-excel';
import Loading from '../Loading/Loading';

const cx = classNames.bind(styles)

function AdminUser() {
    const [form] = Form.useForm()
    const [selectedRow, setSelectedRow] = useState('')
    const [stateUser, setStateUser] = useState('')
    const renderAction = () => {
        return (
            <div className={cx('action_table')}>
                <EditOutlined className={cx('edit_btn')} onClick={handleDetailUser}/>
                <span>|</span>
                <DeleteOutlined className={cx('delete_btn')} onClick={openConfirm}/>
            </div>
        )
    }

    //Filter
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

    const columns =[
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
            ellipsis: true,
            width: "250px",
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name')
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: "250px",
            ellipsis: true,
            sorter: (a, b) => a.email.localeCompare(b.email),
            ...getColumnSearchProps('email')
        },
        {
            title: 'Admin',
            dataIndex: 'isAdmin',
            align: 'center',
            render: (isAdmin) => isAdmin ? "True" : "False",
        },
        {
            title: 'Điện thoại',
            dataIndex: 'phone',
            ellipsis: true,
            align: 'center'
        },
        {
            title: 'Hành động',
            width: "150px",
            dataIndex: 'action',
            align: 'center',
            render: renderAction
        }
    ];

    //get data into table

    const fetchUserAll = async () => {
        const res = await UserServices.getAllUser()
        return res
    }
    
    const queryUser = useQuery({
        queryKey: ['users'], 
        queryFn: fetchUserAll
    })

    const {data: users, isLoading} = queryUser

    const users_table =
        users?.data?.map((user) => {
            return {
                ...user,
                key: user._id
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

    const handleDetailUser = () => {
        showDrawer()
    }

    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = useCallback(() => {
        setOpen(false);
        if (selectedRow.length !== 0){
            fetchDetailUser(selectedRow)
        }
    }, [selectedRow]);
    
    const handleCancel = useCallback(() => {
        onClose()
    }, [onClose]);

    //Delete Button
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false)

    const openConfirm = () => {
        setOpenDeleteConfirm(true)
    }

    const mutationDelete = useMutation({
        mutationFn: id => UserServices.deleteUser(id)
    })

    const handleDeleteUser = () => {
        mutationDelete.mutate(selectedRow, {
            onSettled: () => queryUser.refetch()
        })
        setOpenDeleteConfirm(false)
    }

    useEffect(() => {
        if (mutationDelete?.isSuccess && mutationDelete?.data?.status === "OK"){
            message.success("Xóa người dùng thành công!")
        }else{
            if (mutationDelete?.isError){
                message.error("Lỗi kết nối!")
            } else if (mutationDelete?.data?.status === "ERR"){
                message.error("Xóa người dùng thất bại!")
            }
        }
    }, [mutationDelete?.data?.status, mutationDelete?.isError, mutationDelete?.isSuccess])


    //Change avatar in Drawer
    const handleAvatar = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateUser({
            ...stateUser,
            avatar: file.preview
        })
    }

    const handleOnChangeDrawer = (e) => {
        setStateUser({
            ...stateUser,
            [e.target.name]: e.target.value
        })
    }

    const mutationUpdate = useMutation({
        mutationFn: data => UserServices.updateUser(data.id, data.data)
    })

    // Edit button
    // Error cannot update avatar and info together(just can update avatar or user infomation)
    const onFinishEdit = (values) => {
        const dataUpdate = {
            name: values.name,
            email: values.email,
            isAdmin: values.isAdmin,
            address: values.address,
            phone: values.phone,
            avatar: values.avatar
        }
        mutationUpdate.mutate({id: selectedRow, data: dataUpdate}, {
            onSettled: () => queryUser.refetch()
        })
    }

    useEffect(() => {
        if (mutationUpdate?.isSuccess && mutationUpdate?.data?.status){
            message.success('Chỉnh sửa người dùng thành công!')
            handleCancel()
        }else{
            if (mutationUpdate?.isError){
                message.error('Lỗi kết nối!')
            } else if (mutationUpdate?.data?.status === "ERR"){
                message.error('Người dùng không tồn tại!')
            }
        }
    },[mutationUpdate?.data?.status, mutationUpdate?.isError, mutationUpdate?.isSuccess, handleCancel])

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const fetchDetailUser = async (id) => {
        const res = await UserServices.getDetailUser(id)
        if (res?.data){
            const {
                name,
                email,
                isAdmin,
                address,
                phone,
                avatar
            } = res.data
            setStateUser({
                name,
                email,
                isAdmin,
                address,
                phone,
                avatar
            })
        }
    }
    
    useEffect(() => {
        form.setFieldsValue(stateUser)
    }, [form, stateUser])
    
    useEffect(() => {
        if (selectedRow){
            if (selectedRow.length !== 0){
                fetchDetailUser(selectedRow)
            }
        }
    }, [selectedRow])

    const mutationDeleteMany = useMutation({
        mutationFn: data => UserServices.deleteManyUser(data)
    })

    const handleDeleteMany = () => {
        mutationDeleteMany.mutate(selectedRowKeysArr, {
            onSettled: () => queryUser.refetch()
        })
    }

    useEffect(() => {
        if (mutationDeleteMany?.isSuccess && mutationDeleteMany?.data?.status){
            message.success(`Đã xóa ${selectedRowKeysArr.length} người dùng!`)
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
            .addDataSource(users_table, {
                str2Percent: true
            })
            .saveAs("Users_list.xlsx");
    };

    return (
        <div className={cx('manage_user')}>
            <h1 className={cx('title')}>Quản lý người dùng</h1>
            <div className={cx('table')}>
                {selectedRowKeysArr.length > 0 && 
                    <div className={cx('deleteAll')} onClick={() => setOpenDeleteManyConfirm(true)}>Xóa tất cả</div>
                }
                <div className={cx('export_btn')} onClick={handleClick}>
                    <ExportOutlined style={{paddingRight: "4px"}} />
                    Export
                </div>
                <Loading isLoading={isLoading}>
                    <Table
                        rowSelection={{
                            type: "checkbox",
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={users_table}
                        onRow={(record) => {
                            return{
                                onClick: () => {
                                    setSelectedRow(record._id)
                                }
                            }
                        }}
                        pagination = {{defaultPageSize: 6, style: {
                            marginTop: "8px"
                        }}}
                    />
                </Loading>
            </div>
            <Drawer forceRender title="Chi tiết người dùng" onClose={onClose} open={open} width={"50%"}>
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
                        label="Tên người dùng"
                        name="name"
                    >
                        <Input value={stateUser.name} onChange={handleOnChangeDrawer} name='name'/>
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                    >
                        <Input value={stateUser.email} onChange={handleOnChangeDrawer} name='email'/>
                    </Form.Item>

                    <Form.Item
                        label="Admin"
                        name="isAdmin"
                    >
                        <Input value={stateUser.isAdmin} onChange={handleOnChangeDrawer} name='isAdmin'/>
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                    >
                        <Input value={stateUser.address} onChange={handleOnChangeDrawer} name='address'/>
                    </Form.Item>

                    <Form.Item
                        label="Điện thoại"
                        name="phone"
                    >
                        <Input value={stateUser.phone} onChange={handleOnChangeDrawer} name='phone'/>
                    </Form.Item>
                    
                    <Form.Item 
                        label="Ảnh đại diện"
                    >
                        {stateUser.avatar && 
                            <div className={cx('avatar')}>
                                <img src={stateUser.avatar} alt='avatar'/>
                            </div>
                        }
                        <Form.Item name="avatar" noStyle>
                            <Upload fileList={[]} className={cx('upload')} showUploadList={false} onChange={handleAvatar} maxCount={1}>
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
                <Modal  title="Xóa sản phẩm" open={openDeleteConfirm} onOk={handleDeleteUser} onCancel={() => setOpenDeleteConfirm(false)}>
                    Bạn có chắc muốn xóa người dùng, nhấn OK để xóa.
                </Modal>
            }
            {openDeleteManyConfirm && 
                <Modal  title="Xóa sản phẩm" open={openDeleteManyConfirm} onOk={handleDeleteMany} onCancel={() => setOpenDeleteManyConfirm(false)}>
                    Bạn có chắc muốn xóa những người dùng đã chọn, nhấn OK để xóa.
                </Modal>
            }
        </div>
    );
}

export default AdminUser;