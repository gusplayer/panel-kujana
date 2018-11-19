<template>
  <section id="funcionariosEdit" v-on:click="closeFuncionariosEdit">
    <div class="funcionariosEdit">
      <h3 class="title_information">Información Personal</h3>
      <div class="funcionariosEdit_personal">
        <div class="uploaderPhoto">
          <div class="uploaderPhoto_placeholder">
            <i class="material-icons">add_a_photo</i>
            <p>Cambiar foto</p>
          </div>
          <input type="file" v-on:change="getFileofPhoto">
          <img v-show="dataEditFuncionario.imagen && !currentImage" :src="setPhoto()">
          <img v-show="currentImage" :src="currentImage">
          <i v-show="!dataEditFuncionario.imagen" class="material-icons">add</i>
        </div>
        <div class="funcionariosEdit_personal_inputs">
          <span class="required"><el-input placeholder="Cedula" v-model="dataEditFuncionario.cedula"></el-input></span>
          <span class="required"><el-input placeholder="Nombre" v-model="dataEditFuncionario.nombreUsuario"></el-input></span>
          <span class="required"><el-date-picker
            v-model="birthdate"
            type="date"
            placeholder="Fecha de Nacimiento (opcional)">
          </el-date-picker></span>
          <el-input placeholder="Telefono (opcional)" v-model="dataEditFuncionario.telefono"></el-input>
          <span class="required"><el-input class="email" placeholder="Correo" v-model="dataEditFuncionario.email"></el-input></span>
          <el-checkbox v-model="leader">Lider de dependencia</el-checkbox>
        </div>
      </div>
      <h3 class="title_information">Información Profesional</h3>
      <div class="funcionariosEdit_professional">
        <div class="funcionariosEdit_professional_inputs">
          <span class="required"><el-select v-model="dataEditFuncionario.idDependencia" clearable placeholder="Dependencia">
            <el-option
              v-for="item in dependencias"
              :key="item.idDependencia"
              :label="item.nombreDependencia"
              :value="item.idDependencia">
            </el-option>
          </el-select></span>
          <el-input v-model="dataEditFuncionario.cargo" placeholder="Cargo (opcional)" ></el-input>
          <span class="required"><el-select v-model="dataEditFuncionario.activo" clearable placeholder="Estado">
            <el-option
              v-for="item in estados"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select></span>
          <span class="required"><el-date-picker
            v-model="dataEditFuncionario.fechaEntrada"
            type="date"
            placeholder="Fecha Entrada">
          </el-date-picker></span>
          <el-date-picker
            v-model="dataEditFuncionario.fechaSalida"
            type="date"
            placeholder="Fecha Salida (opcional)">
          </el-date-picker>
          <span class="required"><el-select v-model="dataEditFuncionario.idTipoUsuario" clearable placeholder="Tipo de Usuario">
            <el-option
              v-for="item in tipoUsuarios"
              :key="item.idTipoUsuario"
              :label="item.nombre"
              :value="item.idTipoUsuario">
            </el-option>
          </el-select></span>
          <span class="required"><el-select v-model="contrato" clearable placeholder="Tipo de contrato">
            <el-option label="Contratista" value="1"></el-option>
            <el-option label="Nomina" value="2"></el-option>
          </el-select></span>
        </div>
      </div>
      <div class="funcionariosEdit_actions">
        <div>
          <el-popover
          ref="popover"
          placement="top"
          width="160"
          v-model="visible2">
          <p>Estas seguro de eliminar este funcionario?</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible2 = false">Cancelar</el-button>
            <el-button style="color: #FFF;" type="danger" size="mini" @click="visible2 = false" v-on:click="deleteFuncionario(dataEditFuncionario.id)">Eliminar</el-button>
          </div>
        </el-popover>
          <el-button type="danger" v-popover:popover icon="delete" >Eliminar</el-button>
          <el-button type="primary" class="funcionariosEdit_action_edit" v-on:click="editFuncionario(dataEditFuncionario.id)">Editar Funcionario</el-button>
        </div>
        <p>Si el campo tiene un <strong>*</strong> significa que es requerido</p>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  created(){
    if(this.$store.state.currentUser.tipoUsuario != 1){
      this.$router.push('/funcionarios')
    }
  },
  data(){
    return {
      currentImage: null,
      visible2: false,
      imageUrl: '',
      estados: [
        {
          label: 'Activo',
          value: "1",
        },
        {
          label: 'Inactivo',
          value: "0",
        }
      ],
      contrato: '1',
      removeNoChange: true,
      leader: false,
    }
  },
  watch: {
    thisIsAllow(value){
      if(!value){
        this.$router.push('/funcionarios')
      }
    },
    dataEditFuncionario(value){
      if(value.contrato){
        this.contrato = value.contrato.toString();
      }
    }
  },
  computed: {
    birthdate(){
      let x = Array.from(this.dataEditFuncionario.fechaNacimiento);
      console.log(this.dataEditFuncionario.fechaNacimiento);
      console.log(`${x[3]}${x[4]}/${x[0]}${x[1]}/${x[6]}${x[7]}${x[8]}${x[9]}`);
      return `${x[3]}${x[4]}/${x[0]}${x[1]}/${x[6]}${x[7]}${x[8]}${x[9]}`
    },
    currentUser(){
      return this.$store.state.currentUser;
    },
    tipoUsuarios(){
      return this.$store.state.tipoUsuarios;
    },
    dataEditFuncionario(){
      return this.$store.state.dataEditFuncionario;
    },
    dependencias(){
      return this.$store.state.dependenciasData;
    },
    thisIsAllow(){
      return this.$store.state.thisIsAllow;
    }
  },
  methods: {
    setPhoto(){
      return `${this.$urlHttp}/imagenes_usuario/imagen_usuario/${this.dataEditFuncionario.imagen}`;
    },
    deleteFuncionario(id){
      axios.post(`${this.$urlHttp}/users/eliminar/${id}`)
      delete this.$store.state.funcionariosData.splice(this.$store.state.indexFuncionario, 1);
      this.$router.push('/funcionarios');
    },
    getFileofPhoto(file){
      const isJPG = file.target.files[0].type == 'image/jpeg';
      const isPNG = file.target.files[0].type == 'image/png';
      const isLt3M = file.target.files[0].size / 1024 / 1024 < 3;
      if(isJPG || isPNG){
        if(isLt3M){
          this.currentImage = URL.createObjectURL(file.target.files[0]);
          this.dataEditFuncionario.imagen = file.target.files[0];
          this.removeNoChange = false;
        }else{
          this.$message.error('El archivo debe pesar menos de 3 Megabyte');
        }
      }else{
        this.$message.error('El archivo debe ser JPG o PNG');
      }
    },
    editFuncionario(id){
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      let formData = new FormData();
      formData.append('lider', this.leader);
      formData.append('nombreUsuario', this.dataEditFuncionario.nombreUsuario);
      formData.append('cedula', this.dataEditFuncionario.cedula);
      formData.append('email', this.dataEditFuncionario.email);
      formData.append('telefono', this.dataEditFuncionario.telefono);
      formData.append('fechaNacimiento', this.dataEditFuncionario.fechaNacimiento);
      formData.append('cargo', this.dataEditFuncionario.cargo);
      formData.append('idDependencia', this.dataEditFuncionario.idDependencia);
      formData.append('imagen', this.dataEditFuncionario.imagen);
      formData.append('fechaEntrada', this.dataEditFuncionario.fechaEntrada);
      formData.append('fechaSalida', this.dataEditFuncionario.fechaSalida);
      formData.append('idTipoUsuario', this.dataEditFuncionario.idTipoUsuario);
      formData.append('telefono_emergencia', this.dataEditFuncionario.telefono_emergencia);
      formData.append('direccion', this.dataEditFuncionario.direccion);
      formData.append('activo', this.dataEditFuncionario.activo);
      formData.append('contrato', this.contrato);
      axios.post(`${this.$urlHttp}/users/editar/${id}`, formData, config).then((response) =>{
        this.$store.commit('users');
        this.$router.push('/funcionarios');
      }).catch((error) => {
        this.$message.error('El funcionario no se pudo editar por error en el servidor');
      })
    },
    closeFuncionariosEdit(e){
      if(e.target.id == 'funcionariosEdit'){
        this.$router.push('/funcionarios');
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
  #funcionariosEdit{
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
  .funcionariosEdit{
    max-width: 800px;
    width: 100%;
    max-height: 100vh;
    overflow: auto;
    background-color: #FFF;
    border-radius: 2px;
    padding: 20px 30px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
  }
  .funcionariosEdit_personal{
    display: flex;
    flex-direction: column;
  }
  .funcionariosEdit_personal_inputs, .funcionariosEdit_professional_inputs{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .title_information{
    font-weight: 500;
    color: #4a4a4a;
    font-size: 16px;
    margin: 15px 0;
  }
  .required{
    position: relative;
    width: 50%;
  }
  .required::after{
    content: '*';
    position: absolute;
    right: 12.5px;
    bottom: 2.5px;
    color: red;
    font-size: 18px;
  }
  .funcionariosEdit .el-input, .funcionariosEdit .el-select, .funcionariosEdit .el-checkbox{
    width: calc(50% - 20px);
    display: flex;
    align-items: center;
    margin: 10px;
  }
  .required .el-input, .required .el-select{
    width: calc(100% - 20px) !important;
  }
  .funcionariosEdit .email{
    max-width: 100%;
    width: 100%;
  }
  .funcionariosEdit_actions{
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .funcionariosEdit_actions .funcionariosEdit_action_edit{
    border-style: none;
    padding: 10px 40px;
    background-color: #4192ec;
    color: #FFF;
    cursor: pointer;
    outline: none;
    transition: .3s;
  }
  .funcionariosEdit_actions .funcionariosEdit_action_edit i{
    display: flex;
    color: #FFF;
  }
  .funcionariosEdit_actions .funcionariosEdit_action_edit:hover{
    transform: scale(0.95);
  }
  .funcionariosEdit_actions p{
    font-size: 14px;
    color: gray;
  }
  .funcionariosEdit_actions p strong{
    color: red;
    font-size: 16px;
  }
  @media(max-width: 650px){
    #funcionariosEdit .el-input, #funcionariosEdit .el-select{
      width: 100%;
    }
  }
  @media(max-width: 400px){
    .funcionariosEdit_actions button{
      padding: 10px 20px;
    }
  }
</style>
