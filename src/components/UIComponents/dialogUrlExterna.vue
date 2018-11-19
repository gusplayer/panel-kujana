<template>
  <el-dialog title="Editar url externa" size="small" :visible.sync="dialogUrlExterna" v-loading.body="loading">
    <div class="">
      <el-input placeholder="Url externa" v-model="url">
        <template slot="prepend"><i class="fa fa-link" aria-hidden="true"></i></template>
      </el-input>
      <div class="row">
        <el-input placeholder="Texto del enlace" v-model="titulo"></el-input>
        <el-button type="primary"><input type="file" class="url_choose_file" v-on:change="uploadPhotoUrlExterna"><i class="fa fa-camera-retro" style="cursor: pointer;" aria-hidden="true"></i> Subir imagen</i></el-button>
      </div>
      <el-button type="primary" @click="updateUrlExterna">Guardar</el-button>
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      loading: false,
      url: '',
      titulo: '',
      imagen: null
    }
  },
  watch: {
    dataUrlExterna(value) {
      this.url = value.data.url
      this.titulo = value.data.titulo
    }
  },
  computed: {
    dataUrlExterna: {
      get() {
        return this.$store.state.dataUrlExterna
      },
      set(newValue) {
        this.$store.state.dataUrlExterna = newValue
      }
    },
    dialogUrlExterna: {
      get() {
        return this.$store.state.dialogUrlExterna
      },
      set(newValue) {
        this.$store.state.dialogUrlExterna = newValue
      }
    }
  },
  methods: {
    uploadPhotoUrlExterna(event){
      this.imagen = event.target.files[0];
    },
    updateUrlExterna(){
      this.loading = true;
      const config =  { headers: { 'Content-Type': 'multipart/form-data' } };
      let params = new FormData;
      params.append('_method', 'PUT')
      params.append('url', this.url);
      params.append('titulo', this.titulo);
      if(this.imagen){
        params.append('imagen', this.imagen)
      }
      axios.post(`${this.$urlHttp}/api/micrositio/url/${this.dataUrlExterna.data.id}`, params, config).then((response) => {
        this.$store.state.micrositioEdit.url_externa.splice(this.dataUrlExterna.index, 1, response.data.data);
        this.reloadIframe();
        this.loading = false;
        this.$store.state.dialogUrlExterna = false
      }).catch(() => {
        this.loading = false;
        this.$notify.error({
          title: 'Error',
          message: 'No edito la url externa, intentalo de nuevo recargando la pagina'
        });
      })
    },
    reloadIframe(){
      document.getElementById('iframePreview').src = `https://meta.gov.co/micrositio/${this.dataUrlExterna.data.micrositio_id}`;
    }
  }
}
</script>

<style scoped>
  .url_choose_file{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    opacity: 0;
  }
  .row{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 5px 0;
  }
  .row .el-button{
		position: relative;
    margin-left: 10px;
	}
</style>
