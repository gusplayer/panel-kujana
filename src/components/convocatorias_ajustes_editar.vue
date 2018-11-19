<template>
  <div class="micrositio_setting_edit">
    <cropper-modal :urlPhotoCropper="urlPhotoCropper" v-on:closeCropper="closeCropper" v-on:createBanner="createBanner"></cropper-modal>
    <h2 class="micrositio_setting_title">{{ micrositioEdit.titulo }}</h2>
    <!-- <div class="micrositio_setting_edit_publicado">
      <p>Visibilidad</p>
      <el-switch
        v-model="micrositioEdit.estado"
        on-text=""
        off-text="">
      </el-switch>
    </div> -->
    <!-- <el-select v-model="micrositioEdit.menu" placeholder="Selecciona a donde pertenece">
      <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.titulo"
      :value="item.id">
      </el-option>
    </el-select> -->

    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="Información general" name="1">
        <el-input placeholder="Titulo" v-model="micrositioEdit.titulo"></el-input>
        <el-input placeholder="Correo electronico" v-model="micrositioEdit.email"></el-input>
        <el-input placeholder="Direccion" v-model="micrositioEdit.direccion"></el-input>
        <el-input placeholder="Telefono" v-model="micrositioEdit.telefono"></el-input>
      </el-collapse-item>

      <el-collapse-item title="Banners" name="4">
        <div :class="`micrositios_settings_newsite_banners_item banner${banner.id}`" :id="`bannerMicrositio${banner.id}`" v-for="(banner, index) in micrositioEdit.banners">
          <img :src="`${$urlHttp}/micrositio_banners/${banner.banner}`">
          <div class="micrositios_settings_newsite_banners_item_options">
            <el-button-group>
              <el-button type="danger" icon="delete" v-on:click="deleteBanner(banner.id, index)"> Eliminar</el-button>
            </el-button-group>
          </div>
        </div>
        <div class="micrositios_settings_newsite_banners_item create">
          <el-button type="primary">Subir nuevo banner<input type="file" v-on:change="uploadBanner"></el-button>
        </div>
      </el-collapse-item>
    </el-collapse>

    <div class="secciones">
      <div class="micrositio_setting_header">
        <el-input placeholder="Crear nueva categoria" v-model="titulo"></el-input>
        <el-button type="primary" icon="plus" v-on:click="createSeccion(0)"></el-button>
      </div>
    <el-collapse v-if="seccionesPrincipales.length != 0" v-model="seccionSelected1" accordion>
      <el-collapse-item class="row1" v-for="(item1, index) in seccionesPrincipales" :title="item1.titulo" :name="item1.id" :key="item1.id">
        <ajustes-categorias :currentSeccion="item1"></ajustes-categorias>
        <div class="secciones">
          <div class="secciones_setting_delete">
            <p>Eliminar esta categoria</p>
            <el-button type="danger" size="small" icon="delete" v-on:click="deleteSeccion(item1.id, index, 0)"></el-button>
          </div>
          <div class="micrositio_setting_header">
            <el-input placeholder="Agregar convocatoria" size="small" v-model="titulo"></el-input>
            <el-button type="primary" size="small" icon="plus" v-on:click="createSeccion(item1.id)"></el-button>
          </div>
          <el-collapse v-if="seccionesSecundarias.length != 0" v-model="seccionSelected2" accordion>
            <el-collapse-item class="row2" v-for="(item2, index) in seccionesSecundarias" :title="`${item1.titulo} / ${item2.titulo}`" :name="item2.id" :key="item2.id">
              <ajustes-convocatorias :currentSeccion="item2"></ajustes-convocatorias>
              <div class="secciones_setting_delete">
                <p>Eliminar esta convocatoria</p>
                <el-button type="danger" size="small" icon="delete" v-on:click="deleteSeccion(item2.id, index, 1)"></el-button>
              </div>
              <!-- <div class="micrositio_setting_header">
                <el-input placeholder="Crear subsección" size="small" v-model="titulo"></el-input>
                <el-button type="primary" size="small" icon="plus" v-on:click="createSeccion(item2.id)"></el-button>
              </div> -->
              <el-collapse v-if="seccionesTerciarias.length != 0" v-model="seccionSelected3" accordion>
                <el-collapse-item class="row3" v-for="(item3, index) in seccionesTerciarias" :title="`.. / ${item2.titulo} / ${item3.titulo}`" :name="item3.id" :key="item3.id">
                  <ajustes-secciones :currentSeccion="item3"></ajustes-secciones>
                  <div class="secciones_setting_delete">
                    <p>Eliminar esta seccion</p>
                    <el-button type="danger" size="small" icon="delete" v-on:click="deleteSeccion(item3.id, index, 0)"></el-button>
                  </div>
                  <div class="micrositio_setting_header">
                    <el-input placeholder="Crear subsección" size="small" v-model="titulo"></el-input>
                    <el-button type="primary" size="small" icon="plus" v-on:click="createSeccion(item3.id)"></el-button>
                  </div>
                  <el-collapse v-if="seccionesCuaternarias.length != 0" v-model="seccionSelected4" accordion>
                    <el-collapse-item class="row4" v-for="(item4, index) in seccionesCuaternarias" :title="item4.titulo" :name="item4.id" :key="item4.id">
                      <ajustes-secciones :currentSeccion="item4"></ajustes-secciones>
                      <div class="secciones_setting_delete">
                        <p>Eliminar esta seccion</p>
                        <el-button type="danger" size="small" icon="delete" v-on:click="deleteSeccion(item4.id, index, 0)"></el-button>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </el-collapse-item>
              </el-collapse>
            </el-collapse-item>
          </el-collapse>
      </div>
      </el-collapse-item>
    </el-collapse>
  </div>
  </div>
</template>

<script>
import axios from 'axios';
import { VueEditor } from 'vue2-editor'
import CropperModal from './cropper.vue';
import AjustesConvocatorias from './convocatorias_ajustes_convocatorias.vue'
import AjustesCategorias from './convocatorias_ajustes_categorias.vue'
export default {
  components: { CropperModal, AjustesConvocatorias,AjustesCategorias, VueEditor },
  mounted(){
    setTimeout(() => {
      for(let iframe of document.querySelectorAll('iframe')){
        iframe.style.maxWidth = '280px';
        iframe.style.maxHeight = '140px';
      }
    }, 1000)
  },
  data(){
    return {
      urlPhotoCropper: '',
      activeName: '0',
      activeName2: '',
      cropper: null,
      iframe: '',
      newUrlExterna: {
        url: '',
        texto: '',
        imagen: null,
      },
			currentSeccion: {},
		  seccionSelected: '',
	    seccionSelected1: '',
	    seccionSelected2: '',
		  seccionSelected3: '',
		  seccionSelected4: '',
      titulo: '',
      options: [
        {
          id: '1',
          titulo: 'Nuestra entidad',
        },{
          id: '2',
          titulo: 'Secretarias',
        },{
          id: '3',
          titulo: 'El Meta',
        },{
          id: '4',
          titulo: 'Documentos',
        },{
          id: '5',
          titulo: 'Prensa',
        },{
          id: '6',
          titulo: 'Contáctanos',
        },{
          id: '7',
          titulo: 'Entidades descentralizadas',
        },{
          id: '8',
          titulo: 'No visible',
        }
      ],
      customToolbar: [
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['link'],
          [{'indent': '-1'}, {'indent': '+1'}],
          [{'header': [1, 2, 3, 4, 5, 6, 7]}],
          [{'color': []},{'background': []}],
          [{'font': []}],
          [{'align': []}],
          ['clean']
      ],
      micrositioText: '',
      menuLateral: '0',
    }
  },
  watch: {
    micrositioEdit(value){
      this.seccionSelected = '';
      this.seccionSelected1 = '';
  	},
		seccionSelected(value){
			this.currentSeccion = this.micrositioEdit.secciones.filter(seccion => seccion.id == value)[0];
		},
    seccionSelected1(value){
		    this.seccionSelected = value;
  		if(value == ''){
  			this.seccionSelected2 = '';
  			this.seccionSelected3 = '';
  			this.seccionSelected4 = '';
  		}
	  },
    seccionSelected2(value){
		  this.seccionSelected = value;
  		if(value == ''){
  			this.seccionSelected3 = '';
  			this.seccionSelected4 = '';
  		}
	  },
	  seccionSelected3(value){
		this.seccionSelected = value;
  		if(value == ''){
  			this.seccionSelected4 = '';
  		}
	   },
    seccionSelected4(value){
      this.seccionSelected = value;
    },
  },
  computed: {
    micrositioSecciones(){
      return this.$store.state.micrositioSecciones;
    },
    seccionesPrincipales(){
        return this.$store.state.micrositioSecciones.filter(seccion => seccion.parent_id == "0")
    },
    seccionesSecundarias(){
      	return this.$store.state.micrositioSecciones.filter( seccion => seccion.parent_id == this.seccionSelected1);
    },
  	seccionesTerciarias(){
  		 return this.$store.state.micrositioSecciones.filter( seccion => seccion.parent_id == this.seccionSelected2);
  	},
  	seccionesCuaternarias(){
  		 return this.$store.state.micrositioSecciones.filter( seccion => seccion.parent_id == this.seccionSelected3);
  	},
    micrositioEdit(){
      return this.$store.state.micrositioEdit;
    },
  },
  methods: {
    editMicrositio(){
      let json = {
        titulo: this.micrositioEdit.titulo,
        estado: this.micrositioEdit.estado == true ? 1 : 0,
        menu: this.micrositioEdit.menu,
        menu_lateral: this.menuLateral,
        email: this.micrositioEdit.email,
        telefono: this.micrositioEdit.telefono,
        direccion: this.micrositioEdit.direccion,
        facebook: this.micrositioEdit.facebook,
        youtube: this.micrositioEdit.youtube,
        twitter: this.micrositioEdit.twitter,
        texto: this.micrositioEdit.texto,
      }
      axios.put(`${this.$urlHttp}/api/micrositio/${this.micrositioEdit.id}`, json).then((response) => {
        this.$message.success('El micrositio se edito correctamente');
        this.reloadIframe();
      }).catch((error) => {
        this.$message.error('El micrositio no se pudo editar');
      })
    },
    createSeccion(parent_id){
      let params = {
        titulo: this.titulo,
        padre: parent_id,
        id_micrositio: this.micrositioEdit.id,
      }
      axios.post(`${this.$urlHttp}/api/secciones`, params).then((response) => {
        response.data.data.textos = [];
        this.$store.state.micrositioSecciones.push(response.data.data);
        this.titulo = '';
        this.reloadIframe();
      })
    },
    deleteSeccion(id){
      axios.delete(`${this.$urlHttp}/api/secciones/${id}`).then((response) => {
        this.$message.success('Se elimino correctamente la seccion');
        let position;
        this.$store.state.micrositioSecciones.filter((seccion, index) => {
          if(seccion.id == id){
            position = index;
          }
        })
        this.$store.state.micrositioSecciones.splice(position, 1);
        this.reloadIframe();
      })
    },
    uploadBanner(files){
      let size = files.target.files.length;
      const isLt10M = files.target.files[0].size / 1024 / 1024 < 10;
        if(isLt10M){
          this.loadingCreateBanner = false;
          this.urlPhotoCropper = URL.createObjectURL(files.target.files[0]);
          setTimeout(() => {
            if(this.cropper){
              this.cropper.destroy();
            }
            var image = document.getElementById('image');
            this.cropper = new Cropper(image, {
              aspectRatio: 12 / 4,
              viewMode: 1,
              zoomable: false,
            });
          }, 100)
        }else{
          this.$message.error('El archivo debe pesar menos de 10 Megabyte');
        }
    },
    closeCropper(){
      this.cropper.destroy();
      this.urlPhotoCropper = '';
    },
    createText(){

    },
    deleteText(){

    },
    createBanner(){
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        const config =  { headers: { 'Content-Type': 'multipart/form-data' } };
        let newFile = new FormData();
        newFile.append('banner', blob)
        newFile.append('url', '')
        newFile.append('id_micrositio', this.micrositioEdit.id)
        axios.post(`${this.$urlHttp}/api/micrositio/banners`, newFile, config).then((response) => {
          this.$store.state.micrositioEdit.banners.push(response.data.data);
          this.urlPhotoCropper = '';
          this.cropper.destroy();
          this.reloadIframe();
          this.$store.state.loadingCropper = false;
        }).catch((error) => {
          this.$message.error('El archivo no subio al servidor, vuelve a intentarlo');
          this.urlPhotoCropper = '';
          this.cropper.destroy();
          this.$store.state.loadingCropper = false;
        })
      });
    },
    deleteBanner(id, index){
      axios.delete(`${this.$urlHttp}/api/micrositio/banners/${id}`).then((response) => {
        this.$store.state.micrositioEdit.banners.splice(index, 1)
        this.reloadIframe();
      })
    },
    createIframe(){
      if(this.iframe != ''){
        let json = {
          iframe: this.iframe,
          id_micrositio: this.micrositioEdit.id,
        }
        axios.post(`${this.$urlHttp}/api/micrositio/iframes`, json).then((response) => {
          this.micrositioEdit.iframes.push(response.data.data);
          this.iframe = ''
          setTimeout(() => {
            for(let iframe of document.querySelectorAll('iframe')){
              iframe.style.maxWidth = '300px';
              iframe.style.maxHeight = '160px';
            }
          }, 1000)
          this.reloadIframe();
        })
      }else{
        this.$message.error('Debe incluir un iframe');
      }
    },
    deleteIframe(id, index){
      axios.delete(`${this.$urlHttp}/api/micrositio/iframes/${id}`).then((response) => {
        this.micrositioEdit.iframes.splice(index, 1);
        this.reloadIframe();
      })
    },
    createImage(e){
      const config =  { headers: { 'Content-Type': 'multipart/form-data' } };
      let newImage = new FormData();

      newImage.append('imagen', e.target.files[0]);
      newImage.append('id_micrositio', this.micrositioEdit.id);

      axios.post(`${this.$urlHttp}/api/micrositio/galeria`, newImage, config).then((response) => {
        this.$store.state.micrositioEdit.galeria.unshift(response.data.data);
        this.reloadIframe();
      }).catch((error) => {
        this.$message.error('La foto no se creo en el servidor');
      })
    },
    deleteImage(id, index){
      axios.delete(`${this.$urlHttp}/api/micrositio/galeria/${id}`).then((response) => {
        this.$store.state.micrositioEdit.galeria.splice(index, 1);
        this.reloadIframe();
      }).catch((error) => {
        this.$message.error('La foto no se elimino en el servidor');
      })
    },
    uploadPhotoUrlExterna(event){
      this.newUrlExterna.imagen = event.target.files[0];
    },
    createUrlExterna(){
      if(this.newUrlExterna.url.includes('http') || this.newUrlExterna.url == '#'){
        const config =  { headers: { 'Content-Type': 'multipart/form-data' } };
        let params = new FormData;
        params.append('url', this.newUrlExterna.url);
        params.append('titulo', this.newUrlExterna.texto);
        if(this.newUrlExterna.imagen){
          params.append('imagen', this.newUrlExterna.imagen)
        }
        params.append('id_micrositio', this.micrositioEdit.id);
        axios.post(`${this.$urlHttp}/api/micrositio/url`, params, config).then((response) => {
          this.$store.state.micrositioEdit.url_externa.push(response.data.data);
          this.newUrlExterna.url = '';
          this.newUrlExterna.texto = '';
          this.reloadIframe();
        }).catch((error) => {
          this.$message.error('La url no se creo en el servidor');
        })
      }else{
        this.$message.error('La url no es correcta');
      }
    },
    deleteUrlExterna(id, index){
      axios.delete(`${this.$urlHttp}/api/micrositio/url/${id}`).then((response) => {
        this.$store.state.micrositioEdit.url_externa.splice(index, 1);
        this.reloadIframe();
      })
    },
    setTitle(value){
      if(value){
        value = value.toLowerCase();
        return value.replace(/^\w|\s\w/g, l => l.toUpperCase())
      }
    },
		seccionIdToText(value){
			if(value){
				return this.micrositioEdit.secciones.filter(seccion => seccion.id == value)[0].titulo;
			}
		},
    reloadIframe(){
      document.getElementById('iframePreview').src = `https://meta.gov.co/documentacion/convocatorias}`;
    }
	}
}
</script>

<style scoped>
  .uploaderPhoto{
    position: relative;
    width: 90px;
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin: 3px;
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
  .el-input, .el-textarea, .el-select{
    margin: 5px 0;
  }
  .el-select{
    width: calc(100% - 10px);
    margin-right: 5px;
  }
  .micrositio_setting_edit{
    height: calc(100vh - 120px);
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
  }
  .micrositio_setting_edit::-webkit-scrollbar{
    width: 8px;
  	background-color: transparent;
  }
  .micrositio_setting_edit::-webkit-scrollbar-thumb{
    border-radius: 5px;
  	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.1);
  	background-color: #ddd;
  }
  .micrositio_setting_title{
    font-size: 19px;
    margin: 10px 0 20px 0;
  }
  .micrositio_setting_edit_publicado{
    width: 100%;
    flex: none;
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
  }
  .micrositios_settings_newsite_banners_item{
    position: relative;
    overflow: hidden;
  }
  .micrositios_settings_newsite_banners_item > img{
    width: 100%;
    max-height: 100px;
    background-color: #FFF;
    border: 5px solid #FFF;
    box-shadow: 0 2px 4px 0 rgba(155, 155, 155, 0.48);
    margin: 5px 0;
  }
  .micrositios_settings_newsite_banners_item_options{
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255,255,255,0.9);
    opacity: 0;
    visibility: hidden;
    transition: .3s;
  }
  .micrositios_settings_newsite_banners_item:hover .micrositios_settings_newsite_banners_item_options{
    top: 0;
    opacity: 1;
    visibility: visible;
  }
  .micrositios_settings_newsite_banners_item.create{
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #FFF;
    border: 5px solid #FFF;
    box-shadow: 0 2px 4px 0 rgba(155, 155, 155, 0.48);
    margin: 5px 0;
  }
  .micrositios_settings_newsite_banners_item.create .el-button{
    position: relative;
  }
  .micrositios_settings_newsite_banners_item.create input[type="file"]{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
  .iframe_item{
    position: relative;
    width: 290px;
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin: 10px auto;
  }
  .iframe_item_ajustes{
    position: absolute;
    bottom: -50px;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0,0,0,0.7);
    z-index: 5;
    transition: .3s;
  }
  .iframe_item:hover .iframe_item_ajustes{
    bottom: 0;
  }
  .galeria{
    display: flex;
    flex-wrap: wrap;
  }
  .galeria_item{
    position: relative;
    width: 90px;
    height: 90px;
    background-color: #EEE;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    overflow: hidden;
    margin: 3px;

  }
  .galeria_item img{
    max-width: 100%;
    max-height: 100%;
  }
  .galeria_item .delete{
    position: absolute;
    top: 100%;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255,255,255,0.6);
    cursor: pointer;
  }
  .galeria_item:hover .delete{
    top: 0;
  }
  .url_externa_list{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .url_externa{
    width: 100%;
    display: flex;
    align-items: center;
    box-shadow: 0 0 10px 0 rgba(0,0,0,0.15);
    padding: 10px;
    margin: 5px;
  }
  .url_externa img{
    max-width: 100px;
    margin-right: 5px;
  }
  .row{
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.row .el-input{
		width: initial;
		margin-right: 5px !important;
	}
	.row .el-button{
		position: relative;
	}
	.row .el-button-group{
		flex: none;
	}
  .url_choose_file{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    opacity: 0;
  }
  .micrositio_setting_edit_actions{
    flex: none;
    width: 98%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 10px 0;
  }
  .micrositio_setting_edit_actions *{
    flex: none;
  }
  .secciones{
    flex: none;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .micrositio_setting_header{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0 20px 0;
  }
  .micrositio_setting_header .actionGoBack{
    border-style: none;
    padding: 10px 20px;
    cursor: pointer;
    outline: none;
    background-color: #dfe6ec;
  }
  .micrositio_setting_header h2{
    line-height: 1;
    font-size: 16px;
    font-weight: 700;
    color: #1f2d3d;
  }
  .micrositio_setting_header .el-input{
    margin-right: 5px;
  }
  .secciones .subtitle{
    line-height: 1;
    font-size: 16px;
    font-weight: 700;
    color: #1f2d3d;
  }
  .seccion_list{
    width: 100%;
    border: 1px solid #dfe6ec;
    background-color: #FFF;
    display: flex;
    flex-direction: column;
    list-style: none;
  }
  .seccion_item{
    width: 100%;
    border-bottom: 1px solid #dfe6ec;
    font-size: 13px;
    color: #48576a;
    padding: 10px;
    cursor: pointer;
    border-left: 3px solid #4192ec;
    transition: .15s;
  }
  .seccion_item:last-child{
    border-style: none;
    border-left: 3px solid #4192ec;
  }
  .seccion_item:hover{
    background-color: #dfe6ec;
    border-left: 0px solid #4192ec;
  }
  .secciones_setting_delete{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 5px 0;
  }
  .el-collapse{
    width: 98%;
  }
</style>
