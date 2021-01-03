import React, { useState } from 'react';
import 'antd/dist/antd.css'
import Header from './components/Header'
import StoreLocation  from './components/StoreLocation'
import './static/style/orderSuccess.scss'
import './static/style/font.css'
import api from './api'
import { useHistory, useParams } from 'react-router';

function OrderItem({item}) {
    return (
        <div className="orderItem">
            <img src={'/upload/' + item.food.img} alt={item.food.name} />
            <div className="orderItem-name">{item.food.name}</div>
            <div style={{height:'1.2rem',overflow: 'hidden',width: '14rem'}}>{item.food.desc}</div>
            <div>x{item.amount}</div>
            <div className="orderItem-price">￥{item.food.price}</div>
        </div>
    )
}

const OrderSuccess = (props) => {
    // 获取rid和did
    const {rid, did} = useParams()
    // 设置历史记录
    const history = useHistory()
    // 设置就餐方式
    const [takeout, setTakeout] = useState(false)
    // 就餐时间
    const eatTime = '立即就餐'
    // 设置订单信息
    const orderInfo = props.location.state
    // 设置用户电话
    const [orderPhone, setOrderPhone] = useState('xxx-xxxx')

    // 订单上传
    function orderUpload() {
        // console.log(orderInfo)
        api.post(`/restaurant/${rid}/desk/${did}/order`,orderInfo).then(res => {
            history.push(`/r/${rid}/d/${did}/order-finish`, res.data)
        })
    }

    return (
        <div className="orderSuccess">
            <Header />
            <StoreLocation />
            <div className="orderInfo-body">
                <div className="orderInfo-others">
                    <div className="other-item">
                        <div className="other-item-left">享用方式</div>
                        <div className="other-item-right">
                            <span onClick={() => setTakeout(false)} className={`takeout-btn ${takeout ? '': 'btn-active'}`}>门店就餐</span>
                            <span onClick={() => setTakeout(true)} className={`takeout-btn ${takeout ? 'btn-active': ''}`}>打包外卖</span>
                        </div>
                    </div>
                    <div className="other-item">
                        <div className="other-item-left">预留电话</div>
                        <div className="other-item-right">
                            <span >{orderPhone}</span>
                            <span onClick={() => setOrderPhone('158-07142537')} className="reserved-phone">自动填写</span>
                        </div>
                    </div>
                    <div className="other-item">
                        <div className="other-item-left">就餐时间</div>
                        <div className="other-item-right">
                            <span className="select-eat-time">{eatTime}</span>
                        </div>
                    </div>

                </div>
                <div className="orderInfo-content">
                    <div className="orderInfo-list">
                        {
                            orderInfo.details.map((item, idx) => {
                                return (
                                    <OrderItem item={item} key={item.food.id} />
                                )
                            })
                        }
                    </div>
                    <div className="coupons">
                        <div className="coupons-left"><i style={{fontSize: '1.1rem',color: 'rgb(253,208,0)'}} className="iconfont iconquan"></i> 可用优惠券</div>
                        <div className="coupons-right">暂无可用优惠券</div>
                    </div>
                    <div className="total-price">
                        <div className="total-sum">合计 ￥<strong>{orderInfo.totalPrice}</strong></div>
                    </div>
                </div>
            </div>
            <div className="order-submit">
                <div className="order-submit-left">合计: <strong>{orderInfo.totalPrice}</strong></div>
                <div className="order-submit-right">
                    <div className="order-sumbit-button" onClick={orderUpload}>提交订单</div>
                </div>
            </div>
        </div>
     );
}

export default OrderSuccess;
