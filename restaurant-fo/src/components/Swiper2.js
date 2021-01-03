import React from 'react';
import 'antd/dist/antd.css'
import { Carousel } from 'antd';
import '../static/style/swiper2.scss'

const Slideshow = () => {
    return (
        <div className="swiper" >
            <Carousel  autoplay>
                <div>
                <h3><img style={{height: '73.3vw'}} src={'/upload/swiper3.jpg'} alt="swiper" /></h3>
                </div>
                <div>
                <h3><img style={{height: '73.3vw'}} src={'/upload/swiper4.jpg'} alt="swiper" /></h3>
                </div>
                <div>
                <h3><img style={{height: '73.3vw'}} src={'/upload/swiper5.jpg'} alt="swiper" /></h3>
                </div>
            </Carousel>
        </div>
     );
}

export default Slideshow;
