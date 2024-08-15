import classNames from 'classnames/bind'
import styles from './TypeProducts.module.scss'
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles)

function TypeProduct({name}) {
    return (
        <Link to={`/products/${name}`}>
            <p className={cx('type_product_item')}>
                {name}
            </p>
        </Link>
    );
}

export default TypeProduct;