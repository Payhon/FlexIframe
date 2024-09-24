<template>
  <div ref="iframeContainer"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, PropType } from 'vue';
import { FlexIframe, ChildEventHandler } from '../index';

export default defineComponent({
  name: 'FlexIframe',
  props: {
    iframeUrl: {
      type: String,
      required: true
    },
    onChildEvent: {
      type: Function as PropType<ChildEventHandler>,
      default: null
    }
  },
  setup(props) {
    const iframeContainer = ref<HTMLElement | null>(null);

    onMounted(() => {
      if (iframeContainer.value) {
        const iframe = FlexIframe.mount(props.iframeUrl, iframeContainer.value);
        
        if (props.onChildEvent) {
          FlexIframe.addChildEventHandler(props.onChildEvent);
        }
      }
    });

    return {
      iframeContainer
    };
  }
});
</script>