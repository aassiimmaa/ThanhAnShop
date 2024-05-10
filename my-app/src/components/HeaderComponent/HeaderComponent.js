import {Badge, Col, Popover, Row, message} from 'antd'
import Search from '../Search/Search';
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined} from '@ant-design/icons'
import classNames from 'classnames/bind';
import styles from './HeaderComponent.module.scss'
import { Link, useNavigate } from 'react-router-dom';
import SignIn from '../SignInComponent/SignInComponent';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import * as UserServices from '../../services/UserServices'
import { resetUser } from '../../redux/slides/userSlide';

const cx = classNames.bind(styles)

function HeaderComponent() {
    const [open, setOpen] = useState(false);

    const openModal = () => {
        setOpen(true)
    }

    const closeModal = () => {
        setOpen(false)
    }

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

    const toSystem = () => {
        navigate('/system/admin')
    }

    const content = (
        <div className={cx('popover_menu')}>
            <div onClick={toProfile} className={cx('popover_item')}>Thông tin tài khoản</div>
            {user?.isAdmin && 
                <div onClick={toSystem} className={cx('popover_item')}>Quản lý hệ thống</div>
            }
            <div onClick={handleLogout} className={cx('popover_item')}>Đăng xuất</div>
        </div>
    )

    return (
        <div className={cx('wrapper_Header')}>
            <Row className={cx('container')}>
                <Col span={5} className={cx('wrapper_text_header')}>
                    <Link to='/'>
                        ThanhAnShop
                    </Link>
                </Col>
                <Col span={13} className={cx('search_area')}>
                    <Search size='large' placeholder='Input search text' textButton='Tìm kiếm'/>
                </Col>
                <Col span={6} className={cx('header_menu')}>
                    {user?.avatar ? 
                        <img className={cx("user_avatar")} src={user?.avatar} alt='avatar'/>
                    :
                        <UserOutlined style={{fontSize: '40px', color: '#fff', marginLeft: "12px"}} />
                    }
                    {user?.access_token !== '' ?
                        <div className={cx('account')}>
                            <Popover content={content} overlayClassName={styles.popoverNoPadding}>
                                <div className={cx('signed_in_user')}>
                                    {user.name}
                                </div>
                            </Popover>
                        </div> :
                        <div className={cx('account')} onClick={openModal}>
                            <span>Đăng nhập/Đăng ký</span>
                            <div>
                                <span>Tài khoản</span>
                                <CaretDownOutlined />
                            </div>
                        </div>
                    }
                    <div className={cx('cart')}>
                        <Badge count="4" size="small">
                            <ShoppingCartOutlined style={{fontSize: '36px', color: '#fff'}}/>
                        </Badge>
                        <span>Giỏ hàng</span> 
                    </div>
                    {open && <SignIn close={closeModal} />}
                </Col> 
            </Row>
        </div>
    )
}

export default HeaderComponent;