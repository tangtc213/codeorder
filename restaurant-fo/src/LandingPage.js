import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router';


import StoreLocation from './components/StoreLocation'
import Swiper2 from './components/Swiper2'
import './static/style/landingPage.scss'

const LandingPage = () => {
    const [customs, setCustoms] = useState(1)
    const {rid, did} = useParams()
    const history = useHistory()
    function startOrder () {
        history.push(`/r/${rid}/d/${did}/c/${customs}`)
    }

    return (
        <div className="landingPage">
            <div style={{zIndex:'-1'}} className="landingPage-swiper">
                <Swiper2 />
            </div>
            <div style={{marginTop: '-4rem'}}>
                <StoreLocation />
            </div>
            <div className="landingPage-content">
                <div className="user-select box-shadow">
                    <h2 style={{marginBottom:'1px'}}>请选择用餐人数</h2>
                    <ul className="custom-count">
                        <li className={customs === 1 ? 'active' : null } onClick={() => setCustoms(1)}>1</li>
                        <li className={customs === 2 ? 'active' : null }  onClick={() => setCustoms(2)}>2</li>
                        <li className={customs === 3 ? 'active' : null }  onClick={() => setCustoms(3)}>3</li>
                        <li className={customs === 4 ? 'active' : null }  onClick={() => setCustoms(4)}>4</li>
                    </ul>
                    <br />
                    <span onClick={startOrder} className="start-order-btn">开始点餐</span>
                </div>
                <div className="new-info">
                    御膳房新情报
                </div>
                <div className="new-info-list">
                    <img src="/static/newInfo.png" alt="newInfo" />
                </div>
            </div>
        </div>
     );
}

export default LandingPage;
