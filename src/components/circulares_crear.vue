<template>
<div class="timeline_create_article" v-loading.body="loadingCreateArticle">
  <div class="timeline_create_article_header">
    <figure class="timeline_create__photo">
      <img :src="`${$urlHttp}/imagenes_usuario/imagen_usuario/${currentUser.foto}`" alt="">
    </figure>
    <h3 class="timeline_create__text">Escribe algo interesante, para compartir con los demas usuarios de la intranet.</h3>
  </div>
  <div class="timeline_create_article_inputs">
    <div class="timeline_create__inputs_row">
      <el-input placeholder="Titulo del articulo" v-model="articleTitle"></el-input>
    </div>
    <div class="timeline_create__inputs_row codes">
      <el-input
        type="textarea"
        :rows="2"
        placeholder="Introducir codigo soundcloud"
        v-model="soundcloud">
      </el-input>
      <el-input
        type="textarea"
        :rows="2"
        placeholder="Introducir codigo de youtube"
        v-model="youtube">
      </el-input>
    </div>
    <vue-editor v-model="articleContent" :editorToolbar="customToolbar"></vue-editor>
  </div>
  <div class="photos">
    <figure  class="photo" v-for="(photo, index) in urlPhotos">
      <button class="remove_photo" v-on:click="removePhoto(index)"><i class="material-icons">clear</i></button>
      <img :src="photo">
    </figure>
    <div v-if="urlPhotos.length < 5" class="uploaderPhoto">
      <input type="file" v-on:change="uploadImage">
      <i class="material-icons">add</i>
    </div>
  </div>
  <div class="timeline_create_article_actions">
    <button v-on:click="createArticle" class="action">Publicar</button>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import { VueEditor } from 'vue2-editor'

export default {
  components: { VueEditor },
  data(){
    return {
      newPhotoArticle: false,
      articleTitle: '',
      articleContent: '',
      urlPhotos: [],
      images: [],
      dependenciaSelected: 37,
      destinoSelected: "1",
      currentArticle: {},
      loadingCreateArticle: false,
      soundcloud: '',
      youtube: '',
      customToolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{'indent': '-1'}, {'indent': '+1'}],
            [{'header': [1, 2, 3, 4, 5, 6, 7]}],
            [{'color': []},{'background': []}],
            [{'font': []}],
            [{'align': []}],
            ['clean']
          ]
    }
  },
  computed: {
    timelineData(){
      return this.$store.state.timelineData;
    },
    dependencias(){
      return this.$store.state.dependenciasData;
    },
    funcionarios(){
      return this.$store.state.funcionariosData;
    },
    currentUser(){
      return this.$store.state.currentUser;
    }
  },
  methods: {
    removePhoto(i){
      this.urlPhotos.splice(i, 1);
      this.images.splice(i, 1);
    },
    uploadImage(file){
      const isJPG = file.target.files[0].type == 'image/jpeg';
      const isPNG = file.target.files[0].type == 'image/png';
      const isLt3M = file.target.files[0].size / 1024 / 1024 < 3;
      if(isJPG || isPNG){
        if(isLt3M){
          this.urlPhotos.push(URL.createObjectURL(file.target.files[0]));
          this.images.push(file.target.files[0]);
        }
      }
    },
    showNewPhotoArticle(){
      this.newPhotoArticle = !this.newPhotoArticle;
    },
    createArticle(){
      if(this.destinoSelected != 1){
        if(this.articleTitle){
          this.loadingCreateArticle = true;
          let today = new Date();
          let dd = today.getDate();
          let mm = today.getMonth()+1;
          let yyyy = today.getFullYear();
          const config = { headers: { 'Content-Type': 'multipart/form-data' } };
          let newArticle = new FormData();
            newArticle.append('titulo', this.articleTitle);
            newArticle.append('contenido', this.articleContent);
            newArticle.append('idUsuario', this.currentUser.id);
            newArticle.append('soundcloud', this.soundcloud);
            newArticle.append('youtube', this.youtube);
            newArticle.append('fecha', today);
            for (var i = 0; i < this.images.length; i++) {
               let file = this.images[i];
               newArticle.append('imagen' + i, file);
            }
            newArticle.append('idDependencia', this.dependenciaSelected);
            newArticle.append('destino', this.destinoSelected);
          axios.post(`${this.$urlHttp}/timeline`, newArticle, config).then((response) => {
            this.$store.commit('timeline')
            this.loadingCreateArticle = false;
            this.articleContent = '';
            this.images = [];
            this.urlPhotos = [];
            this.youtube = '';
            this.soundcloud = '';
            this.dependenciaSelected = 1;
            this.articleTitle = '';
            this.destinoSelected = 1;
          }).catch((error) => {
            this.$message.error('El articulo no subio al servidor');
          })
        }else{
          this.$notify.error({
            title: 'Error',
            message: 'El titulo es requerido'
          });
        }
      }else{
        this.loadingCreateArticle = true;
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth()+1;
        let yyyy = today.getFullYear();
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        let newArticle = new FormData();
          newArticle.append('titulo', this.articleTitle);
          newArticle.append('contenido', this.articleContent);
          newArticle.append('idUsuario', this.currentUser.id);
          newArticle.append('soundcloud', this.soundcloud);
          newArticle.append('youtube', this.youtube);
          newArticle.append('fecha', today);
          for (var i = 0; i < this.images.length; i++) {
             let file = this.images[i];
             newArticle.append('imagen' + i, file);
          }
          newArticle.append('idDependencia', this.dependenciaSelected);
          newArticle.append('destino', this.destinoSelected);
        axios.post(`${this.$urlHttp}/timeline`, newArticle, config).then((response) => {
          this.$store.commit('timeline')
          this.loadingCreateArticle = false;
          this.articleContent = '';
          this.images = [];
          this.youtube = '';
          this.soundcloud = '';
          this.urlPhotos = [];
          this.dependenciaSelected = 1;
          this.articleTitle = '';
          this.destinoSelected = 1;
        }).catch((error) => {
          this.$message.error('El articulo no subio al servidor');
        })
      }
    }
  }
}
</script>

<style scoped>
  .timeline_create_article{
    max-width: 800px;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #FFF;
    margin: 10px;
    border-radius: 1px;
    box-shadow: 0 2px 4px 0 rgba(155, 155, 155, 0.48);
    padding: 15px 50px;
  }
  .timeline_create_article_header{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .timeline_create__photo{
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 7px;
  }
  .timeline_create__photo img{
    width: 100%;
  }
  .timeline_create__text{
    font-size: 14px;
    font-weight: 400;
    text-align: center;
  }
  .timeline_create__inputs_row{
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .timeline_create__inputs_row .el-input{
    width: 100%;
  }
  .timeline_create__inputs_row .el-select{
    width: calc(25% - 10px);
  }
  .timeline_create__inputs_row.codes .el-textarea{
    width: 49%;
  }
  .photos{
    display: flex;
    margin-top: 10px;
  }
  .photos > .photo{
    position: relative;
    width: 90px;
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #EEE;
    margin: 0 5px;
    border-radius: 3px;
    overflow: hidden;
  }
  .photos > .photo img{
    max-width: 100%;
    max-height: 100%;
  }
  .remove_photo{
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 5;
    border-style: none;
    background-color: rgba(0, 0, 0, 0.3);
    opacity: 0;
    cursor: pointer;
    transition: .3s;
  }
  .remove_photo i{
    color: #FFF;
    font-size: 30px;
  }
  .photos > .photo:hover .remove_photo{
    opacity: 1;
  }
  .uploaderPhoto{
    position: relative;
    width: 90px;
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  .uploaderPhoto input{
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
  .uploaderPhoto i{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    border: 1px dashed #d9d9d9;
    font-size: 40px;
  }
  .uploaderPhoto img{
    width: 100%;
  }
  .timeline_create_article_actions{
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  .timeline_create_article_actions .action{
    display: flex;
    align-items: center;
    border-style: none;
    padding: 10px 50px;
    margin: 10px 0;
    background-color: #4192ec;
    border-radius: 10px;
    color: #FFF;
    cursor: pointer;
    outline: none;
    transition: .3s;
  }
  @media(max-width: 550px){
    .timeline_create_article{
      padding: 15px 20px;
    }
  }
</style>
