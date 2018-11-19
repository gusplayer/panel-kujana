<template lang="html">
  <!-- Wrap the image or canvas element with a block element (container) -->
  <div class="cropper_dialog" v-if="urlPhotoCropper">
    <div class="cropper" v-loading="loading">
      <img id="image" :src="urlPhotoCropper">
    </div>
    <el-button-group>
      <el-button type="primary" icon="close" v-on:click="closeCropper">Cancelar</el-button>
      <el-button type="primary" icon="upload" v-on:click="createBanner" v-loading="loading">Nuevo Banner</el-button>
    </el-button-group>
  </div>
</template>

<script>
export default {
  props: ['urlPhotoCropper'],
  computed: {
    loading(){
      return this.$store.state.loadingCropper;
    }
  },
  methods: {
    closeCropper(){
      this.$emit('closeCropper');
    },
    createBanner(){
      this.$store.state.loadingCropper = true;
      this.$emit('createBanner');
    }
  }
}
</script>

<style scoped>
  .cropper_dialog{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(0,0,0,0.65);
    z-index: 5;
  }
  .cropper{
    max-width: 1200px;
    width: 100%;
    border: 8px solid #FFF;
    overflow: hidden;
    margin-bottom: 10px;
  }
  #image{
    max-width: 800px;
    width: 100%;
    max-height: 60vh;
  }
</style>
