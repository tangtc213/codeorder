import React, {Suspense} from 'react';
import { Link, useHistory } from 'react-router-dom'
import createFetcher from '../create-fetcher'
import api from '../api'
import history from '../history'
import {
    Button,
    Menu,
} from 'antd'

import '../static/style/managerHeader.scss'


const userInfoFetcher = createFetcher(async () => {
    return api.get('/userInfo').catch(() => {
        history.push('/')
    })
})

function ResaurantInfo() {
    const history = useHistory()
    function backHome() {
        history.push('/manager')
    }
    let info = userInfoFetcher.read().data
    return (
        <div onClick={ backHome }>
            {info.title}
        </div>
    )
}

const ManagerHeader = (props) => {

    function logout() {
        api.get('/logout').then(res => {
            history.push('/login')
        })
    }
    return (
        <div className="manager-header">
            <div className="logo" >
                <Suspense fallback={<div>Loading...</div>}>
                    <ResaurantInfo />
                </Suspense>
            </div>
            <Menu className="header-menu" style={{backgroundColor: 'rgb(253, 208, 0)',marginLeft: '0'}} mode="horizontal" defaultSelectedKeys={['1']}>
                <Menu.Item key="1"><Link to="/manager/food">菜品管理</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/manager/order">订单管理</Link></Menu.Item>
                <Menu.Item key="3"><Link to="/manager/desk">餐桌管理</Link></Menu.Item>
            </Menu>
            <Button style={{margin: '.5rem .5rem .5rem 0', color: '#fff', backgroundColor: 'yellow'}} onClick={logout} >登出</Button>
        </div>
     );
}

export default ManagerHeader;
