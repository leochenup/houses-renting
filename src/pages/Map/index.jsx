import React from 'react'
import { getCurrentCity } from '../../utils/index'
import { Toast, ActivityIndicator } from 'antd-mobile';
import { ListItem } from '../../components'
import style from './index.module.scss'
import NavHeader from '../../components/NavHeader/index'
import { API } from '../../utils'
import { BASE_URL } from '../../utils/url'


const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255,0,0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(255,255,255)',
    textAlign: 'center'
}


/**
 * 地图缩放级别
 * 区 11 范围 10~12
 * 镇 13 范围 12~14
 * 小区 15 范围 14~16
 * 
 * 
 * 区域级别
 * 1 大区域
 * 2 中区域
 * 3 小区
 */
const BMap = window.BMap
export default class Map extends React.Component {
    state = {
        isShowList: false,
        currenArea: { list: [], area: null },
        animating: true
    }

    map = null
    listBox = React.createRef()

    async componentDidMount() {

        // Toast.loading('Loading...', 30, () => {
        //     console.log('Load complete !!!');
        // })

        // 获取当前城市数据
        this.currentCity = await getCurrentCity()
        //根据当前城市获取区域房源数据
        let { houseData } = await this.getAreaData(this.currentCity)

        // 将大区房源数据缓存
        this.houseData = houseData
        //初始化显示地图
        this.showInitMap(this.currentCity)

        //自动根据缩放显示大区房源数据
        this.adjustAreaData()

        // 监听地图移动函数 隐藏 列表
        this.mapMoveStart()

        //渲染该城市的区域数据提示标label
        this.renderHouseTip(houseData, 1)
    }

    showInitMap = async (currentCity) => {
        this.map = new BMap.Map("container");
        this.onLoadeMapEnd()
        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野    
        myGeo.getPoint(currentCity.label + "市", (point) => {
            if (point) {
                this.map.centerAndZoom(point, 11);
                this.map.addControl(new BMap.NavigationControl());
                this.map.addControl(new BMap.ScaleControl());
                this.map.disableDoubleClickZoom()
                this.map.setMinZoom(11)
            }
        }, currentCity.label + "市");

    }

    //获取城市及区域的数据
    getAreaData = (current) => {
        return new Promise(async (resovle, reject) => {
            let res = await API.get(`/area/map?id=${current.value}`)
            resovle({ houseData: res.data.body })
        })
    }

    //渲染该城市的区域数据提示标label
    renderHouseTip = (houseData, laybelType) => {
        for (let i = 0; i < houseData.length; i++) {
            const area = houseData[i];
            let point = new BMap.Point(area.coord.longitude, area.coord.latitude)

            var opts = {
                position: point,    // 指定文本标注所在的地理位置
                offset: new BMap.Size(-23, -63)    //设置文本偏移量
            }
            let label = new BMap.Label("", opts)
            label.setContent(`
                <div class="${area.label.length > 7 // 根据字符串长度渲染不同长度的显示框
                    ? style.bubbelLongLong
                    : area.label.length > 5
                        ? style.bubbelLong
                        : style.bubbel}">
                    <p class="${style.name}" >${area.label}</p> 
                    <p>${area.count}套</p>
                    <div class="${style.trangle}"></div>
                </div>
            `)
            label.setStyle(labelStyle)
            //label 设置类型
            label.type = laybelType
            // 添加点击事件
            let isOpen = true//为点击事件添加同步锁
            label.addEventListener('click', () => {
                if (isOpen) {
                    isOpen = false
                    if (!this.state.isShowList && area.value !== this.state.currenArea.area?.value) {
                        this.setState({ animating: true })
                    }
                    this.getAreaData(area).then(({ houseData }) => {
                        // 获取缩放级别
                        let currentZoom = this.map.getZoom()
                        let nextZoom = currentZoom
                        if (currentZoom < 13) {
                            nextZoom = 13
                        } else if (currentZoom < 15) {
                            nextZoom = 15
                        } else if (currentZoom < 19) {
                            nextZoom = 19
                        }
                        if (currentZoom < 19) {
                            //缩放地图
                            this.map.setZoom(nextZoom)
                        }


                        if (label.type !== 3) {
                            // 去除 上一级的 label 
                            this.map.clearOverlays()
                            // 将点击点 移动到中心位置
                            this.map.panTo(point, true)
                        } else {
                            if (!this.state.isShowList) {
                                const { availHeight, availWidth } = window.screen
                                let centerX = availWidth / 2
                                let centerY = ((availHeight - 45) - availHeight / 2) / 2 + 45

                                let { x, y } = this.map.pointToPixel(point)
                                let dX = centerX - x
                                let dY = centerY - y
                                //点击点移动到中心位置
                                this.map.panBy(dX, dY, true)

                                //获取数据

                                let cityCode = this.currentCity.value
                                if (area.value !== this.state.currenArea.area?.value) {
                                    console.log("家在数据")
                                    API.get(`/houses?cityId=${cityCode}&area=${area.value}`).then((res) => {
                                        let { data: { body: { list } } } = res
                                        this.setState({
                                            currenArea: { list, area }
                                        })
                                    })
                                }
                            }
                            this.toggleListState()
                        }
                        this.renderHouseTip(houseData, laybelType)
                        isOpen = true //解开同步锁
                        this.setState({ animating: false })
                    })
                }
            })
            this.map.addOverlay(label)
        }
        //更新下一级覆盖物所需的类型
        if (laybelType < 3) {
            laybelType++
        }
    }

    //自动根据缩放显示大区房源数据
    adjustAreaData = () => {
        let startZoom = 11
        let endZoom = startZoom
        let area = [{ min: 11, max: 12 }, { min: 13, max: 14 }, { min: 15, max: 19 }]

        // 地图缩放开始监听
        this.map.addEventListener('zoomstart', () => {
            startZoom = this.map.getZoom()
        })

        // 地图缩放结束监听
        this.map.addEventListener('zoomend', (a, b) => {
            endZoom = this.map.getZoom()
            let startIndex = area.findIndex((item) => startZoom >= item.min && startZoom <= item.max)
            let endIndex = area.findIndex((item) => endZoom >= item.min && endZoom <= item.max)
            if (startIndex !== endIndex && endIndex === 0) {
                //修改显示的数据
                //清除所有标记
                this.map.clearOverlays()
                this.renderHouseTip(this.houseData, 1)
            }
        })

    }

    //监听地图是否加载完成
    onLoadeMapEnd = () => {
        this.map.addEventListener('tilesloaded', () => {
            console.log("加载完成")
            this.setState({ animating: false })
        })
    }
    // 地图移动函数 隐藏 列表
    mapMoveStart = () => {
        this.map.addEventListener('movestart', () => {
            if (this.state.isShowList) {
                this.toggleListState()
            }
        })
    }

    // 切换列表显示收起状态
    toggleListState = () => {
        this.listBox.style.display = 'block'
        setTimeout(() => {
            this.setState({ isShowList: !this.state.isShowList }, () => {
                if (!this.state.isShowList) {
                    setTimeout(() => {
                        this.listBox.style.display = 'none'
                    }, 200)
                }
            })
        }, 100)
    }

    render() {
        return (
            <>
                <div className={style.map} >
                    <NavHeader title={"地图找房"} />
                    {/* 地图容器 */}
                    <div className={style.container} id="container" />
                    {/* : style.moveUp */}

                    <div ref={(ref) => this.listBox = ref}
                        className={[style.houseListBox, this.state.isShowList ? style.moveUp : ""].join(" ")} >
                        <div className={style.houseListTitleBox}>
                            <span className={style.listTitle}>房屋列表</span>
                            <span className={style.listTitleMore}>更多房源</span>
                        </div>

                        <div className={style.listOuter} >
                            {this.state.currenArea.list.map((value, index) => <ListItem value={value} index={index} />)}
                        </div>
                    </div>

                    <ActivityIndicator
                        toast
                        text="Loading..."
                        animating={this.state.animating}
                    />
                </div>

            </>
        )
    }
}

