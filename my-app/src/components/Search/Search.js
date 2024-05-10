import { Button, Input } from "antd";
import { SearchOutlined } from '@ant-design/icons'
import classNames from 'classnames/bind';
import styles from './Search.module.scss'

const cx = classNames.bind(styles)

function Search({...children}) {
    const {size, placeholder, textButton} = children
    return (
        <div className="search">
            <Input className={cx('search_input')} size={size} placeholder={placeholder} />
            <Button className={cx('search_btn')} size={size} icon={<SearchOutlined />}>{textButton}</Button>
        </div>
    );
}

export default Search;