<template lang="html">
  <div class="micrositio" v-if="data">
    <iframe id="iframePreview" :src="setUrlIframe" width="100%" height="100vh"></iframe>
  </div>
</template>

<script>
export default {
  props: ['data', 'mode'],
  watch: {
    data(value) {}
  },
  computed: {
    setUrlIframe() {
      return `https://fablabkujana.com/micrositio/${this.data.id}`;
    }
  }
};
</script>

<style scoped>
.micrositio {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.3);
  overflow: auto;
  background-color: #fff;
  transition: 0.3s;
}
.micrositio iframe {
  max-width: 100% !important;
  width: 100%;
  max-height: 100vh !important;
  height: 100vh;
  border-style: none;
}
</style>
