import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
// import { useParams } from 'react-router';
import api from './api';
import './static/style/foodManager.scss'
import {
    Row,
    Col,
    Button,
    Space
} from "antd"
const imgStyle = {
    display: 'block',
    marginRight: '1rem',
    float : 'left',
    border : '1px solid',
    width: '160px',
    height: '160px'
}


function FoodItem({food, onDelete}) {
    // const { rid } = useParams(rid)
    // 添加食物的信息
    const [foodInfo, setFoodInfo] = useState(food)
    // 是否修改
    const [isModify, setIsModify] = useState(false)
    // 设置菜品的详细属性
    const [foodProps, setFoodProps] = useState({
        id: foodInfo.id,
        name: foodInfo.name,
        desc: foodInfo.desc,
        price: foodInfo.price,
        category: foodInfo.category,
        status: foodInfo.status,
        img: null
     })

    // 是否修改菜品
    function getContent(isModify) {
        if(isModify) {
            return (
            <div>
                <form>
                   名称： <input type="text" onChange={change} defaultValue={foodInfo.name} name="name" /><br />
                   描述： <input type="text" onChange={change} defaultValue={foodInfo.desc} name="desc" /><br />
                   价格： <input type="text" onChange={change} defaultValue={foodInfo.price} name="price" /><br />
                   分类： <input type="text" onChange={change} defaultValue={foodInfo.category} name="category" /><br />
                   图片： <input type="file" onChange={imgChange} name="img" /><br />
                </form>
            </div>
            )
        } else {
            return (
                    <div className="food-info-details">
                        <p>描述：{foodInfo.desc}</p>
                        <p>分类：{foodInfo.category? foodInfo.category: '[暂未分类]'}</p>
                        <p>价格：{foodInfo.price + '元'}</p>
                    </div>
            )
        }
    }
    // 保存函数
    function save() {

        var fd = new FormData()

        for(var key in foodProps) {
            var val = foodProps[key]
            fd.append(key, val)
        }
        console.log(fd)

        api.put(`/restaurant/1/food/` + foodInfo.id, fd).then(res => {
            setIsModify(false)
            setFoodInfo(res.data)
        })
    }
    // 修改函数
    function change(e) {
        setFoodProps({
            ...foodProps,
            [e.target.name]: e.target.value
        })
    }
    // 删除食物
    async function deleteFood() {
        await api.delete(`/restaurant/1/food/` + foodInfo.id).then(() => {
            onDelete(food.id)
        })
    }
    // 下线商品
    function setOffline() {
        api.put(`/restaurant/1/food/` + foodInfo.id,{
            ...foodProps,
            status: 'off',
        }).then(res => {
            setFoodInfo(res.data)
        })
    }
    // 上线商品
    function setOnline() {
        api.put(`/restaurant/1/food/` + foodInfo.id,{
            ...foodProps,
            status: 'on',
        }).then(res => {
            setFoodInfo(res.data)
        })
    }
    // 修改图片
    function imgChange(e) {
        console.log(e.target.files[0])
        setFoodProps({
            ...foodProps,
            img: e.target.files[0]
        })
    }
    return (
        <Col xs={{span: 24}} sm={{span:24}} md={{span: 12}} lg={{span: 7}}  className="food-col">
            <img src={'/upload/'+foodInfo.img} alt={foodInfo.name} style={imgStyle}/>
            <h3 className="food-info-title">{foodInfo.name}</h3>
            {
                getContent(isModify)
            }
            <div>
                <Space className="content-button">
                    {!isModify
                        ?<Button onClick={() => setIsModify(true)}>修改</Button>
                        :<Button onClick={save}>保存</Button>
                    }
                    {foodInfo.status === 'on'
                        ? <Button onClick={setOffline}>下架</Button>
                        : <Button onClick={setOnline}>上架</Button>
                    }
                    <Button onClick={deleteFood}>删除</Button>
                </Space>
            </div>
        </Col>
    )
}

const FoodManger = () => {
    const [foods, setFoods] = useState([])
    useEffect(() => {
        // 获取食物的列表
        api.get('/restaurant/1/food').then(res => {
            setFoods(res.data)
        })
    },[])

    function onDelete(id) {
        setFoods(foods.filter(it => it.id !==id))
    }

    return (
        <div className="food-row">
            <Button type="primary" style={{backgroundColor: 'rgb(253,208,0)', border: 'none', borderRadius:'5px', margin: '0.5rem'}}><Link to="/manager/add-food">添加菜品</Link></Button>
            <Row justify="space-between">
                {
                    foods.map(food => {
                        return <FoodItem key={food.id} food={food} onDelete={onDelete} />
                    })
                }
            </Row>
        </div>
     );
}

export default FoodManger;
