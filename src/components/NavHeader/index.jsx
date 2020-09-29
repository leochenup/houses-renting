import React, { Component } from 'react'
import { NavBar } from 'antd-mobile'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'


// import './index.scss'
import style from './index.module.scss'

class NavHeader extends Component {

    static propTypes = {
        click: PropTypes.func,
        title: PropTypes.string.isRequired,
    }

    render() {
        return (
            <NavBar
                className={[style.navBar, this.props.className].join(' ')}
                mode="light"
                icon={<i className="iconfont icon-back"></i>}
                onLeftClick={this.props.click ? this.props.click : () => { this.props.history.goBack() }}
                rightContent={this.props.rightContent}
            >
                {this.props.title}
            </NavBar>
        )
    }
}


//包裹后该组件拥有路由信息 可以直接 操作路由跳转
export default withRouter(NavHeader)