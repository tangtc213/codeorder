import React, { useState } from 'react';
import api from './api';
import history from './history'
import {
    Input,
} from 'antd'
import './static/style/addFood.scss'


const AddFood = () => {
    var [foodInfo, setFoodInfo] = useState({
        name: '',
        desc: '',
        price: 0,
        category: '',
        status: 'on',
        img: null,
    })

    function change(e) {
        setFoodInfo({
            ...foodInfo,
            [e.target.name]: e.target.value
        })
    }
    // 提交
    function sumbit(e) {
        e.preventDefault()
        let fd = new FormData()
        for(let key in foodInfo) {
            let val = foodInfo[key]
            fd.append(key, val)
        }
        api.post('/restaurant/1/food', fd).then(res => {
            history.goBack()
        })
    }
    // 添加图片
    function imgChange(e) {

        setFoodInfo({
            ...foodInfo,
            img: e.target.files[0]
        })
    }


    return (
    <div className="add-food">
        <h2>添加菜品</h2>
        <form onSubmit={sumbit}>
           名称： <Input type="text" onChange={change} defaultValue={foodInfo.name} name="name" /><br />
           描述： <Input type="text" onChange={change} defaultValue={foodInfo.desc} name="desc" /><br />
           价格： <Input addonAfter="元" type="text" onChange={change} defaultValue={foodInfo.price} name="price" /><br />
           分类： <Input type="text" onChange={change} defaultValue={foodInfo.category} name="category" /><br />
           图片： <Input type="file" onChange={imgChange} name="img" /><br />
           <button>提交</button>
        </form>
    </div>
     );
}

export default AddFood;
