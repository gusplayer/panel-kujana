<template>
	<el-collapse v-model="activeName" accordion>
		<el-collapse-item title="Nombre de la convocatoria" name="0">
			<el-input placeholder="Nombre de la convocatoria" v-model="currentSeccion.titulo"></el-input>
			<el-button v-on:click="editarTitulo">Guardar Cambios</el-button>
		</el-collapse-item>
		<el-collapse-item title="Descripción" name="1">
			<!-- <vue-editor :id="`seccionText${currentSeccion.parent_id}${currentSeccion.id}`" v-model="textoSeccion" :editorToolbar="customToolbar"></vue-editor> -->
			<p>Tienes que copiar el codigo que generes en el siguiente editor y pegarlo en el input. </p><a href="https://html-online.com/editor/" target="_blank">Editor de Texto</a>
			<el-input
			  type="textarea"
			  :rows="5"
			  placeholder=""
			  v-model="textoSeccion">
			</el-input>
			<el-button type="primary" class="textos_create" v-on:click="createText">Guardar</el-button>
		</el-collapse-item>

		<el-collapse-item title="Iframes" name="3">
			<div class="iframe_item" v-for="(iframe, index) in currentSeccion.iframes" :key="index">
				<div v-html="iframe.iframe"></div>
				<div class="iframe_item_ajustes">
					<el-button type="danger" icon="delete" v-on:click="deleteIframe(iframe.id, index)">Eliminar</el-button>
				</div>
			</div>
			<el-input
			type="textarea"
			:rows="4"
			placeholder="Agregue un iframe"
			v-model="iframe">
			</el-input>
			<el-button-group class="iframes_create">
				<el-button type="primary" icon="circle-close" v-on:click="iframe = ''" size="small"></el-button>
				<el-button type="primary" v-on:click="createIframe" icon="upload2" size="small"></el-button>
			</el-button-group>
		</el-collapse-item>
		<!-- <el-collapse-item title="Galeria" name="4">
			<div class="galeria">
				<div class="uploaderPhoto">
					<input type="file" v-on:change="createImage">
					<i class="material-icons">add</i>
				</div>
				<div class="galeria_item" v-for="(imagen, index) in currentSeccion.imagenes">
				<img :src="`${$urlHttp}/secciones_imagenes/${imagen.imagen}`">
				<span class="delete" v-on:click="deleteImage(imagen.id, index)">Eliminar</span>
				</div>
			</div>
		</el-collapse-item> -->
		<el-collapse-item title="Urls externas" name="5">
			<div class="url_externa_list">
				<div class="url_externa" v-for="(url, index) in currentSeccion.urls" :key="index">
					<a :href="url.url" target="_blank">
						<img v-show="url.imagen" :src="`${$urlHttp}/secciones_images_url_externas/${url.imagen}`" alt="">
					</a>
					<div class="column">
						<p>{{ url.titulo }}</p>
						<el-button-group>
							<el-button type="primary" size="small" icon="edit"></el-button>
							<el-button type="primary" size="small" v-on:click="deleteUrl(url.id, index)" icon="delete"></el-button>
						</el-button-group>
					</div>
				</div>
			</div>
			<div class="nueva_url_externa">
				<el-input placeholder="Url externa" v-model="newUrlExterna.url">
					<template slot="prepend"><i class="fa fa-link" aria-hidden="true"></i></template>
				</el-input>
				<div class="row">
					<el-input placeholder="Texto del enlace" v-model="newUrlExterna.texto"></el-input>
					<el-button type="primary"><input type="file" class="url_choose_file" v-on:change="uploadPhotoUrlExterna"><i class="fa fa-camera-retro" style="cursor: pointer;" aria-hidden="true"></i> imagen</i></el-button>
				</div>
				<el-button-group>
					<el-button type="primary" v-on:click="createUrl" size="small" icon="circle-check"></el-button>
					<el-button type="primary" size="small" icon="circle-cross"></el-button>
				</el-button-group>
			</div>
		</el-collapse-item>
		<el-collapse-item title="Subir Archivo" name="6">
			<div class="files_upload">
				<label :for="`uploadFile${currentSeccion.id}`">Subir archivos<i class="el-icon-upload"></i></label>
			</div>
			<input type="file" class="upload_file" :id="`uploadFile${currentSeccion.id}`" multiple v-on:change="createFile">
			<template v-for="(file, index) in currentSeccion.archivos">
				<div class="file" v-show="file.estado != 2" v-on:click="downloadFile($event, file)">
					<i class="material-icons">insert_drive_file</i>
					<p>{{ file.titulo }}</p>
					<i class="material-icons file_delete" v-on:click="deleteFile(file.id, index)">delete_forever</i>
				</div>
				<div class="file pending" v-show="file.estado == 2">
					<i class="material-icons">autorenew</i>
					<p>{{ file.titulo }}</p>
					<i class="material-icons"></i>
				</div>
			</template>
			<a id='dwnldLnk' :download='this.currentFile.titulo' :href="this.currentFile.url" style="display:none;" />
		</el-collapse-item>
	</el-collapse>
</template>

<script>
import axios from 'axios';
import { VueEditor } from 'vue2-editor'
export default {
  components: { VueEditor },
  	props: [ 'currentSeccion' ],
		mounted(){
			if(this.currentSeccion.textos[0]){
				this.textoSeccion = this.currentSeccion.textos[0].texto;
			}
		},
  	data(){
	    return {
			activeName: '0',
	      	customToolbar: [
	            ['bold', 'italic', 'underline'],
	            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
							['link', 'code-block'],
	            [{'indent': '-1'}, {'indent': '+1'}],
	            [{'header': [1, 2, 3, 4, 5, 6, 7]}],
	            [{'color': []},{'background': []}],
	            [{'font': []}],
	            [{'align': []}],
	            ['clean']
			],
			textoSeccion: '',
			video: '',
			iframe: '',
			newUrlExterna: {},
			isEditText: false,
			currentFile: {
				url: '',
				titulo: '',
			},
	    }
  },
	methods: {
		editarTitulo(){
			let params = {
				titulo: this.currentSeccion.titulo,
				_method: 'PUT'
			}
			axios.post(`${this.$urlHttp}/api/secciones/${this.currentSeccion.id}`, params).then((response) => {
				this.$message.success('El titulo se cambio correctamente');
			}).catch((error) => {
				this.$message.error('El titulo no cambio en el servidor');
			})
		},
		createText(){
				let params = {
					texto: this.textoSeccion,
					id_seccion: this.currentSeccion.id,
				}
				axios.post(`${this.$urlHttp}/api/secciones/textos`, params).then((response) => {
					this.textoSeccion = response.data.data.texto;
					this.reloadIframe();
				}).catch((error) => {
					this.$message.error('El texto no subio al servidor');
				})
		},
		createVideo(){
			let params = {
				video: this.video,
				id_seccion: this.currentSeccion.id,
			}
			axios.post(`${this.$urlHttp}/api/secciones/video`, params).then((response) => {
				this.currentSeccion.videos.push(response.data.data);
				this.video = '';
				this.reloadIframe();
			}).catch((error) => {

			})
		},
		deleteVideo(id, index){
			axios.delete(`${this.$urlHttp}/api/secciones/video/${id}`).then((response) => {
				this.currentSeccion.videos.splice(index, 1);
				this.reloadIframe();
			})
		},
		createIframe(){
			let params = {
				iframe: this.iframe,
				id_seccion: this.currentSeccion.id,
			}
			axios.post(`${this.$urlHttp}/api/secciones/iframes`, params).then((response) => {
				this.currentSeccion.iframes.push(response.data.data);
				this.reloadIframe();
				setTimeout(() => {
					for(let iframe of document.querySelectorAll('iframe')){
						iframe.style.maxWidth = '280px';
						iframe.style.maxHeight = '140px';
					}
				}, 1000)
			}).catch((error) => {

			})
		},
		deleteIframe(id, index){
      axios.delete(`${this.$urlHttp}/api/secciones/iframes/${id}`).then((response) => {
        this.currentSeccion.iframes.splice(index, 1);
				this.reloadIframe();
      })
    },
		createImage(e){
			let newImage = new FormData();

			newImage.append('imagen', e.target.files[0]);
			newImage.append('id_seccion', this.currentSeccion.id);

			axios.post(`${this.$urlHttp}/api/secciones/imagenes`, newImage).then((response) => {
				this.currentSeccion.imagenes.unshift(response.data.data);
				this.reloadIframe();
			}).catch((error) => {

			})
		},
		deleteImage(id, index){
			axios.delete(`${this.$urlHttp}/api/secciones/imagenes/${id}`).then((response) => {
				this.currentSeccion.imagenes.splice(index, 1);
				this.reloadIframe();
			}).catch((error) => {

			})
		},
		uploadPhotoUrlExterna(event){
			this.newUrlExterna.imagen = event.target.files[0];
		},
		createUrl(){
			const config = { headers: { 'Content-Type': 'multipart/form-data' } };
			let params = new FormData();
			params.append('url', this.newUrlExterna.url);
			params.append('titulo', this.newUrlExterna.texto);
			if(this.newUrlExterna.imagen){
				params.append('imagen', this.newUrlExterna.imagen);
			}
			params.append('id_seccion', this.currentSeccion.id);
			axios.post(`${this.$urlHttp}/api/secciones/url`, params, config).then((response) => {
				this.currentSeccion.urls.push(response.data.data);
				this.newUrlExterna = {};
				this.reloadIframe();
			}).catch((error) => {

			})
		},
		deleteUrl(id, index){
			axios.delete(`${this.$urlHttp}/api/secciones/url/${id}`).then((response) => {
				this.currentSeccion.urls.splice(index, 1);
				this.reloadIframe();
			})
		},
		createFile(e){
			for(var i = 0; i < e.target.files.length; i++) {
					this.currentSeccion.archivos.unshift({
						titulo: 'Pendiente...',
						estado: 2
					});
		        const isLt50M = e.target.files[i].size / 1024 / 1024 < 50;
		        if(isLt50M){
		          const config = { headers: { 'Content-Type': 'multipart/form-data' } };
		          let newFile = new FormData();
		          newFile.append('titulo', e.target.files[i].name)
		          newFile.append('archivo', e.target.files[i])
		          newFile.append('id_seccion', this.currentSeccion.id)
		          axios.post(`${this.$urlHttp}/api/secciones/archivos`, newFile, config).then((response) => {
		            this.currentSeccion.archivos.unshift(response.data.data);
								let indexDelete;
								this.currentSeccion.archivos.filter((archivo, index) => { if(archivo.estado == 2) { indexDelete = index } });
								this.currentSeccion.archivos.splice(indexDelete, 1);
								this.reloadIframe();
		          }).catch((error) =>{
		            this.$message.error('El archivo no subio al servidor, vuelve a intentarlo');
								let indexDelete;
								this.currentSeccion.archivos.filter((archivo, index) => { if(archivo.estado == 2) { indexDelete = index } });
								this.currentSeccion.archivos.splice(indexDelete, 1);
		          })
		        }else{
		          this.$message.error('El archivo debe pesar menos de 50 Megabyte');
		        }
		      }
		},
		deleteFile(id, index){
			axios.delete(`${this.$urlHttp}/api/secciones/archivos/${id}`).then((response) => {
				this.currentSeccion.archivos.splice(index, 1);
				this.reloadIframe();
			}).catch((error) => {

			})
		},
		downloadFile(e, file){
			if(e.target.classList[1] != 'file_delete'){
				file.url = `${this.$urlHttp}/secciones_archivos/${file.titulo}`
				this.currentFile = file;
				document.getElementById('dwnldLnk').click();
			}
		},
		setImgOfVideo(urlVideo){
			let index;
			if(urlVideo.includes('?v=')){
				index = urlVideo.indexOf('?v=')+3;
			}else{
				index = urlVideo.indexOf('.be/')+4;
			}
    	let idYoutube = urlVideo.substring(index);
			return `https://img.youtube.com/vi/${idYoutube}/0.jpg`;
		},
		reloadIframe(){
			document.getElementById('iframePreview').src = `https://meta.gov.co/documentacion/convocatorias`;
		}
	}
}
</script>

<style scoped>
	.textos_create{
		margin: 10px 0;
	}
	.textos_item{
		min-height: 50px;
		position: relative;
		box-shadow: 0px 1px 5px -1px rgba(0,0,0,0.5);
		margin: 10px 0;
		padding: 5px;
		word-break: break-all;
		overflow: hidden;
	}
	.textos_item div:first-child{
		max-height: 300px;
		overflow-y: auto;
		overflow-x: hidden;
	}
	.videos_item{
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 10px;
		overflow: hidden;
	}
	.videos_item img{
		width: 100%;
	}
	.create_video{
		margin-top: 5px;
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
  .iframe_item_ajustes, .textos_item_ajustes, .videos_item_ajustes{
    position: absolute;
		left: 0;
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
	.textos_item:hover .textos_item_ajustes,
	.iframe_item:hover .iframe_item_ajustes,
	.videos_item:hover .videos_item_ajustes{
		bottom: 0;
	}
	.iframes_create{
		margin: 10px 0
	}
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
	.nueva_url_externa .el-input{
		margin: 5px 0;
	}
	.files_upload{
		width: 100%;
		border: 1px dashed black;
		border-radius: 5px;
		padding: 10px 20px;
		margin: 5px 0;
		cursor: pointer;
		transition: .3s;
	}
	.files_upload label{
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
	.files_upload label i{
		margin-left: 5px;
	}
	.files_upload:hover{
		transform: scale(0.95);
	}
	.upload_file{
		position: absolute;
		visibility: hidden;
		opacity: 0;
	}
	.file{
	  width: 100%;
	  min-height: 50px;
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  padding: 6px;
	  margin: 5px 0;
	  border-radius: 5px;
	  border: solid 1px #e9eff4;
	  cursor: pointer;
	  color: #323c47;
	  background-color: #FFF;
	  transition: .3s;
	}
	.file i:first-child{
	  color: #f7ba2a;
	  text-shadow: 0 0 1px #f7ba2a;
	}
	.file i:last-child{
	  color: rgba(208, 215, 221, 0.73);
	}
	.file.selected{
	  background-color: #4da1ff;
	}
	.file p{
	  text-align: center;
	  font-size: 13px;
	  word-break: break-all;
	  margin: 0 5px;
	}
	.file.selected p, .documents__column .file.selected i{
	  color: #FFF;
	  text-shadow: 0 0 0 #FFF;
	}
	.file.pending i:first-child{
		animation: rotate 3s linear infinite;
	}
	@keyframes rotate {
		0% { transform: scale(0deg) }
		25% { transform: scale(30deg) }
		50% { transform: scale(60deg) }
		75% { transform: scale(90deg) }
		100% { transform: scale(180deg) }
	}
</style>
