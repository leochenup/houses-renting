import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'
import { Link } from 'react-router-dom'
import { NavHeader } from '../../components'
import styles from './index.module.css'
import { API } from '../../utils'
import { setToken } from '../../utils/token'
import { withFormik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup';

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {

  render() {
    const { values, errors, touched, location, history } = this.props

    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader} title={'账号登录'} />
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <Form >
            <div className={styles.formItem}>
              <Field className={styles.input} name="username" placeholder="请输入账号" />
            </div>
            <ErrorMessage name='username' component='div' className={styles.error} />

            <div className={styles.formItem}>
              <Field className={styles.input} placeholder="请输入密码" name="password" />
            </div>
            <ErrorMessage name='password' component='div' className={styles.error} />

            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </Form>
          <Flex className={styles.backHome}>
            <Flex.Item className={styles.center}>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}


Login = withFormik({
  mapPropsToValues: () => ({ username: '', password: '' }), // 对应于表单中的 name属性
  handleSubmit: async (values, { props }) => {
    const { username, password } = values
    let res = await API.post('/user/login', {
      username,
      password
    })
    const { status, description, } = res.data
    const { state } = props.location
    if (status === 200) {
      const { body: { token } } = res.data
      setToken(token)
      if (state) {
        console.log(props.history)
        props.history.replace(state.from.pathname)
      } else {
        props.history.go(-1)
      }

    } else {
      Toast.info(description, 2, null, false)
    }
  },
  validationSchema: Yup.object().shape({
    username: Yup.string().required('账号为必填项！').matches(REG_UNAME, '长度为5到8位，只能出现数字、字母、下划线'),
    password: Yup.string().required('账号为必填项！').matches(REG_PWD, '长度为5到12位，只能出现数字、字母、下划线'),
  })
})(Login)

//使用高阶组件包装
export default Login
