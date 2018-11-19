// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import { store } from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-default/index.css";
import locale from "element-ui/lib/locale/lang/es";
import "vue-event-calendar/dist/style.css";
import vueEventCalendar from "vue-event-calendar";
import firebase from "firebase";
import VueAnalytics from "vue-analytics";
import VuePaginate from "vue-paginate";
import VueCarousel from "vue-carousel";

Vue.use(VueCarousel);
Vue.use(VuePaginate);

const config = {
  apiKey: "AIzaSyC5_z5NLqpSVEj6JX0lciebdVahv_qiUR0",
  authDomain: "gobernacion-intranet.firebaseapp.com",
  databaseURL: "https://gobernacion-intranet.firebaseio.com",
  projectId: "gobernacion-intranet",
  storageBucket: "gobernacion-intranet.appspot.com",
  messagingSenderId: "928970967771"
};
Vue.prototype.$urlHttp = "https://panel.fablabkujana.com/";
firebase.initializeApp(config);
window.firebase = firebase;
Vue.use(ElementUI, { locale });
Vue.use(vueEventCalendar, { locale: "es", color: "#4da1ff" });

Vue.config.productionTip = false;
Vue.use(VueAnalytics, {
  id: "UA-98864338-1",
  router
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: { App }
});
