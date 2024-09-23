import React, { useEffect, useRef } from 'react';
import { FlexIframe, ChildEventHandler } from './index';

interface FlexIframeReactProps {
  iframeUrl: string;
  onChildEvent?: ChildEventHandler;
}

const FlexIframeReact: React.FC<FlexIframeReactProps> = ({ iframeUrl, onChildEvent }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const iframe = FlexIframe.mount(iframeUrl, containerRef.current);
      
      if (onChildEvent) {
        FlexIframe.addChildEventHandler(onChildEvent);
      }

      return () => {
        // 清理逻辑，如果需要的话
      };
    }
  }, [iframeUrl, onChildEvent]);

  return <div ref={containerRef}></div>;
};

export default FlexIframeReact;