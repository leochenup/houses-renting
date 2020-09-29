import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import { getCurrentCity } from '../../../utils'
import { API } from '../../../utils'
import _ from 'lodash'

import styles from './index.module.css'

export default class Search extends Component {
  // 当前城市id
  cityId = getCurrentCity().value

  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }

  // 返回发布页面携带小区信息
  handleCilck = ({ community, communityName }) => {
    this.props.history.replace('/rent/add', { community, communityName })
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li key={item.community} className={styles.tip}
        onClick={() => { this.handleCilck(item) }}>
        {item.communityName}
      </li>
    ))
  }

  handleChange = searchTxt => {
    this.setState({
      searchTxt
    })

    if (this.fn) {
      this.fn(searchTxt)
    } else {
      this.fn = _.debounce(async (searchTxt) => {
        //发请求
        let res = await API.get('/area/community', {
          params: {
            name: searchTxt,
            id: this.cityId
          }
        })

        let { body } = res.data
        if (!searchTxt) {
          body = []
        }
        console.log(searchTxt)
        this.setState({
          tipsList: body.map(item => ({
            community: item.community,
            communityName: item.communityName
          }))
        })
      }, 500)
    }

  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          showCancelButton={true}
          onCancel={() => history.replace('/rent/add')}
          onChange={(searchTxt) => { this.handleChange(searchTxt) }}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
