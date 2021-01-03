import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom'
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
import api from './api';

const Register = () => {
    const history = useHistory()
    // 是否加载中
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    const [email, setEmail] = useState('')
    const [captcha, setCaptchaCode] = useState('')
    const [title, setTitle] = useState('')

    // 注册按钮
    function register(e) {
        e.preventDefault()

        if(!name.trim()) {
            message.error('用户名不能为空')
            return false
        } else if(!password.trim()) {
            message.error('密码不能为空')
            return false
        } else if(!rePassword.trim()) {
            message.error('请重复密码')
            return false
        } else if(!email.trim()) {
            message.error('邮箱不能为空')
            return false
        } else if(!captcha.trim()) {
            message.error('验证码不能为空')
            return false
        } else if (!title.trim()) {
            message.error('标题不能为空')
        }

        if(password !== rePassword) {
            message.error('两次密码输入不一致')
            return
        }
        api.post('/register', {
                name,
                password,
                title,
                email,
                captcha
            }).then(res => {
                alert('注册成功')
                setTimeout(() => {
                    setIsLoading(false)
                    history.push('/login')
                },500)
            }).catch(e => {
                console.dir(e)
                message.error(e.response.data.msg)
            })
    }
    return (
        <div className="login">
        <Spin tip="Loading..." spinning={isLoading}>
            <div className="login-card">
                <Card title="注册餐厅" bordered={true} >
                    <Space
                        direction="vertical"
                    >
                        <Input
                            id="name"
                            size="large"
                            placeholder="用户名"
                            prefix={<TeamOutlined style={{color: 'rgba(0,0,0,.25)'}} />}
                            onChange={(e) => {setName(e.target.value)}}
                        />
                        <Input
                            id="password"
                            size="large"
                            placeholder="密码"
                            prefix={<LockOutlined style={{color: 'rgba(0,0,0,.25)'}} />}
                            onChange={(e) => {setPassword(e.target.value)}}
                        />
                        <Input
                            id="rePassword"
                            size="large"
                            placeholder="重复密码"
                            prefix={<LockOutlined style={{color: 'rgba(0,0,0,.25)'}} />}
                            onChange={(e) => {setRePassword(e.target.value)}}
                        />
                        <Input
                            id="email"
                            size="large"
                            placeholder="邮箱"
                            prefix={<LockOutlined style={{color: 'rgba(0,0,0,.25)'}} />}
                            onChange={(e) => {setEmail(e.target.value)}}
                        />
                        <Input
                            id="email"
                            size="large"
                            placeholder="餐厅名称"
                            prefix={<LockOutlined style={{color: 'rgba(0,0,0,.25)'}} />}
                            onChange={(e) => {setTitle(e.target.value)}}
                        />
                        <Input
                            id="captcha-code"
                            size="large"
                            placeholder="验证码"
                            prefix={<VerifiedOutlined style={{color: 'rgba(0,0,0,.25)'}} />}
                            onChange={(e) => setCaptchaCode(e.target.value)}
                            addonAfter={<img height={38.4} src="/api/captcha" alt="验证码" />}
                        />
                        <Button style={{backgroundColor: 'rgb(253,208,0)', border: 'none'}} type="primary" size="large" onClick={register} block >注册</Button>
                    </Space>
                    <div className="login-ForR" >
                        <div><Link to="/login">返回登录</Link></div>
                        <div><Link to="/forget">忘记密码</Link></div>
                    </div>
                </Card>
            </div>
        </Spin>

    </div>
     );
}

export default Register;
