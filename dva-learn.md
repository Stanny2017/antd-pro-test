
## 目录基本解构

合理的项目划分往往能够提供规范的项目搭建思路。 在 dva 架构的项目中，推荐的目录基本结构为：使用 dva-cli 脚手架工具可以自动生成推荐目录结构
```bash
.
├── /mock/           # 数据mock的接口文件
├── /src/            # 项目源码目录
│ ├── /components/   # 项目组件
│ ├── /routes/       # 路由组件（页面维度）
│ ├── /models/       # 数据模型
│ ├── /services/     # 数据接口
│ ├── /utils/        # 工具函数
│ ├── route.js       # 路由配置
│ ├── index.js       # 入口文件
│ ├── index.less     
│ └── index.html     
├── package.json     # 项目信息
└── proxy.config.js  # 数据mock配置
```

## 设计 model

基本上所有的项目都是围绕着数据的展示和操作，复杂一点的无非是组合了很多数据，只要分解开来，model 的层次就会清晰

所以抽离 model 的原则就是抽离数据模型。

设计model 通常有两种方式：
- 按照数据维度
- 按照业务维度

1. 按照数据维度的 model 设计原则就是抽离数据本身以及相关操作的方法
2. 按照业务维度的 model 设计，则是将数据以及使用强关联数据的组件中的状态统一抽象成 model 的方法


## 组件设计方法

组件设计分为两类

1. Container Component
2. Presentational Component

Container Component 的职责是绑定相关联的 model 数据

```
import React, { Component } from 'react';
import PropTypes from 'prop-types'
// dva 的 connect 方法可以将组件和数据关联在一起
import { connect } from 'dva';

// 组件本身
const MyComponent = (props)=>{};
MyComponent.propTypes = {};

// 监听属性，建立组件和数据的映射关系
function mapStateToProps(state) {
  return {...state.data};
}

// 关联 model
export default connect(mapStateToProps)(MyComponent);

```
Presentational Component 展示组件，只负责 UI 呈现，不会关联 model 上的数据，所需要的数据都是通过 `props` 传递到组件内部

```
import React, { Component, PropTypes } from 'react';

// 组件本身
// 所需要的数据通过 Container Component 通过 props 传递下来
const MyComponent = (props)=>{}
MyComponent.propTypes = {};

// 并不会监听数据
export default MyComponent;
```
对组件分类，主要有两个好处：

- 让项目的数据处理更加集中；
- 让组件高内聚低耦合，更加聚焦；


除了写法上订阅数据的区别以外，在设计思路上两个组件也有很大不同。 Presentational Component是独立的纯粹的，每个组件跟业务数据并没有耦合关系，只是完成自己独立的任务，需要的数据通过 props 传递进来，需要操作的行为通过接口暴露出去。 而 Container Component 更像是状态管理器，它表现为一个容器，订阅子组件需要的数据，组织子组件的交互逻辑和展示。

需要注意的是，定义组件一般有三种方式：

```
// 1. 传统写法，不推荐
const App = React.createClass({});

// 2. es6 的写法，涉及 react 声明周期方法的时候采用这种写法。
class App extends React.Component({});

// 3. stateless 的写法，是推荐的写法
const App = (props) => ({});
```

# dva 项目开发顺序

### 0添加路由
注意事项

- 需要注意的是：action的名称（type）如果是在 model 以外调用需要添加 namespace。在 model 内部调用则不需要

- 通过 dispatch 函数，可以通过 type 属性指定对应的 actions 类型，而这个类型名在 reducers（effects）会一一对应，从而知道该去调用哪一个 reducers（effects）

### mock 数据

采用 dora-plugin-proxy 工具来完成了我们的数据 mock 功能

### 添加样式

- CSS Modules 配合 webpack 的 css-loader 进行打包，会为所有的 class name 和 animation name 加 local scope ，避免潜在冲突；
- CSS Modules会给组件的className加上hash字符串，来保证className仅对引用了样式的组件有效，如styles.normal可能会输出为normal___39QwY。