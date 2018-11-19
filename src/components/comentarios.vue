<template>
  <div id="comentarios">
    <div class="comments_action">
      <figure class="comments_action_photo">
        <img :src="`${$urlHttp}/imagenes_usuario/imagen_usuario/${currentUser.foto}`" alt="">
      </figure>
      <div class="comments_action_inputs">
        <button type="button" v-on:click="createComment"><i class="material-icons">send</i></button>
        <input type="text" v-on:keyup.enter="createComment" placeholder="Escribe tu comentario..." v-model="contenido">
      </div>
    </div>
    <div class="comments_comment" v-for="comment in mutableComments">
      <figure class="comments_comment_photo">
        <img :src="`${$urlHttp}/imagenes_usuario/imagen_usuario/${comment.usuario.imagen}`" alt="">
      </figure>
      <p class="comments_comment_text"><strong>{{ comment.usuario.nombreUsuario }}</strong> {{ comment.contenido }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  props: [ 'comments', 'article' ],
  data() {
    return {
      contenido: '',
      mutableComments: this.comments,
    }
  },
  computed:{
    currentUser(){
      return this.$store.state.currentUser;
    }
  },
  methods: {
    createComment(){
      if(this.contenido != ''){
        let newComment = {
          idTimeline: this.article.idTimeline,
          idUsuario: this.currentUser.id,
          contenido: this.contenido,
        }
        axios.post(`${this.$urlHttp}/timeline/comentario`, newComment).then((response) => {
          this.mutableComments.unshift(response.data.estado);
          this.createNotification(response.data.estado.idTimeline, response.data.estado.idUsuario, response.data.estado.contenido);
        })
        this.contenido = '';
      }
    },
    createNotification(){
      firebase.database(id, created, content).ref('').push({
        tipo: 'comentario',
        url: '',
        content: content,
        created_by: created,
        notified_to: this.article,
      })
    }
  }
}
</script>

<style scoped>
  #comentarios{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .comments_action{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #EEE;
    padding-bottom: 15px;
  }
  .comments_action_photo{
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 7px;
  }
  .comments_action_photo img{
    width: 100%;
  }
  .comments_action_inputs{
    width: calc(100% - 70px);
    position: relative;
    display: flex;
    align-items: center;
  }
  .comments_action_inputs input{
    position: absolute;
    width: 100%;
    border: 1px solid #e1e2e3;
    padding: 10px 70px 10px 10px;
  }
  .comments_action_inputs button{
    position: absolute;
    right: 4px;
    z-index: 2;
    display: flex;
    align-items: center;
    border-style: none;
    background-color: transparent;
    border-radius: 2px;
    border: solid 1px rgba(77, 161, 255, 0.7);
    padding: 4px 20px;
    color: #4990e2;
    cursor: pointer;
    transition: .3s;
  }
  .comments_action_inputs button:hover{
    transform: scale(0.95);
  }
  .comments_action_inputs button i{
    display: flex;
    font-size: 18px;
    color: #4990e2;
  }
  .comments_comment{
    width: 95%;
    display: flex;
    justify-content: space-between;
    margin: 15px 0;
  }
  .comments_comment_photo{
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 7px;
  }
  .comments_comment_photo img{
    width: 100%;
  }
  .comments_comment_text{
    width: calc(100% - 70px);
    text-align: justify;
    color: #4a4a4a;
  }
  .comments_comment_text strong{
    font-weight: 500;
    color: #39569c;
  }
</style>
