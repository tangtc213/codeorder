import React from 'react';
import Swiper2 from './components/Swiper2'
import './static/style/orderFinish.scss'

const OrderFinish = (props) => {
    const orderNumber = props.location.state.deskName + props.location.state.id
    return (
        <div className="order-finish">
            <div className="order-finish-header">
                已完成下单
            </div>
            <div className="order-finish-content">
                <div className="order-tip">您的取餐号为</div>
                <div className="order-number">{orderNumber}</div>
            </div>
            <div className="order-finish-footer">
                请出示订单号领餐
            </div>
            <div className="order-finish-swiper">
                <Swiper2 />
            </div>
        </div>
     );
}

export default OrderFinish;
