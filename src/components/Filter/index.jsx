import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterMore from '../FilterMore'
import FilterPicker from '../FilterPicker'
import { API, getCurrentCity } from '../../utils'

import styles from './index.module.scss'


export default class Filter extends Component {

    state = {
        isShowMoreBox: false,
        isShowPickerBox: false,
        titleSelectedStatus: {
            area: false,
            rentType: false,
            price: false,
            more: false
        },
        pickerData: null,
        pickerType: 'area',
        queryStrArrays: {
            area: [],
            rentType: [],
            price: [],
            more: [],
            roomType: [],
            floor: [],
            characteristic: [],
            oriented: []
        },

    }

    queryStrArrays = {
        area: [],
        rentType: [],
        price: [],
        more: [],
        roomType: [],
        floor: [],
        characteristic: [],
        oriented: []
    }

    filterData = {}

    componentDidMount() {
        this.getFilterData()
    }


    //获取数据
    getFilterData = async () => {
        this.currentCity = await getCurrentCity()
        let res = await API.get('/houses/condition', {
            params: { id: this.currentCity.value }
        })
        this.filterData = res.data.body
    }

    // 高亮选择 title
    tintTilte = (type) => {
        if (this.queryStrArrays[this.state.pickerType].length === 0) {
            this.setState({
                titleSelectedStatus: {
                    ...this.state.titleSelectedStatus,
                    [this.state.pickerType]: false
                }
            }, () => {
                this.setState({
                    titleSelectedStatus: {
                        ...this.state.titleSelectedStatus,
                        [type]: true
                    }
                })
            })
        } else {
            this.setState({
                titleSelectedStatus: {
                    ...this.state.titleSelectedStatus,
                    [type]: true
                }
            })
        }
    }

    // 取消高亮选择 title
    cancelTintTilte = (type) => {
        this.setState({
            titleSelectedStatus: {
                ...this.state.titleSelectedStatus,
                [type]: false
            }
        })
    }

    // 切换MoreBox
    toggleMoreBox = (type) => {
        if (!this.state.isShowMoreBox) {
            document.body.style.overflowY = 'hidden'
        }
        this.setMoreBoxData()
        this.setState({
            isShowMoreBox: !this.state.isShowMoreBox,
            pickerType: type
        })
    }

    setMoreBoxData = () => {
        let pickerData = [
            { title: "户型", options: this.filterData['roomType'], type: 'roomType' },
            { title: "楼层", options: this.filterData['floor'], type: 'floor' },
            { title: "特点", options: this.filterData['characteristic'], type: 'characteristic' },
            { title: "朝向", options: this.filterData['oriented'], type: 'oriented' },
        ]
        this.setState({
            pickerData
        })
    }

    // 关闭pickerBox
    closePickerBox = () => {
        this.setState({
            isShowPickerBox: false,
        })
    }

    // 切换pickerBox
    togglePickerBox = (type) => {
        this.setCurrentPickerData(type)
        if (!this.state.isShowPickerBox) {
            document.body.style.overflowY = 'hidden'
            this.setState({
                isShowPickerBox: !this.state.isShowPickerBox,
                pickerType: type
            })
        }
        this.setState({
            pickerType: type
        })
    }

    //设置当前picker中的数据
    setCurrentPickerData = (type) => {
        let pickerData = this.filterData[type]
        if (type === 'area') {
            pickerData = [pickerData, this.filterData['subway']]
        }
        this.setState({
            pickerData
        })
    }

    onSaveDate = (type, res) => {
        document.body.style.overflowY = ''
        if (type === 'more') {
            this.queryStrArrays = {
                ...this.queryStrArrays,
                ...res,
                more: [true]
            }
            this.setState({
                queryStrArrays: this.queryStrArrays,
            }, () => {
                this.sendRequest()
            })
        } else {
            this.setState({
                queryStrArrays: this.queryStrArrays
            }, () => {
                this.sendRequest()
            })
        }
    }

    onCancelData = (type) => {
        document.body.style.overflowY = ''
        this.queryStrArrays = {
            ...this.queryStrArrays,
            [type]: []
        }

        if (type !== 'more') {
            this.setState({
                queryStrArrays: {
                    ...this.state.queryStrArrays,
                    [type]: []
                },
                titleSelectedStatus: {
                    ...this.state.titleSelectedStatus,
                    [type]: false
                }
            })
        } else {
            this.queryStrArrays = {
                ...this.queryStrArrays,
                more: [],
                roomType: [],
                floor: [],
                characteristic: [],
                oriented: []
            }
            this.setState({
                queryStrArrays: {
                    ...this.state.queryStrArrays,
                    more: [],
                    roomType: [],
                    floor: [],
                    characteristic: [],
                    oriented: []
                },
                titleSelectedStatus: {
                    ...this.state.titleSelectedStatus,
                    more: false
                }
            })
        }
    }

    onPickerChange = (res, type) => {
        this.queryStrArrays[type] = res
        if (type === 'more') {
            this.queryStrArrays['more'] = true
        }
    }

    sendRequest = async () => {
        let { queryStrArrays } = this.state
        let params = { cityId: this.currentCity.value }
        if (queryStrArrays.area[0] === 'area') {
            params.area = queryStrArrays.area[queryStrArrays.area.length - 1]
                ? queryStrArrays.area[queryStrArrays.area.length - 1] : ''
            params.subway = ''
        } else {
            params.subway = queryStrArrays.area[queryStrArrays.area.length - 1]
                ? queryStrArrays.area[queryStrArrays.area.length - 1] : ''
            params.area = ''
        }
        params.rentType = queryStrArrays.rentType[0] ? queryStrArrays.rentType[0] : ''
        params.price = queryStrArrays.price[0] ? queryStrArrays.price[0] : ''
        params.roomType = queryStrArrays.roomType[0] ? queryStrArrays.roomType[0] : ''
        params.oriented = queryStrArrays.oriented[0] ? queryStrArrays.oriented[0] : ''
        params.characteristic = queryStrArrays.characteristic[0] ? queryStrArrays.characteristic[0] : ''
        params.floor = queryStrArrays.floor[0] ? queryStrArrays.floor[0] : ''
        params.start = 1
        params.end = 20

        let { renderHouseList } = this.props
        renderHouseList(params)
    }

    render() {
        const { isShowMoreBox, isShowPickerBox, titleSelectedStatus, pickerType, pickerData } = this.state
        const { isTitleFixed } = this.props
        return (
            <div className={[styles.root, isTitleFixed ? styles.fixed : ''].join(' ')}>
                <div className={[styles.mask, isShowPickerBox ? styles.show : ''].join(' ')}
                    onClick={this.closePickerBox}></div>
                <div className={styles.content}>
                    <FilterTitle
                        titleSelectedStatus={titleSelectedStatus}
                        toggleMoreBox={this.toggleMoreBox}
                        togglePickerBox={this.togglePickerBox}
                        closePickerBox={this.closePickerBox}
                        tintTilte={this.tintTilte} />

                    <FilterPicker
                        show={isShowPickerBox}
                        closePickerBox={this.closePickerBox}
                        onPickerChange={this.onPickerChange}
                        onSaveDate={this.onSaveDate}
                        onCancelData={this.onCancelData}
                        data={pickerData}
                        type={pickerType} />

                    <FilterMore
                        show={isShowMoreBox}
                        hideMoreBox={this.toggleMoreBox}
                        onSaveDate={this.onSaveDate}
                        onCancelData={this.onCancelData}
                        data={pickerType === "more" ? pickerData : null}
                    />
                </div>

            </div>
        )
    }
}
