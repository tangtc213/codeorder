import React, { useRef } from 'react';
import { useParams } from 'react-router';


const Changep = () => {
    const {id} = useParams()
    const newpRef = useRef()
    const reNewpRef = useRef()

    const changep = (e) => {
        e.preventDefault()
        let password = newpRef.current.value.trim()
        let rePassword = reNewpRef.current.value.trim()
        if(!password) {
            alert('请输入新密码')
            return false
        } else if(!rePassword) {
            alert('请输入确认密码')
            return false
        }
        if(password !== rePassword) {
            alert('两次输入的密码不一致')
            return false
        }
        console.log(id)
        //api.post(`/change-password/:token`)
    }
    return (
        <div>
            <form onSubmit={changep}>
                  新密码：<input ref={newpRef} type="text" />
                  确认密码：<input ref={reNewpRef} type="text" />
                  <button>邮箱找回</button>
               </form>
        </div>
     );
}

export default Changep;
