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
            more: []
        }
    }


    filterData = {}


    componentDidMount() {
        this.getFilterData()

    }


    //获取数据
    getFilterData = async () => {
        let currentCity = await getCurrentCity()
        let res = await API.get('/houses/condition', {
            params: { id: currentCity.value }
        })
        this.filterData = res.data.body
        console.log(this.filterData)
    }

    // 高亮选择 title
    tintTilte = (type) => {
        if (this.state.queryStrArrays[this.state.pickerType].length === 0) {
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

    onSaveDate = (queryStrArray, type) => {
        if (type !== 'more') {
            this.setState({
                queryStrArrays: {
                    ...this.state.queryStrArrays,
                    [type]: queryStrArray
                }
            })
        } else {
            this.setState({
                queryStrArrays: {
                    ...this.state.queryStrArrays,
                    ...queryStrArray,
                    more: [true]
                }
            })
        }
    }

    onCancelData = (type) => {
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

    render() {
        const { isShowMoreBox, isShowPickerBox, titleSelectedStatus, pickerType, pickerData } = this.state
        return (
            <div className={styles.root}>
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
