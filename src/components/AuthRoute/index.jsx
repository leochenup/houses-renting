import React from 'react'
import { isAuth } from '../../utils/token'
import { Redirect, Route } from 'react-router-dom'



const AuthRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) => {
                if (isAuth()) {
                    //已经登陆
                    return <Component {...props} />
                } else {
                    //未登录
                    return <Redirect
                        to={{
                            pathname: '/login',
                            //传递 额外的数据 此处，用来指定要返回的页面路径
                            state: { from: props.location }
                        }}
                    />
                }
            }}
        />
    )

}


export default AuthRoute