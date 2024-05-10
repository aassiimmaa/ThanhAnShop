import React from "react";
import Slider from "react-slick";
import {Image} from 'antd'
import classNames from 'classnames/bind'
import styles from './SliderComponent.module.scss'

const cx = classNames.bind(styles)

function SampleNextArrow(props) {
    const {className, style, onClick} = props;
    return (
      <div
        className={className}
        style={{...style, 
            display: "block", 
            background: "rgba(0, 0, 0, 0.3)", 
            right: "32px",
            padding: "8px"
        }}
        onClick={onClick}
      />
    );
  }
  
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, 
            display: "block",
            background: "rgba(0, 0, 0, 0.3)", 
            left: "32px",
            zIndex: 5,
            padding: "8px"
        }}
        onClick={onClick}
      />
    );
  }


function SliderComponent({arrImages}) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
        appendDots: dots => (
            <div
              style={{
              }}
            >
              <ul className={cx('dots')}> {dots} </ul>
            </div>
        ),
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };
    return (
        <Slider {...settings}>
            {arrImages.map((image, index) => {
                return(
                    <Image key={index} src={image} alt='slider' preview={false} width='100%' height="274px"/>
                )
            })}
        </Slider>
    )
}

export default SliderComponent;