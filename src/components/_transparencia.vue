<template lang="html">
  <section id="microSitios" v-if="loadData">
    <div class="micrositios_settings">
      <div class="micrositios_settings_header">
        <router-link to="/"><i class="material-icons">keyboard_backspace</i> Volver a la intranet</router-link>
      </div>
      <el-tabs type="card" v-model="selectTab">
        <el-tab-pane name="1">
          <span slot="label"><i class="el-icon-edit"></i></span>
          <ajustes-editar></ajustes-editar>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div id="previewResponse" class="micrositios">
      <preview :data="micrositioData"></preview>
    </div>
    <div class="micrositios_buttons_responsive">
      <i class="fa fa-mobile" aria-hidden="true" v-on:click="modeMobile"></i>
      <i class="fa fa-desktop" aria-hidden="true" v-on:click="modeDesktop"></i>
    </div>
  </section>
</template>

<script>
import AjustesEditar from './transparencia_ajustes_editar.vue';
import Preview from './transparencia_preview.vue';
import axios from 'axios'
export default {
  components: { AjustesEditar, Preview },
  created(){
    if(this.$store.state.micrositiosData.length != 0){
      this.getData();
    }
  },
  data(){
    return{
      selectTab: '1',
      mode: true,
      loadData: false,
    }
  },
  watch: {
    micrositioData(){
      this.getData();
    }
  },
  computed: {
    micrositioData(){
      return this.$store.state.micrositiosData.filter(micrositio => micrositio.id == 56)[0];
    }
  },
  methods: {
    getData(){
      this.loadData = false;
      axios.get(`${this.$urlHttp}/api/secciones/56`).then((response) => {
        this.$store.state.micrositioSecciones = response.data.data;
        this.micrositioData.secciones = response.data.data;
        this.$store.state.micrositioEdit = this.micrositioData;
        this.loadData = true;
      })
    },
    modeMobile(){
      this.mode = true;
      document.getElementById('previewResponse').classList.add('previewMobile')
    },
    modeDesktop(){
      this.mode = false;
      document.getElementById('previewResponse').classList.remove('previewMobile')
    }
  }
}
</script>

<style scoped>
  #microSitios{
    width: 100%;
    display: flex;
    z-index: 99;
  }
  .micrositios_settings{
    position: fixed;
    width: 350px;
    height: 100vh;
    background-image: linear-gradient(to bottom, #f8f8f8, rgba(255, 252, 252, 0.99), #fffcfc);
    z-index: 3;
    box-shadow: 0 0 5px 0px rgba(0,0,0,0.2);
    padding: 5px;
  }
  .micrositios_settings::-webkit-scrollbar{
    width: 8px;
  	background-color: transparent;
  }
  .micrositios_settings::-webkit-scrollbar-thumb{
    border-radius: 5px;
  	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.1);
  	background-color: #ddd;
  }
  .micrositios_settings_header{
    padding: 10px;
  }
  .micrositios_settings_header a{
    display: flex;
    align-items: center;
  }
  .micrositios{
    width: calc(100% - 350px);
    height: 100vh;
    margin-left: 350px;
  }
  .micrositios_list{
    height: calc(100vh - 151px);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    list-style: none;
    overflow: scroll;
  }
  .micrositios_list_item{
    position: relative;
    width: 90%;
    height: 80px;
    display: flex;
    flex: none;
    justify-content: center;
    align-items: center;
    background-color: #FFF;
    box-shadow:  0 0 6px 0 rgba(0,0,0,0.08);
    border-radius: 5px;
    margin: 5px;
    cursor: pointer;
    overflow: hidden;
    transition: .3s;
  }
  .micrositios_list_item:hover{
    transform: scale(0.97);
  }
  .micrositios_list_item_setting{
    position: absolute;
    bottom: -100%;
    left: 5px;
    transition: all .5s;
  }
  .micrositios_list_item:hover .micrositios_list_item_setting{
    bottom: 5px;
  }
  .micrositios_list_item p{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0,0,0,0.55);
    color: #FFF;
    text-align: center;
    pointer-events: none;
  }
  .micrositios_buttons_responsive{
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
  }
  .micrositios_buttons_responsive i:first-child{
    font-size: 32px;
  }
  .micrositios_buttons_responsive i{
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-image: linear-gradient(to bottom, #f8f8f8, rgba(255, 252, 252, 0.99), #fffcfc);
    color: #393939;
    font-size: 22px;
    margin: 5px;
    box-shadow: 1px 1px 10px 0 rgba(0,0,0,0.3);
    cursor: pointer;
  }
  .previewMobile{
    display: flex;
    justify-content: center;
    align-items: center;
    transition: .3s;
  }
  .previewMobile .micrositio{
    width: 412px;
    height: 732px;
    transition: .3s;
  }
  .micrositio_info{
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .micrositio_info img{
    max-width: 1000px;
    width: 95%;
  }
</style>
