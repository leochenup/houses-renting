import React from 'react'
import { Flex } from 'antd-mobile'
import { withRouter } from 'react-router-dom'
import style from './index.module.scss'

class SearchBar extends React.Component {
    render() {
        return (
            <Flex className={style.searchLeft} style={{ ...this.props.style }}>

                <div className={style.location} onClick={() => this.props.history.push("/citylist")}>
                    <span>{this.props.localCity}</span>
                    <i className="iconfont icon-arrow"></i>
                </div>

                <div className={style.searchForm} onClick={() => this.props.history.push("/search")}>
                    <i className="iconfont icon-seach"></i>
                    <span>请输入小区或地址</span>
                </div>
            </Flex>
        )
    }
}


export default withRouter(SearchBar)
