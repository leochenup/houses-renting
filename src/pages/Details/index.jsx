import React, { Component } from 'react'
import { NavHeader, ListItem, HousePackage } from '../../components'
import styles from './index.module.scss'
import { Carousel, Flex, Toast, Modal } from 'antd-mobile'
import { BASE_URL } from '../../utils/url'
import { API } from '../../utils'
import { isAuth } from '../../utils/token'

// 猜你喜欢
const recommendHouses = [
    {
        id: 1,
        houseImg: '/newImg/7bk83o0cf.jpg',
        desc: '72.32㎡/南 北/低楼层',
        title: '安贞西里 3室1厅',
        price: 4500,
        tags: ['随时看房']
    },
    {
        id: 2,
        houseImg: '/newImg/7bk83o0cf.jpg',
        desc: '83㎡/南/高楼层',
        title: '天居园 2室1厅',
        price: 7200,
        tags: ['近地铁']
    },
    {
        id: 3,
        houseImg: '/newImg/7bk83o0cf.jpg',
        desc: '52㎡/西南/低楼层',
        title: '角门甲4号院 1室1厅',
        price: 4300,
        tags: ['集中供暖']
    }
]

// 百度地图
const BMap = window.BMap

const labelStyle = {
    position: 'absolute',
    zIndex: -7982820,
    backgroundColor: 'rgb(238, 93, 91)',
    color: 'rgb(255, 255, 255)',
    height: 25,
    padding: '5px 10px',
    lineHeight: '14px',
    borderRadius: 3,
    boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
    whiteSpace: 'nowrap',
    fontSize: 12,
    userSelect: 'none'
}


let alert = Modal.alert
export default class Detail extends Component {
    state = {
        isLoading: true,
        isFavorite: false,

        houseInfo: {
            // 房屋图片
            houseImg: [],
            // 标题
            title: '',
            // 标签
            tags: [],
            // 租金
            price: 0,
            // 房型
            roomType: '两室一厅',
            // 房屋面积
            size: 89,
            // 装修类型
            renovation: '精装',
            // 朝向
            oriented: [],
            // 楼层
            floor: '',
            // 小区名称
            community: '',
            // 地理位置
            coord: {
                latitude: '39.928033',
                longitude: '116.529466'
            },
            // 房屋配套
            supporting: [],
            // 房屋标识
            houseCode: '',
            // 房屋描述
            description: ''
        }
    }

    async componentDidMount() {
        window.scrollTo(0, 0)
        const { params: { id } } = this.props.match
        this.id = id
        this.getHousesDetails(id)

        this.checkFavorite(id)
    }

    getHousesDetails = async (id) => {
        let res = await API.get('/houses/' + id)
        this.setState({
            houseInfo: res.data.body,
            isLoading: false
        }, () => {
            this.renderMap(this.state.houseInfo.community, {
                latitude: this.state.houseInfo.coord.latitude,
                longitude: this.state.houseInfo.coord.longitude
            })
        })
    }

    //判断是否喜欢
    checkFavorite = async (id) => {
        if (!isAuth()) return
        let res = await API.get('/user/favorites/' + id)
        const { status, body } = res.data
        if (status === 200) {
            this.setState({
                isFavorite: body.isFavorite
            })
        }
    }

    //收藏
    toggleFavorite = async () => {
        if (!isAuth()) {
            alert('去登录', '登录后才能进行操作', [
                { text: '取消', onPress: () => { } },
                { text: '确定', onPress: () => { this.props.history.push('/login') } },
            ])
            return
        }
        const { isFavorite } = this.state
        if (isFavorite) {
            let res = await API.delete('/user/favorites/' + this.id)
            if (res.data.status === 200) {
                this.setState({
                    isFavorite: false
                }, () => { Toast.info('取消收藏', 2, null, false) })
            } else {
                //失败
                alert('信息已过时，请重新登录', '登录后才能进行操作', [
                    { text: '取消', onPress: () => { } },
                    { text: '确定', onPress: () => { this.props.history.push('/login') } },
                ])
            }
        } else {
            let res = await API.post('/user/favorites/' + this.id)
            if (res.data.status === 200) {
                this.setState({
                    isFavorite: true
                }, () => { Toast.info('已收藏', 2, null, false) })
            } else {
                //失败
                alert('信息已过时，请重新登录', '登录后才能进行操作', [
                    { text: '取消', onPress: () => { } },
                    { text: '确定', onPress: () => { this.props.history.push('/login') } },
                ])
            }
        }

    }

    // 渲染轮播图结构
    renderSwipers() {
        const {
            houseInfo: { houseImg }
        } = this.state

        return houseImg.map(item => (
            <a
                key={item}
                href="http://itcast.cn"
                style={{
                    display: 'inline-block',
                    width: '100%',
                    height: 252
                }}
            >
                <img
                    src={BASE_URL + item}
                    alt=""
                    style={{ width: '100%', verticalAlign: 'top', height: '100%' }}
                />
            </a>
        ))
    }

    // 渲染地图
    renderMap(community, coord) {
        const { latitude, longitude } = coord

        const map = new BMap.Map('map')
        const point = new BMap.Point(longitude, latitude)
        map.centerAndZoom(point, 17)

        const label = new BMap.Label('', {
            position: point,
            offset: new BMap.Size(0, -36)
        })

        label.setStyle(labelStyle)
        label.setContent(`
          <span>${community}</span>
          <div class="${styles.mapArrow}"></div>
        `)
        map.addOverlay(label)
    }

    render() {
        const { isLoading, houseInfo, isFavorite } = this.state

        return (
            <div className={styles.root}>
                <NavHeader className={styles.topBar}
                    rightContent={<i className="iconfont icon-share"></i>}
                    title={'房源详情'} />

                {/* 轮播图 */}
                <div className={styles.slides}>
                    {!isLoading ? (
                        <Carousel autoplay infinite autoplayInterval={5000}>
                            {this.renderSwipers()}
                        </Carousel>
                    ) : (
                            ''
                        )}
                </div>

                {/* 房屋基础信息 */}
                <div className={styles.info}>
                    <h3 className={styles.infoTitle}>{houseInfo.title}</h3>
                    <Flex className={styles.tags}>
                        <Flex.Item>
                            {houseInfo.tags.map(item => (
                                <span className={[styles.tag, styles.tag1].join(' ')} key={item}>
                                    {item}
                                </span>
                            ))}
                        </Flex.Item>
                    </Flex>

                    <Flex className={styles.infoPrice}>
                        <Flex.Item className={styles.infoPriceItem}>
                            <div>
                                {houseInfo.price}
                                <span className={styles.month}>/月</span>
                            </div>
                            <div>租金</div>
                        </Flex.Item>
                        <Flex.Item className={styles.infoPriceItem}>
                            <div>{houseInfo.roomType}</div>
                            <div>房型</div>
                        </Flex.Item>
                        <Flex.Item className={styles.infoPriceItem}>
                            <div>{houseInfo.size}</div>
                            <div>面积</div>
                        </Flex.Item>
                    </Flex>

                    <Flex className={styles.infoBasic} align="start">
                        <Flex.Item>
                            <div>
                                <span className={styles.title}>装修：</span>精装
                            </div>
                            <div>
                                <span className={styles.title}>楼层：</span>
                                {houseInfo.floor}
                            </div>
                        </Flex.Item>
                        <Flex.Item>
                            <div>
                                <span className={styles.title}>朝向：</span>
                                {houseInfo.oriented.map(item => item + ' ')}
                            </div>
                            <div>
                                <span className={styles.title}>类型：</span>普通住宅
                            </div>
                        </Flex.Item>
                    </Flex>
                </div>

                {/* 地图位置 */}
                <div className={styles.map}>
                    <div className={styles.mapTitle}>
                        小区： <span>{houseInfo.community}</span>
                    </div>
                    <div className={styles.mapContainer} id="map">地图 </div>
                </div>

                {/* 房屋配套 */}
                <div className={styles.about}>
                    <div className={styles.houseTitle}>房屋配套</div>
                    <HousePackage
                        // select={true}
                        list={[
                            '电视',
                            '冰箱',
                            '洗衣机',
                            '空调',
                            '热水器',
                            '沙发',
                            '衣柜',
                            '天然气'
                        ]}
                    // onSelect={(data) => {
                    //     console.log(data)
                    // }}
                    />
                    {/* <div className="title-empty">暂无数据</div> */}
                </div>

                {/* 房屋概况 */}
                <div className={styles.set}>
                    <div className={styles.houseTitle}>房源概况</div>
                    <div>
                        <div className={styles.contact}>
                            <div className={styles.user}>
                                <img src={BASE_URL + '/img/avatar.png'} alt="头像" />
                                <div className={styles.useInfo}>
                                    <div>王女士</div>
                                    <div className={styles.userAuth}>
                                        <i className="iconfont icon-auth" />已认证房主
                                    </div>
                                </div>
                            </div>
                            <span className={styles.userMsg}>发消息</span>
                        </div>

                        <div className={styles.descText}>
                            {/* {description || '暂无房屋描述'} */}
                            {houseInfo.description ? houseInfo.description : '暂无房屋描述'}
                        </div>
                    </div>
                </div>

                {/* 推荐 */}
                <div className={styles.recommend}>
                    <div className={styles.houseTitle}>猜你喜欢</div>
                    <div className={styles.items}>
                        {recommendHouses.map((item, i) => (
                            <ListItem value={item} i={i} onClick={a => a} key={i + item.title} />
                        ))}
                    </div>
                </div>

                {/* 底部收藏按钮 */}
                <Flex className={styles.fixedBottom}>
                    <Flex.Item className={styles.getMid} onClick={() => { this.toggleFavorite() }}>
                        <img
                            src={isFavorite ? BASE_URL + '/img/star.png' : BASE_URL + '/img/unstar.png'}
                            className={styles.favoriteImg}
                        // alt="收藏"
                        />
                        <span className={styles.favorite}>{isFavorite ? '已收藏' : '收藏'}</span>
                    </Flex.Item>
                    <Flex.Item className={styles.getMid}>在线咨询</Flex.Item>
                    <Flex.Item className={styles.getMid}>
                        <a href="tel:400-618-4000" className={styles.telephone}>电话预约 </a>
                    </Flex.Item>
                </Flex>

            </div>
        )
    }
}

