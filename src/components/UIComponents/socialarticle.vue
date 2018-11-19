<template>
  <article class="timeline_article" :id="`article${article.idTimeline}`">
    <header class="timeline_article_header">
      <div>
        <figure class="timeline_article_header_photo">
          <img :src="`${$urlHttp}/imagenes_usuario/imagen_usuario/${article.usuario.imagen}`">
        </figure>
        <p class="timeline_article_header_name">{{ article.usuario.nombreUsuario }}</p>
      </div>
      <i class="material-icons" v-if="(currentUser.id == article.usuario.id) || allow()" v-on:click="openDialogEditArticle">more_vert</i>
    </header>
    <h2 class="timeline_article_title">{{ article.titulo }}</h2>
    <p class="timeline_article_text" v-html="article.contenido"></p>
    <a v-if="article.archivo" class="file" :download='`${$urlHttp}/archivos_timeline/${article.archivo}`' :href="`${$urlHttp}/archivos_timeline/${article.archivo}`">
      <i class="material-icons">insert_drive_file</i>
      <p>Descarga este archivo</p>
      <i class="el-icon-upload"></i>
    </a>
    <div v-html="article.soundcloud"></div>
    <div v-show="article.imagenes.length != 0 || article.youtube != null" class="timeline_article_photo">
      <carousel :perPage="1">
        <slide v-for="image in article.imagenes">
          <div class="article_slide">
            <img :src="`${$urlHttp}/imagen_timeline/${image.nombre_imagen}`">
          </div>
        </slide>
        <slide v-if="article.youtube">
          <div class="article_slide">
            <div v-html="article.youtube"></div>
          </div>
        </slide>
      </carousel>
    </div>
    <comentarios :comments="setSortComments(article.comentario)" :article="article"></comentarios>
  </article>
</template>

<script>
import comentarios from '../comentarios.vue'

export default {
  components: { comentarios },
  props: ['article', 'index'],
  data() {
    return {
      paginate: ['timelineData'],
    }
  },
  computed: {
    currentUser(){
      return this.$store.state.currentUser;
    }
  },
  methods: {
    openDialogEditArticle() {
      this.$emit('edit', this.article, this.index)
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

<style scoped>
  .timeline{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 30px;
  }
  .timeline_article{
    max-width: 800px;
    width: 100%;
    background-color: #FFF;
    margin: 10px auto;
    border-radius: 1px;
    box-shadow: 0 2px 4px 0 rgba(155, 155, 155, 0.48);
    padding: 15px 50px;
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
  .article_slide{
    width: 98%;
    max-height: 500px;
    height: 98%;
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
  .file{
    max-width: 200px;
    width: 100%;
    min-height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px;
    margin: 5px 0;
    border-radius: 5px;
    border: solid 1px #e9eff4;
    cursor: pointer;
    color: #323c47;
    background-color: #FFF;
    transition: .3s;
  }
  .file i:first-child{
    color: #f7ba2a;
    text-shadow: 0 0 1px #f7ba2a;
  }
  .file i:last-child{
    color: rgba(208, 215, 221, 0.73);
  }
  .file.selected{
    background-color: #4da1ff;
  }
  .file p{
    text-align: center;
    font-size: 13px;
    word-break: break-all;
    margin: 0 5px;
  }
  .file.selected p, .documents__column .file.selected i{
    color: #FFF;
    text-shadow: 0 0 0 #FFF;
  }
  .file.pending i:first-child{
    animation: rotate 3s linear infinite;
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
