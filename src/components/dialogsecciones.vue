<template>
  <el-dialog
    title="Secciones"
    :visible.sync="variable"
    :before-close="handleClose">
    <ul>
      <li v-for="seccion in dialogDataCreateSeccion.sub_secciones">{{seccion.titulo}}</li>
    </ul>
    <el-input placeholder="Titulo de la seccion" v-model="titulo"></el-input>
    <el-button-group>
      <el-button type="primary" icon="circle-cross"></el-button>
      <el-button type="primary" icon="circle-check" v-on:click="createSeccion"></el-button>
    </el-button-group>
  </el-dialog>
</template>

<script>
import axios from 'axios';
export default {
  data(){
    return {
      variable: this.dialogCreateSeccion,
      titulo: '',
    }
  },
  watch: {
    dialogCreateSeccion(value){
      this.variable = value;
    }
  },
  computed: {
    dialogCreateSeccion(){
      return this.$store.state.dialogCreateSeccion;
    },
    dialogDataCreateSeccion(){
      return this.$store.state.dialogDataCreateSeccion;
    }
  },
  methods: {
    handleClose(){
      this.$store.state.dialogCreateSeccion = false;
    },
    createSeccion(){
      let params = {
        titulo: this.titulo,
        padre: this.dialogDataCreateSeccion.id,
        id_micrositio: this.dialogDataCreateSeccion.micrositio_id,
      }
      axios.post(`${this.$urlHttp}/api/secciones`, params).then((response) => {
        response.data.data.textos = [];
        console.log(response.data.data);
        this.$store.state.micrositioSecciones.push(response.data.data);
        this.titulo = '';
        this.$store.state.dialogCreateSeccion = false;
      })
    }
  }
}
</script>

<style scoped>
</style>
