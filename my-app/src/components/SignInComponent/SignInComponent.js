import classNames from 'classnames/bind'
import styles from './SignInComponent.module.scss'
import logo from '../../assets/image/logo-login.png'
import { useEffect, useState } from 'react'
import Button from '../Button/index'
import { FacebookFilled, GooglePlusSquareFilled, LeftOutlined,EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import * as UserServices from '../../services/UserServices'
import {useMutation} from '@tanstack/react-query'
import * as message from '../Message/Message'
import { useNavigate } from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'

const cx = classNames.bind(styles)

function SignIn({close}) {
    const [loginByPhoneNumber, setLoginByPhoneNumBer] = useState(true)

    const changeMethodLogin = () => {
        if(loginByPhoneNumber){
            setLoginByPhoneNumBer(false)
        } else{
            setLoginByPhoneNumBer(true)
        }
        setPhone()
        setEmail('')
        setPassword('')
        setconfirmPassword('')
    }

    const [show, setShow] = useState(false)

    const showPassword = () => {
        setShow(true)

    }

    const hidePassword = () => {
        setShow(false)
    }

    const [passwordForm, setPasswordForm] = useState(false)

    const SwitchToPasswordForm = () => {
        setPasswordForm(!passwordForm)
    }

    const [openSignUp, setOpenSignUp] = useState(false)

    const switchToSignUp = () => {
        setOpenSignUp(true)
        setPhone()
        setEmail('')
        setPassword('')
        setconfirmPassword('')
        setFlag(false)
    }

    const switchToSignIn = () => {
        setOpenSignUp(false)
        setPhone()
        setEmail('')
        setPassword('')
        setconfirmPassword('')
        setFlag(false)
    }

    const [showConfirm, setShowConfirm] = useState(false)

    const showConfirmPassword = () => {
        setShowConfirm(!showConfirm)
    }

    const [phone, setPhone] = useState()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [flag, setFlag] = useState(true)

    const handleChangePhone = (e) => {
        setPhone(e.target.value)
    }

    const handleChangeEmail = (e) => {
        setEmail(e.target.value)
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleChangeConfirmPassword = (e) => {
        setconfirmPassword(e.target.value)
    }

    const testClick = () => {
        console.log({
            "phone": phone,
            "email": email,
            "password": password,
            "confirmPassword": confirmPassword
        })
    }

    const mutationSignIn = useMutation({
        mutationFn: data => UserServices.loginUser(data)
    })

    const mutationSignUp = useMutation({
        mutationFn: data => UserServices.signUp(data)
    })

    //Log in by phone number
    // const mutationSignInByPhone = useMutation({
    //     mutationFn: data => UserServices.loginUser(data)
    // })

    // const handdleSignInByPhone = () => {
    //     mutationFn: data => UserServices.loginUser(data)
    // }

    const handleSignInByEmail = () => {
        mutationSignIn.mutate({
            email, 
            password
        })
        setFlag(true)
    }

    const handleSignUp = () => {
        mutationSignUp.mutate({
            email,
            password,
            confirmPassword
        })
        setFlag(true)
    }  

    const navigate = useNavigate()
    const closeModal = close

    //Sign Up
    useEffect(() => {
        if (mutationSignUp.isSuccess && mutationSignUp.data?.status !== 'ERR'){
            message.success('Đăng ký thành công!')
            setOpenSignUp(false)
            setEmail('')
            setPassword('')
            setconfirmPassword('')
        } else if (mutationSignUp.isError){
            message.error('Lỗi kết nối tới server!')
        }
    },[mutationSignUp.isSuccess, mutationSignUp.isError, mutationSignUp.data?.status])

    //Sign In
    useEffect(() => {
        if (mutationSignIn.isSuccess && mutationSignIn.data?.status !== 'ERR'){
            localStorage.setItem('access_token', mutationSignIn.data.access_token)
            message.success('Đăng nhập thành công!')
            navigate('/')
            closeModal()
            if (mutationSignIn.data?.access_token){
                const decoded = jwtDecode(mutationSignIn.data.access_token)
                if (decoded?.id){
                    handleGetDetailsUser(decoded?.id, mutationSignIn.data?.access_token)
                }
            }
        } else if (mutationSignIn.isError){
            message.error('Lỗi kết nối tới server!')
        }
    },[mutationSignIn.isSuccess, mutationSignIn.isError, mutationSignIn.data?.status, mutationSignIn.data?.access_token, navigate, closeModal])

    const user = useSelector((state) => state.user)
    const handleGetDetailsUser = async ( id, token) => {
        const res = await UserServices.getDetailUser(id, token)
        dispatch(updateUser(res))
    }
    
    const dispatch = useDispatch()

    return (
        <div className={cx('wrapper')} onClick={closeModal}>
           <div className={cx('modal')} onClick={(e) => e.stopPropagation()}>
                <div className={cx('sign_in_form')}>
                    {loginByPhoneNumber && !passwordForm && !openSignUp &&
                        <div className={cx('login_by_phone_number')}>
                                <h2 className={cx('hello_user')}>Xin chào,</h2>
                                <span className={cx('description')}>Nhập số số điện thoại để đăng nhập</span>
                                <br />
                                <input 
                                    required 
                                    className={cx('input_phone_number')} 
                                    type='number' 
                                    placeholder='Số điện thoại'
                                    value={phone}
                                    onChange={handleChangePhone}
                                />
                                <Button disabled={true ? !phone : false} primary large className={cx('login_btn')} onClick={SwitchToPasswordForm}>Đăng nhập</Button>
                                <p className={cx('change_login_method')} onClick={changeMethodLogin}>Đăng nhập bằng email</p>
                                <p className={cx('suggested_method')}>Hoặc tiếp tục bằng</p>
                                <div className={cx('other_login_methods')}>
                                    <FacebookFilled className={cx('facebook_icon')} />
                                    <GooglePlusSquareFilled className={cx('google_icon')}/>
                                </div>
                                <span className={cx('note')}>Bằng việc tiếp tục, bạn đã chấp nhận </span> 
                                <span className={cx('law')}>điều khoản sử dụng</span>
                        </div>
                    }

                    {loginByPhoneNumber && passwordForm && !openSignUp &&
                        <div className={cx('login_by_phone_number')}>
                                <div className={cx('back_to_input_phone')}>
                                    <LeftOutlined className={cx('back_btn')} onClick={SwitchToPasswordForm}/>
                                </div>
                                <span className={cx('description_password')}>Nhập mật khẩu để đăng nhập</span>
                                <div className={cx('password_wrapper-phone')}>
                                    <input 
                                        required 
                                        className={cx('input_password')} 
                                        type={show ? 'text' : 'password'} 
                                        placeholder='Mật khẩu'
                                        value={password}
                                        onChange={handleChangePassword}
                                    />
                                    {!show && <EyeOutlined className={cx('password_icon_phone')} onClick={showPassword}/>}
                                    {show && <EyeInvisibleOutlined className={cx('password_icon_phone')} onClick={hidePassword}/>}
                                </div>
                                {/* {mutationSignIn.data?.status === "ERR" && <span>{mutationSignIn.data?.message}</span>} */}
                                <Button disabled={true ? !phone : false} primary large className={cx('login_btn')} onClick={testClick}>Đăng nhập</Button>
                                <p className={cx('change_login_method')} onClick={changeMethodLogin}>Đăng nhập bằng email</p>
                                <p className={cx('suggested_method')}>Hoặc tiếp tục bằng</p>
                                <div className={cx('other_login_methods')}>
                                    <FacebookFilled className={cx('facebook_icon')} />
                                    <GooglePlusSquareFilled className={cx('google_icon')}/>
                                </div>
                                <span className={cx('note')}>Bằng việc tiếp tục, bạn đã chấp nhận </span> 
                                <span className={cx('law')}>điều khoản sử dụng</span>
                        </div>
                    }

                    {!loginByPhoneNumber && !openSignUp &&
                        <div className={cx('login_by_email')}>
                            <LeftOutlined className={cx('back_btn')} onClick={changeMethodLogin}/>
                            <h2 className={cx('hello_user')}>Đăng nhập bằng email</h2>
                            <span className={cx('description')}>Nhập email và mật khẩu tài khoản</span>
                            <br />
                            <input 
                                required 
                                className={cx('input_email')} 
                                type='email' 
                                placeholder='abc@email.com'
                                value={email}
                                onChange={handleChangeEmail}
                            />
                            <div className={cx('password_wrapper')}>
                                <input 
                                    required 
                                    className={cx('input_password')} 
                                    type={show ? 'text' : 'password'} 
                                    placeholder='Mật khẩu'
                                    value={password}
                                    onChange={handleChangePassword}
                                />
                                {!show && <EyeOutlined className={cx('password_icon')} onClick={showPassword}/>}
                                {show && <EyeInvisibleOutlined className={cx('password_icon')} onClick={hidePassword}/>}
                            </div>
                            {flag && mutationSignIn.data?.status === "ERR" && <span className={cx('error_input')}>{mutationSignIn.data?.message}</span>}
                            <Button disabled={true ? !email.length || !password.length : false} primary large className={cx('login_btn')} onClick={handleSignInByEmail}>Đăng nhập</Button>
                            <p className={cx('forgot_password')}>Quên mật khẩu?</p>
                            <span className={cx('sign_up_suggest')}>Chưa có tài khoản?  </span> 
                            <span className={cx('sign_up_link')} onClick={switchToSignUp}>Tạo tài khoản</span>
                        </div>
                    }

                    {openSignUp && 
                        <div className={cx('sign_up')}>
                            <h2 className={cx('hello_user')}>Xin chào,</h2>
                            <span className={cx('description')}>Điền thông tin đăng ký tài khoản</span>
                            <br />
                            <input 
                                required 
                                className={cx('input_email')} 
                                type='email' 
                                placeholder='abc@gmail.com' 
                                onChange={handleChangeEmail} 
                                value={email}
                            />
                            <div className={cx('password_wrapper')}>
                                <input 
                                    required 
                                    className={cx('input_password')} 
                                    type={show ? 'text' : 'password'} placeholder='Mật khẩu'
                                    onChange={handleChangePassword} 
                                    value={password} 
                                />
                                {!show && <EyeOutlined className={cx('sign_up_password_icon')} onClick={showPassword}/>}
                                {show && <EyeInvisibleOutlined className={cx('sign_up_password_icon')} onClick={hidePassword}/>}
                            </div>
                            <div className={cx('password_wrapper')}>
                                <input 
                                    required 
                                    className={cx('input_password')} 
                                    type={showConfirm ? 'text' : 'password'} 
                                    placeholder='Nhập lại mật khẩu'
                                    value={confirmPassword}
                                    onChange={handleChangeConfirmPassword}
                                />
                                {!showConfirm && <EyeOutlined className={cx('sign_up_confirm_password_icon')} onClick={showConfirmPassword}/>}
                                {showConfirm && <EyeInvisibleOutlined className={cx('sign_up_confirm_password_icon')} onClick={showConfirmPassword}/>}
                            </div>
                            {flag && mutationSignUp.data?.status === "ERR" && <span className={cx('error_input')}>{mutationSignUp.data?.message}</span>}
                            <Button disabled={true ? !email.length || !password.length || !confirmPassword.length : false} primary large className={cx('sign_up_btn')} onClick={handleSignUp}>Đăng ký</Button>
                            <span className={cx('sign_up_suggest')}>Đã có tài khoản? </span> 
                            <span className={cx('sign_up_link')} onClick={switchToSignIn}>Đăng nhập</span>
                        </div>
                    }
                </div>
                <div className={cx('logo')}>
                    <img className={cx('logo_img')} src={logo} alt="logo"/>
                    <p className={cx('slogan')}>Mua sắm tại ThanhAnShop</p>
                </div>
           </div>
        </div>
    );  
}

export default SignIn;