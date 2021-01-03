import React from 'react';
import 'antd/dist/antd.css'
import { Carousel } from 'antd';
import '../static/style/slideshow.scss'

const Slideshow = () => {
    return (
        <div className="carousel" >
            <Carousel
                autoplay
            >
                <div>
                <h3><img style={{width: '16rem' , height: '9rem'}} src={'/upload/swiper1.jpg'} alt="swiper1" /></h3>
                </div>
                <div>
                <h3><img style={{width: '16rem' , height: '9rem'}} src={'/upload/swiper2.jpg'} alt="swiper2" /></h3>
                </div>
            </Carousel>
        </div>
     );
}

export default Slideshow;
