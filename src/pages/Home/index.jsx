import React, { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom'
import { TabBar } from 'antd-mobile';
import './index.css'
import AuthRoute from '../../components/AuthRoute'


const Profile = lazy(() => import('../Profile/index'))
const Index = lazy(() => import('../Index/index'))
const HouseList = lazy(() => import('../HouseList/index'))
const News  = lazy(() => import('../News/index'))


const TABBARLIST = [
    {
        title: "首页",
        icon: (<i className="iconfont icon-ind"></i>),
        path: "/home",
    },
    {
        title: "找房",
        icon: (<i className="iconfont icon-findHouse"></i>),
        path: "/home/list",
    },
    {
        title: "资讯",
        icon: (<i className="iconfont icon-infom"></i>),
        path: "/home/news",
    },
    {
        title: "我的",
        icon: (<i className="iconfont icon-my"></i>),
        path: "/home/profile",
    },
]

export default class Home extends React.Component {

    // state 只会在第一次加载时初始化 之后如果不 setState ，state 不改变

    renderTabBarItems = () => TABBARLIST.map(item => (
        <TabBar.Item
            title={item.title}
            key={item.path}
            icon={item.icon}
            selectedIcon={item.icon}
            //2 每次修改pathname都相当于想组件传递一个prop，因此组件会走更新阶段 重新渲染（不影响state），组件的this.props.location.pathname就更新了
            selected={this.props.location.pathname === item.path || item.path + '/' === this.props.location.pathname}
            onPress={() => {
                //1 每次修改pathname都相当于想组件传递一个prop，因此组件会走更新阶段 重新渲染（不影响state），组件的this.this.props.location.pathname就更新了
                this.props.history.push(item.path)
            }}
            data-seed="logId"
        />
    ))




    render() {
        return (
            <Suspense fallback={<div>loading...</div>}>
                <div className="home">
                    {/* { 配置自路由} */}
                    <Route exact path="/home" component={Index} />
                    <AuthRoute path='/home/profile' component={Profile} />
                    <Route path="/home/news" component={News} />
                    <Route path="/home/list" component={HouseList} />


                    <div className="tabbar">
                        <TabBar
                            unselectedTintColor="#949494"
                            tintColor="rgb(33,185,122)"
                            barTintColor="white"
                            hidden={false}
                            noRenderContent={true}
                        >
                            {this.renderTabBarItems()}
                        </TabBar>
                    </div>
                </div>
            </Suspense>
        )
    }
}