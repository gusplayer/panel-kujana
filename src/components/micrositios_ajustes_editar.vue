<template>
  <div class="micrositio_setting_edit">
    <template v-if="!seccionSelected">
      <cropper-modal :urlPhotoCropper="urlPhotoCropper" v-on:closeCropper="closeCropper" v-on:createBanner="createBanner">
      </cropper-modal>
      <h2 class="micrositio_setting_title">{{ micrositioEdit.titulo }}</h2>
      <div class="micrositio_setting_edit_publicado">
        <p>Publicar micrositio</p>
        <el-switch v-model="micrositioEdit.estado" on-text="" off-text="">
        </el-switch>
      </div>
      <el-select v-model="micrositioEdit.menu" placeholder="Selecciona a donde pertenece">
        <el-option v-for="item in options" :key="item.id" :label="item.titulo" :value="item.id">
        </el-option>
      </el-select>
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="Información general" name="1">
          <el-input placeholder="Url redirección" v-model="micrositioEdit.url_redireccion"></el-input>
          <el-input placeholder="Titulo" v-model="micrositioEdit.titulo"></el-input>
          <el-input placeholder="Correo electronico" v-model="micrositioEdit.email"></el-input>
          <el-input placeholder="Direccion" v-model="micrositioEdit.direccion"></el-input>
          <el-input placeholder="Telefono" v-model="micrositioEdit.telefono"></el-input>
        </el-collapse-item>
        <el-collapse-item title="Redes sociales" name="2">
          <el-input placeholder="Facebook" v-model="micrositioEdit.facebook">
            <template slot="prepend">
              <i class="fa fa-facebook-official" aria-hidden="true"></i>
            </template>
          </el-input>
          <el-input placeholder="Twitter" v-model="micrositioEdit.twitter">
            <template slot="prepend">
              <i class="fa fa-twitter" aria-hidden="true"></i>
            </template>
          </el-input>
        </el-collapse-item>
        <el-collapse-item title="Texto" name="3">
          <p>Tienes que copiar el codigo que generes en el siguiente editor y pegarlo en el input. </p>
          <a href="https://html-online.com/editor/" target="_blank">Editor de Texto</a>
          <el-input type="textarea" :rows="5" placeholder="" v-model="micrositioEdit.texto">
          </el-input>
        </el-collapse-item>
        <el-collapse-item title="Banners" name="4">
          <div :class="`micrositios_settings_newsite_banners_item banner${banner.id}`" :id="`bannerMicrositio${banner.id}`" v-for="(banner, index) in micrositioEdit.banners" :key="index">
            <img :src="`${$urlHttp}/micrositio_banners/${banner.banner}`">
            <div class="micrositios_settings_newsite_banners_item_options">
              <el-button-group>
                <el-button type="danger" icon="delete" v-on:click="deleteBanner(banner.id, index)"> Eliminar</el-button>
              </el-button-group>
            </div>
          </div>
          <div class="micrositios_settings_newsite_banners_item create">
            <el-button type="primary">Subir nuevo banner<input type="file" v-on:change="uploadBanner"></el-button>
          </div>
        </el-collapse-item>
        <el-collapse-item title="Iframes" name="5">
          <div class="iframe_item" v-for="(iframe, index) in micrositioEdit.iframes" :key="index">
            <div v-html="iframe.iframe"></div>
            <div class="iframe_item_ajustes">
              <el-button type="danger" icon="delete" v-on:click="deleteIframe(iframe.id, index)">Eliminar</el-button>
            </div>
          </div>
          <el-input type="textarea" :rows="4" placeholder="Agregue un iframe" v-model="iframe">
          </el-input>
          <el-button-group>
            <el-button type="primary" icon="circle-close" size="small"></el-button>
            <el-button type="primary" v-on:click="createIframe" icon="upload2" size="small"></el-button>
          </el-button-group>
        </el-collapse-item>
        <el-collapse-item title="Galeria" name="6">
          <div class="galeria">
            <div class="uploaderPhoto">
              <input type="file" v-on:change="createImage">
              <i class="material-icons">add</i>
            </div>
            <div class="galeria_item" v-for="(imagen, index) in micrositioEdit.galeria">
              <img :src="`${$urlHttp}/micrositio_galeria/${imagen.imagen}`">
              <span class="delete" v-on:click="deleteImage(imagen.id, index)">Eliminar</span>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="Urls externas" name="7">
          <div class="url_externa_list">
            <div class="url_externa" v-for="(url, index) in micrositioEdit.url_externa">
              <a :href="url.url" target="_blank">
                <img v-show="url.imagen" :src="`${$urlHttp}/micrositio_img_urls/${url.imagen}`" alt="">
              </a>
              <div class="column">
                <p>{{ url.titulo }}</p>
                <el-button-group>
                  <el-button type="primary" size="small" v-on:click="beforeUpdateUrlExterna(url, index)" icon="edit"></el-button>
                  <el-button type="primary" size="small" v-on:click="deleteUrlExterna(url.id, index)" icon="delete"></el-button>
                </el-button-group>
              </div>
            </div>
          </div>
          <div class="">
            <el-input placeholder="Url externa" v-model="newUrlExterna.url">
              <template slot="prepend">
                <i class="fa fa-link" aria-hidden="true"></i>
              </template>
            </el-input>
            <div class="row">
              <el-input placeholder="Texto del enlace" v-model="newUrlExterna.texto"></el-input>
              <el-button type="primary"><input type="file" class="url_choose_file" v-on:change="uploadPhotoUrlExterna">
                <i class="fa fa-camera-retro" style="cursor: pointer;" aria-hidden="true"></i> Subir imagen</i>
              </el-button>
            </div>
            <el-button-group>
              <el-button type="primary" size="small" v-on:click="createUrlExterna" icon="circle-check"></el-button>
              <el-button type="primary" size="small" icon="circle-cross"></el-button>
            </el-button-group>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="micrositio_setting_edit_actions">
        <div class="row">
          <p>Activar menu lateral</p>
          <el-radio-group v-model="menuLateral" size="small">
            <el-radio-button label="1">Sí</el-radio-button>
            <el-radio-button label="0">No</el-radio-button>
          </el-radio-group>
        </div>
        <el-button type="primary" v-on:click="editMicrositio">Guardar Informacion</el-button>
      </div>
    </template>
    <template>
      <div class="secciones">
        <div class="secciones_back">
          <el-button type="primary" v-if="seccionSelected" v-on:click="backHistory">Atras</el-button>
          <h1 class="subtitle" v-if="seccionSelected">{{ seccionSelected.titulo }}</h1>
        </div>
        <ajustes-secciones v-if="seccionSelected" :currentSeccion="seccionSelected"></ajustes-secciones>
        <el-button type="danger" icon="delete" v-if="seccionSelected" @click="beforeDelete">Eliminar esta seccion</el-button>
        <div class="micrositio_setting_header">
          <el-input placeholder="Crear nueva sección" v-model="titulo"></el-input>
          <el-button type="primary" icon="plus" v-on:click="createSeccion()"></el-button>
        </div>
        <ul class="secciones_list">
          <li v-for="(item, index) in currentSecciones" class="secciones_item" v-on:click="updateSettingSeccion(item)">
            <p>{{ item.titulo }}</p>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
import axios from 'axios';
import CropperModal from './cropper.vue';
import AjustesSecciones from './micrositios_ajustes_secciones.vue';
export default {
  components: { CropperModal, AjustesSecciones },
  mounted() {
    setTimeout(() => {
      for (let iframe of document.querySelectorAll('iframe')) {
        iframe.style.maxWidth = '280px';
        iframe.style.maxHeight = '140px';
      }
    }, 1000);
    this.currentSecciones = this.micrositioEdit.secciones.filter(
      seccion => seccion.parent_id == '0'
    );
  },
  data() {
    return {
      dialogUrlExterna: false,
      urlPhotoCropper: '',
      activeName: '0',
      activeName2: '',
      cropper: null,
      iframe: '',
      newUrlExterna: {
        url: '',
        texto: '',
        imagen: null
      },
      currentSeccion: {},
      seccionSelected: null,
      history: [],
      titulo: '',
      options: [
        {
          id: '1',
          titulo: 'Quienes somos'
        },
        {
          id: '2',
          titulo: 'Experiencia'
        },
        {
          id: '3',
          titulo: 'Noticias'
        },
        {
          id: '4',
          titulo: 'Contactanos'
        },
        {
          id: '8',
          titulo: 'No visible'
        }
      ],
      micrositioText: '',
      menuLateral: '0',
      currentSecciones: []
    };
  },
  watch: {
    micrositioEdit(value) {
      this.filterCurrentSecciones(0);
      this.seccionSelected = null;
    },
    seccionSelected(value) {
      if (value) {
        this.filterCurrentSecciones(value.id);
      }
    }
  },
  computed: {
    micrositioSecciones() {
      return this.$store.state.micrositioSecciones;
    },
    micrositioEdit() {
      return this.$store.state.micrositioEdit;
    }
  },
  methods: {
    filterCurrentSecciones(id) {
      this.currentSecciones = this.micrositioEdit.secciones.filter(
        seccion => seccion.parent_id == id
      );
    },
    updateSettingSeccion(item) {
      this.seccionSelected = item;
      this.history.push(item.id);
      this.toggleAnimation();
    },
    backHistory() {
      this.toggleAnimation();
      this.history.pop();
      if (this.history.length) {
        this.seccionSelected = this.micrositioEdit.secciones.filter(
          seccion => seccion.id == this.history[this.history.length - 1]
        )[0];
      } else {
        this.seccionSelected = null;
        this.currentSecciones = this.micrositioEdit.secciones.filter(
          seccion => seccion.parent_id == '0'
        );
      }
    },
    toggleAnimation() {
      document.querySelector('.secciones').style.opacity = '0';
      setTimeout(() => {
        document.querySelector('.secciones').style.opacity = '1';
      }, 250);
    },
    editMicrositio() {
      let json = {
        url_redireccion: this.micrositioEdit.url_redireccion,
        titulo: this.micrositioEdit.titulo,
        estado: this.micrositioEdit.estado == true ? 1 : 0,
        menu: this.micrositioEdit.menu,
        menu_lateral: this.menuLateral,
        email: this.micrositioEdit.email,
        telefono: this.micrositioEdit.telefono,
        direccion: this.micrositioEdit.direccion,
        facebook: this.micrositioEdit.facebook,
        youtube: this.micrositioEdit.youtube,
        twitter: this.micrositioEdit.twitter,
        texto: this.micrositioEdit.texto
      };
      axios
        .put(`${this.$urlHttp}/api/micrositio/${this.micrositioEdit.id}`, json)
        .then(response => {
          this.$message.success('El micrositio se edito correctamente');
          this.reloadIframe();
        })
        .catch(error => {
          this.$message.error('El micrositio no se pudo editar');
        });
    },
    createSeccion() {
      let params = {
        titulo: this.titulo,
        padre: this.seccionSelected ? this.seccionSelected.id : 0,
        id_micrositio: this.micrositioEdit.id
      };
      axios.post(`${this.$urlHttp}/api/secciones`, params).then(response => {
        response.data.data.textos = [];
        this.$store.state.micrositioEdit.secciones.push(response.data.data);
        this.filterCurrentSecciones(this.seccionSelected.id);
        this.titulo = '';
        this.reloadIframe();
      });
    },
    beforeDelete() {
      this.$confirm(
        `Estas seguro de eliminar esta seccion con el nombre de ${
          this.seccionSelected.titulo
        }?`,
        'Warning',
        {
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar',
          type: 'warning'
        }
      )
        .then(() => {
          this.deleteSeccion();
        })
        .catch(() => {});
    },
    deleteSeccion() {
      const id = this.seccionSelected.id;
      axios.delete(`${this.$urlHttp}/api/secciones/${id}`).then(response => {
        this.$message.success('Se elimino correctamente la seccion');
        let position;
        this.$store.state.micrositioSecciones.filter((seccion, index) => {
          if (seccion.id == id) {
            position = index;
          }
        });
        this.$store.state.micrositioSecciones.splice(position, 1);
        this.backHistory();
        this.reloadIframe();
      });
    },
    uploadBanner(files) {
      let size = files.target.files.length;
      const isLt10M = files.target.files[0].size / 1024 / 1024 < 10;
      if (isLt10M) {
        this.loadingCreateBanner = false;
        this.urlPhotoCropper = URL.createObjectURL(files.target.files[0]);
        setTimeout(() => {
          if (this.cropper) {
            this.cropper.destroy();
          }
          var image = document.getElementById('image');
          this.cropper = new Cropper(image, {
            aspectRatio: 12 / 4,
            viewMode: 1,
            zoomable: false
          });
        }, 100);
      } else {
        this.$message.error('El archivo debe pesar menos de 10 Megabyte');
      }
    },
    closeCropper() {
      this.cropper.destroy();
      this.urlPhotoCropper = '';
    },
    createText() {},
    deleteText() {},
    createBanner() {
      this.cropper.getCroppedCanvas().toBlob(blob => {
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        let newFile = new FormData();
        newFile.append('banner', blob);
        newFile.append('url', '');
        newFile.append('id_micrositio', this.micrositioEdit.id);
        axios
          .post(`${this.$urlHttp}/api/micrositio/banners`, newFile, config)
          .then(response => {
            this.$store.state.micrositioEdit.banners.push(response.data.data);
            this.urlPhotoCropper = '';
            this.cropper.destroy();
            this.reloadIframe();
            this.$store.state.loadingCropper = false;
          })
          .catch(error => {
            this.$message.error(
              'El archivo no subio al servidor, vuelve a intentarlo'
            );
            this.urlPhotoCropper = '';
            this.cropper.destroy();
            this.$store.state.loadingCropper = false;
          });
      });
    },
    deleteBanner(id, index) {
      axios
        .delete(`${this.$urlHttp}/api/micrositio/banners/${id}`)
        .then(response => {
          this.$store.state.micrositioEdit.banners.splice(index, 1);
          this.reloadIframe();
        });
    },
    createIframe() {
      if (this.iframe != '') {
        let json = {
          iframe: this.iframe,
          id_micrositio: this.micrositioEdit.id
        };
        axios
          .post(`${this.$urlHttp}/api/micrositio/iframes`, json)
          .then(response => {
            this.micrositioEdit.iframes.push(response.data.data);
            this.iframe = '';
            setTimeout(() => {
              for (let iframe of document.querySelectorAll('iframe')) {
                iframe.style.maxWidth = '300px';
                iframe.style.maxHeight = '160px';
              }
            }, 1000);
            this.reloadIframe();
          });
      } else {
        this.$message.error('Debe incluir un iframe');
      }
    },
    deleteIframe(id, index) {
      axios
        .delete(`${this.$urlHttp}/api/micrositio/iframes/${id}`)
        .then(response => {
          this.micrositioEdit.iframes.splice(index, 1);
          this.reloadIframe();
        });
    },
    createImage(e) {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      let newImage = new FormData();

      newImage.append('imagen', e.target.files[0]);
      newImage.append('id_micrositio', this.micrositioEdit.id);

      axios
        .post(`${this.$urlHttp}/api/micrositio/galeria`, newImage, config)
        .then(response => {
          this.$store.state.micrositioEdit.galeria.unshift(response.data.data);
          this.reloadIframe();
        })
        .catch(error => {
          this.$message.error('La foto no se creo en el servidor');
        });
    },
    deleteImage(id, index) {
      axios
        .delete(`${this.$urlHttp}/api/micrositio/galeria/${id}`)
        .then(response => {
          this.$store.state.micrositioEdit.galeria.splice(index, 1);
          this.reloadIframe();
        })
        .catch(error => {
          this.$message.error('La foto no se elimino en el servidor');
        });
    },
    uploadPhotoUrlExterna(event) {
      this.newUrlExterna.imagen = event.target.files[0];
    },
    createUrlExterna() {
      if (
        this.newUrlExterna.url.includes('http') ||
        this.newUrlExterna.url == '#'
      ) {
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        let params = new FormData();
        params.append('url', this.newUrlExterna.url);
        params.append('titulo', this.newUrlExterna.texto);
        if (this.newUrlExterna.imagen) {
          params.append('imagen', this.newUrlExterna.imagen);
        }
        params.append('id_micrositio', this.micrositioEdit.id);
        axios
          .post(`${this.$urlHttp}/api/micrositio/url`, params, config)
          .then(response => {
            this.$store.state.micrositioEdit.url_externa.push(
              response.data.data
            );
            this.newUrlExterna.url = '';
            this.newUrlExterna.texto = '';
            this.reloadIframe();
          })
          .catch(error => {
            this.$message.error('La url no se creo en el servidor');
          });
      } else {
        this.$message.error('La url no es correcta');
      }
    },
    beforeUpdateUrlExterna(url, index) {
      this.$store.state.dataUrlExterna = {
        data: url,
        index
      };
      this.$store.state.dialogUrlExterna = true;
    },
    deleteUrlExterna(id, index) {
      axios
        .delete(`${this.$urlHttp}/api/micrositio/url/${id}`)
        .then(response => {
          this.$store.state.micrositioEdit.url_externa.splice(index, 1);
          this.reloadIframe();
        });
    },
    setTitle(value) {
      if (value) {
        value = value.toLowerCase();
        return value.replace(/^\w|\s\w/g, l => l.toUpperCase());
      }
    },
    seccionIdToText(value) {
      if (value) {
        return this.micrositioEdit.secciones.filter(
          seccion => seccion.id == value
        )[0].titulo;
      }
    },
    reloadIframe() {
      document.getElementById(
        'iframePreview'
      ).src = `https://meta.gov.co/micrositio/${this.micrositioEdit.id}`;
    }
  }
};
</script>

<style scoped>
.uploaderPhoto {
  position: relative;
  width: 90px;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin: 3px;
}
.uploaderPhoto input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
.uploaderPhoto i {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border: 1px dashed #d9d9d9;
  font-size: 40px;
}
.uploaderPhoto img {
  width: 100%;
}
.el-input,
.el-textarea,
.el-select {
  margin: 5px 0;
}
.el-select {
  width: calc(100% - 10px);
  margin-right: 5px;
}
.micrositio_setting_edit {
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
}
.micrositio_setting_edit::-webkit-scrollbar {
  width: 8px;
  background-color: transparent;
}
.micrositio_setting_edit::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: #ddd;
}
.micrositio_setting_title {
  font-size: 19px;
  margin: 10px 0 20px 0;
}
.micrositio_setting_edit_publicado {
  width: 100%;
  flex: none;
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}
.micrositios_settings_newsite_banners_item {
  position: relative;
  overflow: hidden;
}
.micrositios_settings_newsite_banners_item > img {
  width: 100%;
  max-height: 100px;
  background-color: #fff;
  border: 5px solid #fff;
  box-shadow: 0 2px 4px 0 rgba(155, 155, 155, 0.48);
  margin: 5px 0;
}
.micrositios_settings_newsite_banners_item_options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;
}
.micrositios_settings_newsite_banners_item:hover
  .micrositios_settings_newsite_banners_item_options {
  top: 0;
  opacity: 1;
  visibility: visible;
}
.micrositios_settings_newsite_banners_item.create {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border: 5px solid #fff;
  box-shadow: 0 2px 4px 0 rgba(155, 155, 155, 0.48);
  margin: 5px 0;
}
.micrositios_settings_newsite_banners_item.create .el-button {
  position: relative;
}
.micrositios_settings_newsite_banners_item.create input[type='file'] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
.iframe_item {
  position: relative;
  width: 290px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin: 10px auto;
}
.iframe_item_ajustes {
  position: absolute;
  bottom: -50px;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 5;
  transition: 0.3s;
}
.iframe_item:hover .iframe_item_ajustes {
  bottom: 0;
}
.galeria {
  display: flex;
  flex-wrap: wrap;
}
.galeria_item {
  position: relative;
  width: 90px;
  height: 90px;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
  margin: 3px;
}
.galeria_item img {
  max-width: 100%;
  max-height: 100%;
}
.galeria_item .delete {
  position: absolute;
  top: 100%;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
}
.galeria_item:hover .delete {
  top: 0;
}
.url_externa_list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.url_externa {
  width: 100%;
  display: flex;
  align-items: center;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
  padding: 10px;
  margin: 5px;
}
.url_externa img {
  max-width: 100px;
  margin-right: 5px;
}
.row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.row .el-input {
  width: initial;
  margin-right: 5px !important;
}
.row .el-button {
  position: relative;
}
.row .el-button-group {
  flex: none;
}
.url_choose_file {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  opacity: 0;
}
.micrositio_setting_edit_actions {
  flex: none;
  width: 98%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
}
.micrositio_setting_edit_actions * {
  flex: none;
}
.secciones {
  flex: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  transition: 0.3s;
}
.secciones > .el-button {
  margin: 10px 5px;
  flex: none;
}
.micrositio_setting_header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0 20px 0;
}
.micrositio_setting_header .actionGoBack {
  border-style: none;
  padding: 10px 20px;
  cursor: pointer;
  outline: none;
  background-color: #dfe6ec;
}
.micrositio_setting_header h2 {
  line-height: 1;
  font-size: 16px;
  font-weight: 700;
  color: #1f2d3d;
}
.micrositio_setting_header .el-input {
  margin-right: 5px;
}
.secciones .subtitle {
  line-height: 1;
  font-size: 15px;
  font-weight: 700;
  text-align: right;
  color: #1f2d3d;
}
.seccion_list {
  width: 100%;
  border: 1px solid #dfe6ec;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  list-style: none;
}
.seccion_item {
  width: 100%;
  border-bottom: 1px solid #dfe6ec;
  font-size: 13px;
  color: #48576a;
  padding: 10px;
  cursor: pointer;
  border-left: 3px solid #4192ec;
  transition: 0.15s;
}
.seccion_item:last-child {
  border-style: none;
  border-left: 3px solid #4192ec;
}
.seccion_item:hover {
  background-color: #dfe6ec;
  border-left: 0px solid #4192ec;
}
.secciones_setting_delete {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0;
}
.el-collapse {
  width: 98%;
}
.secciones_back {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-right: 10px;
}
.secciones_list {
  width: 100%;
  list-style: none;
}
.secciones_item {
  width: 100%;
  border-bottom: 1px solid #cfd6dc;
  background-color: #dfe4e8;
  padding: 10px 0;
  cursor: pointer;
}
.secciones_item:first-child {
  border-top: 1px solid #dfe4e8;
}
.secciones_item:hover {
  border-right: 4px solid #20a0ff;
}
.secciones_item p {
  font-size: 15px;
  margin: 0 5px;
}
.slide-enter-active {
  transition: all 0.3s ease;
}
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter, .slide-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(350px);
}
</style>
