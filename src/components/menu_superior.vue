<template>
  <div id="menuSuperior">
    <i class="material-icons" v-on:click="toggleMenuLateral">menu</i>
    <router-link to="/" class="menuSuperior_logo">
      <img src="../assets/logo.png" alt="">
    </router-link>
    <div class="search" v-show="$route.path == '/noticias'">
      <el-input v-model="search" placeholder="Buscar noticia">
        <el-button slot="append" icon="search"></el-button>
      </el-input>
    </div>
    <div class="search" v-show="$route.path == '/circulares'">
      <el-input v-model="searchCirculares" placeholder="Buscar circulares">
        <el-button slot="append" icon="search"></el-button>
      </el-input>
    </div>
    <div class="menuSuperior_options">
      <el-popover
        ref="notify"
        placement="bottom"
        width="200"
        trigger="click">
        <ul class="notificaciones">
          <li class="notificaciones_item" v-for="notificacion in notificaciones" v-on:click="selectedNotification(notificacion)">{{notificacion.mensaje}}</li>
        </ul>
        <p v-show="notificaciones.length == 0">No hay notificaciones</p>
      </el-popover>
      <div class="icon_notification">
        <svg v-popover:notify width="23px"  v-on:click="clearNotificaciones" height="22px" viewBox="0 0 23 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <!-- Generator: Sketch 43.1 (39012) - http://www.bohemiancoding.com/sketch -->
            <title>conversations icon</title>
            <desc>Created with Sketch.</desc>
            <defs></defs>
            <g id="ooto-Productivity-Dashboards" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Funcionarios" transform="translate(-24.000000, -550.000000)" fill="#9B9B9B">
                    <g id="icons" transform="translate(24.000000, 185.000000)">
                        <g id="conversations-icon" transform="translate(0.000000, 365.000000)">
                            <path d="M14.0873436,21.8272464 C11.6541688,21.8272464 9.33488139,20.6529574 7.88095096,18.6702263 L8.63148712,18.1066241 C9.92905585,19.8751204 11.9169498,20.8855551 14.0868768,20.8855551 L14.1013461,20.8855551 C15.1590046,20.8855551 16.1723218,20.6491906 17.1128258,20.1745782 C17.2864573,20.0874717 17.4964954,20.1209018 17.6383878,20.2541511 C18.3814559,20.9467651 20.2083207,20.8855551 21.4214074,20.7264093 C19.9007315,18.7832293 20.228391,17.0415712 20.2447273,16.9601149 C20.2517285,16.9257432 20.2624638,16.892784 20.2769331,16.8602956 C20.6830068,15.9572137 20.8874439,14.9924509 20.8851101,13.9919039 C20.8813761,12.0661452 20.1140369,10.2816402 18.7254517,8.96656827 L19.3644342,8.27960446 C20.9196497,9.75240966 21.814412,11.8340183 21.8186128,13.9904914 C21.8209466,15.1054539 21.5973727,16.1822779 21.1530254,17.191771 C21.1152185,17.4738075 20.9938632,19.0421944 22.662966,20.7184049 C22.7843213,20.8403539 22.8291295,21.0192753 22.7810541,21.1854838 C22.7325119,21.3507506 22.5980875,21.4764664 22.4305238,21.5127215 C22.051055,21.5941778 18.8463403,22.2307612 17.2617194,21.1468745 C16.2675391,21.6012405 15.2061465,21.8272464 14.1032131,21.8272464 L14.0873436,21.8272464 Z" id="Fill-1"></path>
                            <path d="M6.12979327,15.5246478 C6.20027272,15.5246478 6.27168568,15.5406565 6.33749762,15.5736157 C7.33074447,16.0722413 8.4000718,16.3250854 9.51560751,16.3250854 C13.4685246,16.3250854 16.6844414,13.0630667 16.6844414,9.05381597 C16.6844414,5.04409439 13.4685246,1.78207571 9.51560751,1.78207571 C5.56269039,1.78207571 2.34677364,5.04409439 2.34677364,9.05381597 C2.34677364,10.1099228 2.56427976,11.1269494 2.99415775,12.0780576 C3.00862704,12.1100751 3.01936232,12.1435051 3.02683034,12.1783477 C3.04410014,12.2630999 3.3936969,14.1012814 1.77873725,16.1504016 C2.21748352,16.2083157 2.78832041,16.2629338 3.37596035,16.2629338 C4.54237195,16.2629338 5.38439138,16.0515241 5.81193561,15.6508344 C5.90061836,15.5679656 6.01450569,15.5246478 6.12979327,15.5246478 M9.51560751,17.2667767 C8.35526367,17.2667767 7.23832771,17.024762 6.19233795,16.5468537 C5.56502415,16.9837985 4.62031943,17.2046251 3.3764271,17.2046251 L3.37596035,17.2046251 C2.03545049,17.2046251 0.817696239,16.9494267 0.766820343,16.9385973 C0.598789859,16.9032838 0.463898721,16.7775681 0.415356581,16.6123012 C0.36634769,16.4460927 0.411622571,16.2671714 0.53297792,16.1447515 C2.29309723,14.3691925 2.16053985,12.7108742 2.11899898,12.4109455 C1.65038063,11.3534261 1.41327095,10.2238674 1.41327095,9.05381597 C1.41327095,4.52522248 5.04786366,0.840384404 9.51560751,0.840384404 C13.9833514,0.840384404 17.6179441,4.52522248 17.6179441,9.05381597 C17.6179441,13.5824095 13.9833514,17.2667767 9.51560751,17.2667767" id="Fill-4"></path>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
        <span v-show="notificaciones.length != 0"><p>{{ notificaciones.length }}</p></span>
      </div>
      <router-link to="perfil" class="profile">
        <div class="profile_texts">
          <p>{{ currentUser.nombreUser }}</p>
          <em>Editar perfil</em>
        </div>
        <span class="menuSuperior_options_currentUser_photo"><img :src="`${$urlHttp}/imagenes_usuario/imagen_usuario/${currentUser.foto}`" alt=""></span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  created(){
    firebase.database().ref('notificaciones/').orderByChild('funcionario').equalTo(this.currentUser.id).on('value', (snapshot) => {
      this.notificaciones = [];
      for(let notificacion in snapshot.val()){
        let notification = snapshot.val()[notificacion];
        notification.key = notificacion;
        if(notification.revisado){
          this.notificaciones.push(notification);
          this.$store.state.notificaciones.push(notification);
        }
      }
    })
  },
  data(){
    return {
      notificaciones: [],
      search: '',
      searchCirculares: '',
    }
  },
  computed: {
    currentUser(){
      return this.$store.state.currentUser;
    }
  },
  watch: {
    search(value) {
      this.$store.commit('SEARCH_ARTICLE', value);
    },
    searchCirculares(value) {
      this.$store.commit('SEARCH_CIRCULAR', value);
    }
  },
  methods: {
    clearNotificaciones(){
      this.$store.state.notificaciones = [];
    },
    selectedNotification(notificacion){
      switch (notificacion.tipo) {
        case 'mensaje':
          firebase.database().ref(`notificaciones/${notificacion.key}`).update({
            revisado: false
          })
          this.$router.push('/chat');
          break;
        default:

      }
    },
    toggleMenuLateral(){
      if(document.querySelector('#menuLateral.openMenu')){
        document.getElementById('menuLateral').classList.remove('openMenu');
      }else{
        document.getElementById('menuLateral').classList.add('openMenu');
      }
    },
    currentDiary(){
      if(document.getElementById('diary')){
        document.getElementById('diary').classList.toggle('active');
      }
    }
  }
}
</script>

<style scoped>
  #menuSuperior{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background-color: #FFF;
    box-shadow: 0 1px 3px 0 rgba(176, 174, 177, 0.62);
    z-index: 4;
  }
  #menuSuperior > i{
    display: none;
    cursor: pointer;
  }
  .menuSuperior_logo{
    max-width: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .menuSuperior_logo img{
    width: 100%;
  }
  .search{
    max-width: 360px;
    width: 100%;
  }
  .menuSuperior_options{
    height: 100%;
    display: flex;
    align-items: center;
  }
  .icon_notification{
    position: relative;
  }
  .menuSuperior_options > svg, .menuSuperior_options a > svg, .icon_notification > svg{
    width: 20px;
    height: 20px;
    color: #4a4a4a;
    margin: 0 7px;
    cursor: pointer;
  }
  .icon_notification > span{
    position: absolute;
    top: -5px;
    right: 0;
    width: 18px;
    height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: red;
    color: #FFF;
    font-weight: bold;
    font-size: 12px;
    border-radius: 50%;
    pointer-events: none;
  }
  .icon_notification > span p{
    margin-top: 3px;
  }
  .menuSuperior_options a{
    display: flex;
    margin-right: 10px;
  }
  .menuSuperior_options_currentUser_action{
    display: flex;
    align-items: center;
    border: solid 1px rgba(0, 157, 61, 0.7);
    border-radius: 2px;
    font-size: 13px;
    padding: 10px;
    margin: 0 7px;
    cursor: pointer;
  }
  .menuSuperior_options_currentUser_action i{
    font-size: 14px;
    margin-right: 5px;
    color: rgba(0, 157, 61, 0.7);
  }
  .menuSuperior_options_currentUser_photo{
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 7px;
  }
  .menuSuperior_options_currentUser_photo img{
    max-width: 100%;
  }
  .profile{
    height: 100%;
    display: flex;
    align-items: center;
    color: black;
    padding: 0 10px;
    transition: .3s;
  }
  .profile:hover{
    background-color: #f1f0f0;
  }
  .profile_texts{
      text-align: right;
  }
  .profile_texts em{
    color: #168f26;
    font-size: 14px;

  }
  .notificaciones{
    list-style: none;
  }
  .notificaciones_item{
    padding: 10px;
    cursor: pointer;
  }
  .notificaciones_item:hover{
    background-color: #f1f0f0;
  }
  @media(max-width: 600px){
    .icon_notification{
      display: none;
    }
  }
  @media(max-width: 800px){
    #menuSuperior > i{
      display: flex;
    }
    .menuSuperior_title{
      display: none;
    }
    .menuSuperior_options > svg, .menuSuperior_options > .redirecToChat, .menuSuperior_options > .profile .profile_texts{
      display: none;
    }
    .profile, .menuSuperior_options_currentUser_photo{
      margin: 0px !important;
      padding: 0px;
    }
    .menuSuperior_logo{
      max-width: 100px;
    }
    .search{
      display: none;
    }
  }
</style>
