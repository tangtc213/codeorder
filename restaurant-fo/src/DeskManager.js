import React, { useEffect, useRef, useState } from 'react';
import {
    Input,
    Button,
    List,
} from 'antd'
import api from './api'



const DeskManger = () => {
    // 添加输入框
    const addDeskRef = useRef()
    const [deskList, setDeskList] = useState([])
    // 添加桌子
    function addDesk(e) {
        // console.log('----add desk', addDeskRef.current.state.value)
        api.post('/restaurant/1/desk', {
            name : addDeskRef.current.state.value,
            capacity: 4
        }).then(res => {
            setDeskList(deskList => deskList.concat(res.data))
        })
    }
    // 删除桌子
    function deleteDesk(index) {
        let did = deskList[index].id
        console.log(did)
        api.delete('/restaurant/1/desk/' + did).then(res => {
            setDeskList(deskList => deskList.slice(0, index).concat(deskList.slice(index + 1)))
        })
    }
    useEffect(() => {
        api.get('/restaurant/1/desk').then(res => {
            console.log(res.data)
            setDeskList(res.data)
        })
    },[])
    return (
        <div style={{margin: '0 1rem'}}>
            <Input
                ref={addDeskRef}
                style={{width: '50vw', margin: '1rem 0'}}
             /><Button onClick={addDesk} style={{backgroundColor: 'rgb(253,208,0)'}}>添加餐桌</Button>
            <List
                style={{border: '1px solid rgb(253,208,0)'}}
                header={<div style={{color: 'rgb(253,208,0)'}}>桌子列表</div>}
                bordered
                dataSource={deskList}
                renderItem={(item, index) => (
                    <List.Item key={item.id}>
                        桌号：{item.name} <span>可容纳：{item.capacity}人</span>
                        <Button onClick={() => deleteDesk(index)} style={{float: 'right', display: 'inline-block', marginTop: '-5px'}} type="primary" >删除桌面</Button>
                    </List.Item>
                )}></List>
        </div>
     );
}

export default DeskManger;
