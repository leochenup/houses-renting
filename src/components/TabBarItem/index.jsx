import React from 'react'
import { TabBar } from 'antd-mobile'

{/* <i className="iconfont icon-ind"></i> */ }
// this.state.selectedTab === '/home/index'
export default class TabBarItem extends React.Component {

    render() {
        const { title, icon, selectedIcon, selected, onPress } = this.props
        return (
            <TabBar.Item
                title={title}
                key={title}
                icon={icon}
                selectedIcon={selectedIcon}
                selected={selected}
                onPress={onPress}
                data-seed="logId"
            />
        )
    }
}