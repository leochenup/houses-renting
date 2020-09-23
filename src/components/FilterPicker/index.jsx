import React, { Component } from 'react'
import { PickerView } from 'antd-mobile'
import styles from './index.module.scss'


export default class index extends Component {

    queryStrArray = []

    render() {
        const { show, closePickerBox, type, data, onPickerChange, onSaveDate, onCancelData } = this.props
        return (

            <div className={[styles.pickerOuter, show ? styles.show : ''].join(' ')}>
                {
                    data ? <>
                        <PickerView data={data} cascade={type === 'area' ? true : false} onChange={(res) => {
                            // onPickerChange(res, type)
                            this.queryStrArray = res
                        }} />
                        <div className={styles.controllBtn} >
                            <div className={styles.cancel} onClick={this.cancelSelect} onClick={() => {
                                closePickerBox()
                                onCancelData(type)
                            }}>取消</div>
                            <div className={styles.comfirm} onClick={this.okSelect} onClick={() => {
                                closePickerBox(type)
                                onSaveDate(this.queryStrArray, type)
                            }}>确定</div>
                        </div>
                    </>
                        : null
                }
            </div>

        )
    }
}
