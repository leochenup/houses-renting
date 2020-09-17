// react-virtualized 长列表的使用
import React from 'react';
import { NavBar, Icon } from 'antd-mobile';
import { formatCityList, getCurrentCity } from '../../utils'


import axios from 'axios'
import './index.scss'

export default class CityList extends React.Component {


    state = {
        cities: {},
        citiesIndex: []
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

        let currentCity = getCurrentCity()
        let { cities, citiesIndex } = formatCityList(body)

        //添加最热城市
        citiesIndex.unshift("hot")
        // 添加当前城市
        citiesIndex.unshift("#")
        //添加最热城市索引
        cities["hot"] = hotCities
        // 添加当前城市索引
        cities['#'] = [currentCity]
        this.setState({
            citiesIndex,
            cities
        })
    }

    render() {
        return (
            <div>
                <NavBar
                    className="navbar"
                    mode="light"
                    icon={<i className="iconfont icon-back"></i>}
                    onLeftClick={() => this.props.history.goBack()}
                >城市选择</NavBar>
            </div>
        )
    }
}