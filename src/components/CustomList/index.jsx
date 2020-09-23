import React from 'react'
import PropsTypes from 'prop-types'
import style from './index.module.scss'

export default class CoustomList extends React.Component {

    static propTypes = {
        data: PropsTypes.array.isRequired,
        renderItem: PropsTypes.func.isRequired
    }

    render() {
        const { data, renderItem } = this.props
        return (
            <div className={style.listOuter}>
                {data.map((value, index) => renderItem(value, index, value + index))}
            </div>
        )
    }
}