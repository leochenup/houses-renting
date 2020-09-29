import React from 'react'
import PropsTypes from 'prop-types'
import styles from './index.module.scss'
import { BASE_URL } from '../../utils/url'
import { withRouter } from 'react-router-dom'

class ListItem extends React.Component {

    render() {
        const { value, i, style, onClick } = this.props
        return (
            <div className={styles.listItemBox}
                onClick={onClick ? onClick : () => { this.props.history.push('/details/' + value.houseCode) }}
                style={style}
                key={i}>
                <img src={`${BASE_URL}${value.houseImg}`} alt="" />
                <div className={styles.rightDesc}>
                    <div className={styles.topTitle}>
                        <p className={styles.topTitleP1}>{value.title}</p>
                        <p className={styles.topTitleP2}>{value.desc}</p>
                    </div>
                    <div className={styles.bottomTitle}>
                        {value.tags.map((tag, index) => <span key={index + tag} className={styles.houseTag}>{tag}</span>)}
                    </div>
                    <div>
                        <span className={styles.price}>{value.price}元/月</span>
                    </div>
                </div>
            </div>
        )
    }
}


export default withRouter(ListItem)