<template>
  <div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { FlexIframe } from './index';

export default defineComponent({
  name: 'FlexIframeChild',
  setup() {
    onMounted(() => {
      FlexIframe.init();
    });

    return {
      sendEventToParent: FlexIframe.sendEventToParent
    };
  }
});
</script>