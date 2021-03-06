import { getCityFromLocal, setLocalCity } from './city'
import { API } from './api'
import { BASE_URL } from './url'

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
        citiesIndex,
        API
    }
}


const BMap = window.BMap
const getCurrentCity = () => {
    let bufferCity = getCityFromLocal()
    if (!bufferCity) {
        return new Promise(resolve => {
            let myCity = new BMap.LocalCity();
            myCity.get(async (result) => {
                var cityName = result.name;
                console.log(result)
                const res = await API.get(`/area/info?name=${cityName}`)
                bufferCity = res.data.body
                setLocalCity({ label: bufferCity.label, value: bufferCity.value })
                resolve(bufferCity)
            })
        })
    } else {
        return bufferCity
    }
}


const handlerIndex = {
    CITYLIST: "CITYLIST",
    INDEXLIST: 'INDEXLIST',
    run: (c, str) => {
        switch (c) {
            case "#":
                if (str === 'CITYLIST') {
                    c = "当前位置"
                }
                break;

            case "hot":
                if (str === 'CITYLIST') {
                    c = "热门城市"
                } else {
                    c = "热"
                }
                break;
            default:
                c = c.toUpperCase()
                break
        }
        return c
    }
}


const getListScrollToNumber = (indexList, v) => {

    let num = 0
    for (let i = 0; indexList[i] !== v; i++) {
        num++
    }
    return num
}

export {
    formatCityList,
    getCurrentCity,
    handlerIndex,
    getListScrollToNumber,
    API,
    BASE_URL
}