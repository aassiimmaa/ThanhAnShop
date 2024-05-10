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

const cx = className.bind(styles);

function Home() {
  const array = [
    "Thịt,Rau Củ",
    "Bách Hóa",
    "Nhà Cửa",
    "Điện Tử",
    "Thiết Bị Số",
    "Điện thoại",
    "Mẹ & Bé",
    "Làm Đẹp",
    "Gia Dụng",
    "Thời trang nữ",
    "Thời trang nam",
    "Giày nữ",
    "Túi nữ",
  ];

  const fetchProductAll = async () => {
    const res = await ProductServices.getAllProduct()
    return res
  }

  const {data: products} = useQuery({
    queryKey: ['products'], 
    queryFn: fetchProductAll
  })

  return (
    <div  className={cx("type_product_wrapper")}>
      <div className={cx("type_product_content")}>
        {array.map((item, index) => {
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
            <Link key={product._id} className={cx('product_item')} to="/productDetail">
              <CardComponent 
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
      <div className={cx("more_product_btn")}>
        <Button outline large>
          Xem thêm
        </Button>
      </div>
    </div>
  );
}

export default Home;
