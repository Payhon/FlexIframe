<template>
  <div ref="iframeContainer"></div>
</template>

<script>
import { FlexIframe } from './index';

export default {
  name: 'FlexIframeVue2',
  props: {
    iframeUrl: {
      type: String,
      required: true
    },
    onChildEvent: {
      type: Function,
      default: null
    }
  },
  mounted() {
    if (this.$refs.iframeContainer) {
      const iframe = FlexIframe.mount(this.iframeUrl, this.$refs.iframeContainer);
      
      if (this.onChildEvent) {
        FlexIframe.addChildEventHandler(this.onChildEvent);
      }
    }
  }
};
</script>