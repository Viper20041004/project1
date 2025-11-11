import React from 'react'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Image } from 'antd';
import { WrapperSliderStyle } from './style';

export const SlideComponent = ({arrImage}) => {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000,
    };
    return (
      <WrapperSliderStyle {...settings}>
        {arrImage.map((image, index) => (
          <div key={index}>
            <Image
              src={image}   
              alt="slider"
              preview={false}
              style={{ width: '100%', height: '530px', objectFit: 'cover', display: 'block' }}
            />
          </div>
        ))}
      </WrapperSliderStyle>
    )
}

export default SlideComponent