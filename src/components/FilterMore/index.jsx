import React, { Component } from 'react'
import styles from './index.module.scss'


export default class index extends Component {

    state = {
        isClear: false,
        queryStr: {
            roomType: [],
            floor: [],
            characteristic: [],
            oriented: []
        }
    }

    onSaveData = () => {
        const { onSaveDate } = this.props
        onSaveDate(this.state.queryStr, 'more')
    }

    addData = (item, title, type) => {
        let { queryStr } = this.state
        let value = queryStr[type]
        if (!value.includes(item.value)) {
            if (title !== '特点') {
                value = []
            }
            value.push(item.value)
            this.setState({
                queryStr: {
                    ...this.state.queryStr,
                    [type]: value
                }
            })
        } else {
            value.splice(value.findIndex(v => v === item.value), 1)
            this.setState({
                queryStr: {
                    ...this.state.queryStr,
                    [type]: value
                }
            })
        }
    }

    clear = () => {
        this.setState({
            queryStr: {
                roomType: [],
                floor: [],
                characteristic: [],
                oriented: []
            }
        })
    }

    render() {
        const { show, hideMoreBox, data, onSaveDate, onCancelData } = this.props
        const { isClear, queryStr } = this.state
        return (
            <>
                <div className={[styles.moreBox, show ? styles.show : ''].join(' ')}>

                    {data
                        ? <>{data.map((item, i) => {
                            return <Item obj={item} key={i + item.title} data={queryStr[item.type]} addData={this.addData} />
                        })}</>
                        : null
                    }

                    <div className={[styles.btnBox, show ? styles.show : ''].join(' ')}>
                        <div className={styles.cancel} onClick={() => {
                            hideMoreBox('more')
                            this.clear()
                            onCancelData('more')
                        }}>取消</div>
                        <div className={styles.confrim} onClick={() => {
                            hideMoreBox('more')
                            this.onSaveData()
                        }}>确认</div>
                    </div>
                </div>

                <div className={[styles.mask, show ? styles.showMask : ''].join(' ')} onClick={() => hideMoreBox('more')}></div>
            </>
        )
    }
}


class Item extends React.Component {

    render() {
        const { obj, data, addData } = this.props
        return (
            < div className={styles.moreItemBox} >
                <span className={styles.moreTitle}>{obj.title}</span>
                <div className={styles.optionsBox}>
                    {obj.options.map((item, i) => (
                        <div className={[styles.option, data.includes(item.value) ? styles.selected : ''].join(' ')}
                            key={i + item.label}
                            onClick={() => {
                                addData(item, obj.title, obj.type)
                            }}>
                            {item.label}
                        </div>
                    ))}
                </div>
            </div >
        )
    }
}