<template>
  <section id="funcionariosProfile" v-on:click="closeFuncionariosProfile">
    <div class="funcionariosProfile" v-if="data">
      <div class="profile_content">
        <div>
          <p class="profile_content__name">{{ data.nombreUsuario | capitalize }}</p>
          <p class="profile_content__job">{{ data.cargo | capitalize }}</p>
        </div>
        <div>
          <p>{{ data.dependecia }}</p>
        </div>
        <div class="profile_content__contact">
          <p><i class="material-icons">email</i>{{ data.email }}</p>
          <p><i class="material-icons">phone_iphone</i>{{ data.telefono }}</p>
        </div>
        <div class="actions">
          <a v-if="data.hoja_vida" :href="`${$urlHttp}/pdf_hoja_vida/${data.hoja_vida}`"  target="_blank" class="profile_content__action">Descargar hoja de vida</a>
          <button class="profile_content__action" v-on:click="actionEditFuncionario">Editar</button>
        </div>
      </div>
      <div class="profile_photo">
        <figure>
          <img :src="`${$urlHttp}/imagenes_usuario/imagen_usuario/${data.imagen}`" alt="">
        </figure>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  created(){

  },
  data(){
    return{
      index: '',
    }
  },
  computed: {
    currentUser(){
      return thid.$store.state.currentUser;
    },
    data(){
      let data = this.$store.state.funcionariosData.filter((funcionario, index) => {
        if(funcionario.id == this.$route.params.id) {
          this.index = index
          funcionario.dependecia = this.$store.state.dependenciasData.filter(dependencia => dependencia.idDependencia == funcionario.idDependencia)[0].nombreDependencia;
          return funcionario
        }
      });
      return data[0]
    }
  },
  methods: {
    closeFuncionariosProfile(e){
      if(e.target.id == 'funcionariosProfile'){
        this.$router.push('/funcionarios');
      }
    },
    actionEditFuncionario(){
      this.$store.state.dataEditFuncionario = this.data;
      this.$store.state.indexFuncionario = this.index;
      this.$router.push('/funcionarios/editar');
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
          case 1:
            return true;
          break;
          default:
            return false;
        }
      }
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
  #funcionariosProfile{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0,0,0,0.5);
    z-index: 4;
  }
  .funcionariosProfile{
    max-width: 650px;
    width: 100%;
    max-height: 100vh;
    display: flex;
    justify-content: space-around;
    align-items: center;
    overflow: auto;
    background-color: #FFF;
    border-radius: 2px;
    padding: 20px 30px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
  }
  .profile_content{
  }
  .profile_content__name{
    width: 100%;
    font-weight: 500;
    color: rgba(74, 74, 74, 0.81);
  }
  .profile_content__job{
    font-size: 14px;
    color: #9b9b9b;
  }
  .profile_content__contact{
    margin: 10px 0;
  }
  .profile_content__contact p{
    display: flex;
    align-items: center;
    margin-left: 10px;
    line-height: 1.5;
  }
  .profile_content__contact p i{
    margin-right: 5px;
    font-size: 19px;
  }
  .actions{
    display: flex;
  }
  .actions .profile_content__action:first-child{
    border: 1px solid #5ca840;
    color: #5ca840;
  }
  .profile_content__action{
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border-style: none;
    color: #898989;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    outline: none;
    border: 1px solid #9b9b9b;
    border-radius: 6px;
    padding: 5px 20px;
    margin-right: 15px;
    transition: .3s;
  }
  .profile_photo figure{
    width: 280px;
    height: 280px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    overflow: hidden;
  }
  .profile_photo figure img{
    width: 100%;
  }
  @media(max-width: 670px){
    .funcionariosProfile{
      width: 100%;
      flex-direction: column-reverse;
      overflow: hidden;
    }
  }
</style>
