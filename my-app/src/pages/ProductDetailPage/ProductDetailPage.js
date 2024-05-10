import className from "classnames/bind";
import styles from "./ProductDetailPage.module.scss";
import { useState } from "react";
import { MinusOutlined, PlusOutlined,StarFilled } from "@ant-design/icons";
import Button from "../../components/Button";

const cx = className.bind(styles)

function ProductDetail() {
    const [image, setImage] = useState("https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg")

    const url = 
    [
        {src: "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg", alt: "iphone 15"}, 
        {src: "https://phuongtranmobile.com/data/product/500/apple-iphone-15-pro-lineup-hero-230912full-bleed-imagexlarge-1694655131.jpg", alt: "iphone 15"}, 
        {src: "https://bachlongstore.vn/vnt_upload/product/10_2023/iii.png", alt: "iphone 15"}, 
        {src: "https://tuanmystore.vn/wp-content/uploads/2023/09/CEB24D32-D136-4082-8B9F-CD60CD4DA5B0.jpeg", alt: "iphone 15"},
        {src: "https://cdn-v2.didongviet.vn/files/products/2023/8/13/1/1694546055406_2_iphone_15_pro_xam_didongviet.jpg", alt: "iphone 15"},
        {src:"https://static.kinhtedothi.vn/w960/images/upload/2023/07/28/r-7.jpg", alt: "iphone 15"}
    ]

    const handleImage = (src) => {
        setImage(src)
    }

    const [number, setNumber] = useState(0)

    const handlePlusQuantity = () => {
        setNumber(number => number+1)
    }

    const handleMinusQuantity = () => {
        if (number > 0){
            setNumber(number => number-1)
        }
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('link_to_detail')}>
                Trang chủ
            </div>
            <div className={cx('detail')}>
                <div className={cx('detail_image')}>
                    <div className={cx('large_img_container')}>
                        <img className={cx('large_img')} src={image} alt="Detail product"/>
                    </div>
                    <div className={cx('small_img_container')}>
                        {url.map((img, index) => {
                            return(
                                <div key={index} className={cx('image_wrapper', {'active' : img.src === image})}>
                                    <img onClick={() => handleImage(img.src)} className={cx('small_img') } src={img.src} alt={img.alt}/>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className={cx('detail_product')}>
                        <h2 className={cx('title_product')}>Iphone 15 Promax</h2>
                        <div className={cx('rated_star')}>
                            <span><StarFilled /></span>
                            <span><StarFilled /></span>
                            <span><StarFilled /></span>
                            <span><StarFilled /></span>
                        </div>
                        <span className={cx('status')}> | Đã bán 1000+</span>
                        <p className={cx('price')}>1.000.000</p>
                        <span className={cx('to_address')}>Giao đến </span>
                        <span className={cx('address')}>Q. 1, P.Bến Nghé, Hồ Chí Minh</span>
                        <span> - </span>
                        <span className={cx('change_address')}>Đổi địa chỉ</span>
                        <div className={cx('quantity')}>
                            <p className={cx("title_number")}>Số lượng</p>
                            <div className={cx('minus')} onClick={handleMinusQuantity}>
                                <MinusOutlined />
                            </div>
                            <div className={cx('number')}>{number}</div>
                            <div className={cx('plus')} onClick={handlePlusQuantity}> 
                                <PlusOutlined />
                            </div>
                        </div>
                        <div className={cx('buy_btn')}>
                            <Button large primary>Chọn mua</Button>
                            <Button large outline>Mua trả sau</Button>
                        </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;