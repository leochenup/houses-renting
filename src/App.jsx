import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

const CityList = React.lazy(() => import('./pages/CityList'))
const Map = React.lazy(() => import('./pages/Map'))
const Details = React.lazy(() => import('./pages/Details'))
const Home = React.lazy(() => import('./pages/Home'))
const Login = React.lazy(() => import ('./pages/Login'))
const AuthRoute = React.lazy(() => import('./components/AuthRoute'))
const Add = React.lazy(() => import('./pages/Rent/Add'))
const Search = React.lazy(() => import('./pages/Rent/Search'))
const Rent = React.lazy(() => import('./pages/Rent'))

// 配置所有有的路由
function App() {
  return (
    <Router>
      <Suspense fallback={<div>loading...</div>}>
        <div className="app">

          {/* 重定向到 /home */}
          <Route path="/" render={() => <Redirect to="/home" />} />

          <Route path="/home" component={Home} />
          <Route path="/citylist" component={CityList} />
          {/* 地图导航 */}
          <Route path="/map" component={Map} />
          {/* <Route path="/details/:id" component={Details} /> */}
          <Route path="/login" component={Login} />
          <Route path='/details/:id' component={Details} />

          <AuthRoute exact path="/rent" component={Rent} />
          <AuthRoute path="/rent/add" component={Add} />
          <AuthRoute path="/rent/search" component={Search} />

        </div>
      </Suspense>
    </Router>
  );
}

export default App;
