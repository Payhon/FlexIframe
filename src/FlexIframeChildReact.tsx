import React, { useEffect } from 'react';
import { FlexIframe } from './index';

interface FlexIframeChildReactProps {
  children?: React.ReactNode;
}

const FlexIframeChildReact: React.FC<FlexIframeChildReactProps> = ({ children }) => {
  useEffect(() => {
    FlexIframe.init();
  }, []);

  return <div>{children}</div>;
};

export const sendEventToParent = FlexIframe.sendEventToParent;

export default FlexIframeChildReact;