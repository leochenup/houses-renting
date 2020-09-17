import React from 'react'
import './index.scss'

const BMapGL = window.BMapGL
const BMap = window.BMap

export default class Map extends React.Component {

    componentDidMount() {
        // 获取当前位置
        navigator.geolocation.getCurrentPosition((data) => {

            const { latitude, longitude } = data.coords
            //经纬度精确转换
            var ggPoint = new BMap.Point(longitude, latitude);
            var convertor = new BMap.Convertor();
            var pointArr = [];
            pointArr.push(ggPoint);
            convertor.translate(pointArr, 1, 5, (data) => {
                
                const { lng, lat } = data.points[0]
                console.log(lng, lat)
                //渲染地图
                var map = new BMapGL.Map("container");          // 创建地图实例 
                var point = new BMapGL.Point(lng, lat);  // 创建点坐标 
                map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别


                map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
                var scaleCtrl = new BMapGL.ScaleControl();  // 添加比例尺控件
                map.addControl(scaleCtrl);
                var zoomCtrl = new BMapGL.ZoomControl();  // 添加缩放控件
                map.addControl(zoomCtrl);
                var marker = new BMapGL.Marker(point);        // 创建标注   
                map.addOverlay(marker);

            })


        },(e)=>{
            console.log("出错")
        })
    }
    render() {
        return (
            <div className="map">
                {/* 地图容器 */}
                <div className="container" id="container" />
            </div>
        )
    }
}