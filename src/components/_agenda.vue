<template>
  <section id="agenda">
    <div class="agendaDiary">
      <div class="diary_header">
        <h3 class="diary__title">Agregar Evento</h3>
      </div>
      <hr class="diary_split">
      <div class="diary">
        <a href="#formCreateAgenda" class="actionAgendar">Agendar</a>
        <vue-event-calendar :events="agenda">
          <template scope="props">
            <div v-for="(event, index) in props.showEvents" class="event-item">
              <div v-show="!event.currentEdit">
                <h3>{{event.titulo}}</h3>
                <p>{{event.contenido}}</p>
                <em>{{event.fecha_inicio}} - {{event.fecha_fin}}</em>
                <img v-show="event.imagen" :src="`${$urlHttp}/imagen_agenda/${event.imagen}`" alt="">
                <hr>
                <div v-if="allow()" class="event-item_actions">
                  <button v-on:click="deleteEvent(event.idAgenda, index)">Eliminar</button>
                  <button v-on:click="toggleEdit(event, index)">Editar</button>
                </div>
              </div>
              <div v-show="event.currentEdit">
                <el-input placeholder="Titulo del evento" v-model="event.titulo"></el-input>
                <el-date-picker
                v-model="event.date"
                type="datetimerange"
                placeholder="Tiempo del evento">
                </el-date-picker>
                <el-input placeholder="Ubicacion del evento" v-model="event.ubicacion"></el-input>
                <el-input
                  type="textarea"
                  resize="none"
                  :autosize="{ minRows: 2, maxRows: 5}"
                  placeholder="Escribe el contenido del evento..."
                  v-model="event.contenido">
                </el-input>
                <div class="diary_upload">
                  <div class="uploaderPhoto">
                    <input type="file" v-on:change="uploadImage">
                    <span>
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text"><em>click para subir</em></div>
                    </span>
                    <div class="el-upload__tip" slot="tip" v-show="!image">solo archivos jpg/png con peso maximo de 500kb</div>
                  </div>
                  <span class="fileUploaded" v-show="image"><i class="el-icon-document"></i><p>{{ imageName }}</p><i class="el-icon-upload-success el-icon-circle-check"></i></span>
                </div>
                <hr>
                <div class="event-item_actions">
                  <button v-on:click="closeEdit(event, index)">Cancelar</button>
                  <button v-on:click="editEvent(event, index)">Editar</button>
                </div>
              </div>
            </div>
          </template>
        </vue-event-calendar>
        <div v-if="allow()" id="formCreateAgenda">
          <div class="diary_name">
            <el-input placeholder="Titulo del evento" v-model="title"></el-input>
          </div>
          <div class="diary_date">
            <el-date-picker
            v-model="totalTime"
            type="datetimerange"
            placeholder="Tiempo del evento">
          </el-date-picker>
        </div>
        <div class="diary_location">
          <el-input placeholder="Ubicacion del evento" v-model="location"></el-input>
        </div>
        <div class="diary_content">
          <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5}"
          placeholder="Escribe el contenido del evento..."
          resize="none"
          v-model="content">
        </el-input>
      </div>
      <div class="diary_upload">
        <div class="uploaderPhoto">
          <input type="file" v-on:change="uploadImage">
          <span>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text"><em>click para subir</em></div>
          </span>
          <div class="el-upload__tip" slot="tip" v-show="!image">solo archivos jpg/png con peso maximo de 500kb</div>
        </div>
        <span class="fileUploaded" v-show="image"><i class="el-icon-document"></i><p>{{ imageName }}</p><i class="el-icon-upload-success el-icon-circle-check"></i></span>
      </div>
      <div class="diary_actions">
        <button class="diary_action" v-on:click="createEvent">Guardar Evento</button>
      </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import agenda from './agenda.vue'
import axios from 'axios'

export default {
  components: { agenda },
  created(){
    if(this.agendaData){
      this.agenda = this.agendaData;
    }
  },
  data(){
    return {
      title: '',
      totalTime: [],
      location: '',
      content: '',
      image: '',
      imageName: '',
      visible2: false,
      agenda: [],
      beforeIndex: '',
      beforeEvent: null,
    }
  },
  watch: {
    agendaData(value){
      this.agenda = value;
    }
  },
  computed: {
    agendaData(){
      let newArray = [];
      for(let event of this.$store.state.agendaData){
        event.currentEdit = false;
        newArray.push(event);
      };
      return newArray
    },
    currentUser(){
      return this.$store.state.currentUser;
    }
  },
  methods: {
    toggleEdit(event, index){
      // console.log(typeof event.fecha_inicio, typeof event.fecha_fin)
      event.date = [event.fecha_inicio, event.fecha_fin]
      if(this.beforeEvent){
        this.beforeEvent.currentEdit = false;
        // this.agenda.splice(this.beforeIndex, 1, this.beforeEvent);
      }
      event.currentEdit = true;
      this.beforeIndex = index;
      this.beforeEvent = event;
      console.log(this.agenda, index, 1, event)
      this.agenda.splice(index, 1, event);
    },
    closeEdit(event, index){
      event.currentEdit = !event.currentEdit;
      this.agenda.splice(index, 1, event);
    },
    deleteEvent(id, index){
      this.$confirm('Estas seguro de eliminar este archivo. Continuar?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancelar',
          type: 'warning'
        }).then((response) => {
          axios.delete(`${this.$urlHttp}/agenda/${id}`).then(() => {
            this.$store.state.agendaData.splice(index, 1);
            this.$message({
              type: 'success',
              message: 'Eliminada exitosamente'
            });
          }).catch((error) => {
            this.$message({
              type: 'error',
              message: 'No se ha eliminado'
            });
          })
        })
    },
    editEvent(event, index){

      let startTime = new Date(event.date[0]);
      let sTyear = startTime.getFullYear();
      let sTmonth = startTime.getMonth() + 1;
      let sTday = startTime.getDate();
      startTime = `${sTyear}-${sTmonth}-${sTday}`
      let endTime = new Date(event.date[1]);
      let eTyear = endTime.getFullYear();
      let eTmonth = endTime.getMonth() + 1;
      let eTday = endTime.getDate();
      endTime = `${eTyear}-${eTmonth}-${eTday}`

      let editEvent = new FormData();
      editEvent.append('titulo', event.titulo)
      editEvent.append('contenido', event.contenido)
      editEvent.append('fecha_inicio', startTime)
      editEvent.append('fecha_fin', endTime)
      editEvent.append('ubicacion', event.ubicacion)
      editEvent.append('image', this.image)
      editEvent.append('idUsuario', this.currentUser.id)
      editEvent.append('_method', 'PUT')
      axios.post(`${this.$urlHttp}/agenda/${event.idAgenda}`, editEvent).then((response) => {
        this.beforeEvent.currentEdit = !this.beforeEvent.currentEdit;
        this.agenda.splice(index, 1, response.data.agenda);
        this.$message({
          message: 'Felicitaciones, el evento se ha editado.',
          type: 'success'
        });
      }).catch((error) => {
        this.$message({
          message: 'Error, el evento no se ha editado.',
          type: 'error'
        });
      })
    },
    createEvent(){
      let startTime = new Date(this.totalTime[0]);
      let sTyear = startTime.getFullYear();
      let sTmonth = startTime.getMonth() + 1;
      let sTday = startTime.getDate();
      startTime = `${sTyear}-${sTmonth}-${sTday}`
      let endTime = new Date(this.totalTime[1]);
      let eTyear = endTime.getFullYear();
      let eTmonth = endTime.getMonth() + 1;
      let eTday = endTime.getDate();
      endTime = `${eTyear}-${eTmonth}-${eTday}`

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      let newEvent = new FormData();
      newEvent.append('titulo', this.title);
      newEvent.append('fecha_inicio', startTime);
      newEvent.append('fecha_fin', endTime);
      newEvent.append('ubicacion', this.location);
      newEvent.append('contenido', this.content);
      newEvent.append('image', this.image);
      newEvent.append('idUsuario', this.currentUser.id);

      axios.post(`${this.$urlHttp}/agenda`, newEvent, config).then((response) => {
        this.$message({
          message: 'Felicitaciones, su evento se ha agregado exitosamente.',
          type: 'success'
        });
        this.$store.state.agendaData.unshift(response.data.agenda);
      }).catch((error)=>{
        this.$message({
          message: 'Error, el evento no se ha creado.',
          type: 'error'
        });
      })
      this.title = '';
      this.totalTime = [];
      this.location = '';
      this.content = '';
      this.image = '';
    },
    uploadImage(file){
      const isLt2M = file.target.files[0].size / 1024 / 1024 < 2;
      if(isLt2M){
        this.image = file.target.files[0];
      }else{
        this.$message.error('El archivo debe pesar menos de 2 Megabyte');
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
}
</script>

<style scoped>
  #agenda{
    display: flex;
    flex-wrap: wrap;
  }
  .agendaDiary{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .diary_header{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 50px 50px 0 50px;
  }
  .diary__title{
    font-weight: 500;
    color: #4a4a4a;
  }
  .diary_split{
    width: 100%;
    margin: 20px 0;
    opacity: 0.3;
  }
  .diary{
    max-width: 850px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 50px;
    background-color: #FFF;
    border-radius: 1px;
    box-shadow: 0 2px 4px 0 rgba(155, 155, 155, 0.48);
  }
  .event-item{
    display: flex;
    flex-direction: column;
    padding: 15px !important;
  }
  .event-item h3{
    font-size: 16px;
  }
  .event-item p{
    font-size: 14px;
    margin: 5px 0;
  }
  .event-item em{
    font-size: 12px;
    align-self: flex-end;
  }
  .event-item img{
    width: 100%;
  }
  .event-item_actions{
    display: flex;
  }
  .event-item_actions button{
    margin: 5px 10px 0 0;
    border-style: none;
    background-color: transparent;
    cursor: pointer;
  }
  .event-item .el-input{
    width: 100%;
    margin: 5px 0;
  }
  .actionAgendar{
    background-color: green;
    color: #FFF;
    padding: 5px 30px;
    align-self: flex-start;
  }
  #formCreateAgenda{
    width: 100%;
  }
  .diary_date{
    display: flex;
    margin: 15px 0;
  }
  .diary_date > div{
    display: flex;
    flex-direction: column;
  }
  .diary_date > div:nth-child(2){
    margin-left: 15px;
  }
  .diary_name, .diary_location, .diary_date, .diary_upload, .diary_content{
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 15px 0;
  }
  .diary_name .el-input, .diary_location .el-input, .diary_date .el-input, .diary_content .el-textarea, .diary_upload .el-input{
    width: 100% !important;
  }
  .uploaderPhoto{
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .uploaderPhoto input{
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
  .uploaderPhoto span{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 60px;
    border: 1px dashed #97a8be;
    border-radius: 6px;
  }
  .uploaderPhoto input:hover{
    border: 1px dashed #4192ec;
  }
  .uploaderPhoto span i{
    font-size: 60px;
    color: #97a8be;
  }
  .uploaderPhoto span .el-upload__text{
    font-size: 14px;
    color: #97a8be;
  }
  .uploaderPhoto span .el-upload__text em{
    color: #4192ec;
  }
  .fileUploaded{
    display: flex;
    justify-content: flex-start;
    margin-top: 5px;
  }
  .fileUploaded .el-icon-document{
    color: #677384;
  }
  .fileUploaded p{
    color: #677384;
    margin: 0 10px;
  }
  .fileUploaded .el-icon-upload-success{
    color: rgba(0, 157, 61, 0.7);
  }
  .diary_actions{
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  .diary_action{
    display: flex;
    align-items: center;
    border-style: none;
    padding: 10px 50px;
    background-color: #4192ec;
    border-radius: 10px;
    color: #FFF;
    cursor: pointer;
    outline: none;
    transition: .3s;
  }
  .diary_action:hover{
    transform: scale(0.95);
  }
  @media(max-width: 585px){
    .agendaDiary{
      width: 100%;
    }
  }
</style>
