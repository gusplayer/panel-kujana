<template>
  <div class="micrositio_setting_create">
    <div class="micrositio_setting_create_publicado">
      <p>Publicar micrositio</p>
      <el-switch v-model="micrositioNew.estado" on-text="" off-text="">
      </el-switch>
    </div>
    <el-select v-model="micrositioNew.menu" placeholder="Selecciona a donde pertenece">
      <el-option v-for="item in options" :key="item.id" :label="item.titulo" :value="item.id">
      </el-option>
    </el-select>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="Información general" name="1">
        <el-input placeholder="Titulo" v-model="micrositioNew.titulo"></el-input>
        <el-input placeholder="Correo electronico" v-model="micrositioNew.email"></el-input>
        <el-input placeholder="Direccion" v-model="micrositioNew.direccion"></el-input>
        <el-input placeholder="Telefono" v-model="micrositioNew.telefono"></el-input>
      </el-collapse-item>
      <el-collapse-item title="Redes sociales" name="3">
        <el-input placeholder="Facebook">
          <template slot="prepend">
            <i class="fa fa-facebook-official" aria-hidden="true"></i>
          </template>
        </el-input>
        <el-input placeholder="Twitter">
          <template slot="prepend">
            <i class="fa fa-twitter" aria-hidden="true"></i>
          </template>
        </el-input>
      </el-collapse-item>
    </el-collapse>
    <p class="caption">Despues de crear este micrositio podras seguir actializando la información</p>
    <div class="micrositio_setting_create_actions">
      <el-button type="primary" v-on:click="createMicrositio">Crear</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      activeName: '1',
      options: [
        {
          id: '1',
          titulo: 'Quienes somos'
        },
        {
          id: '2',
          titulo: 'Experiencia'
        },
        {
          id: '3',
          titulo: 'Noticias'
        },
        {
          id: '4',
          titulo: 'Contactanos'
        },
        {
          id: '8',
          titulo: 'No visible'
        }
      ]
    };
  },
  computed: {
    micrositioNew(value) {
      return this.$store.state.micrositioNew;
    }
  },
  methods: {
    createMicrositio() {
      if (this.micrositioNew.titulo != '') {
        axios
          .post(`${this.$urlHttp}/api/micrositio`, this.micrositioNew)
          .then(response => {
            response.data.data.banners = [];
            response.data.data.secciones = [];
            this.$store.state.micrositioEdit = response.data.data;
            this.$store.state.micrositiosData.push(response.data.data);
            this.$emit('createMicrositio');
          })
          .catch(error => {
            this.$message.error('El micrositio no se creo en el servidor.');
          });
      } else {
        this.$message.error('Es necesario un titulo.');
      }
    }
  }
};
</script>

<style scoped>
.el-input {
  margin: 5px 0;
}
.el-select {
  width: calc(100% - 10px);
  margin-bottom: 5px;
}
.micrositio_setting_create_publicado {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}
.caption {
  margin: 15px 0 5px 0;
  font-size: 14px;
}
.micrositio_setting_create_actions {
}
</style>
