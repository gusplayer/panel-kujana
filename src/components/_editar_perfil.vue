<template>
  <section id="ajustes">
    <div class="setting_header">
      <h3 class="setting__title">Ajustes de Cuenta</h3>
    </div>
    <hr class="setting_split">
    <div class="setting" v-loading.body="loading">
      <div class="setting_edit-data">
        <h3 class="setting_change-password_title">Editar Datos</h3>
        <div class="uploader">
          <div class="uploaderPhoto">
            <div class="uploaderPhoto_placeholder">
              <i class="material-icons">add_a_photo</i>
              <p>Cambiar foto</p>
            </div>
            <input type="file" v-on:change="getFileofPhoto">
            <img v-show="data.imagen && !currentImage" :src="setPhoto()" id="photo">
            <img v-show="currentImage" :src="currentImage" id="photo">
            <i v-show="!data.imagen" class="material-icons">add</i>
          </div>
          <div class="">
            <div class="uploaderCV">
              <input type="file" v-on:change="uploadCV">
              <button type="button">Subir hoja de vida</button>
            </div>
            <span v-if="currentCV" class="fileUploaded"><i class="el-icon-document"></i><p>{{ currentCV.name }}</p><i class="el-icon-upload-success el-icon-circle-check"></i></span>
          </div>
        </div>
        <el-date-picker
          v-model="data.fechaNacimiento"
          type="date"
          placeholder="Fecha de Nacimiento">
        </el-date-picker>
        <el-input placeholder="Direccion" v-model="data.direccion"></el-input>
        <el-input placeholder="Telefono" v-model="data.telefono"></el-input>
        <el-input placeholder="Telefono emergencia" v-model="data.telefono_emergencia"></el-input>
        <el-select v-model="data.idDependencia" clearable placeholder="Dependencia">
          <el-option
            v-for="item in dependencias"
            :key="item.idDependencia"
            :label="item.nombreDependencia"
            :value="item.idDependencia">
          </el-option>
        </el-select>
        <el-input placeholder="Cargo" v-model="data.cargo"></el-input>
        <el-input placeholder="Correo" v-model="data.email"></el-input>
      </div>
      <div class="setting_actions">
        <button v-on:click="editData">Guardar Datos</button>
      </div>
      <hr class="setting_split">
      <div class="setting_change-password">
        <h3 class="setting_change-password_title">Cambiar Contraseña</h3>
        <el-input type="password" placeholder="Contraseña actual" v-model="lastPassword"></el-input>
        <el-input type="password" placeholder="Contraseña nueva" v-model="password"></el-input>
        <el-input type="password" placeholder="Repetir contraseña nueva" v-model="confirmationPassword"></el-input>
      </div>
      <div class="setting_actions">
        <button v-on:click="changePassword">Cambiar Contraseña</button>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
export default {
  created(){
    this.loading = true;
    if(this.funcionarioData){
      this.data = this.funcionarioData;
      this.loading = false;
    }
  },
  data(){
    return{
      data: {},
      lastPassword: '',
      password: '',
      confirmationPassword: '',
      currentImage: null,
      imageName: '',
      currentCV: null,
      removeNoChange: '',
      loading: false,
    }
  },
  watch: {
    funcionarioData(value){
      this.data = value;
      this.loading = false;
    }
  },
  computed: {
    birthdate(){
      let x = Array.from(this.funcionarioData.fechaNacimiento);
      return `${x[3]}${x[4]}/${x[0]}${x[1]}/${x[6]}${x[7]}${x[8]}${x[9]}`
    },
    dependencias(){
      return this.$store.state.dependenciasData;
    },
    funcionarioData(){
      return this.$store.state.funcionariosData.filter(funcionario => funcionario.id ==  this.$store.state.currentUser.id)[0]
    }
  },
  methods: {
    uploadCV(file){
      const isLtM = file.target.files[0].size / 1024 / 1024 < 5;
      const isPDF = file.target.files[0].type == 'application/pdf';
      if(isPDF){
        if(isLtM){
          this.data.hoja_vida = file.target.files[0];
          this.currentCV = file.target.files[0];
        }else{
          this.$message.error('peso maximo de 5 Megabytes');
        }
      }else{
        this.$message.error('Formato invalido, debe ser PDF');
      }
    },
    getFileofPhoto(file){
      const isJPG = file.target.files[0].type == 'image/jpeg';
      const isPNG = file.target.files[0].type == 'image/png';
      const isLt3M = file.target.files[0].size / 1024 / 1024 < 3;
      if(isJPG || isPNG){
        if(isLt3M){
          this.currentImage = URL.createObjectURL(file.target.files[0]);
          this.data.imagen = file.target.files[0];
          this.imageName = file.target.files[0].name;
          this.removeNoChange = false;
        }else{
          this.$message.error('El archivo debe pesar menos de 3 Megabyte');
        }
      }else {
        this.$message.error('El archivo debe ser JPG o PNG');
      }
    },
    setPhoto(){
      return `${this.$urlHttp}/imagenes_usuario/imagen_usuario/${this.data.imagen}`;
    },
    editData(){
      this.loading = true;
      let formData = new FormData();
      formData.append('nombreUsuario', this.data.nombreUsuario);
      formData.append('cedula', this.data.cedula);
      formData.append('email', this.data.email);
      formData.append('telefono', this.data.telefono);
      formData.append('fechaNacimiento', this.data.fechaNacimiento);
      formData.append('cargo', this.data.cargo);
      formData.append('idDependencia', this.data.idDependencia);
      formData.append('imagen', this.data.imagen);
      if(typeof this.data.hoja_vida != 'string'){
        formData.append('hoja_vida', this.data.hoja_vida);
      }
      formData.append('fechaEntrada', this.data.fechaEntrada);
      formData.append('fechaSalida', this.data.fechaSalida);
      formData.append('idTipoUsuario', this.data.idTipoUsuario);
      formData.append('telefono_emergencia', this.data.telefono_emergencia);
      formData.append('direccion', this.data.direccion);
      formData.append('activo', this.data.activo);
      axios.post(`${this.$urlHttp}/users/editar/${this.data.id}`, formData).then((response) => {
        this.loading = false;
        this.$message({
          message: 'Su informacion ha sido cambiada',
          type: 'success'
        });
        window.location.reload();
      }).catch((error) => {
        this.loading = false;
        this.$message.error('No se puede modificar informacion');
      })
    },
    changePassword(){
      this.loading = true;
      let json = {
        old_password: this.lastPassword,
        password: this.password,
        password_confirmation: this.confirmationPassword
      }
      axios.post(`${this.$urlHttp}/users/contrasena/cambiar`, json).then((response) => {
        this.loading = false;
      })
    }
  }
}
</script>

<style scoped>
  .uploaderPhoto{
    position: relative;
    width: 160px;
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin-left: 10px;
    border-radius: 3px;
    overflow: hidden;
  }
  .uploaderPhoto input{
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
  .uploaderPhoto i{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    border: 1px dashed #d9d9d9;
    font-size: 40px;
  }
  .uploaderPhoto img{
    width: 100%;
  }
  .uploaderPhoto:hover .uploaderPhoto_placeholder{
    opacity: 1;
  }
  .uploaderPhoto_placeholder{
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #FFF;
    background-color: rgba(149, 169, 191, 0.68);
    border: 2px solid #6785a6;
    border-radius: 3px;
    overflow: hidden;
    opacity: 0;
  }
  .uploaderPhoto_placeholder i{
    width: initial;
    height: initial;
    margin-bottom: 10px;
    border: 0px;
    color: #FFF;
  }
  .uploaderPhoto_placeholder p{
    color: #FFF;
    font-weight: 600;
  }
  .uploader{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .uploaderCV{
    position: relative;
    width: 210px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .uploaderCV input[type="file"]{
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 2;
    cursor: pointer;
  }
  .uploaderCV button{
    padding: 12px 40px;
    border-style: none;
    border-radius: 18px;
    border: solid 1px #289bf0;
    background-color: transparent;
    color: #289bf0;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    outline: none;
    transition: .3s;
  }
  .uploaderCV button{
    transform: scale(0.95);
  }
  .fileUploaded{
    margin-top: 5px;
    display: flex;
    justify-content: space-around;
  }
  .fileUploaded .el-icon-upload-success{
    color: rgba(0, 157, 61, 0.7);
  }
  #ajustes{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .setting_header{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 50px 50px 0 50px;
  }
  .setting__title{
    font-weight: 500;
    color: #4a4a4a;
  }
  .setting_split{
      width: 100%;
      margin: 20px 0;
      opacity: 0.3;
  }
  .setting{
    max-width: 1200px;
    width: 95%;
    padding: 30px;
    background-color: #FFF;
    border-radius: 1px;
    box-shadow: 0 2px 4px 0 rgba(155, 155, 155, 0.48);
  }
  .setting_edit-data{
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .setting_edit-data .el-input, .setting_edit-data .el-select{
    width: calc(50% - 12px);
    margin: 5px;
  }
  .setting_change-password{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 30px;
  }
  .setting_change-password_title{
    width: 100%;
    margin-bottom: 20px;
  }
  .setting_change-password .el-input{
    width: calc(33% - 6px);
    margin: 3px;
  }
  .setting_actions{
    display: flex;
    justify-content: flex-end;
  }
  .setting_actions button{
    border-style: none;
    padding: 10px 50px;
    background-color: #4192ec;
    border-radius: 10px;
    color: #FFF;
    cursor: pointer;
    outline: none;
    margin: 5px 0;
    transition: .3s;
  }
  .setting_actions button:hover{
    transform: scale(0.95);
  }
  @media(max-width: 650px){
    .setting_edit-data .el-input, .setting_edit-data .el-select{
      width: 100%;
    }
    .setting_change-password .el-input{
      width: 100%;
    }
  }
</style>
