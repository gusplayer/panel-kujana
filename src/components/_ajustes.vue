<template>
  <div id="ajustes">
    <cropper :urlPhotoCropper="urlPhotoCropper" v-on:closeCropper="closeCropper" v-on:createBanner="createBanner"></cropper>
    <div class="ajustes">
      <h1 class="ajustes_title">Ajustes</h1>
      <!-- <div class="ajustes_dependencias">
        <div class="ajustes_dependencias_selected">
          <p>Selecciona la dependencia que quieres modificar</p><br>
          <el-select v-model="dependenciaIdSelected" clearable placeholder="Seleccionar dependencia">
            <el-option
            v-for="item in dependencias"
            :key="item.idDependencia"
            :label="item.nombreDependencia"
            :value="item.idDependencia">
            </el-option>
          </el-select>
        </div>
        <div class="ajustes_dependencias_edit" v-if="dependenciaIdSelected">
          <p>Editar informacion seleccionada</p><br>
          <div>
            <el-input placeholder="Edita tu informacion" v-model="dependenciaSelected.nombreDependencia"></el-input>
            <el-button type="success" v-on:click="editDependencia">Guardar</el-button>
            <el-button type="danger" icon="delete" v-on:click="deleteDependencia">Eliminar</el-button>
            <el-button type="secundary" v-on:click="dependenciaIdSelected = ''">cancelar</el-button>
          </div>
        </div>
        <div class="ajustes_dependencias_create" v-if="!dependenciaIdSelected">
          <p>Crear nueva dependencia</p><br>
          <div>
            <el-input placeholder="Nueva Dependencia" v-model="newDependencia"></el-input>
            <el-button type="success" v-on:click="createDependencia">Crear</el-button>
            <el-button type="secundary" v-on:click="newDependencia = ''">cancelar</el-button>
          </div>
        </div>
      </div> -->
      <h1 class="ajustes_title">Banners de la pagina</h1>
      <div class="ajustes_banners">
        <div :class="`ajustes_banners_banner banner${banner.id}`" :id="`banner${banner.id}`" v-for="(banner, index) in banners">
          <img :src="`${$urlHttp}/imagen_banners/${banner.imagen}`" :alt="banner.titulo">
          <div class="ajustes_banners_banner_options">
            <el-button-group>
              <!-- <el-button type="primary" icon="edit"></el-button> -->
              <el-button type="danger" icon="delete" v-on:click="deleteBanner(banner.id, index)"> Eliminar</el-button>
            </el-button-group>
          </div>
        </div>
        <div class="ajustes_banners_banner create" v-loading.body="loadingCreateBanner">
          <el-button type="primary">Subir nuevo banner<input type="file" v-on:change="uploadBanner"></el-button>
        </div>
      </div>
      <hr class="separator">
      <span class="ajustes_title">
        <h1>Botones</h1>
        <em>(Bajo el banner)</em>
      </span>
      <div class="ajustes_buttons">
        <div class="nueva_url_externa">
          <el-input placeholder="Url del boton" v-model="newButton.url">
            <template slot="prepend">
              <i class="fa fa-link" aria-hidden="true"></i>
            </template>
          </el-input>
          <div class="row">
            <el-input placeholder="Texto del boton" v-model="newButton.texto"></el-input>
            <el-button type="primary"><input type="file" class="url_choose_file" v-on:change="uploadPhotoButton">
              <i class="fa fa-camera-retro" style="cursor: pointer;" aria-hidden="true"></i> imagen</i>
            </el-button>
          </div>
          <el-button-group>
            <el-button type="primary" v-on:click="createButton" size="small" icon="circle-check"></el-button>
            <el-button type="primary" size="small" icon="circle-cross"></el-button>
          </el-button-group>
        </div>
        <div class="url_externa_list">
          <div class="url_externa" v-for="(button, index) in buttons">
            <a :href="button.url" target="_blank">
              <img v-show="button.imagen" :src="`${$urlHttp}/web_urls_navegacion/${button.imagen}`" alt="">
            </a>
            <div class="column">
              <p>{{ button.titulo }}</p>
              <el-button type="danger" size="small" v-on:click="deleteButton(button.id, index)" icon="delete"></el-button>
            </div>
          </div>
        </div>
      </div>
      <hr class="separator">
      <span class="ajustes_title">
        <h1>Servicios</h1>
        <em>(Botones en la barra lateral derecha)</em>
      </span>
      <div class="ajustes_servicios">
        <div class="nueva_url_externa">
          <el-input placeholder="Url externa" v-model="newUrlExterna.url">
            <template slot="prepend">
              <i class="fa fa-link" aria-hidden="true"></i>
            </template>
          </el-input>
          <div class="row">
            <el-input placeholder="Texto del enlace" v-model="newUrlExterna.texto"></el-input>
            <el-button type="primary"><input type="file" class="url_choose_file" v-on:change="uploadPhotoUrlExterna">
              <i class="fa fa-camera-retro" style="cursor: pointer;" aria-hidden="true"></i> imagen</i>
            </el-button>
          </div>
          <el-button-group>
            <el-button type="primary" v-on:click="createUrl" size="small" icon="circle-check"></el-button>
            <el-button type="primary" size="small" icon="circle-cross" v-on:click="newUrlExterna = {}"></el-button>
          </el-button-group>
        </div>
        <div class="url_externa_list">
          <div class="url_externa" v-for="(url, index) in urls_externas">
            <a :href="url.url" target="_blank">
              <img v-show="url.imagen" :src="`${$urlHttp}/web_img_urls/${url.imagen}`" alt="">
            </a>
            <div class="column">
              <p>{{ url.titulo }}</p>
              <el-button type="danger" size="small" v-on:click="deleteUrlExterna(url.id, index)" icon="delete"></el-button>
            </div>
          </div>
        </div>
      </div>
      <hr class="separator">
      <span class="ajustes_title">
        <h1>Video youtube</h1>
        <em>(Video que se muestra en la pagina de inicio)</em>
      </span>
      <div class="ajustes_video">
        <iframe width="300" height="180" :src="`https://www.youtube.com/embed/${urlYoutube}?rel=0&amp;controls=0&amp;showinfo=0`" frameborder="0" allowfullscreen></iframe>
        <div class="ajustes_video_data">
          <p>Subir el enlace de youtube para</br> remplazarlo de la pagina principal.</p>
          <el-input placeholder="Url video de youtube" v-model="urlYoutubeInput"></el-input>
          <el-button type="primary" v-on:click="createUrlYoutube">Subir</el-button>
        </div>
      </div>
      <hr class="separator">
      <span class="ajustes_title">
        <h1>Logos del Footer</h1>
        <em>(Imagenes que se muestran en el pie de pagina)</em>
      </span>
      <div class="ajustes_logos">
        <label for="uploadLogoFooter" class="ajustes_logos_upload">Subir logo</label>
        <input type="file" id="uploadLogoFooter" v-on:change="uploadLogoFooter">
      </div>
      <div class="ajustes_logos_list">
        <div class="ajustes_logos_item" v-for="(logo, index) in footerLogos">
          <img :src="`${$urlHttp}/footer_img/${logo.imagen}`">
          <div class="ajustes_logos_item_delete">
            <el-button type="danger" v-on:click="deleteLogoFooter(logo.id, index)">Eliminar</el-button>
          </div>
          <div class="ajustes_logos_item_url">
            <el-input placeholder="Url del logo" size="small" v-model="logo.url"></el-input>
            <el-button type="primary" size="small" v-on:click="updateLogoFooter(logo)" icon="plus"></el-button>
          </div>
        </div>
      </div>
      <hr class="separator">
      <span class="ajustes_title">
        <h1>Pop-Up</h1>
        <em>(Ventana emergente al abrir la pagina)</em>
      </span>

      <div class="ajustes_popup">
        <div class="ajustes_video_data" style="height: auto; margin-bottom: 20px">
          <p>Sube una imagen de tu computador que se mostrara <br />como un pop-up al abrir la pagina. </p><br />
          <p>
            <b>Se mostrara un video de youtube o una imange, <br />en caso de no subir nada no se mostrar el pop-up</b>
          </p>
        </div>

        <el-input placeholder="URL video de youtube" v-model="urlYoutubePopInput">
          <template slot="prepend">Youtube</template>
        </el-input>
        <br />
        <div v-show="idYoutubePop">
          <iframe width="300" height="180" :src="`https://www.youtube.com/embed/${idYoutubePop}?rel=0&amp;controls=0&amp;showinfo=0`" frameborder="0" allowfullscreen></iframe>
        </div>
        <input type="file" id="uploadImagePopup" v-on:change="uploadImagePopup">
        <figure class="photo">
          <label for="uploadImagePopup" class="remove_photo">
            <i class="material-icons">cloud_upload</i>
          </label>
          <img v-if="imagePopup" :src="imagePopup">
          <i v-else class="material-icons">cloud_upload</i>
        </figure>
        <br/>
        <div class="">
          <el-button type="danger" v-on:click="deletePopup">Eliminar Pop-Up</el-button>
          <el-button type="primary" v-on:click="updatePopup">Guardar Cambios</el-button>
        </div>
      </div>

      <hr class="separator">
      <span class="ajustes_title">
        <h1>Noticias - Inicio</h1>
        <em>Numero de noticias en pagina de inicio</em>
      </span>
      <div class="ajustes_popup">
        <div class="ajustes_video_data" style="height: auto; margin-bottom: 20px">
          <p>Escribe el número de noticias a mostrar en la pagina de inicio </p>
        </div>

        <el-input placeholder="Numero de noticias" v-model="numeroNoticias" type="number">

        </el-input>
        <br />
        <el-button type="primary" v-on:click="updateAmountNews">Guardar Cambios</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import cropper from './cropper.vue';
export default {
  components: { cropper },
  created() {
    if (this.$store.state.currentUser.tipoUsuario != 1) {
      this.$router.push('/');
    }
    axios.get(`${this.$urlHttp}/banners`).then(response => {
      this.banners = response.data.banners;
    });
    axios.get(`${this.$urlHttp}/web/url_navegacion`).then(response => {
      this.buttons = response.data.data;
    });
    axios.get(`${this.$urlHttp}/web/urls_externas`).then(response => {
      this.urls_externas = response.data.urls;
    });
    axios.get(`${this.$urlHttp}/web/url_youtube`).then(response => {
      this.urlYoutube = response.data.data.url;
    });
    axios.get(`${this.$urlHttp}/web/footer/listado`).then(response => {
      this.footerLogos = response.data.data;
    });
    axios.get(`${this.$urlHttp}/api/cantidad/noticias`).then(response => {
      this.numeroNoticias = response.data.cantidad.cantidad;
    });
    axios.get(`${this.$urlHttp}/api/informacion/popup`).then(response => {
      this.urlYoutubePopInput = response.data.poup.video;
      if (response.data.poup.imagen) {
        this.imagePopup = `https://fablabkujana.com/popup/${
          response.data.poup.imagen
        }`;
      } else {
        this.imagePopup = '';
      }
    });
  },
  data() {
    return {
      dependenciaIdSelected: '',
      dependenciaSelected: {},
      banners: [],
      newDependencia: '',
      loadingCreateBanner: false,
      urlPhotoCropper: '',
      cropper: null,
      buttons: [],
      urls_externas: [],
      urlYoutubeInput: '',
      urlYoutube: '',
      urlYoutubePopInput: '',
      imagePopInput: null,
      urlYoutubePop: '',
      value3: true,
      newButton: {
        url: '',
        texto: ''
      },
      newUrlExterna: {
        url: '',
        texto: ''
      },
      footerLogos: [],
      numeroNoticias: 0,
      imagePopup: ''
    };
  },
  watch: {
    urlYoutubeInput(value) {
      let index;
      if (value.includes('?v=')) {
        index = value.indexOf('?v=') + 3;
      } else {
        if (value.includes('.be/')) {
          index = value.indexOf('.be/') + 4;
        } else {
        }
      }
      let idYoutube = value.substring(index);
      this.urlYoutube = idYoutube;
    },
    urlYoutubePop(value) {
      let index;
      if (value.includes('?v=')) {
        index = value.indexOf('?v=') + 3;
      } else {
        if (value.includes('.be/')) {
          index = value.indexOf('.be/') + 4;
        } else {
        }
      }
      let idYoutubePop = value.substring(index);
      this.urlYoutubePop = idYoutubePop;
    },
    dependenciaIdSelected(value) {
      this.dependenciaSelected = this.dependencias.filter(
        dependencia => dependencia.idDependencia == value
      )[0];
    }
  },
  computed: {
    dependencias() {
      return this.$store.state.dependenciasData;
    }
  },
  methods: {
    createDependencia() {
      let json = {
        nombre: this.newDependencia
      };
      axios
        .post(`${this.$urlHttp}/dependencias`, json)
        .then(response => {
          this.newDependencia = '';
          this.$store.state.dependenciasData.push(response.data.dependencia);
          this.$message.success('Se ha creado la dependencia');
        })
        .catch(() => {
          this.$message.error('La dependencia no se pudo editar');
        });
    },
    editDependencia() {
      let json = {
        nombre: this.dependenciaSelected.nombreDependencia,
        _method: 'PUT'
      };
      axios
        .post(
          `${this.$urlHttp}/dependencias/${
            this.dependenciaSelected.idDependencia
          }`,
          json
        )
        .then(response => {
          this.$store.commit('users');
          this.dependenciaIdSelected = '';
          this.dependenciaSelected = {};
        })
        .catch(error => {
          this.$message.error('No se pudo eliminar');
        });
    },
    deleteDependencia() {
      axios
        .delete(
          `${this.$urlHttp}/dependencias/${
            this.dependenciaSelected.idDependencia
          }`
        )
        .then(response => {
          this.$store.commit('users');
          this.dependenciaIdSelected = '';
          this.dependenciaSelected = {};
        })
        .catch(error => {
          this.$message.error('No se pudo eliminar');
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
    uploadImagePopup(event) {
      this.imagePopInput = event.target.files[0];
      this.imagePopup = URL.createObjectURL(event.target.files[0]);
    },
    closeCropper() {
      this.cropper.destroy();
      this.urlPhotoCropper = '';
    },
    createBanner() {
      this.$prompt(
        'Si tu banner cuenta con una redirección escribe la URL',
        'Url de banner',
        {
          confirmButtonText: 'Crear',
          showCancelButton: false,
          inputPlaceholder: 'Ingresa la url'
        }
      )
        .then(value => {
          this.cropper.getCroppedCanvas().toBlob(blob => {
            const config = {
              headers: { 'Content-Type': 'multipart/form-data' }
            };
            let newFile = new FormData();
            newFile.append('imagen', blob);
            newFile.append('url', value.value || '#');
            axios
              .post(`${this.$urlHttp}/banners`, newFile, config)
              .then(response => {
                this.$store.state.loadingCropper = false;
                this.banners.push(response.data);
                this.loadingCreateBanner = false;
                this.urlPhotoCropper = '';
                this.cropper.destroy();
              })
              .catch(error => {
                this.$store.state.loadingCropper = false;
                this.$message.error(
                  'El banner no subio al servidor, vuelve a intentarlo'
                );
                this.loadingCreateBanner = false;
              });
          });
        })
        .catch(() => {
          this.$message({
            type: 'danger',
            message: 'No es valido'
          });
        });
    },
    editBanner() {},
    deleteBanner(id, index) {
      axios.delete(`${this.$urlHttp}/banners/${id}`).then(response => {
        this.banners.splice(index, 1);
      });
    },
    uploadPhotoButton(files) {
      let size = files.target.files.length;
      const isLt10M = files.target.files[0].size / 1024 / 1024 < 10;
      if (isLt10M) {
        this.newButton.imagen = files.target.files[0];
      } else {
        this.$message.error('El archivo debe pesar menos de 10 Megabyte');
      }
    },
    createButton() {
      if (this.newButton.url.includes('http') || this.newButton.url == '#') {
        if (this.newButton.texto) {
          const config = { headers: { 'Content-Type': 'multipart/form-data' } };
          let params = new FormData();
          params.append('url', this.newButton.url);
          params.append('titulo', this.newButton.texto);
          if (this.newButton.imagen) {
            params.append('imagen', this.newButton.imagen);
          }
          axios
            .post(`${this.$urlHttp}/web/url_navegacion`, params, config)
            .then(response => {
              this.buttons.push(response.data.data);
              this.$message.success('El boton se creo correctamente');
              this.newButton = {
                url: '',
                texto: ''
              };
            })
            .catch(error => {
              this.$message.error('El boton no se pudo crear');
            });
        } else {
          this.$message.error('El texto es obligatorio');
        }
      } else {
        this.$message.error('La url no es correcta');
      }
    },
    deleteButton(id, index) {
      axios
        .delete(`${this.$urlHttp}/web/url_navegacion/${id}`)
        .then(response => {
          this.buttons.splice(index, 1);
        });
    },
    uploadPhotoUrlExterna(files) {
      let size = files.target.files.length;
      const isLt10M = files.target.files[0].size / 1024 / 1024 < 10;
      if (isLt10M) {
        this.newUrlExterna.imagen = files.target.files[0];
      } else {
        this.$message.error('El archivo debe pesar menos de 10 Megabyte');
      }
    },
    createUrl() {
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
        axios
          .post(`${this.$urlHttp}/web/urls_externas`, params, config)
          .then(response => {
            this.urls_externas.push(response.data.data);
            this.$message.success('La url externa se creo correctamente');
            this.newUrlExterna = {
              url: '',
              texto: ''
            };
          })
          .catch(error => {
            this.$message.error('La url externa no se pudo crear');
          });
      } else {
        this.$message.error('La url no es correcta');
      }
    },
    deleteUrlExterna(id, index) {
      axios
        .delete(`${this.$urlHttp}/web/urls_externas/${id}`)
        .then(response => {
          this.urls_externas.splice(index, 1);
        });
    },
    createUrlYoutube() {
      let params = {
        url: this.urlYoutube
      };
      axios.post(`${this.$urlHttp}/web/url_youtube`, params).then(response => {
        this.urlYoutube = response.data.data.url;
      });
    },
    uploadLogoFooter(files) {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      let params = new FormData();
      params.append('imagen', files.target.files[0]);
      axios
        .post(`${this.$urlHttp}/web/footer`, params, config)
        .then(response => {
          this.footerLogos.push(response.data.data);
        });
    },
    updateLogoFooter(logo) {
      if (logo.url.includes('http') || logo.url == '#') {
        let params = {
          imagen: null,
          url: logo.url,
          _method: 'PUT'
        };
        axios
          .post(`${this.$urlHttp}/web/footer/${logo.id}`, params)
          .then(response => {
            this.$message.success('Editado correctamente');
          })
          .catch(error => {
            this.$message.error('Oops, La url no cambio en el servidor.');
          });
      } else {
        this.$message.error('No es una url valida.');
      }
    },
    deleteLogoFooter(id, index) {
      axios.delete(`${this.$urlHttp}/web/footer/${id}`).then(response => {
        this.footerLogos.splice(index, 1);
      });
    },
    updateAmountNews() {
      let params = {
        cantidad: this.numeroNoticias
      };
      axios
        .post(`${this.$urlHttp}/api/cantidad/noticias`, params)
        .then(response => {});
    },
    updatePopup() {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      let params = new FormData();
      if (this.imagePopInput) {
        params.append('imagen', this.imagePopInput);
      }
      params.append('video', this.urlYoutubePopInput);

      axios
        .post(`${this.$urlHttp}/informacion/popup`, params, config)
        .then(response => {});
    },
    deletePopup() {
      axios
        .post(`${this.$urlHttp}/informacion/popup/eliminar`)
        .then(response => {
          this.urlYoutubePopInput = '';
          this.imagePopup = '';
          this.imagePopInput = null;
        });
    }
  }
};
</script>

<style scoped>
#ajustes {
}
.separator {
  height: 1px;
  background-color: #1b7a9d;
  width: 90%;
  margin: 10px;
}
.ajustes_title {
  max-width: 1300px;
  width: 90%;
  margin: 15px auto;
  font-size: 22px;
  font-weight: 400;
  color: #4a4a4a;
}
.ajustes_title h1 {
  font-size: 22px;
  font-weight: 400;
  color: #4a4a4a;
}
.ajustes_title em {
  font-size: 17px;
  font-weight: 400;
  color: #4a4a4a;
}
.ajustes {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.ajustes_dependencias {
  max-width: 1300px;
  width: 90%;
  display: flex;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(155, 155, 155, 0.48);
}
.ajustes_dependencias_selected,
.ajustes_dependencias_edit,
.ajustes_dependencias_create {
  padding: 30px 15px;
}
.ajustes_dependencias_selected {
  width: 40%;
  border-right: 1px solid rgba(151, 151, 151, 0.37);
}
.ajustes_dependencias_edit,
.ajustes_dependencias_create {
  width: 60%;
}
.ajustes_dependencias_edit > div,
.ajustes_dependencias_create > div {
  display: flex;
  align-items: center;
}
.ajustes_dependencias_edit > div .el-button {
  margin: 0 10px;
}
.ajustes_dependencias_edit > div .el-button:nth-child(3) {
  margin: 0px;
}
.ajustes_dependencias_create > div .el-button {
  margin: 0px 10px;
}
.ajustes_dependencias_create > div .el-button:last-child {
  margin: 0px;
}
.ajustes_banners {
  max-width: 1300px;
  width: 90%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}
.ajustes_banners:after {
  height: 0;
  width: 500px;
  content: '';
}
.ajustes_banners_banner {
  position: relative;
  overflow: hidden;
}
.ajustes_banners_banner > img {
  width: 500px;
  height: 173px;
  background-color: #fff;
  border: 5px solid #fff;
  box-shadow: 0 2px 4px 0 rgba(155, 155, 155, 0.48);
  margin: 5px 0;
}
.ajustes_banners_banner_options {
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
.ajustes_banners_banner:hover .ajustes_banners_banner_options {
  top: 0;
  opacity: 1;
  visibility: visible;
}
.ajustes_banners_banner.create {
  max-width: 500px;
  width: 100%;
  height: 175px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border: 5px solid #fff;
  box-shadow: 0 2px 4px 0 rgba(155, 155, 155, 0.48);
  margin: 5px 0;
}
.ajustes_banners_banner.create .el-button {
  position: relative;
}
.ajustes_banners_banner.create input[type='file'] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
.ajustes_buttons,
.ajustes_servicios,
.ajustes_video,
.ajustes_logos {
  display: flex;
  max-width: 1300px;
  width: 90%;
  justify-content: flex-start;
  align-items: flex-start;
}
.ajustes_popup {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  align-self: flex-start;
  margin-left: 50px;
  flex-direction: column;
}
.url_externa_list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.url_externa {
  max-width: 300px;
  display: flex;
  align-items: center;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
  padding: 10px;
  margin: 5px 10px;
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
.nueva_url_externa .el-input {
  margin: 5px 0;
}
.ajustes_video iframe {
  margin-right: 10px;
}
.ajustes_video_data {
  height: 180px;
  display: flex;
  flex-direction: column;
}
.ajustes_video_data .el-input {
  margin: 5px 0;
}
.ajustes_logos {
}
#uploadLogoFooter {
  visibility: hidden;
  opacity: 0;
}
.ajustes_logos_upload {
  padding: 10px 15px;
  border-radius: 4px;
  background-color: #20a0ff;
  color: #fff;
  cursor: pointer;
}
.ajustes_logos_list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.ajustes_logos_item {
  position: relative;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 5px;
  overflow: hidden;
}
.ajustes_logos_item img {
  max-width: 150px;
  max-height: 150px;
}
.ajustes_logos_item_delete {
  position: absolute;
  bottom: 100%;
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  opacity: 0;
  transition: 0.3s;
}
.ajustes_logos_item:hover .ajustes_logos_item_delete {
  bottom: 35px;
  opacity: 1;
}
.ajustes_logos_item_url {
  display: flex;
}
.ajustes_logos_item_url .el-input {
  margin-right: 5px;
}
.photo {
  position: relative;
  width: 90px;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eee;
  margin: 0 5px;
  border-radius: 3px;
  overflow: hidden;
}
.photo img {
  max-width: 100%;
  max-height: 100%;
}
.remove_photo {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  border-style: none;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  cursor: pointer;
  transition: 0.3s;
}
.remove_photo i {
  color: #fff;
  font-size: 30px;
}
.photo:hover .remove_photo {
  opacity: 1;
}
.photo > i {
  color: gray;
}
#uploadImagePopup {
  width: 0px;
  height: 0px;
  opacity: 0;
}
@media (max-width: 1480px) {
  .ajustes_dependencias {
    width: 98%;
  }
}
@media (max-width: 1200px) {
  .ajustes_dependencias {
    flex-direction: column;
  }
  .ajustes_dependencias_selected,
  .ajustes_dependencias_edit,
  .ajustes_dependencias_create {
    width: 100%;
  }
  .ajustes_dependencias_selected {
    border-style: none;
    border-bottom: 1px solid rgba(151, 151, 151, 0.37);
  }
}
@media (max-width: 600px) {
  .ajustes_dependencias_edit > div {
    flex-wrap: wrap;
  }
  .ajustes_dependencias_edit .el-input {
    width: 100%;
    margin-bottom: 10px;
  }
  .ajustes_dependencias_edit > div .el-button--success {
    margin-left: 0px;
  }
}
@media (max-width: 500px) {
  .ajustes_banners {
    width: 100%;
  }
  .ajustes_banners_banner {
    width: 100%;
    height: initial;
  }
}
</style>
