import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom'

import CityList from './pages/CityList/index'
import Home from './pages/Home/index'
import Map from './pages/Map/index'

// 配置所有有的路由
function App() {
  return (
    <Router>
      <div className="app">

        {/* 重定向到 /home */}
        <Route path="/" render={() => <Redirect to="/home" />} />

        <Route path="/home" component={Home} />
        <Route path="/citylist" component={CityList} />
        {/* 地图导航 */}
        <Route path="/map" component={Map} />
      </div>
    </Router>
  );
}

export default App;
