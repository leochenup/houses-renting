# 好客租房

## 项目初始化

- 1 使用 `npx create-react-app react-hkzf` 来初始化项目
- 2 进入项目根目录：`cd react-hkzf`
- 3 启动项目：`yarn start`

## 项目目录结构调整

- 我们约定的项目的目录结构，但是，不同公司项目的目录结构可能不同

```html
/src
  /assets       资源文件，比如：图片、字体等
  /components   公共组件，多个页面中都需要用到的组件
  /pages        页面组件
  /utils        工具函数、方法
  App.js        根组件（用来配置路由等）
  index.js      整个项目的入口文件
```

## 配置基础路由

- 1 安装：`yarn add react-router-dom`
- 2 在 App.js 根组件中配置路由规则
- 3 在 pages 目录中创建页面组件
  - 首页组件：Home/index.js
  - 城市选择组件：CityList/index.js
- 4 在 index.js 中导入根组件 App，然后，渲染根组件

- `index.js --> App.js --> 具体的页面`

## 组件库

- antd-mobile
- 使用步骤：
  - 1 安装：`yarn add antd-mobile`
  - 2 导入 antd-mobile 组件库中提供的组件
  - 3 导入 antd-mobile 组件库的样式文件（导入一次即可）

```js
// 在 index.js 项目入口中导入的：
import 'antd-mobile/dist/antd-mobile.css'

// 在 Home/index.js 中导入 Button 组件：
import { Button } from 'antd-mobile'
```

## 配置基础样式

- 在哪添加全局样式？`src/index.css`
- 注意导入样式文件顺序问题：1 先导入组件库的样式 2 再导入全局样式

## 嵌套路由

- 嵌套路由：一个路由内部又配置了另外一个路由
- 注意：子路由的 path 必须以父路由的 path 开头

```js
// App 组件内部的父路由：
<Route path="/home" component={Home} />

// 在 Home 组件内部的子路由：
<Route path="/home/index" component={Index} />
<Route path="/home/list" component={HouseList} />
<Route path="/home/news" component={News} />
<Route path="/home/profile" component={Profile} />
```

## Home 组件中底部 TabBar 菜单高亮

- 1 进入页面时，与当前 pathname 匹配的菜单项高亮
  - `selected={this.state.selectedTab === '/home/index'}`
- 2 点击 菜单项 切换菜单时高亮

- 说明：TabBar 底部导航菜单的高亮效果是通过每个 TabBar.Item 中的 selected 属性来实现
  - 如果想让当前 菜单高亮，只需要 selected 的值为 true 即可

```js
// 在每个菜单项的单击事件中：
this.setState({
  selectedTab: '/home/index'
})
```

## 封装 TabBar.Item 组件

- 因为这四个菜单，几乎是一样的，所以，我们将把每个菜单中不同的地方提取出来，作为数据。然后，直接通过数组，遍历生成四个菜单即可。
- 封装就是：*针对于变化点来封装*
  - 比如：将四个菜单中不同的地方抽象数据，然后，遍历数据生成 TabBar.Item ，将不同的地方使用数据替换即可。

```js
// 菜单项数据：
const TABBARLIST = [
  { title: '首页', icon: 'icon-ind', path: '/home/index' },
  { title: '找房', icon: 'icon-findHouse', path: '/home/list' },
  { title: '资讯', icon: 'icon-infom', path: '/home/news' },
  { title: '我的', icon: 'icon-my', path: '/home/profile' }
]

// 渲染底部TabBar菜单项
renderTabBarItems = () => {
  return TABBARLIST.map(item => (
    <TabBar.Item
      title={item.title}
      key={item.path}
      icon={<i className={`iconfont ${item.icon}`} />}
      selectedIcon={<i className={`iconfont ${item.icon}`} />}
      selected={this.state.selectedTab === item.path}
      onPress={() => {
        this.props.history.push(item.path)
        this.setState({
          selectedTab: item.path
        })
      }}
    />
  ))
}

// 渲染 TabBar 组件：
<div className="tabbar">
  <TabBar tintColor="#21B97A" noRenderContent={true}>
    {this.renderTabBarItems()}
  </TabBar>
</div>
```

## Home 组件 state 初始化的问题

- 对于 Home 组件来说， state 只会在 Home 组件第一次加载的时候初始化。也就是说：selectedTab 状态的值，只会在第一次加载的时候来获取到 路由 的pathname。
- 而每次点击底部的TabBar菜单项切换路由的时候，只是走了 Home 组件的 更新阶段，所以，state 状态初始化没有再次执行。因此 `selectedTab: this.props.location.pathname` 这句代码只会触发一次。

```js
state = {
  // 指定当前选中的 tab 菜单
  selectedTab: this.props.location.pathname,
  // 指定 TabBar 菜单是否隐藏
  hidden: false,
  // 指定 TabBar 组件是否全屏显示
  fullScreen: true
}
```

## 首页去掉 index

- 去掉了 Index 组件（首页）路由规则（path）中的 /index
- 注意：需要给 Index 组件的路由规则，添加 exact 属性，让其变为精确匹配。这样，才能做到只有当 pathname 为 /home 的时候，才让 Index 组件展示；而pathname 为 /home/list 等，不应该让其展示。

```js
<Route exact path="/home" component={Index} />
```

## 路由重定向

- Route 组件中的 `render` 属性：用来指定该路由规则匹配时要展示的内容
- render 属性的值是一个回调函数，通过回调函数的返回值来指定要渲染的内容
- 实际上这就是：**render-props 模式**

```js
<Route
  path="/"
  render={props => {
    console.log('render props模式：', props)
    return <h1>这是默认路由的内容</h1>
  }}
/>
```

- `<Redirect />` 重定向组件：通过 to 属性来指定重定向的路由地址

```js
<Route exact path="/" render={() => <Redirect to="/home" />} />
```

## 解决动态加载轮播图数据时不自动播放的问题

- 问题分析：给轮播图的状态添加默认数据（即使数据不对），那么，页面中的轮播图也能够自动播放；如果没有数据，我们发现轮播图不能够自动播放。
- 得出的结论：轮播图想要自动播放，需要默认有数据
- 又因为：轮播图数据是动态加载的，所以，我们不能直接在 轮播图数据状态 中，写死一个默认值。
- 所以，只能让轮播图在数据加载完成后，再渲染。因为此时轮播图渲染的时候，就已经有数据了。

```js
// 1 现在 state 中添加了一个用来表示轮播图是否加载完成的状态 isSwiperLoading
state = {
  isSwiperLoading: true
}

// 2 发送请求，获取轮播图数据。在获取数据成功后，将 isSwiperLoading 更新为 false
// 表示轮播图数据已经加载完成
this.setState({
  isSwiperLoading: false
})

// 3 在渲染轮播图的地方，使用 条件渲染 来决定渲染轮播图的时机
{
  this.state.isSwiperLoading
  ? null
  : <Carousel>...</Carousel>
}
```

## SASS 的说明

- SASS 是一个 预编译的CSS，与 LESS 功能类似
- 在项目中的使用步骤：
  - 1 安装：`yarn add node-sass`（这个包的作用：将 sass、scss 转化为 css）
    - [解决 node-sass 安装失败的问题](https://segmentfault.com/a/1190000010984731)
  - 2 在脚手架中创建 `.scss` 后缀的样式文件
  - 3 在组件中，导入 scss 文件
- 两种语法：
  - 1 `.scss`：就跟我们用的 less 一样
  - 2 `.sass`：这种语法里面，没有 `{}` 使用 缩进 代替花括号语法，表示层级关系

```scss
// .scss
.root {
  background-color: #fff;
  .list {
    list-style: none;
    & > li {
      font-size: 30px;
    }
  }
}
```

```sass
// .sass
.root
  background-color: #fff;
  .list
    list-style: none;
    & > li
      font-size: 30px;
```



# 好客租房 - 地图找房

## 地图找房页面结构和样式模板

```js
// 覆盖物样式
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}

// 计算要绘制的覆盖物类型和下一个缩放级别
// 区   -> 11 ，范围：>=10 <12
// 镇   -> 13 ，范围：>=12 <14
// 小区 -> 15 ，范围：>=14 <16

// 区、镇覆盖物结构：
label.setContent(`
  <div class="${styles.bubble}">
    <p class="${styles.name}">浦东新区</p>
    <p>388套</p>
  </div>
`)

// 小区覆盖物结构：
label.setContent(`
  <div class="${styles.rect}">
    <span class="${styles.housename}">上海滩</span>
    <span class="${styles.housenum}">1套</span>
    <i class="${styles.arrow}"></i>
  </div>
`)

// 房屋列表结构
<div className={[styles.houseList, styles.show].join(' ')}>
  <div className={styles.titleWrap}>
    <h1 className={styles.listTitle}>房屋列表</h1>
    <a className={styles.titleMore} href="/house/list">
      更多房源
    </a>
  </div>
  <div className={styles.houseItems}>
    <div className={styles.house}>
      <div className={styles.imgWrap}>
        <img
          className={styles.img}
          src="http://996houzi.com/newImg/7bk75ppj0.jpg"
          alt=""
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>
          三期精装修两房，南北户型，房东诚意出租出门燎原双语
        </h3>
        <div className={styles.desc}>2室2厅1卫/82/南/阳光美景城</div>
        <div>
          <span className={[styles.tag, styles.tag1].join(' ')}>
            近地铁
          </span>
        </div>
        <div className={styles.price}>
          <span className={styles.priceNum}>8500</span> 元/月
        </div>
      </div>
    </div>
  </div>
</div>
```

```css
/* 样式： */

/* 区、镇的覆盖物样式： */
.bubble {
  width: 70px;
  height: 70px;
  line-height: 1;
  display: inline-block;
  position: absolute;
  border-radius: 100%;
  background: rgba(12, 181, 106, 0.9);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.8);
  text-align: center;
  cursor: pointer;
}

.name {
  padding: 18px 0 6px 0;
}

/* 小区的覆盖物样式： */

.rect {
  height: 20px;
  line-height: 19px;
  width: 100px;
  padding: 0 3px;
  border-radius: 3px;
  position: absolute;
  background: rgba(12, 181, 106, 0.9);
  cursor: pointer;
  white-space: nowrap;
}

.arrow {
  display: block;
  width: 0;
  height: 0;
  margin: 0 auto;
  border: 4px solid transparent;
  border-top-width: 4px;
  border-top-color: #00a75b;
}

.housename {
  display: inline-block;
  width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.housenum {
  display: inline-block;
  width: 20px;
}

/* 房源列表样式： */
.houseList {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 330px;
  transition: all 1s;
  transform: translate3d(0, 1000px, 0);
  background: #fff;
}

.show {
  transform: translate3d(0, 0, 0);
}

.titleWrap {
  position: relative;
  width: 100%;
  background: #c0c0c2;
  border-top: 1px solid #c8c8c8;
}

.listTitle {
  display: inline-block;
  padding-left: 10px;
  line-height: 43px;
  font-size: 16px;
  color: #1e1e1e;
  vertical-align: middle;
}

.titleMore {
  float: right;
  padding-right: 15px;
  line-height: 43px;
  font-size: 13px;
  color: #1e1e1e;
  vertical-align: middle;
}

.titleMore:visited {
  text-decoration: none;
}

/* 房屋列表项样式 */
.houseItems {
  padding: 0 10px;
  overflow-y: auto;
  height: 100%;
  padding-bottom: 45px;
}
.house {
  height: 120px;
  position: relative;
  box-sizing: border-box;
  justify-content: space-around;
  padding-top: 18px;
  border-bottom: 1px solid #e5e5e5;
}

.imgWrap {
  float: left;
  width: 106px;
  height: 80px;
}

.img {
  width: 106px;
  height: 80px;
}

.content {
  overflow: hidden;
  line-height: 22px;
  padding-left: 12px;
}

.title {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  font-size: 15px;
  color: #394043;
}

.desc {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  font-size: 12px;
  color: #afb2b3;
}

.price {
  font-size: 12px;
  color: #fa5741;
}

.priceNum {
  font-size: 16px;
  font-weight: bolder;
}

.tag {
  display: inline-block;
  font-size: 12px;
  border-radius: 3px;
  padding: 4px 5px;
  margin-right: 5px;
  line-height: 12px;
}
.tag1 {
  color: #39becd;
  background: #e1f5f8;
}
.tag2 {
  color: #3fc28c;
  background: #e1f5ed;
}
.tag3 {
  color: #5aabfd;
  background: #e6f2ff;
}
```



## 封装 NavHeader 组件

- 因为 城市选择 和 地图找房 两个页面中都要用到该结构，所以，直接封装成一个组件。哪个页面中想要使用顶部导航栏，直接导入使用即可。
- 封装组件的时候，针对于*变化点*封装，也就是将不同的内容，作为组件的 props 传入。
- 组件有自己的样式，在封装组件的时候，组件自己样式就放在自己的样式文件中。

## react 路由的高阶组件

- 注意：只有通过路由 Route 组件直接渲染的内容，才能够通过 props 获取到路由信息。
- 也就是说：间接渲染的组件（比如：NavHeader 组件），它不是直接通过 Route 组件渲染出来的，因此，这个组件中，无法直接获取到路由相关信息。
- 解决方式：使用路由的高阶组件 `withRouter` 来包装 NavHeader 组件，这样，在该组件中就可以获取到路由信息了。
  - 使用高阶组件包装后，NavHeader组件就可以通过 *props* 来获取到路由信息了

```js
import { withRouter } from 'react-router-dom'

function NavHeader({ history }) {}

export default withRouter(NavHeader)
```

## react 项目中样式覆盖问题的说明

- 因为我们是通过路由来实现整个应用功能的，在 App.js 我们为了配置路由，导入所有的组件。只要导入了组件，那么，组件中 导入样式 的代码就会执行，最终，产生的结果：*在项目加载的时候，所有组件的所有样式，都会被加载到页面中，这样，就会导致组件之间样式相互影响相互覆盖了*
  - 比如：在 CityList/index.scss 中添加的样式，对 Map 组件产生了影响！

## CSS IN JS

- `CSS IN JS`：是 React 中用来解决组件之间样式相互影响、覆盖问题的一类解决方案的统称
- 常用的两个方案：1 styled-components 2 CSS Modules（推荐）
- CSS Modules 方案解决样式冲突的原理：将我们写的类名，替换为全局唯一的样式名称
  - React 脚手架中使用 CSSModules 对 CSS 命名采用了 `BEM` 的命名规范
  - 比如：`[filename]_[classname]__[hash]`
  - 实际上，我们只需要提供 classname ，其他的两部分，脚手架会自动生成

## CSS Modules 在脚手架中的使用

- 1 创建名称为：`[name].module.css` 的样式文件
- 2 导入样式文件：`import styles from './index.module.css'`
- 3 使用样式：`<div className={styles.navBar} />`

```js
// navBar 就是我们自己写的 CSS 类名
// 'NavHeader_navBar__Sby3N' 这是 脚手架 自动生成的全局唯一的类名
styles => { navBar: 'NavHeader_navBar__Sby3N' }
```

## CSS Modules 的使用原则

- 0 推荐使用驼峰命名，来指定 CSS 类名
- 1 避免嵌套
  - 因为 CSS Modules 中的类名都是全局唯一的，实际上，如果所有样式全部使用 CSS Modules 来实现，就不需要嵌套
  - 因为 嵌套 的目的，就是为了提升权重，或者，只让某个样式在某种条件下生效。。。
- 3 对于全局的样式，需要使用 `:global()` 包裹

```css
/* 通过 :global() 来告诉 react 脚手架这是一个全局类名，不要对它进行重命名 */
.navBar :global(.icon-back) {
  color: #333;
}

.navBar :global(.am-navbar-title) {
  color: #333;
}

/* SASS 配合 CSSModules 使用 */
.navBar {
  margin-top: -45px;
  background-color: #f6f5f6;

  // 全局样式：
  :global {
    .icon-back,
    .am-navbar-title {
      color: #333;
    }
  }
}
```

## 渲染所有区的覆盖物

- 注意：因为覆盖物是通过 百度地图 渲染出来的，所以，我们发送请求获取到的数据，不需要保存到组件的状态中。直接在获取到数据后，遍历生成房源即可。



## 地图找房页面结构和样式模板

```js
// 计算要绘制的覆盖物类型和下一个缩放级别
// 区   -> 11 ，范围：>=10 <12
// 镇   -> 13 ，范围：>=12 <14
// 小区 -> 15 ，范围：>=14 <16

// 小区覆盖物结构：
label.setContent(`
  <div class="${styles.rect}">
    <span class="${styles.housename}">上海滩</span>
    <span class="${styles.housenum}">1套</span>
    <i class="${styles.arrow}"></i>
  </div>
`)

// 房屋列表结构
<div className={[styles.houseList, styles.show].join(' ')}>
  <div className={styles.titleWrap}>
    <h1 className={styles.listTitle}>房屋列表</h1>
    <a className={styles.titleMore} href="/house/list">
      更多房源
    </a>
  </div>
  <div className={styles.houseItems}>
    <div className={styles.house}>
      <div className={styles.imgWrap}>
        <img
          className={styles.img}
          src="http://996houzi.com/newImg/7bk75ppj0.jpg"
          alt=""
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>
          三期精装修两房，南北户型，房东诚意出租出门燎原双语
        </h3>
        <div className={styles.desc}>2室2厅1卫/82/南/阳光美景城</div>
        <div>
          <span className={[styles.tag, styles.tag1].join(' ')}>
            近地铁
          </span>
        </div>
        <div className={styles.price}>
          <span className={styles.priceNum}>8500</span> 元/月
        </div>
      </div>
    </div>
  </div>
</div>
```

```css
/* 样式： */

/* 小区的覆盖物样式： */

.rect {
  height: 20px;
  line-height: 19px;
  width: 100px;
  padding: 0 3px;
  border-radius: 3px;
  position: absolute;
  background: rgba(12, 181, 106, 0.9);
  cursor: pointer;
  white-space: nowrap;
}

.arrow {
  display: block;
  width: 0;
  height: 0;
  margin: 0 auto;
  border: 4px solid transparent;
  border-top-width: 4px;
  border-top-color: #00a75b;
}

.housename {
  display: inline-block;
  width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.housenum {
  display: inline-block;
  width: 20px;
}

/* 房源列表样式： */
.houseList {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 330px;
  transition: all 1s;
  transform: translate3d(0, 1000px, 0);
  background: #fff;
}

.show {
  transform: translate3d(0, 0, 0);
}

.titleWrap {
  position: relative;
  width: 100%;
  background: #c0c0c2;
  border-top: 1px solid #c8c8c8;
}

.listTitle {
  display: inline-block;
  padding-left: 10px;
  line-height: 43px;
  font-size: 16px;
  color: #1e1e1e;
  vertical-align: middle;
}

.titleMore {
  float: right;
  padding-right: 15px;
  line-height: 43px;
  font-size: 13px;
  color: #1e1e1e;
  vertical-align: middle;
}

.titleMore:visited {
  text-decoration: none;
}

/* 房屋列表项样式 */
.houseItems {
  padding: 0 10px;
  overflow-y: auto;
  height: 100%;
  padding-bottom: 45px;
}
.house {
  height: 120px;
  position: relative;
  box-sizing: border-box;
  justify-content: space-around;
  padding-top: 18px;
  border-bottom: 1px solid #e5e5e5;
}

.imgWrap {
  float: left;
  width: 106px;
  height: 80px;
}

.img {
  width: 106px;
  height: 80px;
}

.content {
  overflow: hidden;
  line-height: 22px;
  padding-left: 12px;
}

.title {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  font-size: 15px;
  color: #394043;
}

.desc {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  font-size: 12px;
  color: #afb2b3;
}

.price {
  font-size: 12px;
  color: #fa5741;
}

.priceNum {
  font-size: 16px;
  font-weight: bolder;
}

.tag {
  display: inline-block;
  font-size: 12px;
  border-radius: 3px;
  padding: 4px 5px;
  margin-right: 5px;
  line-height: 12px;
}
.tag1 {
  color: #39becd;
  background: #e1f5f8;
}
.tag2 {
  color: #3fc28c;
  background: #e1f5ed;
}
.tag3 {
  color: #5aabfd;
  background: #e6f2ff;
}
```

## 获取小区下的房源数据

- 注意：*lable.addEventListener('click', () => {})*绑定事件的时候，不要在事件处理程序中添加 async 关键字，否则，会造成事件不触发！！！
- 解决方式：将 获取房源的代码 封装到一个方法中，在方法中使用 async 即可。

因为 addEventListener 内部会判断 第二个参数（函数）的类型是不是 [object Function] ，如果不是，就不再执行；而 async () => {} 的类型是：[object AsyncFunction] 与 Function 不同，所以，使用 async 函数不会执行

## 给 react 元素添加多个类名

```js
// 因为该元素中这个类名是动态决定是否添加的
// 所以，我们通过一个三元表达式来判断，如果条件成立就添加 styles.show 到数组中；
// 否则，就添加 '' 到数组中
// 数组：[styles.houseList, styles.show].join(' ') ==> 'houseList show'
// 数组：[styles.houseList, ''].join(' ') ==> 'houseList'

// 使用数组处理类名：
<div
  className={[
    styles.houseList,
    this.state.isShowHouseList ? styles.show : ''
  ].join(' ')}
></div>

// 使用字符串处理类名：
<div className={`${styles.houseList} ${this.state.isShowHouseList ? styles.show : ''}`} />

// 使用第三方库处理类名： classnames
```

## 使用classnames第三方库处理类名

- [classnames](https://github.com/JedWatson/classnames)

```js
// 安装：yarn add classnames

import classNames from 'classnames'

classNames('a', { b: true }) // -> 'a b'
classNames('a', { b: false }) // -> 'a'

<div
  className={classNames(styles.houseList, {
    [styles.show]: this.state.isShowHouseList
  })}
></div>
```

## 百度地图API的使用

- 1 `panBy(x, y)`：使用动画将地图在水平或垂直方向上移动一定的距离
  - x 和 y：表示像素值，而不是地图中的真实距离
- 2 给地图对象绑定了 `movestart` 事件，只要地图发生移动就会触发
- 3 `getZoom()`：获取百度地图当前的缩放级别
- 4 `clearOverlays()` 清除当前地图中所有的覆盖物





## 两种环境

- 1 开发环境： development（ 开发期间的环境 ）
- 2 生产环境： prodcution（ 线上环境，给用户使用 ）

### 根据不同环境配置不同的接口地址

- 为开发环境创建一个： .env.development （文件）。
  - 在这个配置文件中，就可以配置 开发期间 使用的接口地址了
- 为生产环境创建一个： .env.production （文件）。
  - 在这个配置文件中，就可以配置 项目上线 使用的接口地址了
- 然后，在代码中，读取 配置文件 中的接口地址，而不是，直接写死在项目页面代码中了

### 环境变量在项目中的使用总结

- 在项目根目录中创建 `.env.development`
  - 项目打包上线时，应该为生产环境提供一个环境变量文件 `.env.prodction`

```bash
# 开发期间的 URL 地址的环境变量
REACT_APP_URL=http://localhost:8080
```

- 添加后，注意 **重启脚手架**，配置才会生效
- 在代码中通过 `process.env.REACT_APP_URL`
  - 约定：不同环境中的配置项名称是相同的，值分别设置为不同环境的接口地址即可

```js
// 导入并导出的语法：
// import ...
// export ...
export { BASE_URL } from './url'
```

## axios 的优化处理

- 在 `utils/api.js` 文件中，创建 axios 的实例，并且配置 baseUrl，然后，导出该实例
- 将来在其他的组件中如果要发送请求，直接导入自己封装好的 axios 实例即可。

## 找房页面顶部搜索导航栏样式处理

- 给 SearchHeader 组件，添加了 className 属性，这个属性用来设置组件的样式
  - 注意：传递给组件的样式，应该放在后面，这样，才能通过我们自己指定的样式覆盖组件默认的样式

```js
<SearchHeader className={styles.listSearch} />

// 组件内部：
function SearchHeader({ className }) {
  return (
    <Flex className={[style.root, className].join(' ')}>
  )
}
```





```js
// height：视口高度
// isScrolling：表示是否滚动中，用来覆盖List组件自身的滚动状态
// scrollTop：页面滚动的距离，用来同步 List 组件自身的滚动距离
//  本来是 List 组件自己维护滚动的距离，但是，现在 List 组件自己不滚动了，而是跟着 window 来滚动，所以，window滚动了多少距离，需要告诉 List 组件，然后，List 组件才知道需要滚动多少距离，也就是展示虚拟列表中的哪些元素
<WindowScroller>
{({ height, isScrolling, scrollTop }) => {}}
</WindowScroller>
```

- 使用：

```js
// 通过 WindowScroller 组件，暴露的 三个属性 以及  autoHeight 属性，最终，就能够让整个页面滚动了
<WindowScroller>
  {({ height, isScrolling, scrollTop }) => {
    return (
      <AutoSizer>
        {({ width }) => (
          <List
            autoHeight
            height={height}
            isScrolling={isScrolling}
            scrollTop={scrollTop}

            width={width}
            rowCount={count}
            rowHeight={HOUSE_ITEM_HEIGHT}
            rowRenderer={this.rowRenderer}
          />
        )}
      </AutoSizer>
    )
  }}
</WindowScroller>
```

## 无限滚动组件

InfiniteLoader

作用：一个用来在用户滚动时，及时获取远程数据的组件.

`loadMoreRows`：类型 Function

当需要加载更多数据到列表中的时候，就会调用该回调函数。

它的函数签名为：({ startIndex: number, stopIndex: number }): Promise

当数据加载完成的时候，应该调用 resolve() 来完成当前 Promise。

```js
<InfiniteLoader
  isRowLoaded={isRowLoaded}     // 表示每一行数据是否加载完成
  loadMoreRows={loadMoreRows}   // 加载更多数据的方法，在需要加载更多数据时，会调用该方法
  rowCount={remoteRowCount}     // 列表数据总条数
>
  {({ onRowsRendered, registerChild }) => (
    <List
      height={200}
      rowCount={remoteRowCount}
      rowHeight={20}
      width={300}
    />
  )}
</InfiniteLoader>
```







## getBoundingClientRect() 方法的说明

作用：返回一个DOM元素的尺寸，以及它相对于当前视口的位置。

## react-spring

Spring 组件：

作用：用来实现动画效果，能够从 动画状态A 到 动画状态B。

注意：from 属性是可选的，它只在组件第一次渲染时生效（也就是只生效一次！！！）。
使用 to 属性来更新动画状态。

第一次动画渲染：   from -> to
后面每次动画渲染： 旧to -> 新to

### 基本使用

- 1 安装：`yarn add react-spring`
- 2 在 Filter 组件中，导入动画组件 Spring
- 3 使用 Spring 动画组件，包装 要实现动画效果的组件
- 4 因为它的使用模式是 render-props 模式，通过 children 方式，拿到了动画组件中暴露出来的 props（ 实际就是当前动画中 opactity 从 0 到 1 的状态 ）
- 5 将 props 设置为 要实现动画元素的style，那么，这个元素就有动画效果了

```js
<Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
  {props => {
    // props 实际就是当前动画的从 0 到 1 的状态
    // console.log('props:', props)
    return (
      <div
        style={props}
        className={styles.mask}
        onClick={() => this.onCancel(openType)}
      />
    )
  }}
</Spring>
```

- 注意：一定要保证动画组件 Spring 一直存在于页面中，才能保证动画效果一直都有！！！
  - 而 Spring 组件中渲染的内容，实际上是可以不渲染的！！！

```js
<Spring to={{ opacity: isHide ? 0 : 1 }}>
  {props => {
    if (props.opacity === 0) {
      return null
    }
    return (
      <div
        style={props}
        className={styles.mask}
        onClick={() => this.onCancel(openType)}
      />
    )
  }}
</Spring>
```





 ## 登录访问控制

### 分析 AuthRoute 鉴权路由组件

 场景：限制某个页面只能在登录的情况下访问。 

说明：在 React 路由中并没有直接提供该组件，需要手动封装，来实现登录访问控制（类似于 Vue 路由 的导航守卫）。 

如何封装？参考 react-router-dom 文档中提供的鉴权示例 。 

如何使用？使用 AuthRoute 组件代替默认的 Route 组件，来配置路由规则。 

AuthRoute 组件实际上就是对原来的 Route 组件做了一次包装，来实现了一些额外的功能。

render 方法：render props 模式，指定该路由要渲染的组件内容（类似于 component 属性）。 

Redirect 组件：重定向组件，通过 to 属性，指定要跳转到的路由信息。 

state 属性：表示给路由附加一些额外信息，此处，用于指定登录成功后要进入的页面地址。

```jsx
// 使用方式：
<AuthRoute path="/rent/add" component={Rent} />
```

### 封装 AuthRoute 鉴权路由组件 

在 components 目录中创建 AuthRoute/index.js 文件。 

创建组件 AuthRoute 并导出。

在 AuthRoute 组件中返回 Route 组件（在 Route 基础上做了一层包装，用于实现自定义功能）。 

给 Route 组件，添加 render 方法，指定该组件要渲染的内容（类似于 component 属性）。 

在 render 方法中，调用 isAuth() 判断是否登录。 

如果登录了，就渲染当前组件（通过参数 component 获取到要渲染的组件，需要重命名）。 

如果没有登录，就重定向到登录页面，并且指定登录成功后要跳转到的页面路径。

将 AuthRoute 组件接收到的 props 原样传递给 Route 组件（保证与 Route 组件使用方式相同）。 

使用 AuthRoute 组件配置路由规则，验证能否实现页面的登录访问控制。

**实现**

```jsx
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
```





## 项目打包

 打开 create-react-app 脚手架文档中的部署。 

在根目录创建 .env.production 文件，配置生产环境的接口基础路径。 

在项目根目录中，打开终端。

输入命令：yarn build，进行项目打包，生成 build 文件夹（打包好的项目内容）。 

将 build 目录中的文件内容，部署到服务器中即可。 

可以通过终端中的提示，使用 serve –s build 来本地查看（需要全局安装工具包 serve）

### 修改脚手架配置说明

`create-react-app` 中隐藏了` webpack` 的配置，隐藏在 react-scripts 包中。 

修改脚手架的 webpack 配置有两种方式： 

运行命令 npm run eject 释放 webpack 配置（注意：不可逆操作）

通过第三方包重写 webpack 配置（比如：react-app-rewired 等）