import React, { Component, useState } from 'react';
import api from './api';
import { produce } from 'immer'
import './static/style/orderManager.scss'
import io from 'socket.io-client'
import {
    Row,
    Col,
    Space,
    Button
 } from "antd";

var orderItemStyle = {
    padding: '5px'
}

function OrderItem({order, onDetele}) {
    const [orderInfo, setOrderInfo] = useState(order)
// 订单确认
    function setComfirm() {
        api.put(`/restaurant/1/order/${order.id}/status` ,{
            status: 'comfirmed'
        }).then(() => {
            setOrderInfo({
                ...orderInfo,
                status: 'comfired'
            })
        })
    }
// 订单完成
    function setComplete() {
        api.put(`/restaurant/1/order/${order.id}/status`,{
            status: 'completed'
        }).then(() => {
            setOrderInfo({
                ...orderInfo,
                status: 'completed'
            })
        })
    }
// 删除订单
    function deleteOrder() {
        api.delete(`/restaurant/1/order/${order.id}`).then(() => {
            onDetele(order)
        })
    }

    return(
    <Col xs={{span: 24}} sm={{span:24}} md={{span: 12}} lg={{span: 7}}  className="food-col">
        <div style={orderItemStyle}>
            <div>订单编号：<span style={{fontSize: '1.1rem', fontWeight: '600'}}>{orderInfo.deskName + order.id}</span></div>
            <div>餐桌：{orderInfo.deskName}</div>
            <div>人数：{orderInfo.customCount}</div>
            <div className="order-details">

                <div>订单详情: </div>
                <div>
                    {
                        orderInfo.details.map(item => <div key={item.food.id} className="order-details-item">
                            {item.food.name} x {item.amount} ：<div style={{float: 'right',marginLeft: '120px'}}>￥{item.food.price * item.amount}</div>
                        </div>)
                    }
                </div>
            </div>
            <h3 style={{marginBottom: '0'}}>总价格：￥{orderInfo.totalPrice}</h3>
            <h3>订单状态：{orderInfo.status}</h3>
            <div>
                <Space>
                    <Button>打印</Button>
                    <Button onClick={setComfirm}>确认</Button>
                    <Button onClick={setComplete}>完成</Button>
                    <Button onClick={deleteOrder}>删除</Button>
                </Space>
            </div>
        </div>
    </Col>
)
}
class OrderManager extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orders: []
        }
    }

    componentDidMount() {
        this.socket = io()
        this.socket.on('new order', order => {
            console.log(order)
            this.setState(produce(state => {
                state.orders.unshift(order)
            }))
        })
        api.get('/restaurant/1/order').then(res => {
            this.setState({
                orders: res.data
            })
        })
    }
    componentWillUnmount() {
        this.socket.close()
    }

    onDetele = (order) => {
        var idx = this.state.orders.findIndex(it => it.id === order.id)
        this.setState(produce(this.state, state => {
            state.orders.splice(idx, 1)
        }))
    }

    render() {
        return (
            <div className="order-row">
                订单详情:
                <Row justify="space-between">
                    {  this.state.orders.length > 0
                        ? this.state.orders.map(order => {
                            return <OrderItem key={order.id} onDetele={this.onDetele} order={order} />
                        })
                        : <div>loading...</div>

                    }
                </Row>
            </div>
         );
    }
}

export default OrderManager;
