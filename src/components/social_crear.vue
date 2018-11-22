<template>
  <div class="timeline_create_article" v-loading.body="loadingCreateArticle">
    <div class="timeline_create_article_header">
      <figure class="timeline_create__photo">
        <img :src="`${$urlHttp}/imagenes_usuario/imagen_usuario/${currentUser.foto}`" alt="">
      </figure>
      <h3 class="timeline_create__text">Escribe algo interesante, para compartir en la seccíon de prense de la pagina de Kujana.</h3>
    </div>
    <div class="timeline_create_article_inputs">
      <div class="timeline_create__inputs_row">
        <el-input placeholder="Titulo del articulo" v-model="articleTitle"></el-input>
        <!-- <el-select v-model="dependenciaSelected" class="timeline_create__content_select" placeholder="Dependencia"> -->
        <!-- <el-option v-for="item in dependencias" :key="item.idDependencia" :label="item.nombreDependencia" :value="item.idDependencia">
          </el-option> -->
        <!-- <el-option label="Kujana" value="40" selected></el-option> -->

        <!-- </el-select>
        <el-select v-model="destinoSelected">
           <el-option label="Intranet" value="1"></el-option>
          <el-option label="Publicar en Pagina Web" value="3" selected></el-option>
        </el-select> -->
      </div>
      <div class="timeline_create__inputs_row codes">
        <el-input type="textarea" :rows="2" placeholder="Introducir codigo soundcloud" v-model="soundcloud">
        </el-input>
        <el-input type="textarea" :rows="2" placeholder="Introducir codigo de youtube" v-model="youtube">
        </el-input>
      </div>
      <vue-editor v-model="articleContent" :editorToolbar="customToolbar"></vue-editor>
    </div>
    <div class="photos">
      <figure class="photo" v-for="(photo, index) in urlPhotos">
        <button class="remove_photo" v-on:click="removePhoto(index)">
          <i class="material-icons">clear</i>
        </button>
        <img :src="photo">
      </figure>
      <div v-if="urlPhotos.length < 5" class="uploaderPhoto">
        <input type="file" ref="uploadImage" v-on:change="uploadImage">
        <i class="material-icons">add</i>
      </div>
    </div>
    <div class="timeline_create_article_actions">
      <div class="file" v-if="file">
        <i class="material-icons">insert_drive_file</i>
        <p>{{ fileName }}</p>
        <i class="material-icons file_delete" v-on:click="deleteFile">delete_forever</i>
      </div>
      <label for="uploadFile" v-else class="action upload_file">
        <i class="el-icon-upload"></i>Subir archivo
      </label>
      <input type="file" id="uploadFile" @change="uploadFile">
      <button v-on:click="createArticle" class="action">Publicar</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { VueEditor } from 'vue2-editor';

export default {
  components: { VueEditor },
  data() {
    return {
      newPhotoArticle: false,
      articleTitle: '',
      articleContent: '',
      urlPhotos: [],
      images: [],
      dependenciaSelected: 40,
      destinoSelected: '3',
      currentArticle: {},
      loadingCreateArticle: false,
      soundcloud: '',
      youtube: '',
      file: null,
      fileName: '',
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
  computed: {
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
    removePhoto(i) {
      this.urlPhotos.splice(i, 1);
      this.images.splice(i, 1);
    },
    uploadImage(file) {
      const isJPG = file.target.files[0].type == 'image/jpeg';
      const isPNG = file.target.files[0].type == 'image/png';
      const isLt3M = file.target.files[0].size / 1024 / 1024 < 3;
      if (isJPG || isPNG) {
        if (isLt3M) {
          this.urlPhotos.push(URL.createObjectURL(file.target.files[0]));
          this.images.push(file.target.files[0]);
        } else {
          this.$message.error('Oops, Tu archivo pesa mas de 3 Megas.');
        }
      } else {
        this.$message.error('Oops, Tu archivo no es una foto.');
      }
      this.$refs.uploadImage.value = null;
    },
    uploadFile(file) {
      this.file = file.target.files[0];
      this.fileName = file.target.files[0].name;
    },
    deleteFile() {
      this.file = null;
      this.fileName = null;
    },
    showNewPhotoArticle() {
      this.newPhotoArticle = !this.newPhotoArticle;
    },
    createArticle() {
      if (this.destinoSelected != 1) {
        if (this.articleTitle) {
          this.loadingCreateArticle = true;
          let today = new Date();
          let dd = today.getDate();
          let mm = today.getMonth() + 1;
          let yyyy = today.getFullYear();
          const config = { headers: { 'Content-Type': 'multipart/form-data' } };
          let newArticle = new FormData();
          newArticle.append('titulo', this.articleTitle);
          newArticle.append('contenido', this.articleContent);
          newArticle.append('idUsuario', this.currentUser.id);
          newArticle.append('soundcloud', this.soundcloud);
          newArticle.append('youtube', this.youtube);
          if (this.file) {
            newArticle.append('archivo', this.file);
          }
          newArticle.append('fecha', today);
          for (var i = 0; i < this.images.length; i++) {
            let file = this.images[i];
            newArticle.append('imagen' + i, file);
          }
          newArticle.append('idDependencia', this.dependenciaSelected);
          newArticle.append('destino', this.destinoSelected);
          axios
            .post(`${this.$urlHttp}/timeline`, newArticle, config)
            .then(response => {
              this.$store.commit('timeline');
              this.loadingCreateArticle = false;
              this.articleContent = '';
              this.images = [];
              this.urlPhotos = [];
              this.youtube = '';
              this.soundcloud = '';
              this.dependenciaSelected = 40;
              this.articleTitle = '';
              this.destinoSelected = 3;
              this.file = null;
            })
            .catch(error => {
              this.$message.error('El articulo no subio al servidor');
              this.loadingCreateArticle = false;
            });
        } else {
          this.$notify.error({
            title: 'Error',
            message: 'El titulo es requerido'
          });
        }
      } else {
        this.loadingCreateArticle = true;
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        let newArticle = new FormData();
        newArticle.append('titulo', this.articleTitle);
        newArticle.append('contenido', this.articleContent);
        newArticle.append('idUsuario', this.currentUser.id);
        newArticle.append('soundcloud', this.soundcloud);
        newArticle.append('youtube', this.youtube);
        if (this.file) {
          newArticle.append('archivo', this.file);
        }
        newArticle.append('fecha', today);
        for (var i = 0; i < this.images.length; i++) {
          let file = this.images[i];
          newArticle.append('imagen' + i, file);
        }
        newArticle.append('idDependencia', this.dependenciaSelected);
        newArticle.append('destino', this.destinoSelected);
        axios
          .post(`${this.$urlHttp}/timeline`, newArticle, config)
          .then(response => {
            this.$store.commit('timeline');
            this.loadingCreateArticle = false;
            this.articleContent = '';
            this.images = [];
            this.youtube = '';
            this.soundcloud = '';
            this.urlPhotos = [];
            this.dependenciaSelected = 1;
            this.articleTitle = '';
            this.file = null;
            this.destinoSelected = 1;
          })
          .catch(error => {
            this.$message.error('El articulo no subio al servidor');
            this.loadingCreateArticle = false;
          });
      }
    }
  }
};
</script>

<style scoped>
.timeline_create_article {
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  margin: 10px;
  border-radius: 1px;
  box-shadow: 0 2px 4px 0 rgba(155, 155, 155, 0.48);
  padding: 15px 50px;
}
.timeline_create_article_header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.timeline_create__photo {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 7px;
}
.timeline_create__photo img {
  width: 100%;
}
.timeline_create__text {
  font-size: 14px;
  font-weight: 400;
  text-align: center;
}
.timeline_create__inputs_row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.timeline_create__inputs_row .el-input {
  width: 50%;
}
.timeline_create__inputs_row .el-select {
  width: calc(25% - 10px);
}
.timeline_create__inputs_row.codes .el-textarea {
  width: 49%;
}
.photos {
  display: flex;
  margin-top: 10px;
}
.photos > .photo {
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
.photos > .photo img {
  max-width: 100%;
  max-height: 100%;
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
.photos > .photo:hover .remove_photo {
  opacity: 1;
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
.timeline_create_article_actions {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.timeline_create_article_actions .action {
  display: flex;
  align-items: center;
  border-style: none;
  padding: 10px 50px;
  margin: 10px 0;
  background-color: #4192ec;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  outline: none;
  transition: 0.3s;
}
.upload_file {
  background-color: #5a5a5a !important;
}
.upload_file i {
  margin-right: 10px;
}
#uploadFile {
  display: none;
}
.file {
  max-width: 200px;
  width: 100%;
  min-height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px;
  margin: 5px 0;
  border-radius: 5px;
  border: solid 1px #e9eff4;
  cursor: pointer;
  color: #323c47;
  background-color: #fff;
  transition: 0.3s;
}
.file i:first-child {
  color: #f7ba2a;
  text-shadow: 0 0 1px #f7ba2a;
}
.file i:last-child {
  color: rgba(208, 215, 221, 0.73);
}
.file.selected {
  background-color: #4da1ff;
}
.file p {
  text-align: center;
  font-size: 13px;
  word-break: break-all;
  margin: 0 5px;
}
.file.selected p,
.documents__column .file.selected i {
  color: #fff;
  text-shadow: 0 0 0 #fff;
}
.file.pending i:first-child {
  animation: rotate 3s linear infinite;
}
@media (max-width: 550px) {
  .timeline_create_article {
    padding: 15px 20px;
  }
}
</style>
