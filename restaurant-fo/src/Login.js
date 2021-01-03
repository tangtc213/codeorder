import React, { useState }from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom'
import './static/style/login.scss'
import {
    Card,
    Input,
    Button,
    Spin,
    Space,
    message
} from 'antd'
import {
    TeamOutlined,
    LockOutlined,
    VerifiedOutlined,
  } from '@ant-design/icons';
import api from './api'

const Login = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [captcha, setCaptchaCode] = useState('')
    const history = useHistory()

    function login(e) {
        e.preventDefault()
        setIsLoading(true)
        if(!name) {
            message.error('用户名不能为空')
            setIsLoading(false)
            return false
        } else if(!password) {
            message.error('密码不能为空')
            setIsLoading(false)
            return false
        } else if(!captcha) {
            message.error('验证码不能为空')
        }

        api.post('/login',{
            name,
            password,
            captcha
        }).then(res => {
            setTimeout(() => {
                setIsLoading(false)
                history.push('/manager')
            },1000)
        }
        ).catch(err => {
            setIsLoading(false)
            message.error(err.response.data.msg)
            // console.dir(err)
        })

    }
    return (
        <div className="login">
            <Spin tip="Loading..." spinning={isLoading}>
                <div className="login-card">
                    <Card title="御膳房餐厅登录" bordered={true} >
                        <Space
                            direction="vertical"
                        >
                            用户名：<Input
                                id="name"
                                size="large"
                                placeholder="Enter your name"
                                prefix={<TeamOutlined style={{color: 'rgba(0,0,0,.25)'}} />}
                                onChange={(e) => {setName(e.target.value)}}
                            />
                            密码: <Input
                                id="password"
                                size="large"
                                placeholder="Enter your password"
                                prefix={<LockOutlined style={{color: 'rgba(0,0,0,.25)'}} />}
                                onChange={(e) => {setPassword(e.target.value)}}
                            />
                            验证码：<Input
                                id="captcha-code"
                                size="large"
                                placeholder="please enter captcha-code"
                                prefix={<VerifiedOutlined style={{color: 'rgba(0,0,0,.25)'}} />}
                                onChange={(e) => setCaptchaCode(e.target.value)}
                                addonAfter={<img height={38.4} src="/api/captcha" alt="验证码" />}
                            />
                            登录：<Button style={{backgroundColor: 'rgb(253,208,0)', border: 'none'}} type="primary" size="large" onClick={login} block >Login</Button>
                        </Space>
                        <div className="login-ForR" >
                            <div><Link to="/register">前往注册</Link></div>
                            <div><Link to="/forget">忘记密码</Link></div>
                        </div>
                    </Card>
                </div>
            </Spin>

        </div>
     );
}

export default Login;

