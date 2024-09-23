import { DefineComponent } from 'vue';
import Vue from 'vue';
import React from 'react';

declare namespace FlexIframe {
  type ChildEventHandler = (eventName: string, eventData: any) => void;

  function addChildEventHandler(handler: ChildEventHandler): void;
  function sendEventToParent(eventName: string, eventData: any): void;
  function init(): void;
  function mount(iframeUrl: string, container?: Element | string): HTMLIFrameElement;

  const VueComponent: DefineComponent<{
    iframeUrl: string;
    onChildEvent?: ChildEventHandler;
  }, {}, any>;

  const Vue2Component: Vue.Component;

  const ReactComponent: React.FC<{
    iframeUrl: string;
    onChildEvent?: ChildEventHandler;
  }>;

  const ChildVueComponent: DefineComponent<{}, {}, any>;
  const ChildVue2Component: Vue.Component;
  const ChildReactComponent: React.FC<{
    children?: React.ReactNode;
  }>;
}

export as namespace FlexIframe;
export = FlexIframe;

export const FlexIframeComponent: typeof FlexIframe.VueComponent;
export const FlexIframeVue2Component: typeof FlexIframe.Vue2Component;
export const FlexIframeReactComponent: typeof FlexIframe.ReactComponent;

export const FlexIframeChildComponent: typeof FlexIframe.ChildVueComponent;
export const FlexIframeChildVue2Component: typeof FlexIframe.ChildVue2Component;
export const FlexIframeChildReactComponent: typeof FlexIframe.ChildReactComponent;