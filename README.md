# FlexIframe

FlexIframe 是一个灵活的 iframe 集成库，用于无缝嵌入第三方内容到您的网页中。它提供了自动高度调整、导航控制和自定义事件处理等功能。

## 安装

使用 npm 安装 FlexIframe：

```bash
npm install flex-iframe
```

或者使用 yarn 安装：

```bash
yarn add flex-iframe
```

## 使用方法

### 1. 在普通 HTML 中使用

#### 父页面引入 FlexIframe

在您的 HTML 文件中引入 FlexIframe：

```html
<script src="node_modules/flex-iframe/dist/index.js" data-script-at="parent" data-iframe-url="https://example.com/child.html"></script>
```

#### 子页面引入 FlexIframe

在您的 HTML 文件中引入 FlexIframe：

```html
<script src="node_modules/flex-iframe/dist/index.js" data-script-at="child"></script>
```

### 2. 在 Vue 3 项目中使用

FlexIframe 提供了一个 Vue 3 组件，可以轻松集成到您的 Vue 项目中。

#### 引入组件

```javascript
import { FlexIframeComponent } from 'flex-iframe';
```

#### 在 Vue 组件中使用

```vue
<template>
  <FlexIframe :iframe-url="childPageUrl" :on-child-event="handleChildEvent" />
</template>

<script>
import { FlexIframeComponent } from 'flex-iframe';

export default {
  components: {
    FlexIframe: FlexIframeComponent
  },
  data() {
    return {
      childPageUrl: 'https://example.com/child.html'
    };
  },
  methods: {
    handleChildEvent(eventName, eventData) {
      console.log('Received event from child:', eventName, eventData);
    }
  }
};
</script>
```

### 3. 在 Vue 2 项目中使用

FlexIframe 也提供了一个 Vue 2 组件，可以轻松集成到您的 Vue 2 项目中。

#### 引入组件

```javascript
import { FlexIframeVue2Component } from 'flex-iframe';
```

#### 在 Vue 2 组件中使用

```vue
<template>
  <FlexIframe :iframe-url="childPageUrl" :on-child-event="handleChildEvent" />
</template>

<script>
import { FlexIframeVue2Component } from 'flex-iframe';

export default {
  components: {
    FlexIframe: FlexIframeVue2Component
  },
  data() {
    return {
      childPageUrl: 'https://example.com/child.html'
    };
  },
  methods: {
    handleChildEvent(eventName, eventData) {
      console.log('Received event from child:', eventName, eventData);
    }
  }
};
</script>
```

### 4. 在 React 项目中使用

FlexIframe 也提供了一个 React 组件，可以轻松集成到您的 React 项目中。

#### 引入组件

```javascript
import { FlexIframeReactComponent } from 'flex-iframe';
```

#### 在 React 组件中使用

```jsx
import React from 'react';
import { FlexIframeReactComponent } from 'flex-iframe';

const MyComponent = () => {
  const handleChildEvent = (eventName, eventData) => {
    console.log('Received event from child:', eventName, eventData);
  };

  return (
    <FlexIframeReactComponent 
      iframeUrl="https://example.com/child.html"
      onChildEvent={handleChildEvent}
    />
  );
};

export default MyComponent;
```

## 子页面使用方法

### 1. 在 Vue 3 子页面中使用

## 配置选项

### HTML 配置

在父页面的脚本标签中，您可以使用以下属性来配置 FlexIframe：

- `data-script-at`: 设置为 "parent" 表示这是父页面。
- `data-iframe-url`: 指定要嵌入的子页面 URL。
- `data-iframe-position`: 指定 iframe 的放置位置。可以是 CSS 选择器（如 "#container" 或 ".iframe-wrapper"）。

在子页面的脚本标签不需要任何配置，只需要引入即可。

### Vue 组件属性

FlexIframe Vue 组件接受以下 props：

- `iframeUrl`: (必需) 指定要嵌入的子页面 URL。
- `onChildEvent`: (可选) 处理子页面发送的自定义事件的回调函数。

## 特性

1. 自动高度调整：iframe 会根据子页面内容自动调整高度。
2. 导航控制：拦截子页面的链接点击、`window.open()` 和 `location.href` 设置。
3. 自定义事件：允许子页面向父页面发送自定义事件。
4. Vue 3 集成：提供 Vue 3 组件以便在 Vue 项目中轻松使用。

## 注意事项

- 确保子页面的域名在父页面的内容安全策略（CSP）允许围内。
- 某些浏览器可能会阻止自动打开的弹窗，特别是对于 `window.open()` 的调用。
- 使用 Vue 组件时，确保您的项目中已安装 Vue 3。

## 许可证

MIT License