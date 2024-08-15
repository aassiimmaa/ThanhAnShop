import className from "classnames/bind";
import styles from "./Home.module.scss";
import TypeProduct from "../../components/TypeProduct/TypeProducts";
import { RightOutlined } from "@ant-design/icons";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import slider1 from "../../assets/image/slider1.webp";
import slider2 from "../../assets/image/slider2.webp";
import slider3 from "../../assets/image/slider3.webp";
import CardComponent from "../../components/CardComponent/CardComponent";
import Button from "../../components/Button/index";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as ProductServices from '../../services/ProductServices'
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading/Loading";
import useDebounce from "../../hooks/useDebounce";

const cx = className.bind(styles);

function Home() {
  const searchValue = useSelector((state) => state.product.search)
  const debounced = useDebounce(searchValue, 500)
  const [loading, setLoading] = useState(false)
  
  const [type, setType] = useState()

  const fetchAllType = async () => {
    const res = await ProductServices.getAllType()
    setType(res?.data)
  }

  useEffect(() => {
    fetchAllType()
  }, [])

  const [limit, setLimit] = useState(6)
  //alo
  const fetchProductAll = async (context) => {
    setLoading(true)
    const search = context?.queryKey && context?.queryKey[2]
    const limit = context?.queryKey && context?.queryKey[1]
    const res = await ProductServices.getAllProduct(search, limit)
    setLoading(false)
    return res
  }

  const {data: products} = useQuery({
    queryKey: ['products', limit, debounced],
    queryFn: fetchProductAll,
    keepPreviousData: true
  })

  return (
    <Loading isLoading={loading}>
      <div  className={cx("type_product_wrapper")}>
        <div className={cx("type_product_content")}>
          {type?.map((item, index) => {
            return <TypeProduct name={item} key={index} />;
          })}
          <button className={cx("next_type_product_btn")}>
            {<RightOutlined />}
          </button>
        </div>
        <div className={cx("slider")}>
          <SliderComponent arrImages={[slider1, slider2, slider3]} />
        </div>
        <div className={cx("products")}>
          {products?.data?.map((product) => {
            return (
              <Link key={product._id} className={cx('product_item')} to={`/productDetail/${product._id}`}>
                <CardComponent 
                  image = {product.image}
                  name = {product.name}
                  price = {product.price}
                  rating = {product.rating}
                  discount = {product.discount}
                  sold = {product.sold}
                  key = {product._id}
                />
              </Link>
            )
          })}  
        </div>
        <div className={cx("more_product_btn")}>
          <Button
            disabled={true ? limit >= products?.total || limit > products?.data?.length : false} 
            outline 
            large 
            onClick={() => {setLimit(limit+6)}}
          >
            Xem thêm
          </Button>
        </div>
      </div>
    </Loading>
  );
}

export default Home;
