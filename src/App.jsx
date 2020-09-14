import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'

import CityList from './pages/CityList/index'
import Home from './pages/Home/index'

// 配置所有有的路由
function App() {
  return (
    <Router>
      <div className="app">
        <Route exact path="/" component={Home} />
        <Route exact path="/citylist" component={CityList} />
      </div>
    </Router>
  );
}

export default App;
