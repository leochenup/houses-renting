const CITY_KEY = "hkzf_city"

//获取localstorage
const getCityFromLocal = () => {
    return JSON.parse(localStorage.getItem(CITY_KEY))
}


//设置localstorage
const setLocalCity = (obj) => {
    localStorage.setItem(CITY_KEY, JSON.stringify(obj))
}

export {
    getCityFromLocal,
    setLocalCity
}