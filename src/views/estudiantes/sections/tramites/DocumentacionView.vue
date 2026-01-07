<template>
    <div v-if='arrDocs.length==0' class='text-center'><i>- No hay documentos enviados para mostrar -</i></div>
	<div v-else class='margen-bottom'>
		<h3 class='h3cabecera'>Documentos enviados</h3>	
		<div v-for='(item, key) in arrDocs' class='row lista recuadro' style='padding:20px 10px;'>
			<div class='col-12 text-center titulo'>{{item.nombre}}</div>
			<div class='col-12' v-for='(i,k) in item.arrFiles'>
				<a v-if='!item.esDocIngresante' :href="'https://cjjc.edu.ar/uploads/alumnos/docs/'+item.folder+'/'+i" target='_blank'>{{i}}</a>
				<a v-else :href="'https://cjjc.edu.ar/uploads/ingresantes/'+item.folder+'/'+i" target='_blank'>{{i}}</a> - 
				<a v-if='item.canDeleted' v-on:click='delFile(key, k)'>Borrar</a>
			</div>
		</div>
	</div>
	<div class='col-12'>
        <a @click='updShowUploadMenu'>Subir un nuevo documento</a>
    </div>
	<div v-show='showUploadMenu'><label>Documentación que presenta:</label><input type='text' v-model='tituloDoc'>
        <input type='button' @click='prepareUpload' value='Seleccionar...'>
    </div>
</template>
<script setup>
    import { ref, onMounted} from 'vue'
    import Resumable from 'resumablejs'
    import { showModal } from '@/services/uiBus.js'
    import { api } from '@/api/api'
    const arrDocs = ref([])
    const showUploadMenu = ref(false)
    const tituloDoc = ref('');
    onMounted(() => {
        listDocs()
    })
	const listDocs = async () => {
		const r = await api.get({
            entity : 'docs',
            action: 'getDocs',
        });
        r.payload.forEach(v =>{
            if (v.arrFiles.length>0) arrDocs.value.push(v)
        })
    }

    const updShowUploadMenu = async () => {
        showUploadMenu.value = !showUploadMenu.value;
    }
    const prepareUpload = async (k = false) => {
        let str = tituloDoc.value;
        if (str !== null && str.trim() != "") {			
            let f = document.createElement("input");
            f.setAttribute("type","file");
            let payload = {
                typeFile: 'docsAlumnos',
            }
            const upl = new Resumable({
                withCredentials: true,
                target: 'https://cjjc.edu.ar/api-v2/',
                query: {
                    entity:"docs",
                    action:"uploadFile",
                },
            });
            upl.assignBrowse(f);
            upl.on('fileSuccess', (file)=>{
                tituloDoc.value = "";
                showModal("Documento enviado correctamente.");
                listDocs();
            });
            upl.on('fileProgress', (file)=>{
                let n = parseInt(upl.progress()*100);
            });
            upl.on('fileAdded', async (file, event)=>{
                let dir = Date.now();
                let d = {
                    "dateToDir":dir,
                    "nombre": str,
                };
                let r = await api.post({
                    entity: "docs",
                    action: "prepareUpload",
                    payload: d,
                })
                if (r.ok) {
                    payload.dir = dir
                    payload = JSON.stringify(payload)
                    upl.opts.query.payload = payload
                    if(file.file.type.startsWith("video")) showModal("No pueden subirse videos a la página. Utilice otro medio (YouTube, Google Drive, etc.) y comparta el enlace de acceso desde un documento de texto");
                    else upl.upload();
                }
            });
            f.click();	
        }
        else showModal("El campo no puede quedar vacío");
    }
    const delFile= async (arr, k) => {
        let r = confirm("¿Confirma que desea borrar este archivo?");
        if (r) {
            request.post(["docs", 1, arrDocs.value[arr][1], arrDocs.value[arr][2][k], arrDocs.value[arr][2].length == 1]);
            rAPI(request).then(r=>{
                if (r.status==200) {
                    arrDocs.value[arr][2].splice(k,1);
                    if (arrDocs.value[arr][2].length == 0) arrDocs.value.splice(arr,1);
                    showModal("El documento ha sido borrado", true);
                }
            });
        }
    }
</script>