<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { FlexIframe } from '../index';

export default {
  name: 'FlexIframeChildVue2',
  mounted() {
    FlexIframe.init();
  },
  methods: {
    sendEventToParent: FlexIframe.sendEventToParent
  }
};
</script>