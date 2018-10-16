- [Reference：antd-pro 官网](http://ant-design-pro.gitee.io/docs/router-and-nav-cn)

- [dva 总结](./dva-learn.md)

## 布局模板

antd-pro 默认的布局样式：
- `BasicLayout` 基础页面布局，包含了头部导航，侧边栏和通知栏
- `UserLayout` 抽离出用于登录注册页面的通用布局

其他布局设计参考antd 布局的设计方案

## 使用默认布局开发

### 0 新增页面


```
step01: src/routes 文件夹中先增加路由组件文件
step02:
// src/common/menu.js
添加菜单项（配置其显示名称和）
step03:
// src/common/router.js 
新增一条路由菜单配置，
将第二步设置的 path 对应到第一步写的路由组件 （别忘记写路由最开始的斜杠）
```
### 1 新增 model、service

用到 dva 的数据流，为新增的页面添加完整的业务逻辑，还需要在 src/model 以及 src/service 中建立相应的 model 和 service ；可以参照 脚手架 中的写法

```js
// src/model/example.js

export default {

  namespace: 'example',

  state: {},

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};

```
```js

// src/service/example.js

import request from '../utils/request';

export function query() {
  return request('/api/users');
}
```

## 2 样式

- antd-pro 默认使用 less 作为样式语言
- 为了解决全局污染和选择器复杂的问题，脚手架默认使用 CSS Module 方案。
```
// example.js
import styles from './example.less';

export default ({ title }) => <div className={styles.title}>{title}</div>;
```
#### 样式文件级别

- 全局样式文件 src/index.less
- 模块级别样式 src/layouts/BasicLayout.less
- 页面级别
- 组件级别 组件相关的样式

#### 覆盖组件样式

- 见[官网案例](http://ant-design-pro.gitee.io/docs/style-cn)，暂未研究

## 3 与服务端交互

==前端请求流程==

在 antd-pro 中，一个完整的前端 UI 交互到服务器处理流程是这样的：
1. UI 组件交互操作
2. 调用 model 的 effect ；
3. 调用统一管理的 service 请求函数
4. service api 返回的是使用 requet.js 封装好的请求
5. 获取服务端返回
6. 返回成功后调用 reducer 改变 state
7. 更新 model

- util/request.js 是基于fetch 的一个封装
- dva 的 effect 以同步化的形式处理异步请求。 

## 4 mock 数据

mock 数据是指在没有后端服务支持的情况下，前端自己造数据

1. mock 文件夹中分类自己模拟数据
2. `.roadhogrc.mock.js` 中 引入自己模拟的数据在 相关 请求 url 后
3. 从 mock 直接切换到 服务端请求 只需要重定向 mock 到对应的服务端接口即可。这就是反向代理。
```
// .roadhogrc.mock.js
export default {
  'GET /api/(.*)': 'https://your.server.com/api/',
};
```

- [node 环境变量 process.env](https://segmentfault.com/a/1190000011683741)
### 引入外部模块

antd 组件和脚手架内置的业务组件，引入其他模块都需要安装


## mock 联调

- antd-pro 中底层的工具是 roadhog，自带了代理请求功能，通过代理请求就能轻松处理数据模拟的功能
- 通过配置 `.roadhogrc.mock.js` 来代理请求
- 当客户端发送请求，本地启动的 roadhog server 会根据此配置文件匹配请求路径以及方法，如果匹配到了，就会将请求通过配置处理，可以直接返回数据，也可以通过函数处理以及重定向到另外一个服务器。
```
// exp：直接返回数据：
'GET /api/currentUser': {
  name: 'momo.zxy',
  avatar: imgMap.user,
  userid: '00000001',
  notifyCount: 12,
},
```
- [mock.js](http://mockjs.com/) 是常用的辅助生成模拟数据的第三方库
```
// exp:
import mockjs from 'mockjs';

export default {
  // 使用 mockjs 等三方库
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 50, 'type|0-2': 1 }],
  }),
};
```
- 复杂系统中，请求接口往往是复杂且繁多的，为了处理大量模拟请求的场景，我们通常把每个数据模型抽象成一个文件，统一放在 mock 文件夹中，然后再在 `.roadhogrc.mock.js` ,详见示例代码
- `roadhog-api-doc` 工具，能够从项目的mock数据中读取接口信息生成对应的文档

