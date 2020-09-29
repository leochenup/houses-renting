import React, { Component } from 'react'
import styles from './index.module.scss'

const PICKERBARITEMS = [
    { title: "区域", type: "area" },
    { title: "方式", type: "rentType" },
    { title: "租金", type: "price" },
    { title: "筛选", type: "more" }
]


export default class index extends Component {

    render() {
        const { titleSelectedStatus, tintTilte, closePickerBox, toggleMoreBox, togglePickerBox } = this.props
     
        return (
            <div className={styles.selectBar}>
                {PICKERBARITEMS.map((item, index) => (
                    <div
                        className={[styles.selectItem, titleSelectedStatus[item.type] ? styles.tint : ''].join(' ')}
                        key={index + item.title}
                        onClick={() => {
                            //高亮
                            tintTilte(item.type)
                            if (item.type === 'more') {
                                closePickerBox()
                                toggleMoreBox(item.type)
                            } else {
                                togglePickerBox(item.type)
                            }
                        }}>
                        <span>{item.title}</span>
                        <i className="iconfont icon-arrow"></i>
                    </div>
                ))}
            </div>

        )
    }
}
