import React from 'react';
import { PickerView, Carousel, Flex, Grid } from 'antd-mobile'
import { getCurrentCity } from '../../utils'
import { CustomPickerNavBar, SearchBar, Filter, CustomList } from '../../components'
import style from './index.module.scss'
import { BASE_URL } from '../../utils/url'




export default class CityList extends React.Component {

    queryString = [
        { str: '' },
        { str: '' },
        { str: '' },
        { str: '' }
    ]

    state = {
        localCity: ''
    }

    async componentDidMount() {
        //获取当前城市信息
        const currentCity = await getCurrentCity()
        this.setState({
            localCity: currentCity.label
        })
    }


    render() {
        return (
            <div className={style.houseList}>
                <div className={style.topBar}>
                    < Flex className={style.searchBox}>
                        <i className="iconfont icon-back" onClick={() => { this.props.history.goBack() }}></i>
                        {/* 首页搜索导航 */}
                        <SearchBar
                            localCity={this.state.localCity}
                            style={{ margin: '0 10px' }}
                        />
                        <i className="iconfont icon-map" onClick={() => this.props.history.push("/map")}></i>
                    </Flex >
                </div>


                {/* 房源查找组件 */}
                <Filter getData={this.getData} />

                {/* 房源列表 */}

                {/* <CustomList
                    data={this.state.currenArea.list}
                    renderItem={(value, index, key) => (
                        <div className={style.listItemBox} key={key}>
                            <img src={`${BASE_URL}${value.houseImg}`} alt="" />
                            <div className={style.rightDesc}>
                                <div className={style.topTitle}>
                                    <p className={style.topTitleP1}>{value.title}</p>
                                    <p className={style.topTitleP2}>{value.desc}</p>
                                </div>
                                <div className={style.bottomTitle}>
                                    {value.tags.map((tag, index) => <span key={index + tag} className={style.houseTag}>{tag}</span>)}
                                </div>
                                <div>
                                    <span className={style.price}>{value.price}元/月</span>
                                </div>
                            </div>
                        </div>
                    )}
                /> */}

            </div>
        )
    }
}

