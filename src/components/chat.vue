<template>
    <div class="chat">
      <div class="chat_container">
        <div class="chat__contact">
          <div class="chat__contact_header">
            <div class="chat__contact_header_row">
              <input type="text" v-model="searchChat" class="chat__contact_search" placeholder="Buscar funcionario">
              <button  class="add_chat" v-on:click="addChat"><i class="material-icons">group_add</i></button>
            </div>
          </div>
          <ul class="chat__contact_list" v-if="filteredChats">
            <li :class="{chat__contact__item: true, selected: chat.chatActual, pending: chat.mensajesPendientes == currentUser.id}" v-for="(chat, index) in filteredChats" v-on:click="selectedChat(chat, index)">
              <figure class="chat__contact__item_photo">
                <img :src="`${$urlHttp}/imagenes_usuario/imagen_usuario/${chat.funcionario2.foto}`" alt="">
              </figure>
              <div class="chat__contact__item_info">
                <p><strong>{{ chat.funcionario2.nombre | capitalize }}</strong></p>
              </div>
            </li>
          </ul>
          <ul class="chat__contact_list" v-else>
            <li :class="{chat__contact__item: true, selected: chat.chatActual, pending: chat.mensajesPendientes == currentUser.id}" v-for="(chat, index) in chats" v-on:click="selectedChat(chat, index)">
              <figure class="chat__contact__item_photo">
                <img :src="`${$urlHttp}/imagenes_usuario/imagen_usuario/${chat.funcionario2.foto}`" alt="">
              </figure>
              <div class="chat__contact__item_info">
                <p><strong>{{ chat.funcionario2.nombre | capitalize }}</strong></p>
              </div>
            </li>
          </ul>
        </div>
        <div class="chat_box" v-if="previousChat">
          <header class="chat__header">
            <i v-on:click="returnAllContact" class="material-icons return_all_contact">arrow_back</i>
            <h2>{{ previousChat.funcionario2.nombre | capitalize }}</h2>
          </header>
          <div class="chat__messages" id="scrollBottom">
            <ul class="chat__messages_list">
              <li v-for="message in chats[previousChatIndex].mensajes" :class="{chat__messages_item: true, para: checkState(message.para)}">{{message.mensaje}}</li>
            </ul>
          </div>
          <div class="chat__actions">
            <div class="chat__actions_message">
              <input type="text" v-model="message" v-on:keyup.enter="createMessage" placeholder="Escribir mensaje..." >
              <i v-on:click="createMessage" class="material-icons">send</i>
            </div>
          </div>
        </div>
        <div class="chat_box empty" v-else>
          <img src="../assets/mailbox.jpg" alt="">
          <h3>Selecciona un chat</h3>
          <p>En esta seccion podras escribirle mensajes a otros funcionarios de la gobernacion</p>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
  created(){
    const dbChat = firebase.database().ref('chats/');

    dbChat.orderByChild("funcionario1/id").equalTo(this.currentUser.id).on('child_added', (snapshot) => {
      if(snapshot.val()){
          let chat = snapshot.val();
          chat.key = snapshot.key;
          this.chats.push(chat);
          this.chats.sort(function(a,b){return b.updated_at - a.updated_at});
      }
    })
    dbChat.orderByChild("funcionario2/id").equalTo(this.currentUser.id).on('child_added', (snapshot) => {
      if(snapshot.val()){
        let chat = snapshot.val();
        chat.key = snapshot.key;
        chat.funcionario = chat.funcionario2;
        chat.funcionario2 = chat.funcionario1;
        chat.funcionario1 = chat.funcionario;
        this.chats.push(chat);
        this.chats.sort(function(a,b){return b.updated_at - a.updated_at});
      }
    })

    dbChat.orderByChild("funcionario1/id").equalTo(this.currentUser.id).on('child_changed', (snapshot) => {
      this.chats.find((chat, index) => {
        if(chat.key === snapshot.key){
          chat.mensajes = snapshot.val().mensajes;
          this.chats.splice(index, 1);
          this.chats.unshift(chat)
          if(chat.chatActual){
            this.previousChatIndex = 0;
          }
          this.automaticallyScroll();
          return true;
        }
      });
    })
    dbChat.orderByChild("funcionario2/id").equalTo(this.currentUser.id).on('child_changed', (snapshot) => {
      this.chats.find((chat, index) => {
        if(chat.key === snapshot.key){
          chat.mensajes = snapshot.val().mensajes;
          this.chats.splice(index, 1);
          this.chats.unshift(chat)
          if(chat.chatActual){
            this.previousChatIndex = 0;
          }
          this.automaticallyScroll();
          return true;
        }
      });
    })
    setTimeout(() => {
      if(this.$store.state.backupSearchFuncionario != ''){
        this.funcionarioSearch(this.$store.state.backupSearchFuncionario)
      }
    }, 1000)
  },
  watch: {
    searchChat(value){
      this.filteredChats = this.chats.filter(chat => chat.funcionario2.nombre.toLowerCase().includes(value.toLowerCase()))
    }
  },
  data(){
    return{
      chats: [],
      filteredChats: null,
      previousChat: null,
      message: '',
      previousChatIndex: '',
      searchChat: '',
    }
  },
  computed: {
    backupSearch(){
      return this.$store.state.backupSearchFuncionario;
    },
    currentUser(){
      return this.$store.state.currentUser;
    },
    notificaciones(){
      return this.$store.state.notificaciones;
    },
  },
  methods: {
    funcionarioSearch(value){
      this.searchChat = value;
      setTimeout(() => {
        if(this.filteredChats.length == 0){
          this.$router.push('/chat/agregar');
        }
      }, 500)
    },
    addChat(){
      this.$store.state.chats = this.chats;
      this.$router.push('/chat/agregar');
    },
    selectedChat(chat, index){
      if(this.previousChat) this.previousChat.chatActual = false;
      chat.chatActual = true;
      this.previousChat = chat;
      this.previousChatIndex = index;
      firebase.database().ref(`chats/${this.previousChat.key}`).update({
        mensajesPendientes: 0,
      })
      this.automaticallyScroll();
    },
    createMessage(){
      if(this.message != ''){
        firebase.database().ref(`chats/${this.previousChat.key}`).update({
          updated_at: Date.now(),
          mensajesPendientes: this.previousChat.funcionario2.id
        })
        firebase.database().ref(`chats/${this.previousChat.key}/mensajes`).push({
          de: this.currentUser.id,
          para: this.previousChat.funcionario2.id,
          mensaje: this.message,
        }).then((response) => {
          this.createNotification();
        })
        this.message = '';
      }
    },
    checkState(value){
      if(value == this.currentUser.id){
        return false;
      }else{
        return true;
      }
    },
    automaticallyScroll(){
      setTimeout(()=>{
        let messagesScroll = document.getElementById('scrollBottom')
        messagesScroll.scrollTop = messagesScroll.scrollHeight;
      }, 50)
    },
    createNotification(){
      firebase.database().ref('notificaciones/').limitToLast(1).once('value', (snapshot) => {
        if(snapshot.val()){
          if(Object.values(snapshot.val())[0].funcionario != this.previousChat.funcionario2.id){
            firebase.database().ref('notificaciones/').push({
              funcionario: this.previousChat.funcionario2.id,
              mensaje: `Nuevo Mensaje de ${this.currentUser.nombreUser}`,
              revisado: true,
              tipo: 'mensaje'
            })
          }
        }else{
          firebase.database().ref('notificaciones/').push({
            funcionario: this.previousChat.funcionario2.id,
            mensaje: `Nuevo Mensaje de ${this.currentUser.nombreUser}`,
            revisado: true,
            tipo: 'mensaje'
          })
        }
      })
    },
    returnAllContact(){
      this.previousChat = null;
    }
  },
  filters: {
    capitalize(value){
      if(value){
        value = value.toLowerCase();
        return value.replace(/^\w|\s\w/g, l => l.toUpperCase())
      }
    }
  }
}
</script>

<style scoped>
  .chat{
    width: 100%;
    height: calc(100vh - 60px);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
  }
  .chat_container{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #FFF;
    overflow: hidden;
    box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.3);
  }
  .chat__contact{
    min-width: 280px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-image: linear-gradient(107deg, rgba(223, 228, 230, 0.39), rgba(193, 201, 209, 0.53));
    color: #FFF;
    overflow: hidden;
  }
  .chat__contact_header{
    width: 100%;
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(0,0,0,0.05);
  }
  .chat__contact_header_row{
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .chat__contact_header_row i{
    color: #FFF;
    transition: .3s;
  }
  .chat__contact_header_row i:hover{
    transform: scale(1.15);
  }
  .chat__contact_search{
    background-color: #FFF;
    border-style: none;
    padding: 7px 10px;
    border-radius: 4px;
    outline: none;
    box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.05);
  }
  .chat__contact_list{
    width: 100%;
    margin: 15px 0;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .chat__contact_list::-webkit-scrollbar{
  	width: 8px;
  	background-color: transparent;
  }
  .chat__contact_list::-webkit-scrollbar-thumb{
  	border-radius: 10px;
  	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  	background-color: rgb(0,157,61);
  }
  .chat__contact__item{
    width: 100%;
    display: flex;
    color: #2e2e2e;
    font-weight: 200;
    padding: 15px 10px;
    cursor: pointer;
    transition: all .3s;
  }
  .chat__contact__item.pending{
    border-left: 4px solid #d3a800;
  }
  .chat__contact__item.selected{
    background-color: rgba(0,0,0,0.08);
    border-left: 0px solid #d3a800;
  }
  .chat__contact__item:hover{
    background-color: rgba(0,0,0,0.05);
  }
  .chat__contact__item_photo{
    max-width: 45px;
    width: 45px;
    min-width: 45px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 7px;
  }
  .chat__contact__item_photo img{
    width: 100%;
  }
  .chat__contact__item_info{
    display: flex;
    align-items: center;
  }
  .chat_box{
    width: 100%;
    height: 100%;
    background-color: #FFF;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .chat_box.empty{
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .chat_box.empty img{
    max-width: 350px;
    width: 100%;
  }
  .chat__header{
    display: flex;
    justify-content: space-between;
    padding: 10px;
    box-shadow: 0px 2px 5px 1px rgba(0,0,0,0.1);
  }
  .chat__header .return_all_contact{
    cursor: pointer;
  }
  .chat__header h2{
    font-weight: 400;
    font-size: 18px;
  }
  .chat__messages{
    height: calc(100% - 118px);
    overflow-y: auto;
  }
  .chat__messages::-webkit-scrollbar{
  	width: 8px;
  	background-color: transparent;
  }
  .chat__messages::-webkit-scrollbar-thumb{
  	border-radius: 5px;
  	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.1);
  	background-color: #ddd;
  }
  .chat__messages_list{
    /*height: 100%;*/
    margin: 10px 5px;
    list-style: none;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .chat__messages_item{
    background-color: #EEE;
    padding: 10px;
    margin: 2.5px 5px;
    border-radius: 0px 10px 10px 10px;
  }
  .chat__messages_item.para{
    background-color: #008935;
    color: #FFF;
    padding: 10px;
    align-self: flex-end;
    border-radius: 10px 10px 0px 10px;
  }
  .chat__actions{
    width: 100%;
    height: 70px;
    background-color: #EEE;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .chat__actions_message{
    position: relative;
    max-width: 1000px;
    width: 95%;
    display: flex;
    align-items: center;
  }
  .chat__actions_message input{
    position: absolute;
    width: 100%;
    height: 35px;
    border-radius: 5px;
    border-style: none;
    padding: 7px 35px 7px 7px;
    outline: none;
  }
  .chat__actions_message input:focus{
    border: 1px solid rgb(0,157,61);
  }
  .chat__actions_message i{
    position: absolute;
    right: 5px;
    color: #b7b7b7;
    cursor: pointer;
  }
  .chat__actions_message i:hover{
    position: absolute;
    right: 5px;
    color: #b7b7b7;
  }
  .add_chat{
    border-style: none;
    background-color: transparent;
    cursor: pointer;
    outline: none;
  }
  @media(max-width: 700px){
    .chat__contact{
      width: 100%;
    }
    .chat_box{
      position: absolute;
      top: 0;
      left: 0;
      z-index: 999;
    }
    .chat_box.empty{
      display: none;
    }
  }
  @media(max-width: 300px){
    .chat{
      padding: 0px;
    }
  }
</style>
