import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);
const conf = JSON.parse(localStorage.getItem("conf"));
export const store = new Vuex.Store({
  state: {
    dialogUrlExterna: false,
    dataUrlExterna: null,
    foldersData: null,
    funcionariosData: [],
    dependenciasData: [],
    tipoUsuarios: [],
    dataEditFuncionario: {},
    indexFuncionario: 0,
    timelineDataTMP: [],
    timelineData: [],
    circularData: [],
    circularDataTMP: [],
    searchArticle: "",
    agendaData: [],
    chats: [],
    newKeyChat: "",
    currentUser: conf,
    backupSearchFuncionario: "",
    thisIsAllow: false,
    notificaciones: [],
    micrositiosData: [],
    micrositioEdit: null,
    micrositioSecciones: [],
    dialogCreateSeccion: false,
    dialogDataCreateSeccion: {},
    loadingCropper: false,
    micrositioNew: {
      titulo: "",
      menu: "",
      email: "",
      telefono: "",
      direccion: "",
      estado: false,
      facebook: "",
      twitter: ""
    }
  },
  mutations: {
    allow(state, value) {
      if (state.currentUser.tipoUsuario == 1) {
        state.thisIsAllow = true;
      } else {
        if (state.currentUser.tipoUsuario == 2) {
          switch (value) {
            case 1.2:
              state.thisIsAllow = false;
              break;
            default:
              state.thisIsAllow = true;
          }
        } else {
          switch (value) {
            case 2.3:
              state.thisIsAllow = true;
              break;
            default:
              state.thisIsAllow = false;
          }
        }
      }
    },
    users(state) {
      axios.get("https://panel.fablabkujana.com/users/get").then(response => {
        let newArray = [];
        for (let dependencia of response.data.dependencias) {
          dependencia.funcionarios =
            response.data.dependencias_usuarios[dependencia.nombreDependencia];
          newArray.push(dependencia);
        }
        state.dependenciasData = newArray;
        state.funcionariosData = response.data.users;
        state.tipoUsuarios = response.data.tipoUsuario;
      });
    },
    timeline(state) {
      axios
        .get("https://panel.fablabkujana.com/api/noticias")
        .then(response => {
          state.timelineData = response.data.timeline;
          state.timelineDataTMP = response.data.timeline;
          state.circularData = response.data.timeline.filter(
            article => article.idDependencia == 37
          );
          state.circularDataTMP = response.data.timeline.filter(
            article => article.idDependencia == 37
          );
        });
    },
    SEARCH_ARTICLE(state, search) {
      state.timelineData = state.timelineDataTMP.filter(article =>
        article.titulo.toLowerCase().includes(search.toLowerCase())
      );
    },
    SEARCH_CIRCULAR(state, search) {
      state.circularData = state.circularDataTMP.filter(article =>
        article.titulo.toLowerCase().includes(search.toLowerCase())
      );
    },
    diary(state) {
      axios.get("https://panel.fablabkujana.com/agenda").then(response => {
        state.agendaData = response.data.agenda;
        for (let event of state.agendaData) {
          event.title = event.titulo;
          let date = new Date(event.fecha_inicio);
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          let day = date.getDate();
          date = `${year}/${month}/${day}`;
          event.date = date;
          event.desc = event.contenido;
        }
      });
    },
    folders(state) {
      axios.get("https://panel.fablabkujana.com/carpetas").then(response => {
        state.foldersData = response.data.carpetas;
      });
    },
    micrositios(state) {
      axios
        .get("https://panel.fablabkujana.com/api/micrositio")
        .then(response => {
          state.micrositiosData = response.data.data;
        });
    }
  }
});

store.commit("users");
store.commit("timeline");
store.commit("diary");
store.commit("folders");
store.commit("micrositios");
