import classNames from 'classnames/bind';
import styles from './AdminPage.module.scss'
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Popover, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { UserOutlined, AppstoreOutlined } from '@ant-design/icons'
import { resetUser } from '../../redux/slides/userSlide';
import * as UserServices from '../../services/UserServices'
import { useState } from 'react';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';

const cx = classNames.bind(styles)

function AdminPage() {
    
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const handleLogout = async () => {
        await UserServices.logoutUser()
        localStorage.removeItem("access_token")
        dispatch(resetUser())
        navigate('/')
        message.success('Đăng xuất thành công!')
    }

    const navigate = useNavigate()
    
    const toProfile = () => {
        navigate('/profile')
    }

    const content = (
        <div className={cx('popover_menu')}>
            <div onClick={toProfile} className={cx('popover_item')}>Thông tin tài khoản</div>
            <div onClick={handleLogout} className={cx('popover_item')}>Đăng xuất</div>
        </div>
    )

    const items = [
        {
          key: 'user',
          label: 'Quản lý người dùng',
          icon: <UserOutlined />
        },
        {
          key: 'product',
          label: 'Quản lý sản phẩm',
          icon: <AppstoreOutlined />
        }
      ];

    const [selectedKey, setSelectedKey] = useState('user')
    const handleClick = ({key}) => {
        setSelectedKey(key)
    }

    return (
        <div className={cx('page_wrapper')}>
            <div className={cx('header_page')}>
                <div className={cx('container')}>
                    <Link className={cx('wrapper_text_header')} to='/'>
                        ThanhAnShop
                    </Link>
                    <div className={cx('admin')}>
                        {user?.avatar ? 
                            <img className={cx("user_avatar")} src={user?.avatar} alt='avatar'/>
                        :
                            <UserOutlined style={{fontSize: '40px', color: '#fff', marginLeft: "12px"}} />
                        }
                        <div className={cx('account')}>
                            <Popover content={content} overlayClassName={styles.popoverNoPadding}>
                                <div className={cx('signed_in_user')}>
                                    {user.name}
                                </div>
                            </Popover>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx("content")}>
                <Menu
                    className={cx("menu")}
                    onClick={handleClick}
                    defaultSelectedKeys={['user']}
                    mode="inline"
                    items={items}
                />
                <div className={cx('management')}>
                    {selectedKey === 'user' &&
                        <AdminUser />
                    }
                    {selectedKey === 'product' && 
                        <AdminProduct />
                    }
                </div>
            </div>
        </div>
    );
}

export default AdminPage;