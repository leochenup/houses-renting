import React from 'react'
import { Carousel, Flex, WhiteSpace, Grid } from 'antd-mobile'
import { Link } from 'react-router-dom'
import { getCurrentCity } from '../../utils/index'

import axios from 'axios'
import './index.scss'

import nav_1 from '../../assets/images/nav-1.png'
import nav_2 from '../../assets/images/nav-2.png'
import nav_3 from '../../assets/images/nav-3.png'
import nav_4 from '../../assets/images/nav-4.png'


const NAVLIST = [
    {
        towhere: "/home/list",
        img: nav_1,
        title: "整租"
    },
    {
        towhere: "/home/list",
        img: nav_2,
        title: "合租"
    },
    {
        towhere: "/home/map",
        img: nav_3,
        title: "地图找房"
    },
    {
        towhere: "/home/add",
        img: nav_4,
        title: "去出租"
    },
]

// //获取当前地理位置
// navigator.geolocation.getCurrentPosition(position => {
//     console.log(position)
// })


export default class Index extends React.Component {

    state = {
        swipers: [],
        isSwiperLoading: true,

        group: [],
        info: [],
        localCity: "北京"
    }

    async componentDidMount() {

        //获取当前城市信息
        const currentCity = await getCurrentCity()
        this.setState({
            localCity: currentCity.label
        })

        //获取轮播图片
        this.getSwipers()
        // 获取租房小组
        this.getGroup()
        // 获取资讯
        this.getInfo()
    }

    //获取轮播的图片
    getSwipers = async () => {
        //请求图片数据
        let { data: { body } } = await axios.get("http://127.0.0.1:8080/home/swiper")
        this.setState({
            swipers: body,
            isSwiperLoading: false
        })
    }

    // 获取资讯
    getInfo = async () => {
        let { data: { body } } = await axios.get("http://127.0.0.1:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0")
        this.setState({
            info: body
        })

    }

    // 获取租房小组
    getGroup = async () => {
        let { data: { body } } = await axios.get('http://127.0.0.1:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0')
        this.setState({
            group: body
        })
    }

    renderSwiperItem = () => (
        this.state.swipers.map(val => (
            < a
                key={val.imgSrc}
                href="#"
                className="swiper-img-box"
            >
                <img
                    src={`http://127.0.0.1:8080${val.imgSrc}`}
                    alt=""
                    style={{ width: '100%', verticalAlign: 'top' }}
                    onLoad={() => { // 图片加载完成 onError 图片加载失败
                        // fire window resize event to change height
                        window.dispatchEvent(new Event('resize'));
                        this.setState({ imgHeight: 'auto' });
                    }}
                />
            </a>
        ))
    )

    renderNavItme = () => NAVLIST.map(item => (
        <Flex.Item key={item.towhere + item.title}>
            <Link to={item.towhere}>
                <img src={item.img} />
                <p>{item.title}</p>
            </Link>
        </Flex.Item>
    ))

    renderInfoItem = () => {
        return this.state.info.map(item => (
            <a className="info-item" key={item.imgSrc}>
                <div>
                    <img src={`http://127.0.0.1:8080${item.imgSrc}`} alt="" width={120} height={80} />
                </div>
                <div className="info-item-content">
                    <div className="info-item-content-title">
                        <p>{item.title}</p>
                    </div>
                    <div className="info-item-content-desc">
                        <p>{item.from}</p>
                        <p>{item.date}</p>
                    </div>
                </div>
            </a>
        ))
    }

    // chooseCity = (city) => {
    //     this.setState({
    //         localCity: city
    //     })
    // }

    render() {
        return (
            <div className="index">

                {/* 轮播图 */}
                <div className="swiper">

                    {/* 首页搜索导航 */}
                    <Flex className="search-box">
                        <Flex className="search-left">
                            <div className="location" onClick={() => this.props.history.push("/citylist")}>
                                <span>{this.state.localCity}</span>
                                <i className="iconfont icon-arrow"></i>
                            </div>

                            <div className="search-form" onClick={() => this.props.history.push("/search")}>
                                <i className="iconfont icon-seach"></i>
                                <span>请输入小区或地址</span>
                            </div>
                        </Flex>
                        <i className="iconfont icon-map" onClick={() => this.props.history.push("/map")}></i>
                    </Flex>

                    {this.state.isSwiperLoading
                        ? null
                        : (<Carousel
                            autoplayInterval={4000}
                            autoplay={true}
                            infinite
                            dotActiveStyle={{ backgroundColor: '#21b97a' }}
                        >
                            {this.renderSwiperItem()}
                        </Carousel>)}
                </div>

                {/*  菜单导航 */}
                <Flex className="nav">
                    {this.renderNavItme()}
                </Flex>

                {/* 租房小组 */}
                <div className="groups">
                    {/* 标题 */}
                    <Flex justify='between' className="groups-title">
                        <h3>租房小组</h3>
                        <span>更多</span>
                    </Flex>
                    <Grid
                        className="grid"
                        square={false}
                        data={this.state.group}
                        columnNum={2}
                        activeStyle={true}
                        hasLine={false}
                        renderItem={(item, index) => (
                            <Flex className="grid-item" justify="between">
                                <div className="dec">
                                    <p className="title">{item.title}</p>
                                    <p className="content">{item.desc}</p>
                                </div>
                                <div>
                                    <img src={`http://127.0.0.1:8080${item.imgSrc}`} alt="" />
                                </div>
                            </Flex>
                        )} />
                </div>

                {/* 资讯 */}
                <div className="info">
                    <div className="info-title">
                        <h3>最新资讯</h3>
                    </div>
                    {this.renderInfoItem()}
                </div >

            </div >
        )
    }
}













