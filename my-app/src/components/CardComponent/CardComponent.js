import { StarFilled } from '@ant-design/icons'
import classNames from 'classnames/bind'
import styles from './CardComponent.module.scss'
import logo from '../../assets/image/logo.png'

const cx = classNames.bind(styles)

function CardComponent(props) {
    const {image, name, price, rating, discount, sold} = props
    return (
    <div className={cx('card')}>
        <img className={cx('product-image')} src={image} alt="product" />
        <div className={cx('card_content')}>
            <p className={cx('product_name')}>{name}</p>
            <div className={cx('product_rated')}>
                <span>{rating} </span>
                <StarFilled style={{color: "yellow"}} />
                <span> | Đã bán {sold>1000 ? '1000+' : sold || 0}</span>
            </div>
            <div className={cx('product_price_discount')}>
                <span className="product_price">{price}đ</span>
                <span className={cx('product_discount')}>{discount ? `-${discount}%` : ""}</span>
            </div>
        </div>
        <img className={cx('official_logo')} src={logo} alt='logo' />
    </div>
    );
}

export default CardComponent;