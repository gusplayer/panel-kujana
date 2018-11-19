<template>
  <section id="social">
    <el-dialog title="Editar Articulo" :size="sizeDialog" :visible.sync="dialogEditArticle" v-loading.body="loadingActionArticle">
      <div class="inputs_row">
        <el-input placeholder="Titulo del articulo" v-model="currentArticle.titulo"></el-input>
        <el-select v-model="currentArticle.idDependencia" placeholder="Dependencia">
          <el-option
          v-for="item in dependencias"
          :key="item.idDependencia"
          :label="item.nombreDependencia"
          :value="item.idDependencia">
        </el-option>
        </el-select>
        <el-select v-model="currentArticle.destino" placeholder="Tipo de destino">
          <el-option label="Intranet" value="1"></el-option>
          <el-option label="Intranet & Pagina Web" value="3"></el-option>
        </el-select>
      </div>
      <div class="inputs_row codes">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="Introducir codigo soundcloud"
          v-model="currentArticle.soundcloud">
        </el-input>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="Introducir codigo de youtube"
          v-model="currentArticle.youtube">
        </el-input>
      </div>
      <vue-editor v-model="currentArticle.contenido" :editorToolbar="customToolbar" ></vue-editor>
      <div class="images_tiny">
        <div class="images_tiny_photo" v-for="(image, index) in currentArticle.imagenes">
          <button class="remove_photo" v-on:click="removePhoto(index, image.idImagenTimeline)"><i class="material-icons">clear</i></button>
          <img :src="`${$urlHttp}/imagen_timeline/${image.nombre_imagen}`">
        </div>
        <div v-if="urlPhotos.length < 5" class="uploaderPhoto">
          <input type="file" v-on:change="uploadImage">
          <i class="material-icons">add</i>
        </div>
      </div>
      <div style="margin-top: 5px;">
        <el-button type="danger" v-on:click="deleteArticle" icon="delete">Eliminar</el-button>
        <el-button v-on:click="editArticle">Guardar informacion</el-button>
      </div>
    </el-dialog>
    <div class="timeline" v-loading="timelineLoading">
      <create-article-circulares v-if="allow()"></create-article-circulares>
      <paginate
        class="article_list"
        name="circularData"
        :list="circularData"
        :per="5">
        <social-article :article="article" @edit="openDialogEditArticle" v-for="(article, index) in paginated('circularData')" />
      </paginate>
      <paginate-links
        for="circularData"
        :limit="5"
        @change="onLangsPageChange"
        :show-step-links="true">
      </paginate-links>
    </div>
  </section>
</template>

<script>
import createArticleCirculares from './circulares_crear.vue'
import socialArticle from './UIComponents/socialarticle.vue'
import comentarios from './comentarios.vue'
import { VueEditor } from 'vue2-editor'
import axios from 'axios'

export default {
  components: { VueEditor, createArticleCirculares, socialArticle, comentarios },
  created () {
    if (this.$store.state.timelineData.length) {
      this.timeline = this.$store.state.timelineData.filter((article) => article.idDependencia == 37).slice(0, 5)
      this.timelineLoading = false
    }
  },
  data(){
    return {
      paginate: ['circularData'],
      newPhotoArticle: false,
      fileList: [],
      articleContent: '',
      urlPhotos: [],
      images: [],
      dependenciaSelected: '',
      dialogEditArticle: false,
      currentArticle: {},
      currentIndexArticle: 0,
      loadingActionArticle: false,
      timelineLoading: true,
      timeline: [],
      pagination: 5,
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
  watch: {
    circularData (value) {
      this.timeline = value.slice(0, 5)
      this.timelineLoading = false
    }
  },
  computed: {
    sizeDialog(){
      const mq = window.matchMedia( "(max-width: 600px)" );
      if (mq.matches) {
        return 'full'
      } else {
        return 'small'
      }
    },
    validateSizePagination () {
      if (this.timelineData) {
        if (this.timeline.length > this.timelineData.length) {
          return false
        } else {
          return true
        }
      }
    },
    circularData(){
      return this.$store.state.circularData;
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
    infiniteHandler() {
      this.timeline = this.timeline.concat(this.timelineData.splice(this.pagination, 5));
      this.pagination += 5
    },
    setYoutube(id, youtube){
      setTimeout(() => {
        document.getElementById(`iframeYoutube${id}`).innerHTML = youtube;
      }, 100)
    },
    setSoundcloud(id, soundcloud){
      setTimeout(() => {
        document.getElementById(`iframeSoundcloud${id}`).innerHTML = soundcloud;
      }, 100)
    },
    setContenidoArticle(id, contenido){
      setTimeout(() => {
        document.querySelector(`#article${id} .timeline_article_text`).innerHTML = contenido;
      }, 10)
    },
    openDialogEditArticle(article, index){
      if((this.currentUser.id == article.usuario.id) || this.allow(1)){
        this.currentIndexArticle = index;
        article.destino = article.destino.toString();
        this.currentArticle = article;
        this.dialogEditArticle = !this.dialogEditArticle;
      }
    },
    uploadImage(file){
      const isJPG = file.target.files[0].type == 'image/jpeg';
      const isPNG = file.target.files[0].type == 'image/png';
      const isLt3M = file.target.files[0].size / 1024 / 1024 < 3;
      if(isJPG || isPNG){
        if(isLt3M){
          const config = { headers: { 'Content-Type': 'multipart/form-data' } };
          let uploadImage = new FormData();
          uploadImage.append('id_timeline', this.currentArticle.idTimeline);
          uploadImage.append('imagen', file.target.files[0]);
          axios.post(`${this.$urlHttp}/timeline/nueva/imagen`, uploadImage, config).then((response) => {
            this.currentArticle.imagenes.push(response.data.imagen);
          })
        }
      }
    },
    setSortComments(comments){
      if(comments.length != 0){
        let newArray = [];
        for(let comment of comments){
          newArray.unshift(comment);
        }
        return newArray;
      }else{
        return comments
      }
    },
    editArticle(){
      this.loadingActionArticle = true;
      let json = {
        titulo: this.currentArticle.titulo,
        contenido: this.currentArticle.contenido,
        idDependencia: this.currentArticle.idDependencia,
        destino: this.currentArticle.destino,
        soundcloud: this.currentArticle.soundcloud,
        youtube: this.currentArticle.youtube,
        _method: "PUT"
      }
      axios.post(`${this.$urlHttp}/timeline/${this.currentArticle.idTimeline}`, json).then((response) => {
        this.loadingActionArticle = false;
        this.dialogEditArticle = !this.dialogEditArticle;
      }).catch((error) => {
        this.loadingActionArticle = false;
        this.dialogEditArticle = !this.dialogEditArticle;
      })
    },
    deleteArticle(){
      this.loadingActionArticle = true;
      axios.delete(`${this.$urlHttp}/timeline/${this.currentArticle.idTimeline}`).then((response) => {
        this.dialogEditArticle = false;
        this.$store.state.timelineData.splice(this.currentIndexArticle, 1);
        this.loadingActionArticle = false;
      }).then((error) => {
        this.dialogEditArticle = false;
        this.loadingActionArticle = false;
      })
    },
    removePhoto(index, id){
      axios.post(`${this.$urlHttp}/timeline/eliminar/imagen`, {id_imagen: id}).then((response) => {
        this.currentArticle.imagenes.splice(index, 1)
      })
    },
    onLangsPageChange(toPage, fromPage) {
      document.body.scrollTop	= 600;
    },
    allow(value = 0){
      if(this.currentUser.tipoUsuario == 1){
        return true;
      }else{
        if(this.currentUser.tipoUsuario == 2){
          switch (value) {
            case 1:
              return false;
            break;
            default:
              return true;
          }
        }else{
          switch (value) {
            case 2:
              return true;
            break;
            default:
              return false;
          }
        }
      }
    }
  }
}
</script>

<style>
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
  .el-dialog .el-icon-delete{
    color: #FFF !important;
  }
  .timeline{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 30px;
  }
  .article_list{
    width: 100%;
  }
  .timeline_article_header{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .timeline_article_header > div{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .timeline_article_header > i{
    cursor: pointer;
    color: #515151;
  }
  .timeline_article_header_photo{
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 7px;
  }
  .timeline_article_header_photo img{
    width: 100%;
  }
  .timeline_article_header_name{
    font-size: 16px;
    font-weight: 500;
    color: #007aff;
  }
  .timeline_article_title{
    font-size: 18px;
    font-weight: 600;
    margin: 15px 0;
  }
  .timeline_article_text{
    color: #4a4a4a;
    margin: 10px 0;
    text-align: justify;
  }
  .el-carousel__item{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .timeline_article_photo{
    max-height: 500px;
    margin-bottom: 20px;
  }
  .timeline_article_photo img{
    max-width: 100%;
    max-height: 100%;
    border-radius: 5px;
    box-shadow: 0 1px 7px 2px rgba(155, 155, 155, 0.64);
  }
  .inputs_row{
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .inputs_row .el-input{
    width: 50%;
  }
  .inputs_row .el-select{
    width: calc(25% - 10px);
  }
  .inputs_row.codes > .el-textarea{
    width: 49%;
  }
  .images_tiny{
    display: flex;
    align-items: center;
    margin: 10px 0;
  }
  .images_tiny_photo{
    width: 90px;
    height: 90px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #EEE;
    margin: 10px 10px;
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
  .images_tiny_photo:hover .remove_photo{
    opacity: 1;
  }
  .images_tiny_photo input[type="file"]{
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
  .images_tiny img{
    max-width: 90px;
    max-height: 90px;
  }
  .paginate-links.circularData{
    display: flex;
    background-color: #FFF;
    box-shadow: 0 1px 3px 0 rgba(155, 155, 155, 0.48);
    list-style: none;
  }
  .paginate-links.circularData li{
    min-width: 40px;
    height: 40px;
  }
  .paginate-links.circularData li:hover{
    background-color: #EEE;
    cursor: pointer;
  }
  .paginate-links.circularData li.active{
    background-color: #128f2e;
    color: #FFF;
  }
  .paginate-links.circularData li ~ li{
    border-left: 1px solid #EEE;
  }
  .paginate-links.circularData li a{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @media(max-width: 750px){
    .timeline{
      padding: 0px !important;
    }
  }
  @media(max-width: 550px){
    .timeline_article{
      padding: 15px 20px;
    }
  }
</style>
