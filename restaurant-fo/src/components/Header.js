import React from 'react';
import '../static/style/header.scss'
import history from '../history'
import '../static/style/font.css'

const Header = () => {
    function goBack() {
        history.goBack()
    }

    return (
        <div className="header">

            <div onClick={goBack} className="header-text"><i className="iconfont iconhoutui"></i></div>
            <span>老娘舅点餐中心</span>
        </div>
     );
}

export default Header;
