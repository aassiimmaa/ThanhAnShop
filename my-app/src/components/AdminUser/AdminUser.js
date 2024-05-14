import classNames from 'classnames/bind';
import styles from './AdminUser.module.scss'
import { Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons'

const cx = classNames.bind(styles)

function AdminUser() {
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          render: (text) => <a href='/'>{text}</a>,
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

    const data = [
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
    

    return (
        <div className={cx('manage_user')}>
            <h1 className={cx('title')}>Quản lý người dùng</h1>
            <div className={cx('adding_btn')}>
                <PlusOutlined className={cx("plus_icon")}/>
            </div>
            <div className={cx('table')}>
                <Table
                    rowSelection={{
                        type: "checkbox",
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={data}
                />
            </div>
            
        </div>
    );
}

export default AdminUser;