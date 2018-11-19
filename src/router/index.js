import Vue from 'vue'
import Router from 'vue-router'
import Inicio from '@/components/_inicio'
import Social from '@/components/_social'
import Circulares from '@/components/_circulares'
import Funcionarios from '@/components/_funcionarios'
import FuncionariosCrear from '@/components/_funcionarios_crear'
import FuncionariosEditar from '@/components/_funcionarios_editar'
import FuncionariosProfile from '@/components/_funcionarios_profile'
import Agenda from '@/components/_agenda'
import Documentos from '@/components/_documentos'
import Chat from '@/components/_chat'
import ChatAdd from '@/components/_chat_add'
import Ajustes from '@/components/_ajustes'
import EditarPerfil from '@/components/_editar_perfil'
import MicroSitios from '@/components/_micrositios'
import Convocatorias from '@/components/_convocatorias'
import ManualUso from '@/components/_manual_uso'
import Transparencia from '@/components/_transparencia'
import PageNotFound from '@/components/_404.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '/',
      redirect: '/inicio'
    },{
      path: '/inicio',
      name: 'Inicio',
      component: Inicio
    },{
      path: '/noticias',
      name: 'Social',
      component: Social
    },{
      path: '/circulares',
      name: 'Circulares',
      component: Circulares
    },{
      path: '/funcionarios',
      name: 'Funcionarios',
      component: Funcionarios,
      children: [
        {
          path: '/funcionario/:id',
          name: 'funcionariosProfile',
          component: FuncionariosProfile
        },{
          path: 'crear',
          name: 'funcionariosCrear',
          component: FuncionariosCrear
        },
        {
          path: 'editar',
          name: 'funcionariosEditar',
          component: FuncionariosEditar
        }
      ]
    },{
      path: '/eventos',
      name: 'Agenda',
      component: Agenda
    },{
      path: '/documentos',
      name: 'Documentos',
      component: Documentos
    },{
      path: '/chat',
      name: 'Chat',
      component: Chat,
      children: [
        {
          path: 'agregar',
          component: ChatAdd
        }
      ]
    },{
      path: '/ajustes',
      name: 'Ajustes',
      component: Ajustes
    },{
      path: '/micrositios',
      name: 'microSitios',
      component: MicroSitios
    },{
      path: '/convocatorias',
      name: 'Convocatorias',
      component: Convocatorias
    },{
      path: '/perfil',
      name: 'EditarPerfil',
      component: EditarPerfil
    },{
      path: '/manual',
      name: 'ManualUso',
      component: ManualUso
    },
    {
      path: '/transparencia',
      name: 'Transparencia',
      component: Transparencia
    },
    { path: "*", component: PageNotFound }
  ]
})
