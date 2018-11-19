<template>
  <section id="funcionariosCreate">
      <el-dialog title="Información" :visible.sync="dialogVisible" :size="sizeDialog" :before-close="closeFuncionariosEdit">
          <h3 class="title_information">Información Personal</h3>
          <div class="funcionario_personal">
            <div class="uploaderPhoto">
              <input type="file" v-on:change="setImage">
              <img v-show="currentImage" :src="currentImage" id="photo">
              <i v-show="!currentImage" class="material-icons">add</i>
            </div>
            <div class="funcionario_personal_inputs">
              <span class="required"><el-input type="number" placeholder="Cedula" v-model="cedula"></el-input></span>
              <span class="required"><el-input placeholder="Nombre" v-model="nombre"></el-input></span>
              <span class="required"><el-date-picker
              v-model="fechaNacimiento"
              type="date"
              placeholder="Fecha de Nacimiento (opcional)">
            </el-date-picker></span>
            <el-input placeholder="Telefono (opcional)" v-model="telefono"></el-input>
            <el-input placeholder="Telefono emergencia (opcional)" v-model="telefonoEmergencia"></el-input>
            <el-input placeholder="Direccion (opcional)" v-model="direccion"></el-input>
            <span class="required"><el-input placeholder="Correo" v-model="correo"></el-input></span>
          </div>
        </div>
        <h3 class="title_information">Información Profesional</h3>
        <div class="funcionario_professional">
          <div class="funcionario_professional_inputs">
            <span class="required"><el-select v-model="dependencia" clearable placeholder="Dependencia">
              <el-option
              v-for="item in dependencias"
              :key="item.idDependencia"
              :label="item.nombreDependencia"
              :value="item.idDependencia">
            </el-option>
          </el-select></span>
          <el-input placeholder="Cargo (opcional)" v-model="cargo"></el-input>
        <span class="required"><el-date-picker
          v-model="fechaEntrada"
          type="date"
          placeholder="Fecha Entrada">
        </el-date-picker></span>
        <span class="required"><el-date-picker
        v-model="fechaSalida"
        type="date"
        placeholder="Fecha Salida">
      </el-date-picker></span>
      <span class="required"><el-select v-model="estado" clearable placeholder="Estado">
        <el-option
          v-for="item in estados"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select></span>
    <span class="required"><el-select v-model="tipoUsuario" clearable placeholder="Tipo de Usuario">
      <el-option
        v-for="item in tipoUsuarios"
        :key="item.idTipoUsuario"
        :label="item.nombre"
        :value="item.idTipoUsuario">
      </el-option>
    </el-select></span>
    <el-select v-model="tipoContrato" clearable placeholder="Tipo de contrato">
      <el-option label="Contrato" value="1"></el-option>
      <el-option label="Nomina" value="2"></el-option>
    </el-select>
    <el-checkbox v-model="leader">Lider de dependencia</el-checkbox>
    </div>
    </div>
    <div class="funcionario_actions">
      <p>Si el campo tiene un <strong>*</strong> significa que es requerido</p>
      <button v-on:click="createFuncionario">Crear Funcionario</button>
    </div>
  </el-dialog>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  created(){
    this.$store.state.funcionarioCreate = true;
  },
  data(){
    return {
      dialogVisible: true,
      imageUrl: '',
      cedula: '',
      nombre: '',
      fechaNacimiento: '',
      telefono: '',
      telefonoEmergencia: '',
      direccion: '',
      correo: '',
      contraseña: '',
      dependencia: '',
      cargo: '',
      leader: false,
      estados: [
        {
          label: 'Activo',
          value: 1,
        },
        {
          label: 'Inactivo',
          value: 0,
        }
      ],
      estado: '',
      fechaEntrada: '',
      fechaSalida: '',
      tipoUsuario: '',
      tipoContrato: '',
      image: '',
      imageName: '',
      currentImage: '',
    }
  },
  watch: {
    fechaSalida(value){
      if(value < this.fechaEntrada){
        this.$message({
          message: 'La fecha de salida debe ser mayor a la de entrada.',
          type: 'warning'
        });
        this.fechaSalida = '';
      }
    }
  },
  computed: {
    sizeDialog(){
      const mq = window.matchMedia( "(max-width: 600px)" );
      if (mq.matches) {
        return 'full'
      } else {
        return 'small'
      }
    },
    dependencias(){
      return this.$store.state.dependenciasData;
    },
    tipoUsuarios(){
      return this.$store.state.tipoUsuarios;
    }
  },
  methods: {
    createFuncionario() {
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        let formData = new FormData();
        formData.append('nombreUsuario', this.nombre);
        formData.append('cedula', this.cedula);
        formData.append('password', this.contraseña);
        formData.append('email', this.correo);
        formData.append('telefono', this.telefono);
        formData.append('fechaNacimiento', this.fechaNacimiento);
        formData.append('cargo', this.cargo);
        formData.append('idDependencia', this.dependencia);
        formData.append('imagen', this.image);
        formData.append('fechaEntrada', this.fechaEntrada);
        formData.append('fechaSalida', this.fechaSalida);
        formData.append('idTipoUsuario', this.tipoUsuario);
        formData.append('contrato', this.tipoContrato);
        formData.append('telefono_emergencia', this.telefonoEmergencia);
        formData.append('direccion', this.direccion);
        formData.append('activo', this.estado);
        let newFuncionario = {
          nombreUsuario: this.nombre,
          cedula: this.cedula,
          password: this.contraseña,
          email: this.correo,
          telefono: this.telefono,
          fechaNacimiento: this.fechaNacimiento,
          cargo: this.cargo,
          idDependencia: 1,
          imagen: this.imageName,
          fechaEntrada: this.fechaEntrada,
          fechaSalida: this.fechaSalida,
          idTipoUsuario: 1,
          activo: 1,
        }
      axios.post(`${this.$urlHttp}/users/guardar`, formData, config).then((response) => {
        this.$message({
          message: 'Felicitaciones, se ha creado el funcionario.',
          type: 'success'
        });
        this.$store.commit('users');
        this.$router.push('/funcionarios');
      }).catch((error) => {
        this.$message.error('Oops, no se ha podido crear el funcionario.');
      })
    },
    setImage(file){
      const isJPG = file.target.files[0].type == 'image/jpeg';
      const isPNG = file.target.files[0].type == 'image/png';
      const isLt3M = file.target.files[0].size / 1024 / 1024 < 3;
      if(isJPG || isPNG){
        if(isLt3M){
          this.currentImage = URL.createObjectURL(file.target.files[0]);
          this.image = file.target.files[0];
          this.imageName = file.target.files[0].name;
        }else{
          this.$message.error('El archivo debe pesar menos de 3 Megabyte');
        }
      }else {
        this.$message.error('El archivo debe ser JPG o PNG');
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
      }
      if (!isLt2M) {
        this.$message.error('Avatar picture size can not exceed 2MB!');
      }
      return isJPG && isLt2M;
    },
    closeFuncionariosEdit(){
        this.$router.push('/funcionarios');
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
  #funcionariosCreate{
  }
  .funcionariosCreate{

  }
  .title_information{
    font-weight: 500;
    color: #4a4a4a;
    font-size: 16px;
    margin: 0 25px;
  }
  .funcionario_personal, .funcionario_professional{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: flex-start;
    padding: 0 25px;
    margin: 10px 0 20px 0;
  }
  .funcionario_personal_inputs, .funcionario_professional_inputs{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .required{
    position: relative;
    width: calc(50% - 10px);
  }
  .required::after{
    content: '*';
    position: absolute;
    right: 2.5px;
    bottom: 2.5px;
    color: red;
    font-size: 18px;
  }
  #funcionariosCreate .el-input, #funcionariosCreate .el-select, #funcionariosCreate .el-checkbox{
    width: calc(50% - 10px);
    display: flex;
    align-items: center;
    margin: 10px 0;
  }
  .required .el-input, .required .el-select{
    width: 100% !important;
  }
  .funcionario_actions{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .funcionario_actions p{
    font-size: 14px;
    color: gray;
  }
  .funcionario_actions p strong{
    color: red;
    font-size: 16px;
  }
  .funcionario_actions button{
    border-style: none;
    padding: 10px 50px;
    background-color: #4192ec;
    border-radius: 10px;
    color: #FFF;
    cursor: pointer;
    outline: none;
    transition: .3s;
  }
  .funcionario_actions button:hover{
    transform: scale(0.95);
  }
  @media(max-width: 650px){
    #funcionariosCreate .el-input, #funcionariosCreate .el-select{
      width: 100%;
    }
  }
  @media(max-width: 400px){
    #funcionariosCreate{
      padding: 20px 10px;
    }
    .funcionario_personal, .funcionario_professional{
      padding: 0 10px;
    }
  }
  @media(max-width: 340px){
    #funcionariosCreate{
      padding: 20px 5px;
    }
    .funcionario_personal, .funcionario_professional{
      padding: 0 5px;
    }
  }
  @media(max-width: 260px){
    #funcionariosCreate{
      padding: 20px 2.5px;
    }
    .funcionario_personal, .funcionario_professional{
      padding: 0 2.5px;
    }
  }
</style>
