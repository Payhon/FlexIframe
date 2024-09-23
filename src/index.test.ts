import '@testing-library/jest-dom';
import { JSDOM } from 'jsdom';
import FlexIframe from './index';
import { describe, beforeEach, afterEach, it, expect, jest } from '@jest/globals';

describe('FlexIframe', () => {
  let originalWindow: Window;
  let dom: JSDOM;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      url: 'https://example.com',
      runScripts: 'dangerously',
    });
    originalWindow = window;
    // @ts-ignore
    global.window = dom.window as unknown as Window & typeof globalThis;
    global.document = dom.window.document;
  });

  afterEach(() => {
    // @ts-ignore
    global.window = originalWindow;
  });

  describe('parentInit', () => {
    it('should create an iframe with correct attributes', () => {
      const script = document.createElement('script');
      script.setAttribute('data-script-at', 'parent');
      script.setAttribute('data-iframe-url', 'https://example.com/child');
      document.body.appendChild(script);

      FlexIframe.init();

      const iframe = document.querySelector('iframe');
      expect(iframe).toBeTruthy();
      expect(iframe?.src).toBe('https://example.com/child?flexIframeEmbedded=true');
      expect(iframe?.style.width).toBe('100%');
      expect(iframe?.style.border).toBe('none');
    });

    it('should handle resize message from child', () => {
      const script = document.createElement('script');
      script.setAttribute('data-script-at', 'parent');
      script.setAttribute('data-iframe-url', 'https://example.com/child');
      document.body.appendChild(script);

      FlexIframe.init();

      const iframe = document.querySelector('iframe') as HTMLIFrameElement;
      window.dispatchEvent(new MessageEvent('message', {
        data: { type: 'resize', height: 500 }
      }));

      expect(iframe.style.height).toBe('500px');
    });
  });

  describe('childInit', () => {
    beforeEach(() => {
      const url = new URL(dom.window.location.href);
      url.searchParams.set('flexIframeEmbedded', 'true');
      dom.reconfigure({ url: url.toString() });
    });

    it('should set global variable', () => {
      const script = document.createElement('script');
      script.setAttribute('data-script-at', 'child');
      document.body.appendChild(script);

      FlexIframe.init();

      expect((window as any).isFlexIframeChild).toBe(true);
    });

    it('should intercept link clicks', () => {
      const script = document.createElement('script');
      script.setAttribute('data-script-at', 'child');
      document.body.appendChild(script);

      FlexIframe.init();

      const link = document.createElement('a');
      link.href = 'https://example.com/test';
      document.body.appendChild(link);

      const postMessageSpy = jest.spyOn(window.parent, 'postMessage');
      link.click();

      expect(postMessageSpy).toHaveBeenCalledWith({
        type: 'navigate',
        method: 'click',
        url: 'https://example.com/test'
      }, '*');
    });

    // ... 其他测试保持不变 ...
  });
});