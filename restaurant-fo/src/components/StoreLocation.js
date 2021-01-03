import React, { useEffect, useState } from 'react';
import '../static/style/storelocation.scss'
import api from '../api'
import { useParams } from 'react-router';
import '../static/style/font.css'

function useDeskInfo() {
    const {rid, did} = useParams()
    const [deskInfo, setDeskInfo] = useState(null)
    useEffect(() => {
        api.get(`/deskinfo/r/${rid}/d/${did}`).then(res => {
            setDeskInfo(res.data)
        }).catch(err => {
            console.log('get failed')
        })
    },[rid, did])
    return deskInfo
}

const StoreLocation = () => {
    // 自定义hook获取desk信息
    const deskInfo = useDeskInfo()
    return (
        <div className="storelocation">
            <div className="store-name">杭州庆春乐购店{' >'}</div>
            <div className="store-location"><i className="iconfont icondizhi"></i>距离您314m</div>
            <div className="store-deskInfo">桌号：{deskInfo && deskInfo.name}</div>
        </div>
     );
}

export default StoreLocation;
