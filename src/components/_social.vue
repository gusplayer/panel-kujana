<template>
  <section id="social">
    <el-dialog title="Editar Articulo" :size="sizeDialog" :visible.sync="dialogEditArticle" v-loading.body="loadingActionArticle">
      <div class="inputs_row">
        <el-input placeholder="Titulo del articulo" v-model="currentArticle.titulo"></el-input>
        <el-select v-model="currentArticle.idDependencia" placeholder="Dependencia">
          <el-option v-for="item in dependencias" :key="item.idDependencia" :label="item.nombreDependencia" :value="item.idDependencia">
          </el-option>
        </el-select>
        <el-select v-model="currentArticle.destino" placeholder="Tipo de destino">
          <el-option label="Intranet" value="1"></el-option>
          <el-option label="Intranet & Pagina Web" value="3"></el-option>
        </el-select>
      </div>
      <div class="inputs_row codes">
        <el-input type="textarea" :rows="2" placeholder="Introducir codigo soundcloud" v-model="currentArticle.soundcloud">
        </el-input>
        <el-input type="textarea" :rows="2" placeholder="Introducir codigo de youtube" v-model="currentArticle.youtube">
        </el-input>
      </div>
      <vue-editor v-model="currentArticle.contenido" :editorToolbar="customToolbar"></vue-editor>
      <div class="images_tiny">
        <div class="images_tiny_photo" v-for="(image, index) in currentArticle.imagenes">
          <button class="remove_photo" v-on:click="removePhoto(index, image.idImagenTimeline)">
            <i class="material-icons">clear</i>
          </button>
          <img :src="`${$urlHttp}/imagen_timeline/${image.nombre_imagen}`">
        </div>
        <div v-if="urlPhotos.length < 5" class="uploaderPhoto">
          <input type="file" v-on:change="uploadImage">
          <i class="material-icons">add</i>
        </div>
      </div>
      <div style="margin-top: 5px;">
        <el-button type="danger" v-on:click="deleteArticle" icon="delete">Eliminar</el-button>
        <el-button v-on:click="editArticle">Guardar informacion</el-button>
      </div>
    </el-dialog>
    <div class="timeline" v-loading="timelineLoading">
      <create-article v-if="allow()"></create-article>
      <paginate name="timelineData" :list="timelineData" :per="5">
        <social-article :article="article" :index="index" @edit="openDialogEditArticle" v-for="(article, index) in paginate[timelineData]" :key="index">
          <p>fd</p>
        </social-article>
      </paginate>
      <paginate-links for="timelineData" :limit="5" @change="onLangsPageChange" :show-step-links="true">
      </paginate-links>
    </div>
  </section>
</template>

<script>
import createArticle from './social_crear.vue';
import socialArticle from './UIComponents/socialarticle.vue';
import comentarios from './comentarios.vue';
import { VueEditor } from 'vue2-editor';
import axios from 'axios';

export default {
  components: { VueEditor, createArticle, socialArticle, comentarios },
  created() {
    if (this.$store.state.timelineData.length) {
      this.timelineLoading = false;
    }
  },
  data() {
    return {
      paginate: ['timelineData'],
      newPhotoArticle: false,
      fileList: [],
      articleContent: '',
      urlPhotos: [],
      images: [],
      dependenciaSelected: '',
      dialogEditArticle: false,
      currentArticle: {},
      currentIndexArticle: 0,
      loadingActionArticle: false,
      timelineLoading: true,
      timeline: [],
      customToolbar: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ header: [1, 2, 3, 4, 5, 6, 7] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ['clean']
      ]
    };
  },
  watch: {
    timelineData(value) {
      this.timelineLoading = false;
    }
  },
  computed: {
    sizeDialog() {
      const mq = window.matchMedia('(max-width: 600px)');
      if (mq.matches) {
        return 'full';
      } else {
        return 'small';
      }
    },
    timelineData() {
      return this.$store.state.timelineData;
    },
    dependencias() {
      return this.$store.state.dependenciasData;
    },
    funcionarios() {
      return this.$store.state.funcionariosData;
    },
    currentUser() {
      return this.$store.state.currentUser;
    }
  },
  methods: {
    openDialogEditArticle(article, index) {
      if (this.currentUser.id == article.usuario.id || this.allow(1)) {
        this.currentIndexArticle = index;
        article.destino = article.destino.toString();
        this.currentArticle = article;
        this.dialogEditArticle = !this.dialogEditArticle;
      }
    },
    uploadImage(file) {
      const isJPG = file.target.files[0].type == 'image/jpeg';
      const isPNG = file.target.files[0].type == 'image/png';
      const isLt3M = file.target.files[0].size / 1024 / 1024 < 3;
      if (isJPG || isPNG) {
        if (isLt3M) {
          const config = { headers: { 'Content-Type': 'multipart/form-data' } };
          let uploadImage = new FormData();
          uploadImage.append('id_timeline', this.currentArticle.idTimeline);
          uploadImage.append('imagen', file.target.files[0]);
          axios
            .post(`${this.$urlHttp}/timeline/nueva/imagen`, uploadImage, config)
            .then(response => {
              this.currentArticle.imagenes.push(response.data.imagen);
            });
        }
      }
    },
    editArticle() {
      this.loadingActionArticle = true;
      let json = {
        titulo: this.currentArticle.titulo,
        contenido: this.currentArticle.contenido,
        idDependencia: this.currentArticle.idDependencia,
        destino: this.currentArticle.destino,
        soundcloud: this.currentArticle.soundcloud,
        youtube: this.currentArticle.youtube,
        _method: 'PUT'
      };
      axios
        .post(
          `${this.$urlHttp}/timeline/${this.currentArticle.idTimeline}`,
          json
        )
        .then(response => {
          this.loadingActionArticle = false;
          this.dialogEditArticle = !this.dialogEditArticle;
        })
        .catch(error => {
          this.loadingActionArticle = false;
          this.dialogEditArticle = !this.dialogEditArticle;
        });
    },
    deleteArticle() {
      this.loadingActionArticle = true;
      axios
        .delete(`${this.$urlHttp}/timeline/${this.currentArticle.idTimeline}`)
        .then(response => {
          this.dialogEditArticle = false;
          this.$store.state.timelineData.splice(this.currentIndexArticle, 1);
          this.loadingActionArticle = false;
        })
        .then(error => {
          this.dialogEditArticle = false;
          this.loadingActionArticle = false;
        });
    },
    removePhoto(index, id) {
      axios
        .post(`${this.$urlHttp}/timeline/eliminar/imagen`, { id_imagen: id })
        .then(response => {
          this.currentArticle.imagenes.splice(index, 1);
        });
    },
    onLangsPageChange(toPage, fromPage) {
      document.body.scrollTop = 600;
    },
    allow(value = 0) {
      if (this.currentUser.tipoUsuario == 1) {
        return true;
      } else {
        if (this.currentUser.tipoUsuario == 2) {
          switch (value) {
            case 1:
              return false;
              break;
            default:
              return true;
          }
        } else {
          switch (value) {
            case 2:
              return true;
              break;
            default:
              return false;
          }
        }
      }
    }
  }
};
</script>

<style>
.timeline {
  position: relative;
}
.uploaderPhoto {
  position: relative;
  width: 90px;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
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
.el-dialog .el-icon-delete {
  color: #fff !important;
}
.timeline {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 30px;
}
.inputs_row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.inputs_row .el-input {
  width: 50%;
}
.inputs_row .el-select {
  width: calc(25% - 10px);
}
.inputs_row.codes > .el-textarea {
  width: 49%;
}
.images_tiny {
  display: flex;
  align-items: center;
  margin: 10px 0;
}
.images_tiny_photo {
  width: 90px;
  height: 90px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eee;
  margin: 10px 10px;
}
.remove_photo {
  position: absolute;
  width: 100%;
  height: 100%;
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
.images_tiny_photo:hover .remove_photo {
  opacity: 1;
}
.images_tiny_photo input[type='file'] {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
.images_tiny img {
  max-width: 90px;
  max-height: 90px;
}
.paginate-links.timelineData {
  display: flex;
  background-color: #fff;
  box-shadow: 0 1px 3px 0 rgba(155, 155, 155, 0.48);
  list-style: none;
}
.paginate-links.timelineData li {
  min-width: 40px;
  height: 40px;
}
.paginate-links.timelineData li:hover {
  background-color: #eee;
  cursor: pointer;
}
.paginate-links.timelineData li.active {
  background-color: #128f2e;
  color: #fff;
}
.paginate-links.timelineData li ~ li {
  border-left: 1px solid #eee;
}
.paginate-links.timelineData li a {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
@media (max-width: 750px) {
  .timeline {
    padding: 0px !important;
  }
}
</style>
