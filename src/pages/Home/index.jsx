import React from 'react';
import { Button } from 'antd-mobile';

export default class CityList extends React.Component {
    render() {
        return (
            <div>首页
                <Button type="primary">按钮</Button>
                <Button type="warning">按钮</Button>
                <Button type="ghost">按钮</Button>
            </div>
        )
    }
}