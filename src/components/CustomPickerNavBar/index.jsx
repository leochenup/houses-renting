
import React from 'react'
import style from './index.module.scss'

//picker navber
export default class CustomPickerNavBar extends React.Component {

    render() {
        const { pickerNavBarList, click, selectIndexArray } = this.props

        return (
            <div className={style.selectBar}>
                {pickerNavBarList.map((item, index) => (
                    <div
                        className={[style.selectItem, selectIndexArray.includes(index) ? style.checkNavItem : ''].join(' ')}
                        key={index + item}
                        onClick={() => { click(index) }}>
                        <span>{item}</span>
                        <i className={["iconfont icon-arrow", selectIndexArray.includes(index) ? style.checkNavItem : ''].join(' ')}></i>
                    </div>
                ))}
            </div>

        )
    }
}