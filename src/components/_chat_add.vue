<template>
    <el-dialog title="Agregar Funcionario" :visible.sync="visible">
      <div class="chat_add_header">
        <p>Podras agregar un funcionario a la lista de chats</p>
        <el-input placeholder="Buscar funcionario" v-model="searchFuncionario"></el-input>
      </div>
      <ul class="chat_add_list">
        <li v-for="funcionario in filteredFuncionarios" class="chat_add_list_item">
          <div class="chat_add__item_info">
            <figure class="chat_add__item_photo">
              <img :src="`${$urlHttp}/imagenes_usuario/imagen_usuario/${funcionario.imagen}`" alt="">
            </figure>
            <div>
              <p>{{funcionario.nombreUsuario | capitalize}}</p>
              <em>{{ funcionario.cargo | capitalize }}</em>
            </div>
          </div>
          <p class="addFuncionario" v-on:click="createdChat(funcionario)">Agregar<i class="material-icons">person_add</i></p>
        </li>
      </ul>
    </el-dialog>
</template>

<script>
export default {
  data(){
    return{
      visible: true,
      searchFuncionario: '',
      filteredFuncionarios: [],
    }
  },
  watch: {
    searchFuncionario(){
      this.filteredFuncionarios = this.funcionarios.filter(funcionario => funcionario.nombreUsuario.toLowerCase().includes(this.searchFuncionario.toLowerCase()));
    },
    funcionarios(){

    }
  },
  computed: {
    funcionarios(){
      this.filteredFuncionarios = this.$store.state.funcionariosData;
      return this.$store.state.funcionariosData;
    },
    currentUser(){
      return this.$store.state.currentUser;
    },
    chats(){
      return this.$store.state.chats;
    }
  },
  methods: {
    createdChat(funcionario){
      let existChat = this.chats.filter(chat => chat.funcionario2.id == funcionario.id);
      if(existChat.length == 0 && funcionario.id != this.currentUser.id){
        let newChat = firebase.database().ref('chats').push({
          funcionario1: {
            id: this.currentUser.id,
            foto: this.currentUser.foto,
            nombre: this.currentUser.nombreUser,
          },
          funcionario2: {
            id: funcionario.id,
            foto: funcionario.imagen,
            nombre: funcionario.nombreUsuario,
          },
          updated_at: Date.now(),
          mensajesPendientes: 0,
          chatActual: false,
        })
        this.$router.push('/chat');
      }else{
        this.$notify({
          title: 'Ya existe',
          message: 'Este chat ya existe en tu lista de contactos',
          type: 'warning'
        });
        this.$router.push('/chat');
      }
    }
  },
  filters: {
    capitalize(value){
      value = value.toLowerCase();
      return value.replace(/^\w|\s\w/g, l => l.toUpperCase())
    }
  }
}
</script>

<style scoped>
  #chatAdd{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 4;
  }
  .chat_add_header{
    padding: 15px;
    padding-top: 0px;
  }
  .chat_add_header p{
    margin: 0px 0 20px 0;
  }
  .chat_add_list{
    height: calc(100% - 138px);
    overflow-y: auto;
  }
  .chat_add_list::-webkit-scrollbar{
  	width: 8px;
  	background-color: transparent;
  }
  .chat_add_list::-webkit-scrollbar-thumb{
  	border-radius: 5px;
  	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.1);
  	background-color: #ddd;
  }
  .chat_add_list_item{
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: content-box;
    padding: 5px 10px;
    border-bottom: 1px solid #e2e2e2;
  }
  .chat_add_list_item:hover{
    background-color: #EEE;
  }
  .chat_add_list_item i{
    cursor: pointer;
  }
  .chat_add_list_item:hover > i{
    display: block;
  }
  .chat_add__item_info{
    display: flex;
    align-items: center;
  }
  .chat_add__item_photo{
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 7px;
  }
  .chat_add__item_photo img{
    width: 100%;
  }
  .chat_add__item_info div p{
    font-size: 15px;
  }
  .chat_add__item_info div em{
    font-size: 13px;
  }
  .addFuncionario{
    font-size: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: #878787;
  }
  .addFuncionario i{
    margin-left: 5px;
    color: #878787;
    font-size: 18px;
  }
  .addFuncionario:hover, .addFuncionario:hover i{
    color: #4192ec;
  }
</style>
