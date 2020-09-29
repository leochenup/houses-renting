import React from 'react';
import { PickerView, Carousel, Flex, Grid, Toast } from 'antd-mobile'
import { getCurrentCity, API } from '../../utils'
import { ListItem, SearchBar, Filter, CustomList, NoHouse } from '../../components'
import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'
import styles from './index.module.scss'
import src from '../../assets/images/kong.png'
import { BASE_URL } from '../../utils/url'


export default class HouseList extends React.Component {

    state = {
        localCity: '',
        list: [],
        count: 0,
        isTitleFixed: false,
        // 数据是否加载完成
        isGetData: false
    }

    // list = React.createRef()

    async componentDidMount() {
        const { value, label } = await getCurrentCity()
        this.setState({
            localCity: label
        })
        this.searchHouseList(1, 20)
    }

    searchHouseList = async (start, end) => {
        //开启loading
        Toast.loading('加载中...', 0, null, false)
        const { value } = await getCurrentCity()
        const res = await API.get('/houses', {
            params: {
                ...this.filters,
                cityId: value,
                start,
                end
            }
        })
        // 关闭loading
        Toast.hide()

        const { list, count } = res.data.body
        if (count) {
            Toast.info(`共找到${count}条结果`, 1, null, false)
        }
        this.setState({
            list,
            count,
            isGetData: true
        })
    }

    renderHouseList = (params) => {
        //回到顶部
        window.scrollTo(0, 0)
        this.filters = params
        this.searchHouseList(1, 20)
    }


    // 列表滚动后判断是否加载
    isRowLoaded = ({ index }) => {
        return !!this.state.list[index];
    }

    loadMoreRows = ({ startIndex, stopIndex }) => {
        return new Promise(async (resolve, reject) => {
            const { value } = await getCurrentCity()
            const res = await API.get('/houses', {
                params: {
                    ...this.filters,
                    cityId: value,
                    start: startIndex + 1,
                    end: stopIndex + 1
                }
            })
            const { list, count } = res.data.body
            this.setState({
                list: [...this.state.list, ...list],
                count
            })
            resolve()

        })
    }

    render() {
        const { count, list, isTitleFixed, isGetData } = this.state
        return (
            <div className={styles.houseList}>
                <div className={styles.topBar}>
                    < Flex className={styles.searchBox}>
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
                <Filter
                    renderHouseList={this.renderHouseList}
                    loadMoreRows={this.loadMoreRows}
                    isTitleFixed={isTitleFixed} />

                {/* 房源列表 */}
                {!(isGetData && count === 0)
                    ? (<InfiniteLoader
                        isRowLoaded={this.isRowLoaded}
                        loadMoreRows={this.loadMoreRows}
                        rowCount={count}
                        minimumBatchSize={20}
                    >
                        {({ onRowsRendered, registerChild }) => (
                            <WindowScroller >
                                {({ height, isScrolling, scrollTop }) => (
                                    <AutoSizer>
                                        {({ width }) => (
                                            <List
                                                onRowsRendered={onRowsRendered}
                                                ref={registerChild}
                                                className={styles.list}
                                                isScrolling={isScrolling}
                                                scrollTop={scrollTop}
                                                autoHeight
                                                width={width}
                                                height={height}
                                                rowCount={count}
                                                onScroll={({ scrollTop, scrollHeight }) => {
                                                    if (scrollTop >= 1) {
                                                        if (!isTitleFixed) {
                                                            this.setState({
                                                                isTitleFixed: true
                                                            })
                                                        }
                                                    } else {
                                                        if (isTitleFixed) {
                                                            this.setState({
                                                                isTitleFixed: false
                                                            })
                                                        }
                                                    }
                                                }}
                                                rowHeight={({ index }) => {
                                                    if (!!list[index]) {
                                                        let houseItem = list[index]
                                                        return houseItem.tags.length > 4 ? 134 : 110
                                                    } else {
                                                        return 134
                                                    }
                                                }}
                                                rowRenderer={({ key, index, style }) => {
                                                    if (!list[index]) {
                                                        return <div
                                                            className={styles.loadingBar}
                                                            key={key}
                                                            style={style}>
                                                            <div className={styles.inner}>loading ...</div>
                                                        </div>
                                                    }
                                                    return <ListItem value={list[index]} i={index} key={key} style={style} />
                                                }}
                                            />
                                        )}
                                    </AutoSizer>
                                )}
                            </WindowScroller>
                        )}
                    </InfiniteLoader>)
                    : <NoHouse >没有结果！请更换条件查询~~</NoHouse>}
            </div >
        )
    }
}



