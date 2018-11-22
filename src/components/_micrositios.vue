<template lang="html">
  <section id="microSitios">
    <div class="micrositios_settings">
      <div class="micrositios_settings_header">
        <router-link to="/"><i class="material-icons">keyboard_backspace</i> Volver al inicio</router-link>
      </div>
      <el-tabs type="card" v-model="selectTab">
        <el-tab-pane name="1" v-if="micrositioEdit">
          <span slot="label"><i class="el-icon-edit"></i></span>
          <ajustes-editar></ajustes-editar>
        </el-tab-pane>
        <el-tab-pane name="2" label="Micrositios">
          <h3>Escoge un micrositio</h3>
          <el-input
            placeholder="Buscar micrositio"
            icon="search"
            v-model="searchMicrositio">
          </el-input>
          <ul class="micrositios_list">
            <li v-for="(micrositio, index) in filteredMicrositios" class="micrositios_list_item" :style="micrositioItem(micrositio)" v-on:click="dispatchEditable($event, micrositio)">
              <p>{{ micrositio.id }}. {{ micrositio.titulo }}</p>
              <div class="micrositios_list_item_setting">
                <el-button type="danger" size="small" icon="delete" class="deleteMicrositio" v-on:click="beforeDeleteMicrositio(micrositio.id, index)">Eliminar</el-button>
              </div>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane name="3" label="Nuevo micrositio">
          <ajustes-crear v-on:createMicrositio="selectTab = '1'"></ajustes-crear>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div id="previewResponse" class="micrositios">
      <preview v-if="selectTab == '1'" :data="micrositioEdit"></preview>
      <div class="micrositio_info"  v-if="selectTab != '1'">
        <img src="../assets/select_micrositios.png" alt="">
      </div>
    </div>
    <div class="micrositios_buttons_responsive">
      <i class="fa fa-mobile" aria-hidden="true" v-on:click="modeMobile"></i>
      <i class="fa fa-desktop" aria-hidden="true" v-on:click="modeDesktop"></i>
    </div>
  </section>
</template>

<script>
import AjustesEditar from './micrositios_ajustes_editar.vue';
import AjustesCrear from './micrositios_ajustes_crear.vue';
import Preview from './micrositios_preview.vue';
import axios from 'axios';
export default {
  components: { AjustesEditar, AjustesCrear, Preview },
  created() {
    this.filteredMicrositios = this.$store.state.micrositiosData;
  },
  data() {
    return {
      selectTab: '2',
      mode: true,
      searchMicrositio: '',
      filteredMicrositios: []
    };
  },
  watch: {
    micrositios(value) {
      this.filteredMicrositios = value;
    },
    searchMicrositio(value) {
      this.filteredMicrositios = this.micrositios.filter(micrositio =>
        micrositio.titulo.toLowerCase().includes(value.toLowerCase())
      );
    }
  },
  computed: {
    micrositioNew() {
      return this.$store.state.micrositioNew;
    },
    micrositioEdit() {
      return this.$store.state.micrositioEdit;
    },
    micrositios() {
      return this.$store.state.micrositiosData;
    }
  },
  methods: {
    micrositioItem(micrositio) {
      if (micrositio.banners.length != 0) {
        let bannerMainUrl = `${this.$urlHttp}/micrositio_banners/${
          micrositio.banners[0].banner
        }`;
        return `background-image: url('${bannerMainUrl}'); background-size: cover;`;
      }
    },
    dispatchEditable(e, micrositio) {
      if (e.target.className == 'micrositios_list_item') {
        axios
          .get(`${this.$urlHttp}/api/secciones/${micrositio.id}`)
          .then(response => {
            this.$store.state.micrositioSecciones = response.data.data;
            micrositio.secciones = response.data.data;
            this.$store.state.micrositioEdit = micrositio;
          });
        this.selectTab = '1';
      }
    },
    beforeDeleteMicrositio(id, index) {
      this.$confirm('Deseas eliminar este micrositio', 'Warning', {
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      })
        .then(() => {
          this.deleteMicrositio(id, index);
        })
        .catch(() => {});
    },
    deleteMicrositio(id, index) {
      axios.delete(`${this.$urlHttp}/api/micrositio/${id}`).then(response => {
        this.$store.state.micrositiosData.splice(index, 1);
      });
    },
    modeMobile() {
      this.mode = true;
      document.getElementById('previewResponse').classList.add('previewMobile');
    },
    modeDesktop() {
      this.mode = false;
      document
        .getElementById('previewResponse')
        .classList.remove('previewMobile');
    }
  }
};
</script>

<style scoped>
#microSitios {
  width: 100%;
  display: flex;
  z-index: 99;
}
.micrositios_settings {
  position: fixed;
  width: 350px;
  height: 100vh;
  background-image: linear-gradient(
    to bottom,
    #f8f8f8,
    rgba(255, 252, 252, 0.99),
    #fffcfc
  );
  z-index: 3;
  box-shadow: 0 0 5px 0px rgba(0, 0, 0, 0.2);
  padding: 5px;
}
.micrositios_settings::-webkit-scrollbar {
  width: 8px;
  background-color: transparent;
}
.micrositios_settings::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: #ddd;
}
.micrositios_settings_header {
  padding: 10px;
}
.micrositios_settings_header a {
  display: flex;
  align-items: center;
}
.micrositios {
  width: calc(100% - 350px);
  height: 100vh;
  margin-left: 350px;
}
.micrositios_list {
  height: calc(100vh - 151px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  list-style: none;
  overflow: scroll;
}
.micrositios_list_item {
  position: relative;
  width: 90%;
  height: 80px;
  display: flex;
  flex: none;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.08);
  border-radius: 5px;
  margin: 5px;
  cursor: pointer;
  overflow: hidden;
  transition: 0.3s;
}
.micrositios_list_item:hover {
  transform: scale(0.97);
}
.micrositios_list_item_setting {
  position: absolute;
  bottom: -100%;
  left: 5px;
  transition: all 0.5s;
}
.micrositios_list_item:hover .micrositios_list_item_setting {
  bottom: 5px;
}
.micrositios_list_item p {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.55);
  color: #fff;
  text-align: center;
  pointer-events: none;
}
.micrositios_buttons_responsive {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
}
.micrositios_buttons_responsive i:first-child {
  font-size: 32px;
}
.micrositios_buttons_responsive i {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-image: linear-gradient(
    to bottom,
    #f8f8f8,
    rgba(255, 252, 252, 0.99),
    #fffcfc
  );
  color: #393939;
  font-size: 22px;
  margin: 5px;
  box-shadow: 1px 1px 10px 0 rgba(0, 0, 0, 0.3);
  cursor: pointer;
}
.previewMobile {
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s;
}
.previewMobile .micrositio {
  width: 412px;
  height: 732px;
  transition: 0.3s;
}
.micrositio_info {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.micrositio_info img {
  max-width: 1000px;
  width: 95%;
}
</style>
