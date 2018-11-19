<template>
  <div class="agenda" id="diary" v-if="mediaQuery">
    <div class="agenda_header">
      <div class="agenda__notifications_logo">
        <i class="material-icons">notifications_none</i>
      </div>
      <div class="">
        <h3>Agenda</h3>
        <p>14 febrero</p>
      </div>
    </div>
    <p><strong>Eventos y reuniones.</strong></p>
    <ul class="agenda_events_list">
      <li class="agenda_events__item" v-for="(item, index) in agenda">
        <em>{{item.fecha_inicio}}</em>
        <el-progress :percentage="item.porcentaje"></el-progress>
        <p>{{item.title}}</p>
      </li>
    </ul>
    <router-link to="eventos" v-show="$route.name != 'Agenda'" class="agenda_action">
      <div class="agenda_action_content">
        <p>Ver agenda de eventos</p>
        <img src="../assets/calendar.png" alt="">
      </div>
      <div class="agenda_action_date">
        <p>18 de septiembre del 2017</p>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  created(){
    const mq = window.matchMedia( "(max-width: 800px)" );
    if (mq.matches) {
      this.mediaQuery = false;
    } else {
      this.mediaQuery = true;
      if(this.agendaData){
        this.agenda = this.agendaData;
        this.calcPorcent();
      }
    }
  },
  data(){
    return {
      agenda: {},
      mediaQuery: false,
    }
  },
  watch: {
    agendaData(value){
      this.agenda = value;
      this.calcPorcent();
    }
  },
  computed: {
    agendaData(){
      return this.$store.state.agendaData.slice(0,5);
    }
  },
  methods: {
    calcPorcent(){
      let index = 0;
      for(let item of this.agenda){
        let fechaInicio = new Date(item.fecha_inicio).getTime();
        let fechaFinal = new Date(item.fecha_fin).getTime();
        let fechaActual = Date.now();
        let tiempoTotal, tiempoTranscurrido, porcentajeTranscurrido;
          if(fechaInicio > fechaActual){
            item.porcentaje = 0;
            this.agenda.splice(index, 1, item)
          }else if (fechaFinal < fechaActual) {
            item.porcentaje = 100;
            this.agenda.splice(index, 1, item)
          }else {
            setInterval(() => {
              tiempoTotal = fechaFinal - fechaInicio;
              tiempoTranscurrido = fechaActual - fechaInicio;
              item.porcentaje = Math.round((tiempoTranscurrido * 100) / tiempoTotal);
            }, 5000)
          }
        index++
      }
    }
  }
}
</script>

<style scoped>
  .agenda{
    position: sticky;
    top: 50px;
    right: 0;
    width: 252px;
    height: 85vh;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 40px 20px;
    background-color: #FFF;
    box-shadow: 0 2px 9px 0 rgba(0, 0, 0, 0.11);
    transition: .3s;
  }
  .agenda_header{
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .agenda__notifications_logo{
    width: 55px;
    height: 55px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    background-color: #4da1ff;
    box-shadow: 1px 2px 17px 0 rgba(0, 0, 0, 0.07);
  }
  .agenda__notifications_logo i{
    color: #FFF;
    font-size: 40px;
  }
  .agenda_events_list{
    list-style: none;
  }
  .agenda_events__item{
    margin: 20px 0;
  }
  .agenda_action{
    display: flex;
    flex-direction: column;
    align-items: center;
    border-style: none;
    padding: 10px 10px;
    background-color: #4da1ff;
    box-shadow: 0 2px 3px 0 rgba(81, 79, 79, 0.47);
    cursor: pointer;
    outline: none;
    transition: .3s;
  }
  .agenda_action:hover{
    transform: scale(0.95);
  }
  .agenda_action p{
    color: #FFF;
  }
  .agenda_action_content{
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .agenda_action_content p{
    width: 90px;
  }
  .agenda_action_date{
    width: 100%;
    font-size: 10.7px;
    font-weight: 500;
    text-align: right;
    margin-top: 10px;
  }
  @media(max-width: 800px){
    #diary{
      display: none;
    }
  }
  @media(max-width: 585px){
    .agenda{
      position: fixed;
      top: calc( 50% - 40vh);
      right: -252px;
    }
    #diary.active{
      right: 0;
    }
  }
</style>
