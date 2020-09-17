import { List } from "antd-mobile";
import axios from 'axios'

const formatCityList = list => {
    //城市列表
    let cities = {}
    //索引数组
    let citiesIndex = []

    for (let i = 0; i < list.length; i++) {
        const c = list[i];
        let fi = c.short.substr(0, 1)
        // "a" in obj 判断 obj 中是否有 "a" 属性
        if (!(fi in cities)) {
            cities[fi] = []
        }
        cities[fi].push(c)
    }

    //遍历对象的属性 key 为 cities 属性 
    for (const key in cities) {
        if (cities.hasOwnProperty(key)) {
            citiesIndex.push(key)
        }
    }
    citiesIndex = citiesIndex.sort()

    return {
        cities,
        citiesIndex
    }
}


const BMap = window.BMap
const getCurrentCity = () => {

    //判断内存中是否有当前城市信息
    let bufferCity = JSON.parse(localStorage.getItem("hkzf_city"))
    if (!bufferCity) {
        let myCity = new BMap.LocalCity();
        myCity.get(async (result) => {
            var cityName = result.name;
            cityName = cityName.split("市")[0]
            //调用接口获取城市信息
            try {
                const res = await axios.get(`http://127.0.0.1:8080/area/info?name=${cityName}`)
                bufferCity = res.data.body
                //将城市信息缓存到内存中
                localStorage.setItem('hkzf_city', JSON.stringify({ label: bufferCity.label, value: bufferCity.value }))
            } catch (error) {
                return ({ label: "上海", value: "AREA|dbf46d32-7e76-1196" })
            }
        })

    }
    return bufferCity
}



export {
    formatCityList,
    getCurrentCity
}