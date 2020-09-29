import axios from 'axios'
import { getToken, removeToken } from './token'
import { BASE_URL } from './url'

const API = axios.create({
    baseURL: BASE_URL
})

API.interceptors.request.use((config) => {
    const { url } = config
    if (url.startsWith('/user') && !url.startsWith('/user/registered') && !url.startsWith('/user/login')) {
        config.headers.authorization = getToken()
    }

    return config
})


API.interceptors.response.use(res => {
    if (res.data.status === 400) {
        removeToken()
    }
    return res
})
export { API }