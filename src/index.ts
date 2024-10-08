// FlexIframe 主文件

// 定义自定义事件处理器的类型
type ChildEventHandler = (eventName: string, eventData: any) => void;

// FlexIframe 命名空间
namespace FlexIframe {
  let childEventHandlers: ChildEventHandler[] = [];

  // 添加子页面事件处理器的 API
  export function addChildEventHandler(handler: ChildEventHandler) {
    childEventHandlers.push(handler);
  }

  // 处理子页面事件
  function handleChildEvent(eventName: string, eventData: any) {
    childEventHandlers.forEach(handler => handler(eventName, eventData));
  }

  // 封装发送消息到父页面的方法
  function sendMessageToParent(type: string, data: any) {
    window.parent.postMessage({
      type: type,
      source: 'flex-iframe-child', // 新增 source 参数
      ...data
    }, '*');
  }

  // 发送事件到父页面的方法
  export function sendEventToParent(eventName: string, eventData: any) {
    sendMessageToParent('customEvent', { eventName, eventData });
  }

  // 父页面代码 (原 parentInit 函数，现在改名为 childIframeMount)
  function childIframeMount(iframeUrl: string, container?: Element | string, isApiMount: boolean = false) {
    // 将相对路径转换为绝对路径
    if (!iframeUrl.startsWith('http://') && !iframeUrl.startsWith('https://')) {
        iframeUrl = new URL(iframeUrl, window.location.origin).toString();
    }

    // 给 iframe URL 添加查询参数
    const url = new URL(iframeUrl);
    url.searchParams.set('flexIframeEmbedded', 'true');
    
    // 创建 iframe 元素
    const iframe = document.createElement('iframe');
    iframe.src = url.toString();
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.display = 'none'; // 初始隐藏 iframe

    // 决定 iframe 的放置位置
    let targetContainer: Element | null = null;

    if (typeof container === 'string') {
      targetContainer = document.querySelector(container);
    } else if (container instanceof Element) {
      targetContainer = container;
    } else {
      targetContainer = document.querySelector('.flex-iframe') || document.body;
    }

    if (targetContainer) {
      targetContainer.appendChild(iframe);
    }

    // 监听来自子页面的消息
    const messageHandler = (event: MessageEvent) => {
      if (event.data.source !== 'flex-iframe-child') {
        return; // 如果来源不是 flex-iframe-child，直接返回
      }
      console.log('Received message:', event.data);
      if (event.data.type === 'flexIframeChildReady') {
        if (event.data.url === iframe.src) {
          console.log('Child iframe is ready:', event.data.url);
          iframe.style.display = 'block'; // 显示 iframe
          if (isApiMount) {
            window.removeEventListener('message', messageHandler);
          }
        } else {
          console.warn('Received ready message from unexpected URL:', event.data.url);
        }
      } else if (event.data.type === 'resize') {
        iframe.style.height = `${event.data.height}px`;
      } else if (event.data.type === 'navigate') {
        // 处理导航请求
        console.log('Navigation request:', event.data.url, 'Method:', event.data.method);
        
        switch (event.data.method) {
          case 'click':
            // 创建一个临时的 a 标签并触发点击
            const tempLink = document.createElement('a');
            tempLink.href = event.data.url;
            tempLink.target = '_blank'; // 或者根据需求设置其他 target
            tempLink.style.display = 'none';
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            break;
          
          case 'window.open':
            window.open(event.data.url);
            break;
          
          case 'urlChange':
            window.location.href = event.data.url;
            break;
          
          default:
            console.warn('Unknown navigation method:', event.data.method);
        }
      } else if (event.data.type === 'customEvent') {
        // 处理自定义事件
        console.log('Custom event:', event.data.eventName, event.data.eventData);
        handleChildEvent(event.data.eventName, event.data.eventData);
      }
    };

    window.addEventListener('message', messageHandler);

    return iframe;
  }

  // 子页面代码
  function childInit() {
    // 设置全局变量
    (window as any).isFlexIframeChild = true;

    // 发准备就绪消息
    sendMessageToParent('flexIframeChildReady', { url: window.location.href });

    // 发送页面高度
    function sendHeight() {
      sendMessageToParent('resize', { height: document.documentElement.scrollHeight });
    }

    // 初始发送高度，并在窗口大小改变时重新发送
    window.addEventListener('resize', sendHeight);

    // 拦截链接点击
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') {
        e.preventDefault();
        sendMessageToParent('navigate', {
          method: 'click',
          url: (target as HTMLAnchorElement).href
        });
      }
    });

    // 重写 window.open
    const originalOpen = window.open;
    window.open = function(url?: string | URL, target?: string, features?: string) {
      if (url) {
        sendMessageToParent('navigate', {
          method: 'window.open',
          url: url.toString()
        });
        return null;
      }
      return originalOpen.apply(this, arguments as any);
    };

    (window as any).$location = new Proxy(Object.create(window.location), {
      set (target, key, value) {
        if (key === 'href' && (window as any).isFlexIframeChild) {
          sendMessageToParent('navigate', {
            method: 'urlChange',
            url: value
          });
          return true;
        }
        return (window as any).location[key] = value
      }
    });

    // 将 sendEventToParent 方法添加到全局 window 对象
    (window as any).FlexIframe = {
      sendEventToParent: sendEventToParent
    };
  }

  // 判断当前页面是父页面还是子页面
  function determinePageType(): 'parent' | 'child' {
    if (window.parent === window) {
      return 'parent';
    }
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('flexIframeEmbedded') === 'true') {
      return 'child';
    }
    return 'parent'; // 默认为父页面
  }

  // 主函数
  export function init() {
    const script = document.currentScript as HTMLScriptElement;
    let scriptAt = script.getAttribute('data-script-at');

    if (!scriptAt) {
      scriptAt = determinePageType();
    }

    if (scriptAt === 'parent') {
      const iframeUrl = script.getAttribute('data-iframe-url');
      const iframePosition = script.getAttribute('data-iframe-position');
      if (iframeUrl) {
        childIframeMount(iframeUrl, iframePosition || undefined, false);
      } else {
        console.error('FlexIframe: data-iframe-url is required for parent page');
      }
    } else if (scriptAt === 'child') {
      childInit();
    } else {
      console.error('FlexIframe: Invalid page type');
    }
  }

  // 新的 API 函数，用于手动挂载 iframe
  export function mount(iframeUrl: string, container?: Element | string): HTMLIFrameElement {
    return childIframeMount(iframeUrl, container, true);
  }

}

// 自动执行
FlexIframe.init();

// 导出 FlexIframe 命名空间
export { FlexIframe };

// 默认导出
export default FlexIframe;

// 显式导出类型
export type { ChildEventHandler };