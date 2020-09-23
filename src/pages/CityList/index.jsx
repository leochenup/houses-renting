// react-virtualized 长列表的使用
import React from 'react';
import { NavBar, Modal, Toast } from 'antd-mobile';
import { formatCityList, getCurrentCity } from '../../utils'
import { setLocalCity } from '../../utils/city'
import { List, AutoSizer } from 'react-virtualized';
import { NavHeader } from '../../components'

import axios from 'axios'
import './index.scss'


const alert = Modal.alert;

export default class CityList extends React.Component {

    constructor(props) {
        super(props)
        // 处理index数组得到每个索引下列表的高度范围存在 EachIndexHeight 中, 供列表滚动式索引设置用
        this.EachIndexHeight = {}
        this.state = {
            cities: {}, // 城市列表
            citiesIndex: [], //城市索引列表
            scrollToIndex: 0, // 列表滚动的距离
            seletedOneIndex: 0 // 被选中的索引
        }
    }

    componentDidMount() {
        //获取城市数据
        this.getCityList()
    }

    //获取列表
    // { label: "北京", value: "AREA|88cff55c-aaa4-e2e0", pinyin: "beijing", short: "bj" }
    getCityList = async () => {
        const { data: { body } } = await axios.get('http://127.0.0.1:8080/area/city?level=1')
        const res = await axios.get("http://127.0.0.1:8080/area/hot")
        const hotCities = res.data.body

        body[5].short = "cq"
        // 获取当前城市
        let currentCity = getCurrentCity()
        //格式化城市列表数据 和 索引数据
        let { cities, citiesIndex } = formatCityList(body)

        //添加最热城市索引
        citiesIndex.unshift("hot")
        // 添加当前城市索引
        citiesIndex.unshift("#")
        //添加最热城市
        cities["hot"] = hotCities
        // 添加当前城市
        cities['#'] = [currentCity]

        // 处理index数组得到每个索引下列表的高度范围存在 EachIndexHeight 中, 供列表滚动式索引设置用
        this.EachIndexHeight = this.createEachIndexHeight(citiesIndex, cities)

        //更新状态 处理完的数据
        this.setState({
            citiesIndex,
            cities
        })
    }

    //索引点击处理事件
    clickIndexHandler = (v, i) => {
        //被点击的索引高亮
        //列表滚动
        this.setState({
            seletedOneIndex: i,
            scrollToIndex: i
        })
    }

    //城市列表渲染
    renderList = ({ height, width }) => (
        <List
            scrollToIndex={this.state.scrollToIndex}
            scrollToAlignment={'start'}
            onScroll={this.listOnScroll}
            width={width}
            height={height}
            rowCount={this.state.citiesIndex.length}
            rowHeight={({ index }) => {
                let c = this.state.citiesIndex[index]
                let cityArray = this.state.cities[c]
                return cityArray.length * 40 + 30 + cityArray.length
            }}
            rowRenderer={this.renderListItem}
        />
    )

    // 城市列表项渲染
    renderListItem = ({ key, index, style }) => {
        let c = this.state.citiesIndex[index]
        let cityArray = this.state.cities[c]
        c = this.handlerIndex(c, 'CITYLIST')
        return (
            <div key={key} style={style}  >
                {
                    cityArray.map((city, i) => {
                        return (
                            <div key={city.label} className="list-item"
                                onClick={() => { this.setCity(city) }}>
                                {
                                    i === 0
                                        ? <div className="classify" >{c}</div>
                                        : null
                                }
                                <div className="cityName">{cityArray[i].label}</div>
                            </div>
                        )
                    })
                }
            </div>
        );
    }

    //点击城市项修改城市 
    setCity = (city) => {
        if (["北京", "上海", "广州", "深圳"].includes(city.label)) {
            alert('你选择的城市', city.label, [
                { text: '取消', onPress: () => { } },
                {
                    text: '确定', onPress: () => {
                        Toast.info("操作成功", 1)
                        //把点击获取的城市存入缓存中，供其他以页面使用
                        setLocalCity(city);
                        //返回主页
                        this.props.history.goBack()
                    }
                },
            ])
        } else {
            Toast.info(`${city.label}没有房源，请重新选择~`, 1)
        }

    }

    //列表滚动事件处理 让索引列表动起来
    listOnScroll = ({ scrollTop }) => {
        let scrollNm = 0
        for (let i = 0; i < this.EachIndexHeight.length; i++) {
            const e = this.EachIndexHeight[i];
            if (scrollTop >= e.statH && scrollTop < e.endH) {
                scrollNm = i
                break
            }
        }
        //判断当前索引与 最新计算出的索引 只用不同时才更新状态
        if (scrollNm !== this.state.seletedOneIndex) {
            this.setState({
                seletedOneIndex: scrollNm
            })
        }
    }

    //工具函数 -- 处理 索引 改为大写 或替换 成需要的索引
    handlerIndex = (c, str) => {
        switch (c) {
            case "#":
                if (str === 'CITYLIST') {
                    c = "当前位置"
                }
                break;

            case "hot":
                if (str === 'CITYLIST') {
                    c = "热门城市"
                } else {
                    c = "热"
                }
                break;
            default:
                c = c.toUpperCase()
                break
        }
        return c
    }

    //处理index数组得到每个索引下列表的高度范围存在 EachIndexHeight 中,供列表滚动式索引设置用
    /*
    EachIndexHeight =  [
            {index: "#", statH: 0, endH: 71},
            {index: "hot", statH: 71, endH: 265},
            {index: "a", statH: 265, endH: 336},
            {index: "b", statH: 336, endH: 489},
            .....
        ]
      */
    createEachIndexHeight = (citiesIndex, cities) => {
        let EachIndexHeight = []
        let currentH = 0
        let preNum = 0
        for (let i = 0; i < citiesIndex.length; i++) {
            preNum = currentH
            const c = citiesIndex[i];
            let len = cities[c].length
            currentH += len * 40 + 30 + len
            EachIndexHeight.push({
                index: c,
                statH: preNum,
                endH: currentH
            })
        }
        return EachIndexHeight
    }

    render() {
        return (
            <div className="citylist">
                <NavHeader title={"城市选择"} />

                {/* 城市列表 */}
                <AutoSizer>
                    {this.renderList}
                </AutoSizer>
                {/* 索引列表 */}
                <CityIndexComponent
                    handlerIndex={this.handlerIndex}
                    citiesIndex={this.state.citiesIndex}
                    clickIndexHandler={this.clickIndexHandler}
                    seletedOneIndex={this.state.seletedOneIndex} />
            </div>
        )
    }
}

//城市索引组件
class CityIndexComponent extends React.Component {
    render() {
        const { clickIndexHandler, citiesIndex, seletedOneIndex, handlerIndex } = this.props
        return (
            <div className="city-index">
                {citiesIndex.map((v, i) => (
                    <li className="city-index-item" key={v}>
                        <span className={seletedOneIndex === i ? "index-active" : ""}
                            onClick={(e) => {
                                clickIndexHandler(v, i)
                            }}>
                            {handlerIndex(v, 'INDEXLIST')}
                        </span>
                    </li>
                ))}
            </div>
        )
    }
}