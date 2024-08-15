import classNames from "classnames/bind";
import styles from "./TypeProductPage.module.scss";
import Navbar from "../../components/Navbar/Navbar"
import CardComponent from "../../components/CardComponent/CardComponent";
import { Pagination } from "antd";
import { Link } from "react-router-dom";
import * as ProductServices from '../../services/ProductServices'
import { useQuery } from "@tanstack/react-query";

const cx = classNames.bind(styles);

function TypeProductPage() {

    const fetchProductAll = async () => {
        const res = await ProductServices.getAllProduct()
        return res
      }
    
    const {data: products} = useQuery({
    queryKey: ['products'], 
    queryFn: fetchProductAll
    })

    return (
        <div className={cx("wrapper")}>
            <div className={cx('navbar')}>
                <Navbar />
            </div>
            <div className={cx('products')}>
                <div className={cx('cards')}>
                    {products?.data?.map((product) => {
                        return(
                            <Link to='/productDetail'>
                                <CardComponent 
                                    key = {product.name}
                                    image = {product.image}
                                    name = {product.name}
                                    price = {product.price}
                                    rating = {product.rating}
                                    discount = {product.discount}
                                    sold = {product.sold}
                                />
                            </Link>
                        )
                    })}
                </div>
                <div className={cx('pagination')}>
                    <Pagination defaultCurrent={1} total={30} />
                </div>
            </div>
        </div>
    );
}

export default TypeProductPage;
