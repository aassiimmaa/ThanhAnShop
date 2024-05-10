import classNames from "classnames/bind";
import styles from "./Navbar.module.scss";
import { Checkbox, Rate} from "antd";

const cx = classNames.bind(styles);

function Navbar() {
  const onChange = () => {};

  const renderNavbarItem = (type, options) => {
    switch (type) {
      case "text":
        return options.map((option) => {
          return (
            <div key={option} className={cx("products_list")}>
              {option}
            </div>
          );
        });
      case "checkBox":
        return (
          <>
            <h4 className={cx('products_label')}>Nơi bán</h4>
            <Checkbox.Group className={cx('nav_checkBox')} onChange={onChange}>
              {options.map((option) => {
                return (
                  <Checkbox key={option.label} className={cx('checkBox_item')} value={option.value}>{option.label}</Checkbox>
                );
              })}
            </Checkbox.Group>
          </>
        );
        case 'rate':
            return(
                <div className={cx('rated_products')}>
                    <h4 className={cx('products_label')}>Đánh giá</h4>
                    {options.map(option => {
                        return(
                           <div key={option} className={cx('rated_wrapper')}>
                                <Rate className={cx('rated_star')} disabled defaultValue={option} />
                                <span className={cx('rated_products_text')}>từ {option} sao</span>
                           </div>
                        )
                    })}
                </div>
            )
        case 'price':
            return(
                <div className={cx('price_wrapper')}>
                    <h4 className={cx('products_label')}>Giá</h4>
                    {options.map(option => {
                        return (
                            <div key={option} className={cx('price')}>
                                {option}
                            </div>
                        )
                    })}
                </div>
            )
      default:
        return {};
    }
  };

  return (
    <div className={cx("navbar")}>
      <h4 className={cx("products_label")}>Danh mục sản phẩm</h4>
      {renderNavbarItem("text", [
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
      ])}

      {renderNavbarItem("checkBox", [
        { value: "A", label: "A" },
        { value: "B", label: "B" },
        { value: "C", label: "C" },
      ])}

      {renderNavbarItem("rate", [5, 4, 3])}

      {renderNavbarItem('price', ['Dưới 40.000', '40.000->120.000', '120.000->400.000', 'Trên 400.000'])}
    </div>
  );
}

export default Navbar;
