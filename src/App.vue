<template>
  <div id="app">
    <dialogUrlExterna/>
    <div class="comodin" v-show="$route.name != 'microSitios' && $route.name != 'Convocatorias' && $route.name != 'Transparencia'"></div>
    <menu-superior v-show="$route.name != 'microSitios' && $route.name != 'Convocatorias' && $route.name != 'Transparencia'"></menu-superior>
    <menu-lateral v-show="$route.name != 'microSitios' && $route.name != 'Convocatorias' && $route.name != 'Transparencia'"></menu-lateral>
    <router-view class="views"></router-view>
    <div class="comodin" v-show="$route.name != 'microSitios' && $route.name != 'Convocatorias' && $route.name != 'Transparencia'"></div>
    <menu-mobile></menu-mobile>
    <footer-bottom v-show="$route.name != 'Chat' && $route.name != 'microSitios' && $route.name != 'Convocatorias' && $route.name != 'Transparencia' ">
    </footer-bottom>
  </div>
</template>

<script>
import dialogUrlExterna from './components/UIComponents/dialogUrlExterna.vue'
import menuSuperior from './components/menu_superior.vue'
import menuLateral from './components/menu_lateral.vue'
import footerBottom from './components/footer.vue'
import menuMobile from './components/menu_mobile.vue'

export default {
  components: { dialogUrlExterna, menuLateral, menuSuperior, footerBottom, menuMobile },
  name: 'app',
  mounted() {
    var myElement = document.getElementById('app');
    // create a simple instance
    // by default, it only adds horizontal recognizers
    var mc = new Hammer(myElement);
    // listen to events...
    mc.on("swipeleft swiperight", (ev) => {
        this.toggleMenuLateral(ev.type);
    });
  },
  methods: {
    toggleMenuLateral(type){
      if(type == 'swiperight'){
        document.getElementById('menuLateral').classList.add('openMenu');
      }else{
        document.getElementById('menuLateral').classList.remove('openMenu');
      }
    }
  }
}
</script>

<style>
@font-face {
    font-family: AvenirNext;
    src: url('./assets/AvenirNextLTPro-Regular.woff');
}
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;
  font-family: 'AvenirNext', sans-serif;
}
#app{
  display: flex;
  flex-wrap: wrap;
  background-color: #fafbfc;
  overflow-x: hidden;
}
.comodin{
  width: 100%;
  height: 60px;
}
.views{
  width: calc(100% - 180px);
  min-height: calc(100vh - 60px);
}
.upload-demo, .upload-demo > .el-upload, .upload-demo .el-upload-dragger{
  width: 100%;
}
.el-input-group__prepend{
  position: relative;
  overflow: hidden;
}
.el-collapse-item.row1 > .el-collapse-item__header{
  background-color: rgb(196, 217, 236);
  background-color: #dfe6ec;
}
.el-collapse-item.row2 > .el-collapse-item__header{
  background-color: rgb(196, 217, 236);
  background-color: #dfe6ec;
}
.el-collapse-item.row3 > .el-collapse-item__header{
  background-color: rgb(196, 217, 236);
  background-color: #dfe6ec;
}
.secciones .el-collapse-item .el-collapse-item__header{
  display: flex;
  align-items: center;
  line-height: initial
}
@media(max-width: 800px){
  .views{
    width: 100%;
  }
}
</style>
