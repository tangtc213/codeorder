import React, {useState, Component} from 'react';
import api from './api';
import PropTypes from 'prop-types'
import { produce } from 'immer'
import _ from 'lodash'
import $ from 'jquery'
import 'antd/dist/antd.css'
import { Drawer } from 'antd'
import Header from './components/Header'
import StoreLocation  from './components/StoreLocation'
import Slideshow from './components/Slideshow'
import {
    Badge
} from 'antd'
import './static/style/foodCart.scss'
import './static/style/font.css'


// 函数传递两个参数一个是食物的信息，一个是数目发生改变时的方法
function MenuItem({food, onUpdate, count}) {
    function dec() {
        // 当数目为0时无法继续减少
        if(count === 0) {
            return
        }
        onUpdate(food, count - 1)
    }
    function inc() {
        // 数目增加
        onUpdate(food, count + 1)
    }

    return (
        <div className="foodMenu">
            <img className="foodMenu-img" src={'/upload/' + food.img} alt={food.name} />
            <div className='foodMenu-name'>{food.name}</div>
            <div className="foodMenu-desc">{food.desc}</div>
            <div className="foodMenu-priceandadd">
                <div className="foodMenu-price">￥{food.price}</div>
                <div className="foodMenu-btn">
                    { count > 0  &&
                    <span>
                        <i className="foodMenu-btn-dec" onClick={dec}>-</i>
                        <span>{count}</span>
                    </span>
                    }
                    <i onClick={inc}>+</i>
                </div>
            </div>
        </div>
    )
}

MenuItem.prototype = {
    food: PropTypes.object.isRequired,
    onUpdate: PropTypes.func,
}
MenuItem.defaultProps = {
    onUpdate: () => {},
}

// 购物车的每一项条目
function CartItem({item, onUpdate}) {
    // 申明食物的详细信息
    var food = item.food
    // 每一种食物的数量
    var [count, setCount ] = useState(item.amount)
    function dec() {
        // 当数目为0时无法继续减少
        if(count === 0) {
            return
        }
        setCount(count - 1)
        onUpdate(food, count - 1)
    }
    function inc() {
        // 数目增加
        setCount(count + 1)
        onUpdate(food, count + 1)
    }

    return (
        <div className="cartMenu">
            <div className='cartMenu-name'>{food.name}</div>
            <div className="cartMenu-price"><span>单价￥</span>{food.price}</div>
                <div className="cartMenu-btn">
                    { count > 0  &&
                    <span>
                        <i className="cartMenu-btn-dec" onClick={dec}>-</i>
                        <span>{count}</span>
                    </span>
                    }
                    <i onClick={inc}>+</i>
                </div>
            </div>
    )
}

const CartStatus = (props) => {
    // 购物车的状态（是否有扩展）
    var [expend, setExpend] = useState(false)
    // 设置总价
    var totalPrice = calcTotalPrice(props.foods)
    const drawerClose = () => {
        setExpend(false)
    }


    return (
        <div className="cartStatus" >
            <div className="cartStatus-left">
                <span className="cartStatus-symbol" onClick={() => {setExpend(expend => !expend)}}>
                    <Badge
                        size="small"
                        count={props.foods.length}
                        >
                            <i style={{fontSize:"2rem",marginLeft:'.5rem', color: "#fff"}} className="iconfont icongouwudai7"></i>
                        </Badge>
                </span>
                <strong className="cartStatus-price"><span>￥</span>{totalPrice}</strong>
            </div>
            <div className="cartStatus-placeOrder" onClick={() => props.onPlaceOrder()}>去结算</div>
            <Drawer
                className="cart-drawer"
                title={<div className="cart-drawer-title"><div>已购商品</div><div onClick={props.clearFooCart}><i className="iconfont iconicon-z-lajitong"></i>清空购物车</div></div>}
                placement="bottom"
                closable={false}
                onClose={drawerClose}
                visible={expend}
            >
                <ul className="cart-drawer">
                    {
                        props.foods.map((item, idx) => {
                            return <CartItem key={item.food.id} item={item} onUpdate={props.onUpdate} />
                        })
                    }
                </ul>
            </Drawer>
        </div>
    )
}

// 计算总价
function calcTotalPrice(cartAry) {
    return cartAry.reduce((total, item) => {
        return total + item.amount * item.food.price
    }, 0)
}

export default class FoodCart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cart:[], //购物车数目
            foodMenu: [], // 食物列表
            deskInfo: {}, // 桌面信息
            foodMap: [], // 食物分类信息
            foodCategoryList: [], //食物分类列表
            foodCountMap : [], //已订食物与数量
            activeCategoryIdx: 0, // 选中的激活类名
            categoryList: [], // 选择滚动元素列表
        }
    }
    componentDidMount() {
        // 从路径中读取参数
        var params = this.props.match.params
        // 读取桌子的信息
        api.get('/deskinfo?did=' + params.did).then(val => {
            this.setState({
                deskInfo: val.data,
            })
        })
        // 读取某餐厅的菜单
        api.get('/menu/restaurant/1').then(res => {
            this.setState({
                foodMenu: res.data,
            })
            let foodCountMap = []
            for(let food of res.data) {
                foodCountMap.push({
                    food: food,
                    count: 0
                })
            }
            let newMap = _.entries(_.groupBy(res.data, 'category'))
            let newCategoryList = _.keys(_.groupBy(res.data, 'category'))
            this.setState({
                foodMap : newMap,
                foodCategoryList : newCategoryList,
                foodCountMap: foodCountMap,
            })
        })

        let currentList = document.getElementsByClassName('foodCart-foodlist-category')
        this.setState({
            categoryList: currentList
        })
        // 为界面绑定一个滚动事件
    //     window.addEventListener('scroll', () => {

    //         // let top = document
    //         let categoryMenu = document.getElementById('categoryMenu')
    //         // console.dir(window.scrollY)
    //         if(window.scrollY > 60) {
    //             categoryMenu.style.position = "fixed"
    //             categoryMenu.style.top = '4rem'
    //         } else {
    //             categoryMenu.style.position = "absolute"
    //             categoryMenu.style.top = '0rem'
    //         }
    //         let currentIdx
    //         let currentList = document.getElementsByClassName('foodCart-foodlist-category')
    //         for(let idx in currentList) {
    //             let oneTop = currentList[idx].offsetTop
    //             if(window.scrollY < oneTop) {
    //                 currentIdx = idx
    //                 break
    //             }
    //         }
    //         console.log(currentIdx)
    //         setTimeout(() => {
    //             // console.log(currentIdx)
    //             this.setState({
    //                 activeCategoryIdx: currentIdx
    //             })
    //         },500)

    //     })
    }

    // 将食物与食物数量列表产生映射
    mapFoodToCount(food) {
        let count
        for(let item of this.state.foodCountMap) {
            if(item.food.id === food.id) {
               count = item.count
            }
        }
        return count
    }

    // 清空购物车
    clearFooCart = () => {
        var updatedcount = produce(this.state.foodCountMap, countMap => {
            for(let item of countMap) {
                item.count = 0
            }
        })
        this.setState({
            cart: [],
            foodCountMap: updatedcount
        })
    }

    // 修改购物车内容
    foodChange =  (food, amount) => {
        // 数据更新方法
        var updated  = produce(this.state.cart, cart => {
            var idx = cart.findIndex(it => it.food.id === food.id)
            if(idx >= 0) {
                if(amount === 0) {
                    cart.splice(idx,1)
                } else {
                    cart[idx].amount = amount
                }
            } else {
                cart.push({
                    food,
                    amount,
                })
            }
        })
        var updatedcount = produce(this.state.foodCountMap, countMap => {
            var index =  countMap.findIndex(it => it.food.id === food.id)
            countMap[index].count = amount
        })
        this.setState({
            cart: updated,
            foodCountMap: updatedcount
        })
    }

    placeOrder = () => {
        // 订单的提交
        let sum = calcTotalPrice(this.state.cart)
        let params = this.props.match.params
        let state = {
            deskName: this.state.deskInfo.name,
            customCount: params.count,
            totalPrice: sum,
            details: this.state.cart,
            params,
        }
        this.props.history.push(`/r/${params.rid}/d/${params.did}/order-success`, state)
    }

    handleCategoryActive = (index) => {
        // 改变选中的category列表
        this.setState({
            activeCategoryIdx: index
        })
        // 右侧滚动
        $('html,body').animate({scrollTop: this.state.categoryList[index].offsetTop - 30}, 300)
    }

    render() {
        return (
            <div className="foodCart">
                <Header />
                <StoreLocation />

                <div className="foodCart-foodlist">
                    <div className="foodCart-foodlist-left">
                        <ul id="categoryMenu">
                            {
                                this.state.foodCategoryList.map((category,idx) => {
                                    return (
                                        <li onClick={() => this.handleCategoryActive(idx)} className={`foodCart-categoryList ${idx === this.state.activeCategoryIdx ? 'categoryActive' : ''}`} key={idx}>
                                            {category}
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    <div className="foodCart-foodlist-right">
                        <div className="slideshow">
                            <Slideshow />
                        </div>
                        {
                            this.state.foodMap.map((element,idx) => {
                              return (
                                  <div key={idx}>
                                    <span className="foodCart-foodlist-category">&nbsp;{element[0]}</span>
                                    <div>{element[1].map(food => {
                                            let count = this.mapFoodToCount(food)
                                            return <MenuItem key={food.id} food={food} onUpdate={this.foodChange} count={count}/>
                                        })}
                                    </div>
                                  </div>
                              )
                            })
                        }
                        {
                            this.state.cart.length
                            ? <div className="cart-addblank"></div>
                            : ''
                        }
                    </div>
                </div>
                {
                    this.state.cart.length
                        ? <CartStatus foods={this.state.cart} clearFooCart={this.clearFooCart} onUpdate={this.foodChange} onPlaceOrder={this.placeOrder}/>
                        : <></>
                }
            </div>
         );
    }
}
