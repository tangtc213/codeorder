
import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import {
    Input,
    Button,
} from 'antd'
import api from './api'

const forgetDiv = {
    textAlign: 'center',
    width: '80vw',
    margin: '2rem auto',
    display: 'flex',
}

var timeId
const Forget = () => {
    const history = useHistory()
    // 设置一个倒计时
    const [countTime, setCountTime] = useState(5)
    // 检查是否发送邮箱
    const [hassend, setHassend] = useState(false)
    // 设置一个定时器
    // 如果倒计时清零，则返回前页
    if(countTime === 0) {
        history.goBack()
        clearInterval(timeId)
    }
    const emailRef = useRef()
    const forget = async (e) => {
        e.preventDefault()
        let email = emailRef.current.value.trim()
        if(!email) {
            alert('请输入邮箱')
            return false
        }
        try {
            let res = await api.post('/forgot',{
                email
            })
            if(res) {
                setHassend(true)
                timeId = setInterval(() => {
                    setCountTime(countTime => countTime - 1)
                }, 1000)
            }
        } catch(e) {
            alert(e.response.data.msg)
        }
    }
    return (
        <div>
            { hassend
              ? <div style={forgetDiv}>
                  邮件已发送{countTime}秒后返回
              </div>
              :<form style={forgetDiv} onSubmit={forget}>
                  <Input ref={emailRef} type="text" placeholder="xxx@xx.com" />
                  <Button type="primary">邮箱找回</Button>
               </form>
            }
        </div>
     );
}

export default Forget;
