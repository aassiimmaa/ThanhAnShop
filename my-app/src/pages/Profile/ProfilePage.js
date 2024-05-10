import classnames from 'classnames/bind'
import styles from './ProfilePage.module.scss'
import { RightOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, Upload, message } from 'antd';
import { getBase64 } from '../../utils'
import { useEffect, useState } from 'react';
import userIcon from '../../assets/image/user.png'
import { useSelector } from 'react-redux';
import * as UserService from '../../services/UserServices'

const cx = classnames.bind(styles)

function Profile() {
    const navigate = useNavigate()

    const linkToHome = () => {
        navigate('/')
    }

    const user = useSelector((state) => state.user)
    const [openForm, setOpenForm] = useState(false)
    const [flagUserName, setFlagUserName] = useState(false)
    const [flagPhone, setFlagPhone] = useState(false)
    const [flagPassword, setFlagPassword] = useState(false)
    const [flagAddress, setFlagAddress] = useState(false)
    const [tempInput, settempInput] = useState()
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')
    
    const setForm = () => {
        setOpenForm(!openForm)
        if (!openForm){
            setFlagUserName(false)
            setFlagPhone(false)
            setFlagPassword(false)
            setFlagAddress(false)
        }
    }
    
    const OpenChangeUserName = () => {
        setForm()
        setFlagUserName(true)
    }

    const OpenChangePhone = () => {
        setForm()
        setFlagPhone(true)
    }

    const OpenChangePassword = () => {
        setForm()
        setFlagPassword(true)
    }

    const OpenChangeAddress = () => {
        setForm()
        setFlagAddress(true)
    }

    const handleAvatar = async ({fileList}) => {
        const file = fileList[0]
        console.log(file)
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setAvatar(file.preview)
    }

    const handleInputChange = (e) => {
        settempInput(e.target.value)
    }

    const handleChangeForm = () => {
        if (flagUserName){
            setUserName(tempInput)
            setForm()
        }
        if (flagPassword){
            setPassword(tempInput)
            setForm()
        }
        if (flagPhone){
            setPhoneNumber(tempInput)
            setForm()
        }
        if (flagAddress){
            setAddress(tempInput)
            setForm()
        }
    }

    useEffect(() => {
        setUserName(user.name)
        setPassword(user.password)
        setPhoneNumber(user.phone)
        setAddress(user.address)
        setAvatar(user.avatar)
    }, [user])

    const handleUpdate = () => {
        UserService.updateUser(user?.id, {
            name: userName, 
            password: password, 
            phone: phoneNumber, 
            address: address, 
            avatar: avatar
        })
        message.success('Cập nhật thành công!')
    }

    return (
        <div className={cx('profile_wrapper')}>
            <div className={cx('link_to_profile')}>
                <span onClick={linkToHome} className={cx('link')}>Trang chủ</span>
                <RightOutlined style={{fontSize: "1.4rem", fontWeight: "lighter", color: "rgba(0,0,0,0.3)", padding: "0 4px"}} />
                <span>Thông tin tài khoản</span>
            </div>
            <div className={cx('account')}>
                <div className={cx('avatar_wrapper')}>
                    {avatar ?
                    <img className={cx('avatar')} src={avatar} alt="avt"/>
                    :
                    <img className={cx('avatar')} src={userIcon} alt="avt"/>
                    }
                    <Upload className={cx('upload')} showUploadList={false} onChange={handleAvatar} maxCount={1}>
                        <Button className={cx('change_info_btn')} icon={<UploadOutlined />}>Chọn ảnh đại diện</Button>
                    </Upload>
                </div>
                <div className={cx('info_user')}>
                    <h1 className={cx('title')}>
                        Thông tin tài khoản
                    </h1>
                    <div className={cx('info_content')}>
                        <p className={cx("info_label")}>Tên người dùng:</p>
                        <p className={cx("info")}>{userName}</p>
                        <Button className={cx('change_info_btn')} onClick={OpenChangeUserName}>Thay đổi</Button>
                    </div>
                    <div className={cx('info_content')}>
                        <p className={cx("info_label")}>Mật khẩu:</p>
                        <p className={cx("info")}>******</p>
                        <Button className={cx('change_info_btn')} onClick={OpenChangePassword}>Thay đổi</Button>
                    </div>
                    <div className={cx('info_content')}>
                        <p className={cx("info_label")}>Số điện thoại:</p>
                        <p className={cx("info")}>{phoneNumber}</p>
                        <Button className={cx('change_info_btn')} onClick={OpenChangePhone}>Thay đổi</Button>
                    </div>
                    <div className={cx('info_content')}>
                        <p className={cx("info_label")}>Địa chỉ:</p>
                        <p className={cx("info")}>{address}</p>
                        <Button className={cx('change_info_btn')} onClick={OpenChangeAddress}>Thay đổi</Button>
                    </div>
                    <Button onClick={handleUpdate} className={cx('update_btn')}>Cập nhật thông tin</Button>
                </div>
            </div>
            {openForm && 
                <div className={cx('change_form_wrapper')} onClick={setForm}>
                    <div className={cx('change_form_content')} onClick={(e) => e.stopPropagation()}>
                        <h2 className={cx('label_change')}>Nhập thông tin</h2>
                        {flagUserName &&
                            <input className={cx('input_change')} type='text' placeholder='Nhập tên người dùng' onChange={handleInputChange}/>
                        }
                        {flagPassword && 
                            <input className={cx('input_change')} type='password' placeholder='Nhập mật khẩu mới' onChange={handleInputChange}/>
                        }
                        {flagPhone &&
                            <input className={cx('input_change')} type='number' placeholder='Nhập số điện thoại' onChange={handleInputChange}/>
                        }
                        {flagAddress &&
                            <input className={cx('input_change')} type='text' placeholder='Nhập địa chỉ' onChange={handleInputChange}/>
                        }
                        <Button onClick={handleChangeForm} className={cx('update_change_btn')}>Cập nhật</Button>
                    </div>
                </div>
            }
        </div>
    );
}

export default Profile;